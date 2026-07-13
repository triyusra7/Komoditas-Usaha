import Link from "next/link";

import { AnimateIn } from "@/components/animate-in";
import { CategoryCard, ProductCard } from "@/components/catalog-cards";
import { ContentBlocks } from "@/components/content-blocks";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { buttonVariants } from "@/components/ui/button";
import { PublicDataService } from "@/lib/services/public-data-service";
import { createClient } from "@/lib/supabase/server";

import { t, tc } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";

export const revalidate = 60;

export default async function BerandaPage() {
  const supabase = await createClient();
  const publicData = new PublicDataService(supabase);
  const [settings, categories, featured, homeBlocks] = await Promise.all([
    publicData.getSiteSettings(),
    publicData.getCategories(),
    publicData.getFeaturedProducts(4),
    publicData.getPageBlocks("home"),
  ]);
  const lang = await getLanguage();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#f7f0e6] pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-foreground/10">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 sm:grid-cols-2 relative z-10">
          {/* Left Column: Heading and CTAs */}
          <div className="flex flex-col items-start gap-6 relative z-10">
            <AnimateIn variant="fade-down" duration={500}>
              <span className="rounded-full border-2 border-secondary bg-primary px-4 py-1.5 text-xs font-black tracking-widest uppercase text-secondary shadow-[3px_3px_0px_#1d2b1f]">
                {tc(settings.tagline ?? settings.business_name, lang)}
              </span>
            </AnimateIn>
            <AnimateIn variant="fade-up" delay={150} duration={700}>
              <h1 className="font-heading text-5xl font-black tracking-tight text-secondary leading-[1.1] sm:text-6xl lg:text-7xl">
                {t("Dari kandang sampai ke meja Anda —", lang)}{" "}
                <span 
                  className="text-primary font-heading relative inline-block drop-shadow-[2.5px_2.5px_0px_#1d2b1f] tracking-tight [-webkit-text-stroke:1.5px_#1d2b1f] ml-1"
                >
                  {t("tertelusur penuh.", lang)}
                </span>
              </h1>
            </AnimateIn>
            {settings.hero_text && (
              <AnimateIn variant="fade-up" delay={300} duration={700}>
                <p className="max-w-xl text-lg md:text-xl leading-relaxed text-secondary/80 font-medium font-sans">
                  {tc(settings.hero_text, lang)}
                </p>
              </AnimateIn>
            )}
            <AnimateIn variant="fade-up" delay={450} duration={600}>
              <div className="flex flex-wrap gap-4 pt-2">
                {settings.whatsapp_number && (
                  <WhatsAppButton
                    phoneNumber={settings.whatsapp_number}
                    message={`Halo ${settings.business_name}, saya ingin bertanya tentang produk Anda.`}
                    label={t("Hubungi via WhatsApp", lang)}
                  />
                )}
                <Link 
                  href="/katalog" 
                  className={buttonVariants({ size: "xl", variant: "outline" })}
                >
                  {t("Lihat Katalog", lang)}
                </Link>
              </div>
            </AnimateIn>
          </div>

          {/* Right Column: Original 4-emoji Floating Cards with Neo-Brutalist Styling */}
          <div className="hidden items-center justify-center sm:flex relative z-10" aria-hidden="true">
            <div className="grid grid-cols-2 gap-6">
              <AnimateIn variant="scale-up" delay={200} duration={700}>
                <div className="animate-float flex h-40 w-40 items-center justify-center rounded-3xl bg-primary/20 text-7xl border-2 border-secondary shadow-[4px_4px_0px_#1d2b1f]">
                  🐖
                </div>
              </AnimateIn>
              <AnimateIn variant="scale-up" delay={350} duration={700}>
                <div className="animate-float-delayed mt-10 flex h-40 w-40 items-center justify-center rounded-3xl bg-[#f7f0e6] text-7xl border-2 border-secondary shadow-[4px_4px_0px_#1d2b1f]">
                  ☕
                </div>
              </AnimateIn>
              <AnimateIn variant="scale-up" delay={500} duration={700}>
                <div className="animate-float-slow -mt-6 flex h-40 w-40 items-center justify-center rounded-3xl bg-[#f7f0e6] text-7xl border-2 border-secondary shadow-[4px_4px_0px_#1d2b1f]">
                  🐟
                </div>
              </AnimateIn>
              <AnimateIn variant="scale-up" delay={650} duration={700}>
                <div className="animate-float-reverse flex h-40 w-40 items-center justify-center rounded-3xl bg-secondary text-7xl border-2 border-secondary shadow-[4px_4px_0px_#bfea4b]">
                  🌱
                </div>
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>

      {/* Owner-editable blocks (Kenapa kami + stats) */}
      {homeBlocks.length > 0 && (
        <section className="bg-secondary border-y border-foreground/10 text-[#f7f0e6]">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
            <AnimateIn variant="fade-up" duration={700}>
              <ContentBlocks blocks={homeBlocks} lang={lang} theme="dark" />
            </AnimateIn>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <AnimateIn variant="fade-up">
          <div className="flex flex-col md:flex-row md:justify-between md:items-stretch border-b border-foreground/10 pb-8 mb-10 gap-6">
            <div className="flex flex-col items-start justify-between gap-4 md:gap-8">
              <span className="rounded-full border border-secondary px-3 py-1 text-xs font-black tracking-widest uppercase text-secondary">
                {t("Pilihan", lang)}
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-secondary tracking-tight leading-none">
                {t("Komoditas Kami", lang)}
              </h2>
            </div>
            <div className="flex flex-col items-start md:items-end justify-between gap-4 md:gap-8 md:text-right">
              <Link 
                href="/katalog" 
                className="text-sm font-black tracking-wide uppercase text-secondary hover:underline flex items-center gap-1"
              >
                {t("Semua Kategori", lang)} →
              </Link>
              <p className="text-secondary/70 leading-relaxed font-sans font-medium text-base md:text-lg max-w-md md:text-right">
                {t("Fokus rilis pertama: Babi. Kopi & Perikanan menyusul.", lang)}
              </p>
            </div>
          </div>
        </AnimateIn>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {categories.map((category, i) => (
            <AnimateIn key={category.id} variant="fade-up" delay={i * 120} duration={600} className="h-full">
              <CategoryCard category={category} lang={lang} />
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="border-t border-foreground/10 bg-card/50">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <AnimateIn variant="fade-up">
              <div className="flex flex-col md:flex-row md:justify-between md:items-stretch border-b border-foreground/10 pb-8 mb-10 gap-6">
                <div className="flex flex-col items-start justify-between gap-4 md:gap-8">
                  <span className="rounded-full border border-secondary px-3 py-1 text-xs font-black tracking-widest uppercase text-secondary">
                    {t("Katalog", lang)}
                  </span>
                  <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-secondary tracking-tight leading-none">
                    {t("Produk Unggulan", lang)}
                  </h2>
                </div>
                <div className="flex flex-col items-start md:items-end justify-between gap-4 md:gap-8 md:text-right">
                  <Link 
                    href="/katalog/babi" 
                    className="text-sm font-black tracking-wide uppercase text-secondary hover:underline flex items-center gap-1"
                  >
                    {t("Semua Produk", lang)} →
                  </Link>
                  <p className="text-secondary/70 leading-relaxed font-sans font-medium text-base md:text-lg max-w-md md:text-right">
                    {t("Setiap produk memiliki riwayat traceability yang dapat Anda periksa secara transparan.", lang)}
                  </p>
                </div>
              </div>
            </AnimateIn>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((product, i) => (
                <AnimateIn key={product.id} variant="fade-up" delay={i * 100} duration={600} className="h-full">
                  <ProductCard product={product} lang={lang} />
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
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
