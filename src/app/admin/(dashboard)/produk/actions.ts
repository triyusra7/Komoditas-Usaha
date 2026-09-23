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
  categoryId: z.string().min(1),
  newCategoryName: z.string().optional(),
  newCategorySlug: z.string().optional(),
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
    newCategoryName: (formData.get("newCategoryName") as string)?.trim() || undefined,
    newCategorySlug: (formData.get("newCategorySlug") as string)?.trim() || undefined,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function resolveCategoryId(supabase: any, parsed: ReturnType<typeof parseProductFields>): Promise<string> {
  // If user selected custom new category or typed a new category name
  if (parsed.categoryId === "custom_new" || parsed.newCategoryName) {
    const catName = parsed.newCategoryName || "Komoditas Baru";
    const catSlug = (
      parsed.newCategorySlug ||
      catName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ||
      "kategori-baru"
    ).trim();

    const { data: existing } = await supabase
      .from("commodity_categories")
      .select("id")
      .eq("slug", catSlug)
      .maybeSingle();

    if (existing) return existing.id;

    const type = catSlug.includes("kopi") ? "coffee" : "pig";
    const { data: newCat, error: insertError } = await supabase
      .from("commodity_categories")
      .insert({
        name: catName,
        slug: catSlug,
        commodity_type: type,
        status: "active",
        is_public: true,
        description: `Kategori komoditas ${catName}`,
      })
      .select("id")
      .single();

    if (insertError) throw new Error(`Gagal membuat kategori baru: ${insertError.message}`);
    return newCat.id;
  }

  // If user selected default virtual Jagung
  if (parsed.categoryId === "create_jagung_default") {
    const { data: existingJagung } = await supabase
      .from("commodity_categories")
      .select("id")
      .eq("slug", "jagung")
      .maybeSingle();

    if (existingJagung) return existingJagung.id;

    // Check if legacy 'babi' category can be renamed to 'jagung'
    const { data: legacyBabi } = await supabase
      .from("commodity_categories")
      .select("id")
      .eq("slug", "babi")
      .maybeSingle();

    if (legacyBabi) {
      await supabase
        .from("commodity_categories")
        .update({ name: "Jagung Pakan", slug: "jagung" })
        .eq("id", legacyBabi.id);
      return legacyBabi.id;
    }

    const { data: created, error } = await supabase
      .from("commodity_categories")
      .insert({
        name: "Jagung Pakan",
        slug: "jagung",
        commodity_type: "pig",
        status: "active",
        is_public: true,
        description: "Komoditas jagung pipil kering berkualitas tinggi",
      })
      .select("id")
      .single();
    if (error) throw new Error(`Gagal membuat kategori jagung: ${error.message}`);
    return created.id;
  }

  return parsed.categoryId;
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
  await requireRole("owner", "staff");

  const parsed = parseProductFields(formData);
  const images = await uploadNewPhotos(formData, MAX_PRODUCT_IMAGES);

  const supabase = await createClient();
  const finalCategoryId = await resolveCategoryId(supabase, parsed);
  const content = new ContentService(supabase);
  await content.createProduct({
    category_id: finalCategoryId,
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
  await requireRole("owner", "staff");

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
  const finalCategoryId = await resolveCategoryId(supabase, parsed);
  const content = new ContentService(supabase);
  await content.updateProduct(id, {
    category_id: finalCategoryId,
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
  await requireRole("owner", "staff");
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
  await requireRole("owner", "staff");
  const supabase = await createClient();
  const content = new ContentService(supabase);
  await content.updateProduct(id, { price_visible: priceVisible });
  revalidatePath("/admin/produk");
  revalidatePath("/");
}

export async function deleteProduct(id: string): Promise<void> {
  await requireRole("owner", "staff");
  const supabase = await createClient();
  const content = new ContentService(supabase);
  await content.deleteProduct(id);
  revalidatePath("/admin/produk");
  revalidatePath("/");
}
