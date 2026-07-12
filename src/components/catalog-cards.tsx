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

/** Cover image, or a warm flat color + commodity emoji while real photos are pending. */
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
      <div className={cn("relative overflow-hidden border-b-2 border-secondary", className)}>
        <Image src={src} alt={alt} fill className="object-cover" />
      </div>
    );
  }
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-[#f5ebd6] text-6xl border-b-2 border-secondary",
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
        "group flex h-full flex-col overflow-hidden rounded-[18px] border-2 border-secondary bg-[#fdfbf7] shadow-[4px_4px_0px_#1d2b1f] transition-all duration-300",
        isActive && "hover:-translate-y-1 hover:shadow-[6px_6px_0px_#1d2b1f]",
      )}
    >
      <CoverVisual src={category.cover_image} alt={tc(category.name, lang)} emoji={emoji} className="h-40" />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-heading text-xl font-black text-secondary">{tc(category.name, lang)}</h3>
          {isActive ? (
            <span className="rounded-full border border-secondary bg-primary px-3 py-0.5 text-xs font-black uppercase text-secondary shadow-[2px_2px_0px_#1d2b1f]">
              {t("Aktif", lang)}
            </span>
          ) : (
            <span className="rounded-full border border-secondary bg-[#f5ebd6] px-3 py-0.5 text-xs font-black uppercase text-secondary shadow-[2px_2px_0px_#1d2b1f]">
              {t("Segera Hadir", lang)}
            </span>
          )}
        </div>
        {category.description && (
          <p className="text-sm leading-relaxed text-secondary/70 font-sans font-medium">{tc(category.description, lang)}</p>
        )}
        {isActive && (
          <span className="mt-auto pt-2 text-sm font-black uppercase tracking-wider text-secondary group-hover:underline">
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

  const availabilityBg = product.availability === "available"
    ? "bg-primary text-secondary"
    : product.availability === "preorder"
      ? "bg-amber-200 text-secondary"
      : "bg-foreground/10 text-muted-foreground";

  return (
    <Link
      href={`/produk/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[18px] border-2 border-secondary bg-[#fdfbf7] shadow-[4px_4px_0px_#1d2b1f] transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#1d2b1f]"
    >
      <CoverVisual src={product.cover_image} alt={tc(product.name, lang)} emoji="🐖" className="h-44" />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap items-center gap-2">
          {product.breed && (
            <span className="rounded-full border border-secondary bg-secondary px-2.5 py-0.5 text-[10px] font-black uppercase text-secondary-foreground shadow-[1.5px_1.5px_0px_#1d2b1f]">
              {tc(product.breed, lang)}
            </span>
          )}
          <span
            className={cn(
              "rounded-full border border-secondary px-2.5 py-0.5 text-[10px] font-black uppercase shadow-[1.5px_1.5px_0px_#1d2b1f]",
              availabilityBg
            )}
          >
            {t(availability.label, lang)}
          </span>
        </div>
        <h3 className="font-heading text-lg font-black text-secondary leading-snug group-hover:underline mt-1">
          {tc(product.name, lang)}
        </h3>
        {product.short_desc && (
          <p className="line-clamp-2 text-sm text-secondary/70 font-sans font-medium">{tc(product.short_desc, lang)}</p>
        )}
        <p className="mt-auto pt-2 font-heading text-lg font-black text-secondary">
          {product.price_visible && product.price_numeric != null ? (
            <>
              {formatRupiah(product.price_numeric)}
              {product.unit && (
                <span className="text-sm font-normal text-secondary/60">
                  {" "}
                  / {product.unit === "ekor" ? (lang === "en" ? "head" : "ekor") : product.unit}
                </span>
              )}
            </>
          ) : (
            <span className="text-sm text-secondary/60 font-sans font-bold">{t("Hubungi untuk harga", lang)}</span>
          )}
        </p>
      </div>
    </Link>
  );
}
