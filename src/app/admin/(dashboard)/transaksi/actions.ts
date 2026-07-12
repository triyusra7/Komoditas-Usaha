"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { LedgerService } from "@/lib/accounting/ledger-service";
import type { PostingInput } from "@/lib/accounting/types";
import { requireRole } from "@/lib/auth/access-control";
import { createClient } from "@/lib/supabase/server";

const postTransactionSchema = z.object({
  type: z.enum([
    "sale",
    "purchase_feed",
    "purchase_livestock",
    "purchase_medicine",
    "purchase_asset",
    "purchase_service",
    "investor_contribution",
    "bank_loan",
    "loan_repayment",
    "opex",
    "depreciation",
  ]),
  entryDate: z.string().min(1),
  memo: z.string().min(2),
  amount: z.coerce.number().positive().optional(),
  isCash: z.coerce.boolean().optional(),
  cogsAmount: z.coerce.number().nonnegative().optional(),
  principalAmount: z.coerce.number().nonnegative().optional(),
  interestAmount: z.coerce.number().nonnegative().optional(),
});

export async function postTransaction(
  _prevState: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  await requireRole("owner");

  const parsed = postTransactionSchema.safeParse({
    type: formData.get("type"),
    entryDate: formData.get("entryDate"),
    memo: formData.get("memo"),
    amount: formData.get("amount") || undefined,
    isCash: formData.get("isCash") === "on",
    cogsAmount: formData.get("cogsAmount") || undefined,
    principalAmount: formData.get("principalAmount") || undefined,
    interestAmount: formData.get("interestAmount") || undefined,
  });

  if (!parsed.success) {
    return { error: "Data transaksi tidak valid." };
  }

  const { type, entryDate, memo, amount, isCash, cogsAmount, principalAmount, interestAmount } =
    parsed.data;

  let input: PostingInput;
  switch (type) {
    case "sale":
      if (!amount) return { error: "Nominal wajib diisi." };
      input = { type: "sale", amount, isCash: !!isCash, cogsAmount };
      break;
    case "purchase_feed":
    case "purchase_livestock":
    case "purchase_medicine":
    case "purchase_asset":
    case "purchase_service":
      if (!amount) return { error: "Nominal wajib diisi." };
      input = { type, amount, isCash: !!isCash };
      break;
    case "investor_contribution":
      if (!amount) return { error: "Nominal wajib diisi." };
      input = { type: "investor_contribution", amount };
      break;
    case "bank_loan":
      if (!amount) return { error: "Nominal wajib diisi." };
      input = { type: "bank_loan", amount };
      break;
    case "loan_repayment":
      input = {
        type: "loan_repayment",
        principalAmount: principalAmount ?? 0,
        interestAmount: interestAmount ?? 0,
      };
      break;
    case "opex":
      if (!amount) return { error: "Nominal wajib diisi." };
      input = { type: "opex", amount, isCash: !!isCash };
      break;
    case "depreciation":
      if (!amount) return { error: "Nominal wajib diisi." };
      input = { type: "depreciation", amount };
      break;
  }

  const supabase = await createClient();
  const ledger = new LedgerService(supabase);

  try {
    await ledger.postTransaction(input, entryDate, memo);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal memposting transaksi." };
  }

  revalidatePath("/admin/transaksi");
  revalidatePath("/admin/laporan");
  revalidatePath("/admin");
  return {};
}

export async function reverseJournalEntry(entryId: string): Promise<void> {
  await requireRole("owner");
  const supabase = await createClient();
  const ledger = new LedgerService(supabase);
  await ledger.reverseEntry(entryId);
  revalidatePath("/admin/transaksi");
  revalidatePath("/admin/laporan");
}
