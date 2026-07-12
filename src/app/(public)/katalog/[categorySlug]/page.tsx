import Link from "next/link";
import { notFound } from "next/navigation";

import { PublicDataService } from "@/lib/services/public-data-service";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);
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

  if (!category) notFound();

  const products = await publicData.getProducts({ categorySlug });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-heading text-3xl font-bold">{category.name}</h1>
      {category.description && <p className="mt-2 text-muted-foreground">{category.description}</p>}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/produk/${product.slug}`}
            className="rounded-lg border border-border p-6 transition-colors hover:border-primary"
          >
            <h2 className="font-heading text-lg font-semibold">{product.name}</h2>
            {product.description && (
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {product.description}
              </p>
            )}
            {product.price_visible && product.price_numeric != null && (
              <p className="mt-3 font-semibold">
                {formatRupiah(product.price_numeric)}
                {product.unit && <span className="text-sm font-normal"> / {product.unit}</span>}
              </p>
            )}
          </Link>
        ))}
        {products.length === 0 && (
          <p className="text-sm text-muted-foreground">Belum ada produk publik di kategori ini.</p>
        )}
      </div>
    </div>
  );
}
