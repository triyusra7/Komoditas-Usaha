import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { AnimateIn } from "@/components/animate-in";
import { ProductCard } from "@/components/catalog-cards";
import { buttonVariants } from "@/components/ui/button";
import { PublicDataService } from "@/lib/services/public-data-service";
import { createClient } from "@/lib/supabase/server";
import { getLanguage, t, tc } from "@/lib/i18n";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug } = await params;
  return { title: `Katalog ${categorySlug.charAt(0).toUpperCase()}${categorySlug.slice(1)}` };
}

export default async function KategoriKatalogPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;

  const supabase = await createClient();
  const publicData = new PublicDataService(supabase);
  const categories = await publicData.getCategories();
  const category = categories.find((c) => c.slug === categorySlug);

  if (!category || category.status !== "active") notFound();

  const products = await publicData.getProducts({ categorySlug });
  const lang = await getLanguage();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <AnimateIn variant="fade" duration={400}>
        <Link href="/katalog" className="text-sm text-muted-foreground hover:underline">
          {t("← Semua kategori", lang)}
        </Link>
      </AnimateIn>
      <AnimateIn variant="fade-up" delay={100} duration={700}>
        <h1 className="mt-4 font-heading text-4xl font-bold">{tc(category.name, lang)}</h1>
      </AnimateIn>
      {category.description && (
        <AnimateIn variant="fade-up" delay={200} duration={600}>
          <p className="mt-2 max-w-2xl text-muted-foreground">{tc(category.description, lang)}</p>
        </AnimateIn>
      )}

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, i) => (
          <AnimateIn key={product.id} variant="fade-up" delay={i * 100} duration={600} className="h-full">
            <ProductCard product={product} lang={lang} />
          </AnimateIn>
        ))}
      </div>

      {products.length === 0 && (
        <AnimateIn variant="fade-up" delay={300} duration={600}>
          <div className="mt-10 rounded-2xl border border-dashed border-foreground/20 p-12 text-center">
            <p className="text-lg font-semibold">{t("Produk sedang disiapkan", lang)}</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              {t("Kami sedang melengkapi katalog kategori ini. Hubungi kami untuk informasi ketersediaan terbaru.", lang)}
            </p>
            <Link href="/kontak" className={`${buttonVariants({ size: "xl" })} mt-6`}>
              {t("Hubungi Kami", lang)}
            </Link>
          </div>
        </AnimateIn>
      )}
    </div>
  );
}
