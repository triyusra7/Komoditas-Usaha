import type { Metadata } from "next";

import { CategoryCard } from "@/components/catalog-cards";
import { PublicDataService } from "@/lib/services/public-data-service";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Katalog Komoditas",
  description: "Katalog komoditas Tri Agri: babi, kopi, dan perikanan.",
};

export default async function KatalogPage() {
  const supabase = await createClient();
  const publicData = new PublicDataService(supabase);
  const categories = await publicData.getCategories();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <span className="rounded-full border border-foreground/20 px-4 py-1.5 text-xs font-bold tracking-widest uppercase">
        Katalog
      </span>
      <h1 className="mt-6 font-heading text-4xl font-bold">Komoditas Kami</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Pilih kategori untuk melihat produk yang tersedia. Kategori bertanda
        &ldquo;Segera Hadir&rdquo; sedang kami siapkan.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
        {categories.length === 0 && (
          <p className="text-sm text-muted-foreground">Belum ada kategori publik.</p>
        )}
      </div>
    </div>
  );
}
