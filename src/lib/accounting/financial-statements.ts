import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/supabase";

export type AccountType = "asset" | "liability" | "equity" | "income" | "expense";
export type NormalSide = "debit" | "credit";

export type AccountBalanceRow = {
  code: string;
  name: string;
  type: AccountType;
  normalSide: NormalSide;
  debit: number;
  credit: number;
};

export type CashMutationRow = {
  sourceType: string;
  debit: number;
  credit: number;
};

export type IncomeStatement = {
  totalIncome: number;
  totalExpense: number;
  netIncome: number;
  incomeLines: { code: string; name: string; amount: number }[];
  expenseLines: { code: string; name: string; amount: number }[];
};

export type BalanceSheet = {
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  isBalanced: boolean;
  assetLines: { code: string; name: string; amount: number }[];
  liabilityLines: { code: string; name: string; amount: number }[];
  equityLines: { code: string; name: string; amount: number }[];
};

export type CashFlowStatement = {
  operating: number;
  investing: number;
  financing: number;
  netChangeInCash: number;
};

export type FinancialRatios = {
  netProfitMargin: number | null;
  returnOnEquity: number | null;
  debtToEquityRatio: number | null;
  debtServiceCoverageRatio: number | null;
};

const CASH_FLOW_CATEGORY: Record<string, keyof Omit<CashFlowStatement, "netChangeInCash">> = {
  sale: "operating",
  purchase_feed: "operating",
  purchase_livestock: "operating",
  purchase_medicine: "operating",
  purchase_service: "operating",
  opex: "operating",
  manual: "operating",
  reversal: "operating",
  purchase_asset: "investing",
  investor_contribution: "financing",
  bank_loan: "financing",
  loan_repayment: "financing",
};

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** balance = the side that grows the account, per its normal_side. */
function periodBalance(row: { debit: number; credit: number; normalSide: NormalSide }): number {
  return row.normalSide === "debit" ? row.debit - row.credit : row.credit - row.debit;
}

/** Pure — computes L/R from a period's account balance rows (income + expense types only). */
export function computeIncomeStatement(rows: AccountBalanceRow[]): IncomeStatement {
  const incomeLines = rows
    .filter((r) => r.type === "income")
    .map((r) => ({ code: r.code, name: r.name, amount: round2(periodBalance(r)) }));
  const expenseLines = rows
    .filter((r) => r.type === "expense")
    .map((r) => ({ code: r.code, name: r.name, amount: round2(periodBalance(r)) }));

  const totalIncome = round2(incomeLines.reduce((sum, l) => sum + l.amount, 0));
  const totalExpense = round2(expenseLines.reduce((sum, l) => sum + l.amount, 0));

  return {
    totalIncome,
    totalExpense,
    netIncome: round2(totalIncome - totalExpense),
    incomeLines,
    expenseLines,
  };
}

/**
 * Pure — computes the balance sheet from cumulative-as-of account balance rows.
 *
 * `rows` is expected to cover the entire life of the ledger up to `asOf` (no
 * period-closing entries exist in this system), so income/expense accounts
 * still carry their all-time balance. Their net becomes "Laba Ditahan
 * (Berjalan)" — unclosed retained earnings — inside equity. Without folding
 * that in, the sheet would only balance for a ledger with zero net income.
 */
export function computeBalanceSheet(rows: AccountBalanceRow[]): BalanceSheet {
  const assetLines = rows
    .filter((r) => r.type === "asset")
    .map((r) => ({ code: r.code, name: r.name, amount: round2(periodBalance(r)) }));
  const liabilityLines = rows
    .filter((r) => r.type === "liability")
    .map((r) => ({ code: r.code, name: r.name, amount: round2(periodBalance(r)) }));
  const recordedEquityLines = rows
    .filter((r) => r.type === "equity")
    .map((r) => ({ code: r.code, name: r.name, amount: round2(periodBalance(r)) }));

  const retainedEarnings = round2(
    rows
      .filter((r) => r.type === "income" || r.type === "expense")
      .reduce((sum, r) => sum + (r.type === "income" ? periodBalance(r) : -periodBalance(r)), 0),
  );

  const equityLines = [
    ...recordedEquityLines,
    { code: "3900", name: "Laba Ditahan (Berjalan)", amount: retainedEarnings },
  ];

  const totalAssets = round2(assetLines.reduce((sum, l) => sum + l.amount, 0));
  const totalLiabilities = round2(liabilityLines.reduce((sum, l) => sum + l.amount, 0));
  const totalEquity = round2(equityLines.reduce((sum, l) => sum + l.amount, 0));

  return {
    totalAssets,
    totalLiabilities,
    totalEquity,
    isBalanced: totalAssets === round2(totalLiabilities + totalEquity),
    assetLines,
    liabilityLines,
    equityLines,
  };
}

