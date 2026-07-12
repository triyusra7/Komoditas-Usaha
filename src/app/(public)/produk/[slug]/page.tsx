import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { AnimateIn } from "@/components/animate-in";
import { formatRupiah } from "@/components/catalog-cards";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { buttonVariants } from "@/components/ui/button";
import { PublicDataService } from "@/lib/services/public-data-service";
import { createClient } from "@/lib/supabase/server";
import { t, tc } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";

export const revalidate = 60;

const AVAILABILITY_LABEL: Record<string, string> = {
  available: "Tersedia",
  preorder: "Pre-Order",
  sold_out: "Stok Habis",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const publicData = new PublicDataService(supabase);
  const product = await publicData.getProductBySlug(slug);
  return {
    title: product?.name ?? "Produk",
    description: product?.short_desc ?? undefined,
  };
}

export default async function ProdukDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();
  const publicData = new PublicDataService(supabase);
  const product = await publicData.getProductBySlug(slug);

  if (!product) notFound();

  const [settings, traceSubjects] = await Promise.all([
    publicData.getSiteSettings(),
    publicData.getTraceabilityByProduct(product.id),
  ]);
  const lang = await getLanguage();

  const gallery = Array.isArray(product.gallery)
    ? product.gallery.filter((item): item is string => typeof item === "string")
    : [];
  const images = [product.cover_image, ...gallery].filter((url): url is string => !!url);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <AnimateIn variant="fade" duration={400}>
        <Link href="/katalog/babi" className="text-sm text-muted-foreground hover:underline">
          {t("← Kembali ke katalog", lang)}
        </Link>
      </AnimateIn>

      <div className="mt-6 grid gap-12 lg:grid-cols-2">
        {/* Visual */}
        <AnimateIn variant="fade-left" duration={700} delay={100}>
          {images.length > 0 ? (
            <div className="flex flex-col gap-3">
              <div className="relative h-80 overflow-hidden rounded-3xl border-2 border-secondary shadow-[4px_4px_0px_#1d2b1f] lg:h-[420px]">
                <Image
                  src={images[0]}
                  alt={tc(product.name, lang)}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-3 gap-3">
                  {images.slice(1).map((url, index) => (
                    <div
                      key={url}
                      className="relative aspect-square overflow-hidden rounded-2xl border-2 border-secondary shadow-[3px_3px_0px_#1d2b1f]"
                    >
                      <Image
                        src={url}
                        alt={`${tc(product.name, lang)} — foto ${index + 2}`}
                        fill
                        sizes="(min-width: 1024px) 16vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-80 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/30 via-card to-secondary/10 text-9xl lg:h-[420px]">
              <span className="animate-float-slow" aria-hidden="true">🐖</span>
            </div>
          )}
        </AnimateIn>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <AnimateIn variant="fade-right" delay={200} duration={600}>
            <div className="flex flex-wrap gap-2">
              {product.breed && (
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold tracking-wide text-secondary-foreground uppercase">
                  {tc(product.breed, lang)}
                </span>
              )}
              <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-bold">
                {t(AVAILABILITY_LABEL[product.availability] ?? product.availability, lang)}
              </span>
            </div>
          </AnimateIn>

          <AnimateIn variant="fade-right" delay={300} duration={700}>
            <h1 className="font-heading text-4xl font-bold">{tc(product.name, lang)}</h1>
          </AnimateIn>

          <AnimateIn variant="fade-right" delay={400} duration={600}>
            <p className="text-2xl font-bold">
              {product.price_visible && product.price_numeric != null ? (
                <>
                  {formatRupiah(product.price_numeric)}
                  {product.unit && (
                    <span className="text-base font-normal text-muted-foreground">
                      {" "}
                      / {product.unit === "ekor" ? (lang === "en" ? "head" : "ekor") : product.unit}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-lg font-semibold text-muted-foreground">
                  {t("Hubungi untuk harga", lang)}
                </span>
              )}
            </p>
          </AnimateIn>

          {product.description && (
            <AnimateIn variant="fade-right" delay={500} duration={600}>
              <p className="leading-relaxed text-muted-foreground">{tc(product.description, lang)}</p>
            </AnimateIn>
          )}

          <AnimateIn variant="fade-up" delay={600} duration={600}>
            <div className="mt-2 flex flex-wrap gap-3">
              {settings.whatsapp_number && (
                <WhatsAppButton
                  phoneNumber={settings.whatsapp_number}
                  message={`Halo ${settings.business_name}, saya tertarik dengan produk "${product.name}". Mohon info ketersediaan dan harganya.`}
                  label={t("Hubungi via WhatsApp", lang)}
                />
              )}
              <Link href="/kontak" className={buttonVariants({ size: "xl", variant: "outline" })}>
                {t("Kirim Pesan", lang)}
              </Link>
            </div>
          </AnimateIn>

          {traceSubjects.length > 0 && (
            <AnimateIn variant="fade-up" delay={700} duration={700}>
              <div className="mt-6 rounded-2xl border border-foreground/10 bg-card p-6">
                <h2 className="font-heading text-lg font-bold">{t("🔍 Jejak Produk Ini", lang)}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("Periksa sendiri perjalanan produk ini — dari asal bibit sampai siap potong.", lang)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {traceSubjects.map(({ subject }) => (
                    <Link
                      key={subject.id}
                      href={`/jejak/${subject.public_slug}`}
                      className={buttonVariants({ variant: "outline", size: "sm" })}
                    >
                      {subject.title ? tc(subject.title, lang) : subject.code} →
                    </Link>
                  ))}
                </div>
              </div>
            </AnimateIn>
          )}
        </div>
      </div>
    </div>
  );
}
