"use server";

import { z } from "zod";

import { PublicDataService } from "@/lib/services/public-data-service";
import { createClient } from "@/lib/supabase/server";

const leadSchema = z.object({
  name: z.string().min(2, "Nama wajib diisi."),
  contact: z.string().min(5, "Kontak wajib diisi."),
  message: z.string().min(3, "Pesan wajib diisi."),
  interest: z.string().optional(),
  website: z.string().max(0).optional(), // honeypot — humans never fill this
});

export async function submitLead(
  _prevState: { success?: boolean; error?: string } | undefined,
  formData: FormData,
): Promise<{ success?: boolean; error?: string }> {
  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    contact: formData.get("contact"),
    message: formData.get("message"),
    interest: formData.get("interest") || undefined,
    website: formData.get("website") || undefined,
  });

  if (!parsed.success) {
    const isHoneypot = parsed.error.issues.some((issue) => issue.path[0] === "website");
    if (isHoneypot) return { success: true }; // silently swallow bots
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const supabase = await createClient();
  const publicData = new PublicDataService(supabase);

  try {
    await publicData.submitLead({
      name: parsed.data.name,
      contact: parsed.data.contact,
      message: parsed.data.message,
      interest: parsed.data.interest,
      sourcePage: "/kontak",
    });
  } catch {
    return { error: "Gagal mengirim pesan. Silakan coba lagi." };
  }

  return { success: true };
}
