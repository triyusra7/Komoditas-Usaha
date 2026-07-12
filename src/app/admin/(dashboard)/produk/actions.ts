"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireRole } from "@/lib/auth/access-control";
import { ContentService } from "@/lib/services/content-service";
import { createClient } from "@/lib/supabase/server";
import { getUploadedFiles, uploadImage } from "@/lib/supabase/storage";

// "use server" modules may only export async functions — keep in sync with product-form.tsx
const MAX_PRODUCT_IMAGES = 4;

const productSchema = z.object({
  categoryId: z.string().uuid(),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  name: z.string().min(2),
  shortDesc: z.string().optional(),
  description: z.string().optional(),
  breed: z.string().optional(),
  unit: z.string().optional(),
  priceNumeric: z.coerce.number().nonnegative().optional(),
  availability: z.enum(["available", "preorder", "sold_out"]),
});

function parseProductFields(formData: FormData) {
  return productSchema.parse({
    categoryId: formData.get("categoryId"),
    slug: formData.get("slug"),
    name: formData.get("name"),
    shortDesc: formData.get("shortDesc") || undefined,
    description: formData.get("description") || undefined,
    breed: formData.get("breed") || undefined,
    unit: formData.get("unit") || undefined,
    priceNumeric: formData.get("priceNumeric") || undefined,
    availability: formData.get("availability") ?? "available",
  });
}

async function uploadNewPhotos(formData: FormData, limit: number): Promise<string[]> {
  const files = getUploadedFiles(formData, "photos").slice(0, Math.max(limit, 0));
  const supabase = await createClient();
  const urls: string[] = [];
  for (const file of files) {
    urls.push(await uploadImage(supabase, file, "products"));
  }
  return urls;
}

function revalidateProductPages(slug: string): void {
  revalidatePath("/admin/produk");
  revalidatePath("/");
  revalidatePath("/katalog");
  revalidatePath(`/produk/${slug}`);
}

export async function createProduct(formData: FormData): Promise<void> {
  await requireRole("owner");

  const parsed = parseProductFields(formData);
  const images = await uploadNewPhotos(formData, MAX_PRODUCT_IMAGES);

  const supabase = await createClient();
  const content = new ContentService(supabase);
  await content.createProduct({
    category_id: parsed.categoryId,
    slug: parsed.slug,
    name: parsed.name,
    short_desc: parsed.shortDesc ?? null,
    description: parsed.description ?? null,
    breed: parsed.breed ?? null,
    unit: parsed.unit ?? null,
    price_numeric: parsed.priceNumeric ?? null,
    availability: parsed.availability,
    cover_image: images[0] ?? null,
    gallery: images.slice(1),
  });

  revalidateProductPages(parsed.slug);
  redirect("/admin/produk");
}

export async function updateProduct(id: string, formData: FormData): Promise<void> {
  await requireRole("owner");

  const parsed = parseProductFields(formData);

  // Images the user chose to keep (checkboxes), in their original order,
  // then any newly uploaded photos — capped at MAX_PRODUCT_IMAGES total.
  const keptImages = formData
    .getAll("keepImages")
    .filter((value): value is string => typeof value === "string" && value.length > 0)
    .slice(0, MAX_PRODUCT_IMAGES);
  const newImages = await uploadNewPhotos(formData, MAX_PRODUCT_IMAGES - keptImages.length);
  const images = [...keptImages, ...newImages];

  const supabase = await createClient();
  const content = new ContentService(supabase);
  await content.updateProduct(id, {
    category_id: parsed.categoryId,
    slug: parsed.slug,
    name: parsed.name,
    short_desc: parsed.shortDesc ?? null,
    description: parsed.description ?? null,
    breed: parsed.breed ?? null,
    unit: parsed.unit ?? null,
    price_numeric: parsed.priceNumeric ?? null,
    availability: parsed.availability,
    cover_image: images[0] ?? null,
    gallery: images.slice(1),
  });

  revalidateProductPages(parsed.slug);
  redirect("/admin/produk");
}

export async function toggleProductPublic(id: string, isPublic: boolean): Promise<void> {
  await requireRole("owner");
  const supabase = await createClient();
  const content = new ContentService(supabase);
  await content.updateProduct(id, {
    is_public: isPublic,
    status: isPublic ? "published" : "draft",
  });
  revalidatePath("/admin/produk");
  revalidatePath("/");
}

export async function togglePriceVisible(id: string, priceVisible: boolean): Promise<void> {
  await requireRole("owner");
  const supabase = await createClient();
  const content = new ContentService(supabase);
  await content.updateProduct(id, { price_visible: priceVisible });
  revalidatePath("/admin/produk");
  revalidatePath("/");
}

export async function deleteProduct(id: string): Promise<void> {
  await requireRole("owner");
  const supabase = await createClient();
  const content = new ContentService(supabase);
  await content.deleteProduct(id);
  revalidatePath("/admin/produk");
  revalidatePath("/");
}
