import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { formatRupiah } from "@/components/catalog-cards";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { buttonVariants } from "@/components/ui/button";
import { PublicDataService } from "@/lib/services/public-data-service";
import { createClient } from "@/lib/supabase/server";

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

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link href="/katalog/babi" className="text-sm text-muted-foreground hover:underline">
        ← Kembali ke katalog
      </Link>

      <div className="mt-6 grid gap-12 lg:grid-cols-2">
        {/* Visual */}
        <div className="flex h-80 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/30 via-card to-secondary/10 text-9xl lg:h-[420px]">
          <span aria-hidden="true">🐖</span>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {product.breed && (
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold tracking-wide text-secondary-foreground uppercase">
                {product.breed}
              </span>
            )}
            <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-bold">
              {AVAILABILITY_LABEL[product.availability] ?? product.availability}
            </span>
          </div>

          <h1 className="font-heading text-4xl font-bold">{product.name}</h1>

          <p className="text-2xl font-bold">
            {product.price_visible && product.price_numeric != null ? (
              <>
                {formatRupiah(product.price_numeric)}
                {product.unit && (
                  <span className="text-base font-normal text-muted-foreground">
                    {" "}
                    / {product.unit}
                  </span>
                )}
              </>
            ) : (
              <span className="text-lg font-semibold text-muted-foreground">
                Hubungi untuk harga
              </span>
            )}
          </p>

          {product.description && (
            <p className="leading-relaxed text-muted-foreground">{product.description}</p>
          )}

          <div className="mt-2 flex flex-wrap gap-3">
            {settings.whatsapp_number && (
              <WhatsAppButton
                phoneNumber={settings.whatsapp_number}
                message={`Halo ${settings.business_name}, saya tertarik dengan produk "${product.name}". Mohon info ketersediaan dan harganya.`}
              />
            )}
            <Link href="/kontak" className={buttonVariants({ size: "lg", variant: "outline" })}>
              Kirim Pesan
            </Link>
          </div>

          {traceSubjects.length > 0 && (
            <div className="mt-6 rounded-2xl border border-foreground/10 bg-card p-6">
              <h2 className="font-heading text-lg font-bold">🔍 Jejak Produk Ini</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Periksa sendiri perjalanan produk ini — dari asal bibit sampai siap potong.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {traceSubjects.map(({ subject }) => (
                  <Link
                    key={subject.id}
                    href={`/jejak/${subject.public_slug}`}
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    {subject.title ?? subject.code} →
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
