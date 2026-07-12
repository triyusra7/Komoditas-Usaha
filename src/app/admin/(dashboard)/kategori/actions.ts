"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireRole } from "@/lib/auth/access-control";
import { ContentService } from "@/lib/services/content-service";
import { createClient } from "@/lib/supabase/server";

const createCategorySchema = z.object({
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  name: z.string().min(2),
  commodityType: z.enum(["babi", "kopi", "perikanan"]),
  description: z.string().optional(),
});

export async function createCategory(formData: FormData): Promise<void> {
  await requireRole("owner");

  const parsed = createCategorySchema.parse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    commodityType: formData.get("commodityType"),
    description: formData.get("description") || undefined,
  });

  const supabase = await createClient();
  const content = new ContentService(supabase);
  await content.createCategory({
    slug: parsed.slug,
    name: parsed.name,
    commodity_type: parsed.commodityType,
    description: parsed.description ?? null,
  });

  revalidatePath("/admin/kategori");
}

export async function toggleCategoryPublic(id: string, isPublic: boolean): Promise<void> {
  await requireRole("owner");
  const supabase = await createClient();
  const content = new ContentService(supabase);
  await content.updateCategory(id, { is_public: isPublic });
  revalidatePath("/admin/kategori");
}

export async function deleteCategory(id: string): Promise<void> {
  await requireRole("owner");
  const supabase = await createClient();
  const content = new ContentService(supabase);
  await content.deleteCategory(id);
  revalidatePath("/admin/kategori");
}
