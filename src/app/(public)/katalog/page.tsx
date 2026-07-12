import type { Metadata } from "next";

import { AnimateIn } from "@/components/animate-in";
import { CategoryCard } from "@/components/catalog-cards";
import { PublicDataService } from "@/lib/services/public-data-service";
import { createClient } from "@/lib/supabase/server";
import { t } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Katalog Komoditas",
  description: "Katalog komoditas Tri Agri: babi, kopi, dan perikanan.",
};

export default async function KatalogPage() {
  const supabase = await createClient();
  const publicData = new PublicDataService(supabase);
  const categories = await publicData.getCategories();
  const lang = await getLanguage();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <AnimateIn variant="fade-down" duration={500}>
        <span className="rounded-full border border-foreground/20 px-4 py-1.5 text-xs font-bold tracking-widest uppercase">
          {t("Katalog", lang)}
        </span>
      </AnimateIn>
      <AnimateIn variant="fade-up" delay={100} duration={700}>
        <h1 className="mt-6 font-heading text-4xl font-bold">{t("Komoditas Kami", lang)}</h1>
      </AnimateIn>
      <AnimateIn variant="fade-up" delay={200} duration={600}>
        <p className="mt-2 max-w-xl text-muted-foreground">
          {t("Pilih kategori untuk melihat produk yang tersedia. Kategori bertanda &ldquo;Segera Hadir&rdquo; sedang kami siapkan.", lang)}
        </p>
      </AnimateIn>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {categories.map((category, i) => (
          <AnimateIn key={category.id} variant="fade-up" delay={i * 120} duration={600} className="h-full">
            <CategoryCard category={category} lang={lang} />
          </AnimateIn>
        ))}
        {categories.length === 0 && (
          <p className="text-sm text-muted-foreground">{t("Belum ada kategori publik.", lang)}</p>
        )}
      </div>
    </div>
  );
}
