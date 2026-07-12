import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/supabase";

import { buildJournalLines } from "./posting-rules";
import type { JournalEntryInput, JournalLineInput, PostingInput } from "./types";

export class UnbalancedJournalError extends Error {
  constructor(totalDebit: number, totalCredit: number) {
    super(`Journal entry is not balanced: debit ${totalDebit} !== credit ${totalCredit}`);
    this.name = "UnbalancedJournalError";
  }
}

/** Throws UnbalancedJournalError unless total debit equals total credit. */
export function assertBalanced(lines: JournalLineInput[]): void {
  const totalDebit = round2(lines.reduce((sum, line) => sum + line.debit, 0));
  const totalCredit = round2(lines.reduce((sum, line) => sum + line.credit, 0));
  if (totalDebit !== totalCredit) {
    throw new UnbalancedJournalError(totalDebit, totalCredit);
  }
}

/** Swaps debit/credit on every line — used to reverse a posted entry. */
export function buildReversalLines(lines: JournalLineInput[]): JournalLineInput[] {
  return lines.map((line) => ({
    accountCode: line.accountCode,
    debit: line.credit,
    credit: line.debit,
  }));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

type TrialBalanceRow = {
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
};

export type LedgerRow = {
  entryDate: string;
  memo: string;
  sourceType: string;
  debit: number;
  credit: number;
};

/**
 * The accounting engine's only entry point for posting/reversing journal
 * entries. Every invariant (balance, no hard deletes) is enforced here AND
 * at the database level (deferred CHECK trigger) as defense in depth.
 */
export class LedgerService {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async postTransaction(input: PostingInput, entryDate: string, memo: string) {
    const lines = buildJournalLines(input);
    return this.postJournalEntry({
      entryDate,
      memo,
      sourceType: input.type,
      lines,
    });
  }

  async postJournalEntry(input: JournalEntryInput) {
    assertBalanced(input.lines);

    const accountIdByCode = await this.resolveAccountIds(
      input.lines.map((line) => line.accountCode),
    );

    const { data: entry, error: entryError } = await this.supabase
      .from("journal_entries")
      .insert({
        entry_date: input.entryDate,
        memo: input.memo,
        source_type: input.sourceType,
        source_id: input.sourceId,
        status: "posted",
      })
      .select("id")
      .single();

    if (entryError || !entry) {
      throw new Error(`Failed to create journal entry: ${entryError?.message}`);
    }

    const { error: linesError } = await this.supabase.from("journal_lines").insert(
      input.lines.map((line) => ({
        entry_id: entry.id,
        account_id: accountIdByCode.get(line.accountCode)!,
        debit: line.debit,
        credit: line.credit,
      })),
    );

    if (linesError) {
      throw new Error(`Failed to create journal lines: ${linesError.message}`);
    }

    return entry.id as string;
  }

  /** Never deletes — posts the balancing opposite entry and links it. */
  async reverseEntry(entryId: string) {
    const { data: original, error: originalError } = await this.supabase
      .from("journal_lines")
      .select("account_id, debit, credit, accounts(code)")
      .eq("entry_id", entryId);

    if (originalError || !original) {
      throw new Error(`Failed to load journal entry ${entryId}: ${originalError?.message}`);
    }

    const reversalLines = buildReversalLines(
      original.map((line) => ({
        accountCode: (line.accounts as unknown as { code: string }).code,
        debit: line.debit,
        credit: line.credit,
      })),
    );

    const reversalEntryId = await this.postJournalEntry({
      entryDate: new Date().toISOString().slice(0, 10),
      memo: `Reversal of entry ${entryId}`,
      sourceType: "reversal",
      sourceId: entryId,
      lines: reversalLines,
    });

    await this.supabase
      .from("journal_entries")
      .update({ status: "void", reversed_entry_id: reversalEntryId })
      .eq("id", entryId);

    return reversalEntryId;
  }

  async getTrialBalance(asOf: string): Promise<TrialBalanceRow[]> {
    const { data, error } = await this.supabase
      .from("journal_lines")
      .select("debit, credit, accounts!inner(code, name), journal_entries!inner(entry_date, status)")
      .lte("journal_entries.entry_date", asOf)
      .eq("journal_entries.status", "posted");

    if (error || !data) {
      throw new Error(`Failed to load trial balance: ${error?.message}`);
    }

    const totals = new Map<string, TrialBalanceRow>();
    for (const row of data) {
      const account = row.accounts as unknown as { code: string; name: string };
      const existing = totals.get(account.code) ?? {
        accountCode: account.code,
        accountName: account.name,
        debit: 0,
        credit: 0,
      };
      existing.debit = round2(existing.debit + row.debit);
      existing.credit = round2(existing.credit + row.credit);
      totals.set(account.code, existing);
    }

    return [...totals.values()].sort((a, b) => a.accountCode.localeCompare(b.accountCode));
  }

  /** Chronological mutations of one account within a period — the Buku Besar rows. */
  async getLedgerRows(accountCode: string, from: string, to: string): Promise<LedgerRow[]> {
    const { data, error } = await this.supabase
      .from("journal_lines")
      .select(
        "debit, credit, accounts!inner(code), journal_entries!inner(entry_date, memo, source_type, status)",
      )
      .eq("accounts.code", accountCode)
      .gte("journal_entries.entry_date", from)
      .lte("journal_entries.entry_date", to)
      .eq("journal_entries.status", "posted");

    if (error || !data) {
      throw new Error(`Failed to load ledger rows: ${error?.message}`);
    }

    return data
      .map((row) => {
        const entry = row.journal_entries as unknown as {
          entry_date: string;
          memo: string | null;
          source_type: string | null;
        };
        return {
          entryDate: entry.entry_date,
          memo: entry.memo ?? "-",
          sourceType: entry.source_type ?? "manual",
          debit: row.debit,
          credit: row.credit,
        };
      })
      .sort((a, b) => a.entryDate.localeCompare(b.entryDate));
  }

  async getAccountBalance(accountCode: string, asOf: string): Promise<number> {
    const trialBalance = await this.getTrialBalance(asOf);
    const row = trialBalance.find((r) => r.accountCode === accountCode);
    if (!row) return 0;
    return round2(row.debit - row.credit);
  }

  private async resolveAccountIds(codes: string[]): Promise<Map<string, string>> {
    const uniqueCodes = [...new Set(codes)];
    const { data, error } = await this.supabase
      .from("accounts")
      .select("id, code")
      .in("code", uniqueCodes);

    if (error || !data) {
      throw new Error(`Failed to resolve accounts: ${error?.message}`);
    }

    const missing = uniqueCodes.filter((code) => !data.some((a) => a.code === code));
    if (missing.length > 0) {
      throw new Error(`Unknown account code(s): ${missing.join(", ")}`);
    }

    return new Map(data.map((a) => [a.code, a.id as string]));
  }
}
