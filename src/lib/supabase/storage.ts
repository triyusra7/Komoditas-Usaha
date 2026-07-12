import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/supabase";

const MEDIA_BUCKET = "media";
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export class ImageUploadError extends Error {}

/**
 * Uploads one image to the public `media` bucket and returns its public URL.
 * Validates type and size; callers decide the folder (e.g. "products", "trace-events").
 */
export async function uploadImage(
  supabase: SupabaseClient<Database>,
  file: File,
  folder: string,
): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new ImageUploadError("Format gambar harus JPG, PNG, WebP, atau AVIF.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new ImageUploadError("Ukuran gambar maksimal 3 MB per file.");
  }

  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { contentType: file.type, cacheControl: "31536000" });
  if (error) {
    throw new ImageUploadError(`Gagal mengunggah gambar: ${error.message}`);
  }

  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Extracts non-empty File entries for a multi-file input field. */
export function getUploadedFiles(formData: FormData, field: string): File[] {
  return formData
    .getAll(field)
    .filter((value): value is File => value instanceof File && value.size > 0);
}
