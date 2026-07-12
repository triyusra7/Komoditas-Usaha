import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ProductCard } from "@/components/catalog-cards";
import { buttonVariants } from "@/components/ui/button";
import { PublicDataService } from "@/lib/services/public-data-service";
import { createClient } from "@/lib/supabase/server";

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
  const categories = await publicData.getCategories();
  const category = categories.find((c) => c.slug === categorySlug);

  if (!category || category.status !== "active") notFound();

  const products = await publicData.getProducts({ categorySlug });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link href="/katalog" className="text-sm text-muted-foreground hover:underline">
        ← Semua kategori
      </Link>
      <h1 className="mt-4 font-heading text-4xl font-bold">{category.name}</h1>
      {category.description && (
        <p className="mt-2 max-w-2xl text-muted-foreground">{category.description}</p>
      )}

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-foreground/20 p-12 text-center">
          <p className="text-lg font-semibold">Produk sedang disiapkan</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Kami sedang melengkapi katalog kategori ini. Hubungi kami untuk informasi
            ketersediaan terbaru.
          </p>
          <Link href="/kontak" className={`${buttonVariants({ size: "lg" })} mt-6`}>
            Hubungi Kami
          </Link>
        </div>
      )}
    </div>
  );
}
