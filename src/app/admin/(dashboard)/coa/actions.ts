"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireRole } from "@/lib/auth/access-control";
import { createClient } from "@/lib/supabase/server";

const updateAccountNameSchema = z.object({
  name: z.string().trim().min(2, "Nama akun minimal 2 karakter"),
});

const ACCOUNT_TYPE_PREFIX: Record<string, string> = {
  asset: "1",
  liability: "2",
  equity: "3",
  income: "4",
  expense: "5",
};

const createAccountSchema = z.object({
  type: z.enum(["asset", "liability", "equity", "income", "expense"]),
  name: z.string().trim().min(2, "Nama akun minimal 2 karakter"),
  normalSide: z.enum(["debit", "credit"]),
  isActive: z.coerce.boolean(),
});

/**
 * Creates a COA account with an auto-generated code (Arobi flow: the user
 * picks the type and name; the code is assigned by the system). Codes step by
 * 10 within the type's range: asset 1xxx, liability 2xxx, equity 3xxx,
 * income 4xxx, expense 5xxx.
 */
export async function createAccount(
  _prevState: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  await requireRole("owner");

  const parsed = createAccountSchema.safeParse({
    type: formData.get("type"),
    name: formData.get("name"),
    normalSide: formData.get("normalSide"),
    isActive: formData.get("isActive") === "on",
  });
  if (!parsed.success) {
    return { error: "Data akun tidak valid. Periksa kembali isian Anda." };
  }

  const supabase = await createClient();
  const prefix = ACCOUNT_TYPE_PREFIX[parsed.data.type];
  const { data: existing, error: loadError } = await supabase
    .from("accounts")
    .select("code")
    .like("code", `${prefix}%`);
  if (loadError) return { error: `Gagal memuat daftar akun: ${loadError.message}` };

  const maxCode = (existing ?? [])
    .map((row) => Number(row.code))
    .filter((code) => Number.isFinite(code))
    .reduce((max, code) => Math.max(max, code), Number(prefix) * 1000);
  const nextCode = String(maxCode + 10);

  const { error: insertError } = await supabase.from("accounts").insert({
    code: nextCode,
    name: parsed.data.name,
    type: parsed.data.type,
    normal_side: parsed.data.normalSide,
    is_active: parsed.data.isActive,
  });
  if (insertError) return { error: `Gagal membuat akun: ${insertError.message}` };

  revalidatePath("/admin/coa");
  redirect("/admin/coa");
}

export async function updateAccountName(code: string, formData: FormData): Promise<void> {
  await requireRole("owner");

  const parsed = updateAccountNameSchema.parse({
    name: formData.get("name"),
  });

  const supabase = await createClient();
  const { error } = await supabase
    .from("accounts")
    .update({ name: parsed.name })
    .eq("code", code);
  if (error) throw new Error(`Gagal mengubah nama akun: ${error.message}`);

  revalidatePath("/admin/coa");
  revalidatePath("/admin/laporan", "layout");
  redirect("/admin/coa");
}
