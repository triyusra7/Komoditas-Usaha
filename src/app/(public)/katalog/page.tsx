import Link from "next/link";
import type { Metadata } from "next";

import { PublicDataService } from "@/lib/services/public-data-service";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Katalog Komoditas",
};

export default async function KatalogPage() {
  const supabase = await createClient();
  const publicData = new PublicDataService(supabase);
  const categories = await publicData.getCategories();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-heading text-3xl font-bold">Katalog Komoditas</h1>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.status === "active" ? `/katalog/${category.slug}` : "#"}
            className="rounded-lg border border-border p-6 transition-colors hover:border-primary"
            aria-disabled={category.status !== "active"}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold">{category.name}</h2>
              {category.status === "coming_soon" && (
                <span className="text-xs text-muted-foreground">Segera Hadir</span>
              )}
            </div>
            {category.description && (
              <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
            )}
          </Link>
        ))}
        {categories.length === 0 && (
          <p className="text-sm text-muted-foreground">Belum ada kategori publik.</p>
        )}
      </div>
    </div>
  );
}
