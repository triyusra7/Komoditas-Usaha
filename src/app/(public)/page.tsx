import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { PublicDataService } from "@/lib/services/public-data-service";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

export default async function BerandaPage() {
  const supabase = await createClient();
  const publicData = new PublicDataService(supabase);
  const [settings, categories] = await Promise.all([
    publicData.getSiteSettings(),
    publicData.getCategories(),
  ]);

  return (
    <div>
      <section className="flex flex-col items-center gap-8 px-6 py-32 text-center">
        <span className="rounded-full border border-foreground/20 px-4 py-1.5 text-xs font-bold tracking-widest text-foreground uppercase">
          {settings.business_name}
        </span>
        <h1 className="max-w-3xl font-heading text-5xl font-bold tracking-tight sm:text-6xl">
          {settings.hero_heading ?? "Dari kandang, kebun, dan tambak — sampai ke meja Anda."}
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          {settings.hero_subheading ??
            "Company profile, katalog komoditas, dan traceability publik untuk setiap batch produk yang kami hasilkan."}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/katalog" className={buttonVariants({ size: "lg" })}>
            Lihat Katalog
          </Link>
          <Link href="/tentang" className={buttonVariants({ size: "lg", variant: "outline" })}>
            Tentang Kami
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-heading text-2xl font-bold">Kategori Komoditas</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.status === "active" ? `/katalog/${category.slug}` : "#"}
              className="rounded-lg border border-border p-6 transition-colors hover:border-primary"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg font-semibold">{category.name}</h3>
                {category.status === "coming_soon" && (
                  <span className="text-xs text-muted-foreground">Segera Hadir</span>
                )}
              </div>
              {category.description && (
                <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
              )}
            </Link>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-muted-foreground">Kategori akan segera tersedia.</p>
          )}
        </div>
      </section>
    </div>
  );
}
