import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { AnimateIn } from "@/components/animate-in";
import { ProductCard } from "@/components/catalog-cards";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { buttonVariants } from "@/components/ui/button";
import { PublicDataService } from "@/lib/services/public-data-service";
import { createClient } from "@/lib/supabase/server";
import { t, tc } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";

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
  const [categories, settings] = await Promise.all([
    publicData.getCategories(),
    publicData.getSiteSettings(),
  ]);
  const category = categories.find((c) => c.slug === categorySlug);

  if (!category || category.status !== "active") notFound();

  const products = await publicData.getProducts({ categorySlug });
  const lang = await getLanguage();

  return (
    <div className="bg-[#f7f0e6]">
      {/* Hero Header */}
      <section className="bg-secondary text-[#f7f0e6] pt-20 pb-16 sm:pb-24 border-b border-foreground/10">
        <div className="mx-auto max-w-6xl px-6 flex flex-col items-start gap-6">
          <AnimateIn variant="fade-down" duration={500}>
            <span className="rounded-full border border-[#f7f0e6]/30 px-3.5 py-1 text-xs font-black tracking-widest uppercase text-[#f7f0e6]/90 font-sans">
              {t("Katalog", lang)}
            </span>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={100} duration={700}>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-black text-[#fdfbf7] tracking-tight leading-none max-w-4xl">
              {t("Katalog", lang)} <span className="text-primary">{tc(category.name, lang)}</span>
            </h1>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={200} duration={600}>
            <p className="text-[#f7f0e6]/70 leading-relaxed font-sans font-medium text-base sm:text-lg max-w-2xl mt-2">
              {category.description ? `${tc(category.description, lang)}. ` : ""}
              {t("Jelajahi pilihan produk segar berkualitas tinggi dari kategori ini, diproduksi higienis dengan jaminan penelusuran penuh.", lang)}
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Products Grid */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <AnimateIn key={product.id} variant="fade-up" delay={i * 100} duration={600} className="h-full">
              <ProductCard product={product} lang={lang} />
            </AnimateIn>
          ))}
        </div>

        {products.length === 0 && (
          <AnimateIn variant="fade-up" delay={300} duration={600}>
            <div className="mt-10 rounded-2xl border border-dashed border-foreground/20 p-12 text-center bg-[#fdfbf7] shadow-[4px_4px_0px_#1d2b1f] border-2 border-secondary">
              <p className="text-lg font-black text-secondary">{t("Produk sedang disiapkan", lang)}</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-secondary/70 font-sans font-medium">
                {t("Kami sedang melengkapi katalog kategori ini. Hubungi kami untuk informasi ketersediaan terbaru.", lang)}
              </p>
              <Link href="/kontak" className={`${buttonVariants({ size: "xl" })} mt-6 rounded-full`}>
                {t("Hubungi Kami", lang)}
              </Link>
            </div>
          </AnimateIn>
        )}
      </section>

      {/* WhatsApp CTA Section (Neon Green) */}
      <AnimateIn variant="fade" duration={800}>
        <section className="bg-primary border-t border-foreground/10 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-12 items-center gap-8">
            <div className="md:col-span-8 flex flex-col items-start text-left gap-4">
              <AnimateIn variant="scale-up" duration={700} delay={200}>
                <span className="rounded-full border-2 border-secondary bg-secondary px-4 py-1.5 text-xs font-black tracking-widest uppercase text-primary shadow-[2.5px_2.5px_0px_#1d2b1f]">
                  {t("Kemitraan", lang)}
                </span>
              </AnimateIn>
              <AnimateIn variant="fade-up" delay={350}>
                <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-secondary leading-tight tracking-tight">
                  {t("Butuh pasokan rutin untuk katering atau usaha Anda?", lang)}
                </h2>
                <p className="mt-4 text-secondary/80 font-sans font-medium text-base sm:text-lg max-w-2xl leading-relaxed">
                  {t("Kami melayani kebutuhan katering kawasan industri, restoran, dan pengepul di Palopo, Morowali, dan sekitarnya.", lang)}
                </p>
              </AnimateIn>
            </div>
            <div className="md:col-span-4 flex justify-start md:justify-end">
              <AnimateIn variant="fade-up" delay={500}>
                {settings.whatsapp_number && (
                  <WhatsAppButton
                    phoneNumber={settings.whatsapp_number}
                    message={`Halo ${settings.business_name}, saya tertarik menjadi mitra/pelanggan rutin.`}
                    label={t("Hubungi Kami", lang)}
                    variant="secondary"
                    className="!h-16 md:!h-20 px-10 md:px-14 !text-base md:!text-lg !bg-secondary !text-primary hover:!bg-[#2e4030] shadow-[5px_5px_0px_#1d2b1f] hover:shadow-[2px_2px_0px_#1d2b1f] border-2 border-secondary"
                  />
                )}
              </AnimateIn>
            </div>
          </div>
        </section>
      </AnimateIn>
    </div>
  );
}
