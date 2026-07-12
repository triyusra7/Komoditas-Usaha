import type { MetadataRoute } from "next";

import { PublicDataService } from "@/lib/services/public-data-service";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const publicData = new PublicDataService(supabase);

  const [categories, products] = await Promise.all([
    publicData.getCategories(),
    publicData.getProducts(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = ["", "/tentang", "/katalog", "/kontak"].map(
    (path) => ({ url: `${BASE_URL}${path}`, changeFrequency: "weekly", priority: 0.8 }),
  );

  const categoryRoutes: MetadataRoute.Sitemap = categories
    .filter((c) => c.status === "active")
    .map((c) => ({
      url: `${BASE_URL}/katalog/${c.slug}`,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/produk/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
