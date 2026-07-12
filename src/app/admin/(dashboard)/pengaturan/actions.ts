"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireRole } from "@/lib/auth/access-control";
import { ContentService } from "@/lib/services/content-service";
import { createClient } from "@/lib/supabase/server";

const settingsSchema = z.object({
  businessName: z.string().min(2),
  tagline: z.string().optional(),
  heroText: z.string().optional(),
  whatsappNumber: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
});

export async function updateSiteSettings(formData: FormData): Promise<void> {
  await requireRole("owner");

  const parsed = settingsSchema.parse({
    businessName: formData.get("businessName"),
    tagline: formData.get("tagline") || undefined,
    heroText: formData.get("heroText") || undefined,
    whatsappNumber: formData.get("whatsappNumber") || undefined,
    email: formData.get("email") || "",
    address: formData.get("address") || undefined,
  });

  const supabase = await createClient();
  const content = new ContentService(supabase);
  await content.updateSiteSettings({
    business_name: parsed.businessName,
    tagline: parsed.tagline ?? null,
    hero_text: parsed.heroText ?? null,
    whatsapp_number: parsed.whatsappNumber ?? null,
    email: parsed.email || null,
    address: parsed.address ?? null,
  });

  revalidatePath("/admin/pengaturan");
  revalidatePath("/");
}
