import Image from "next/image";
import Link from "next/link";

import type { PublicCategory, PublicProduct } from "@/lib/services/public-data-service";
import { cn } from "@/lib/utils";

import { t, tc, type Language } from "@/lib/i18n";

const COMMODITY_EMOJI: Record<string, string> = {
  pig: "🐖",
  coffee: "☕",
  fishery: "🐟",
};

const AVAILABILITY_LABEL: Record<string, { label: string; className: string }> = {
  available: { label: "Tersedia", className: "bg-primary/20 text-foreground" },
  preorder: { label: "Pre-Order", className: "bg-amber-200/60 text-amber-900" },
  sold_out: { label: "Habis", className: "bg-foreground/10 text-muted-foreground" },
};

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Cover image, or a warm gradient + commodity emoji while real photos are pending. */
function CoverVisual({
  src,
  alt,
  emoji,
  className,
}: {
  src: string | null;
  alt: string;
  emoji: string;
  className?: string;
}) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image src={src} alt={alt} fill className="object-cover" />
      </div>
    );
  }
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-gradient-to-br from-primary/30 via-card to-secondary/10 text-6xl",
        className,
      )}
      aria-hidden="true"
    >
      {emoji}
    </div>
  );
}

export function CategoryCard({ category, lang = "id" }: { category: PublicCategory; lang?: Language }) {
  const isActive = category.status === "active";
  const emoji = COMMODITY_EMOJI[category.commodity_type] ?? "🌱";

  const inner = (
    <div
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-card transition-all",
        isActive && "hover:-translate-y-1 hover:border-primary hover:shadow-lg",
      )}
    >
      <CoverVisual src={category.cover_image} alt={tc(category.name, lang)} emoji={emoji} className="h-40" />
      <div className="flex flex-1 flex-col gap-2 p-6">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-heading text-xl font-bold">{tc(category.name, lang)}</h3>
          {isActive ? (
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
              {t("Aktif", lang)}
            </span>
          ) : (
            <span className="rounded-full border border-foreground/20 px-3 py-1 text-xs font-semibold text-muted-foreground">
              {t("Segera Hadir", lang)}
            </span>
          )}
        </div>
        {category.description && (
          <p className="text-sm leading-relaxed text-muted-foreground">{tc(category.description, lang)}</p>
        )}
        {isActive && (
          <span className="mt-auto pt-2 text-sm font-semibold text-foreground group-hover:underline">
            {t("Lihat produk →", lang)}
          </span>
        )}
      </div>
    </div>
  );

  if (!isActive) return <div className="opacity-80 h-full">{inner}</div>;
  return <Link href={`/katalog/${category.slug}`} className="h-full block">{inner}</Link>;
}

export function ProductCard({ product, lang = "id" }: { product: PublicProduct; lang?: Language }) {
  const availability = AVAILABILITY_LABEL[product.availability] ?? AVAILABILITY_LABEL.available;

  return (
    <Link
      href={`/produk/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-card transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg"
    >
      <CoverVisual src={product.cover_image} alt={tc(product.name, lang)} emoji="🐖" className="h-44" />
      <div className="flex flex-1 flex-col gap-2 p-6">
        <div className="flex flex-wrap items-center gap-2">
          {product.breed && (
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-secondary-foreground uppercase">
              {tc(product.breed, lang)}
            </span>
          )}
          <span
            className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-bold", availability.className)}
          >
            {t(availability.label, lang)}
          </span>
        </div>
        <h3 className="font-heading text-lg font-bold leading-snug group-hover:underline">
          {tc(product.name, lang)}
        </h3>
        {product.short_desc && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{tc(product.short_desc, lang)}</p>
        )}
        <p className="mt-auto pt-2 font-semibold">
          {product.price_visible && product.price_numeric != null ? (
            <>
              {formatRupiah(product.price_numeric)}
              {product.unit && (
                <span className="text-sm font-normal text-muted-foreground">
                  {" "}
                  / {product.unit === "ekor" ? (lang === "en" ? "head" : "ekor") : product.unit}
                </span>
              )}
            </>
          ) : (
            <span className="text-sm text-muted-foreground">{t("Hubungi untuk harga", lang)}</span>
          )}
        </p>
      </div>
    </Link>
  );
}
