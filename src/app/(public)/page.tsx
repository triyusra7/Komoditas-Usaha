import Link from "next/link";

import { AnimateIn } from "@/components/animate-in";
import { CategoryCard, ProductCard } from "@/components/catalog-cards";
import { ContentBlocks } from "@/components/content-blocks";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { buttonVariants } from "@/components/ui/button";
import { PublicDataService } from "@/lib/services/public-data-service";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
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
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 sm:grid-cols-2 sm:py-28">
          <div className="flex flex-col items-start gap-6">
            <AnimateIn variant="fade-down" duration={500}>
              <span className="rounded-full border border-foreground/20 px-4 py-1.5 text-xs font-bold tracking-widest uppercase">
                {lang === "en" && settings.tagline ? tc(settings.tagline, lang) : (settings.tagline ?? settings.business_name)}
              </span>
            </AnimateIn>
            <AnimateIn variant="fade-up" delay={150} duration={700}>
              <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {t("Dari kandang sampai ke meja Anda —", lang)}{" "}
                <span className="bg-primary px-2">{t("tertelusur penuh.", lang)}</span>
              </h1>
            </AnimateIn>
            {settings.hero_text && (
              <AnimateIn variant="fade-up" delay={300} duration={700}>
                <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
                  {tc(settings.hero_text, lang)}
                </p>
              </AnimateIn>
            )}
            <AnimateIn variant="fade-up" delay={450} duration={600}>
              <div className="flex flex-wrap gap-3">
                <Link href="/katalog" className={buttonVariants({ size: "xl", variant: "outline" })}>
                  {t("Lihat Katalog", lang)}
                </Link>
                {settings.whatsapp_number && (
                  <WhatsAppButton
                    phoneNumber={settings.whatsapp_number}
                    message={`Halo ${settings.business_name}, saya ingin bertanya tentang produk Anda.`}
                    label={t("Hubungi via WhatsApp", lang)}
                  />
                )}
              </div>
            </AnimateIn>
          </div>
          <div className="hidden items-center justify-center sm:flex" aria-hidden="true">
            <div className="grid grid-cols-2 gap-4">
              <AnimateIn variant="scale-up" delay={200} duration={700}>
                <div className="animate-float flex h-40 w-40 items-center justify-center rounded-3xl bg-primary/25 text-7xl">
                  🐖
                </div>
              </AnimateIn>
              <AnimateIn variant="scale-up" delay={350} duration={700}>
                <div className="animate-float-delayed mt-10 flex h-40 w-40 items-center justify-center rounded-3xl bg-card text-7xl">
                  ☕
                </div>
              </AnimateIn>
              <AnimateIn variant="scale-up" delay={500} duration={700}>
                <div className="animate-float-slow -mt-6 flex h-40 w-40 items-center justify-center rounded-3xl bg-card text-7xl">
                  🐟
                </div>
              </AnimateIn>
              <AnimateIn variant="scale-up" delay={650} duration={700}>
                <div className="animate-float-reverse flex h-40 w-40 items-center justify-center rounded-3xl bg-secondary text-7xl">
                  🌱
                </div>
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>

      {/* Owner-editable blocks (Kenapa kami + stats) */}
      {homeBlocks.length > 0 && (
        <section className="border-y border-foreground/10 bg-card/50">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <AnimateIn variant="fade-up" duration={700}>
              <ContentBlocks blocks={homeBlocks} lang={lang} />
            </AnimateIn>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <AnimateIn variant="fade-up">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-3xl font-bold">{t("Komoditas Kami", lang)}</h2>
              <p className="mt-1 text-muted-foreground">
                {t("Fokus rilis pertama: Babi. Kopi & Perikanan menyusul.", lang)}
              </p>
            </div>
            <Link href="/katalog" className="text-sm font-semibold hover:underline">
              {t("Semua kategori →", lang)}
            </Link>
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
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="font-heading text-3xl font-bold">{t("Produk Unggulan", lang)}</h2>
                  <p className="mt-1 text-muted-foreground">
                    {t("Setiap produk punya jejak yang bisa Anda periksa sendiri.", lang)}
                  </p>
                </div>
                <Link href="/katalog/babi" className="text-sm font-semibold hover:underline">
                  {t("Semua produk →", lang)}
                </Link>
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
        <section className="bg-primary">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-20 text-center">
            <AnimateIn variant="scale-up" duration={700} delay={200}>
              <h2 className="max-w-2xl font-heading text-3xl font-bold text-primary-foreground sm:text-4xl">
                {t("Butuh pasokan rutin untuk katering atau usaha Anda?", lang)}
              </h2>
            </AnimateIn>
            <AnimateIn variant="fade-up" delay={350}>
              <p className="max-w-xl text-primary-foreground/80">
                {t("Kami melayani kebutuhan katering kawasan industri, restoran, dan pengepul di Palopo, Morowali, dan sekitarnya.", lang)}
              </p>
            </AnimateIn>
            <AnimateIn variant="fade-up" delay={500}>
              <div className="flex flex-wrap justify-center gap-3">
                {settings.whatsapp_number && (
                  <WhatsAppButton
                    phoneNumber={settings.whatsapp_number}
                    message={`Halo ${settings.business_name}, saya tertarik menjadi mitra/pelanggan rutin.`}
                    label={t("Chat WhatsApp Sekarang", lang)}
                    variant="secondary"
                  />
                )}
                <Link
                  href="/kontak"
                  className={cn(
                    buttonVariants({ size: "xl", variant: "outline" }),
                    "border-secondary text-secondary bg-transparent hover:bg-secondary/10"
                  )}
                >
                  {t("Kirim Pesan", lang)}
                </Link>
              </div>
            </AnimateIn>
          </div>
        </section>
      </AnimateIn>
    </div>
  );
}
