"use server";

import { z } from "zod";

import { PublicDataService } from "@/lib/services/public-data-service";
import { createClient } from "@/lib/supabase/server";

const leadSchema = z.object({
  name: z.string().min(2, "Nama wajib diisi."),
  contact: z.string().min(5, "Kontak wajib diisi."),
  message: z.string().optional(),
});

export async function submitLead(
  _prevState: { success?: boolean; error?: string } | undefined,
  formData: FormData,
): Promise<{ success?: boolean; error?: string }> {
  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    contact: formData.get("contact"),
    message: formData.get("message") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const supabase = await createClient();
  const publicData = new PublicDataService(supabase);

  try {
    await publicData.submitLead({ ...parsed.data, sourcePage: "/kontak" });
  } catch {
    return { error: "Gagal mengirim pesan. Silakan coba lagi." };
  }

  return { success: true };
}