/** Pure — direct-method cash flow from Kas/Bank mutations, bucketed by transaction source_type. */
export function computeCashFlow(cashMutations: CashMutationRow[]): CashFlowStatement {
  const totals: CashFlowStatement = {
    operating: 0,
    investing: 0,
    financing: 0,
    netChangeInCash: 0,
  };

  for (const mutation of cashMutations) {
    const category = CASH_FLOW_CATEGORY[mutation.sourceType] ?? "operating";
    const net = mutation.debit - mutation.credit;
    totals[category] = round2(totals[category] + net);
  }

  totals.netChangeInCash = round2(totals.operating + totals.investing + totals.financing);
  return totals;
}

function round4(value: number): number {
  return Math.round(value * 10_000) / 10_000;
}

/**
 * Pure — ratios per business-plan definitions (marjin, ROE, DER, DSCR).
 * Rounded to 4 decimals rather than 2 — these are ratios, not currency, and
 * 2 decimals throws away too much precision for numbers usually below 1.
 */
export function computeRatios(
  incomeStatement: IncomeStatement,
  balanceSheet: BalanceSheet,
  debtService?: { principalPaid: number; interestPaid: number },
): FinancialRatios {
  const netProfitMargin =
    incomeStatement.totalIncome > 0
      ? round4(incomeStatement.netIncome / incomeStatement.totalIncome)
      : null;

  const returnOnEquity =
    balanceSheet.totalEquity > 0
      ? round4(incomeStatement.netIncome / balanceSheet.totalEquity)
      : null;

  const debtToEquityRatio =
    balanceSheet.totalEquity > 0
      ? round4(balanceSheet.totalLiabilities / balanceSheet.totalEquity)
      : null;

  const debtServiceTotal = debtService
    ? debtService.principalPaid + debtService.interestPaid
    : 0;
  const debtServiceCoverageRatio =
    debtService && debtServiceTotal > 0
      ? round4(incomeStatement.netIncome / debtServiceTotal)
      : null;

  return { netProfitMargin, returnOnEquity, debtToEquityRatio, debtServiceCoverageRatio };
}

/** DB-facing glue: fetches raw rows, delegates all math to the pure functions above. */
export class FinancialStatements {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  private async fetchAccountBalances(
    fromDate: string | null,
    toDate: string,
  ): Promise<AccountBalanceRow[]> {
    let query = this.supabase
      .from("journal_lines")
      .select(
        "debit, credit, accounts!inner(code, name, type, normal_side), journal_entries!inner(entry_date, status)",
      )
      .lte("journal_entries.entry_date", toDate)
      .eq("journal_entries.status", "posted");

    if (fromDate) {
      query = query.gte("journal_entries.entry_date", fromDate);
    }

    const { data, error } = await query;
    if (error || !data) {
      throw new Error(`Failed to load account balances: ${error?.message}`);
    }

    const totals = new Map<string, AccountBalanceRow>();
    for (const row of data) {
      const account = row.accounts as unknown as {
        code: string;
        name: string;
        type: AccountType;
        normal_side: NormalSide;
      };
      const existing = totals.get(account.code) ?? {
        code: account.code,
        name: account.name,
        type: account.type,
        normalSide: account.normal_side,
        debit: 0,
        credit: 0,
      };
      existing.debit += row.debit;
      existing.credit += row.credit;
      totals.set(account.code, existing);
    }

    return [...totals.values()];
  }

  async incomeStatement(range: { from: string; to: string }): Promise<IncomeStatement> {
    const rows = await this.fetchAccountBalances(range.from, range.to);
    return computeIncomeStatement(rows);
  }

  async balanceSheet(asOf: string): Promise<BalanceSheet> {
    const rows = await this.fetchAccountBalances(null, asOf);
    return computeBalanceSheet(rows);
  }

  async cashFlow(range: { from: string; to: string }): Promise<CashFlowStatement> {
    const { data, error } = await this.supabase
      .from("journal_lines")
      .select(
        "debit, credit, accounts!inner(code), journal_entries!inner(entry_date, status, source_type)",
      )
      .in("accounts.code", ["1100", "1200"])
      .gte("journal_entries.entry_date", range.from)
      .lte("journal_entries.entry_date", range.to)
      .eq("journal_entries.status", "posted");

    if (error || !data) {
      throw new Error(`Failed to load cash mutations: ${error?.message}`);
    }

    const cashMutations: CashMutationRow[] = data.map((row) => ({
      sourceType:
        (row.journal_entries as unknown as { source_type: string | null }).source_type ??
        "manual",
      debit: row.debit,
      credit: row.credit,
    }));

    return computeCashFlow(cashMutations);
  }

  async ratios(range: { from: string; to: string }): Promise<FinancialRatios> {
    const [incomeStatement, balanceSheet] = await Promise.all([
      this.incomeStatement(range),
      this.balanceSheet(range.to),
    ]);
    return computeRatios(incomeStatement, balanceSheet);
  }
}
