"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { LedgerService, UnbalancedJournalError } from "@/lib/accounting/ledger-service";
import type { JournalLineInput } from "@/lib/accounting/types";
import { requireRole } from "@/lib/auth/access-control";
import { createClient } from "@/lib/supabase/server";

/**
 * Posts a manual (jurnal umum) entry from the row-based form: parallel arrays
 * of account codes, debit, and credit amounts. Balance is enforced here and by
 * LedgerService/DB — an unbalanced journal is always rejected.
 */
export async function postManualJournal(
  _prevState: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  await requireRole("owner");

  const entryDate = String(formData.get("entryDate") ?? "");
  const memo = String(formData.get("memo") ?? "").trim();
  if (!entryDate) return { error: "Tanggal wajib diisi." };
  if (memo.length < 2) return { error: "Keterangan wajib diisi." };

  const accountCodes = formData.getAll("accountCode").map(String);
  const debits = formData.getAll("debit").map(String);
  const credits = formData.getAll("credit").map(String);

  const lines: JournalLineInput[] = [];
  for (let i = 0; i < accountCodes.length; i++) {
    const accountCode = accountCodes[i];
    const debit = Number(debits[i] || 0);
    const credit = Number(credits[i] || 0);

    if (!accountCode && debit === 0 && credit === 0) continue; // empty row
    if (!accountCode) return { error: `Baris ${i + 1}: pilih akun.` };
    if (debit < 0 || credit < 0) return { error: `Baris ${i + 1}: nominal tidak boleh negatif.` };
    if (debit > 0 && credit > 0) {
      return { error: `Baris ${i + 1}: isi debit ATAU kredit, tidak keduanya.` };
    }
    if (debit === 0 && credit === 0) {
      return { error: `Baris ${i + 1}: isi nominal debit atau kredit.` };
    }
    lines.push({ accountCode, debit, credit });
  }

  if (lines.length < 2) {
    return { error: "Jurnal minimal 2 baris (satu debit, satu kredit)." };
  }

  const supabase = await createClient();
  const ledger = new LedgerService(supabase);

  try {
    await ledger.postJournalEntry({
      entryDate,
      memo,
      sourceType: "manual",
      lines,
    });
  } catch (error) {
    if (error instanceof UnbalancedJournalError) {
      return { error: "Total debit harus sama dengan total kredit." };
    }
    return { error: error instanceof Error ? error.message : "Gagal memposting jurnal." };
  }

  revalidatePath("/admin/jurnal");
  revalidatePath("/admin/laporan", "layout");
  revalidatePath("/admin");
  redirect("/admin/jurnal");
}
