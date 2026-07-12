import Link from "next/link";

import { CategoryCard, ProductCard } from "@/components/catalog-cards";
import { ContentBlocks } from "@/components/content-blocks";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { buttonVariants } from "@/components/ui/button";
import { PublicDataService } from "@/lib/services/public-data-service";
import { createClient } from "@/lib/supabase/server";

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

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 sm:grid-cols-2 sm:py-28">
          <div className="flex flex-col items-start gap-6">
            <span className="rounded-full border border-foreground/20 px-4 py-1.5 text-xs font-bold tracking-widest uppercase">
              {settings.tagline ?? settings.business_name}
            </span>
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Dari kandang sampai ke meja Anda —{" "}
              <span className="bg-primary px-2">tertelusur penuh.</span>
            </h1>
            {settings.hero_text && (
              <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
                {settings.hero_text}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Link href="/katalog" className={buttonVariants({ size: "lg" })}>
                Lihat Katalog
              </Link>
              {settings.whatsapp_number && (
                <WhatsAppButton
                  phoneNumber={settings.whatsapp_number}
                  message={`Halo ${settings.business_name}, saya ingin bertanya tentang produk Anda.`}
                  label="Hubungi via WhatsApp"
                />
              )}
            </div>
          </div>
          <div className="hidden items-center justify-center sm:flex" aria-hidden="true">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex h-40 w-40 items-center justify-center rounded-3xl bg-primary/25 text-7xl">
                🐖
              </div>
              <div className="mt-10 flex h-40 w-40 items-center justify-center rounded-3xl bg-card text-7xl">
                ☕
              </div>
              <div className="-mt-6 flex h-40 w-40 items-center justify-center rounded-3xl bg-card text-7xl">
                🐟
              </div>
              <div className="flex h-40 w-40 items-center justify-center rounded-3xl bg-secondary text-7xl">
                🌱
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Owner-editable blocks (Kenapa kami + stats) */}
      {homeBlocks.length > 0 && (
        <section className="border-y border-foreground/10 bg-card/50">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <ContentBlocks blocks={homeBlocks} />
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl font-bold">Komoditas Kami</h2>
            <p className="mt-1 text-muted-foreground">
              Fokus rilis pertama: Babi. Kopi & Perikanan menyusul.
            </p>
          </div>
          <Link href="/katalog" className="text-sm font-semibold hover:underline">
            Semua kategori →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="border-t border-foreground/10 bg-card/50">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="font-heading text-3xl font-bold">Produk Unggulan</h2>
                <p className="mt-1 text-muted-foreground">
                  Setiap produk punya jejak yang bisa Anda periksa sendiri.
                </p>
              </div>
              <Link href="/katalog/babi" className="text-sm font-semibold hover:underline">
                Semua produk →
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-primary">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-20 text-center">
          <h2 className="max-w-2xl font-heading text-3xl font-bold text-primary-foreground sm:text-4xl">
            Butuh pasokan rutin untuk katering atau usaha Anda?
          </h2>
          <p className="max-w-xl text-primary-foreground/80">
            Kami melayani kebutuhan katering kawasan industri, restoran, dan pengepul di
            Palopo, Morowali, dan sekitarnya.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {settings.whatsapp_number && (
              <WhatsAppButton
                phoneNumber={settings.whatsapp_number}
                message={`Halo ${settings.business_name}, saya tertarik menjadi mitra/pelanggan rutin.`}
                label="Chat WhatsApp Sekarang"
              />
            )}
            <Link
              href="/kontak"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Kirim Pesan
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
