import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { buttonVariants } from "@/components/ui/button";
import { PublicDataService } from "@/lib/services/public-data-service";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const publicData = new PublicDataService(supabase);
  const product = await publicData.getProductBySlug(slug);
  return { title: product?.name ?? "Produk" };
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

  const traceSubjects = await publicData.getTraceabilityByProduct(product.id);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-heading text-3xl font-bold">{product.name}</h1>
      {product.description && <p className="mt-4 text-muted-foreground">{product.description}</p>}
      {product.price_visible && product.price_numeric != null && (
        <p className="mt-4 text-xl font-semibold">
          {formatRupiah(product.price_numeric)}
          {product.unit && <span className="text-base font-normal"> / {product.unit}</span>}
        </p>
      )}

      {traceSubjects.length > 0 && (
        <div className="mt-8 space-y-2">
          <h2 className="font-heading text-lg font-semibold">Traceability</h2>
          <div className="flex flex-wrap gap-2">
            {traceSubjects.map(({ subject }) => (
              <Link
                key={subject.id}
                href={`/traceability/${subject.public_slug}`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Lihat jejak {subject.code}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
