import type { Product } from "@/lib/services/content-service";

export const MAX_PRODUCT_IMAGES = 4;

/** Cover first, then gallery — the exact order the actions persist. */
export function productImages(product: Product): string[] {
  const gallery = Array.isArray(product.gallery)
    ? product.gallery.filter((item): item is string => typeof item === "string")
    : [];
  return [product.cover_image, ...gallery].filter((url): url is string => !!url);
}
