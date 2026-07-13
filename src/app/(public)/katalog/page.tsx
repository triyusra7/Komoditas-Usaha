import type { Metadata } from "next";


import { AnimateIn } from "@/components/animate-in";
import { CategoryCard } from "@/components/catalog-cards";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { PublicDataService } from "@/lib/services/public-data-service";
import { createClient } from "@/lib/supabase/server";
import { t } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Katalog Komoditas",
  description: "Katalog komoditas Tri Agri: babi, kopi, dan perikanan.",
};

export default async function KatalogPage() {
  const supabase = await createClient();
  const publicData = new PublicDataService(supabase);
  const [categories, settings] = await Promise.all([
    publicData.getCategories(),
    publicData.getSiteSettings(),
  ]);
  const lang = await getLanguage();

  return (
    <div className="bg-[#f7f0e6]">
      {/* Hero Header */}
      <section className="bg-secondary text-[#f7f0e6] pt-20 pb-16 sm:pb-24 border-b border-foreground/10">
        <div className="mx-auto max-w-6xl px-6 flex flex-col items-start gap-6">
          <AnimateIn variant="fade-down" duration={500}>
            <span className="rounded-full border border-[#f7f0e6]/30 px-3.5 py-1 text-xs font-black tracking-widest uppercase text-[#f7f0e6]/90 font-sans">
              {t("Katalog", lang)}
            </span>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={100} duration={700}>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-black text-[#fdfbf7] tracking-tight leading-none max-w-4xl">
              {lang === "zh" ? (
                <>我们的<span className="text-primary">主要产品</span></>
              ) : lang === "en" ? (
                <>Our <span className="text-primary">Commodities</span></>
              ) : (
                <>Komoditas <span className="text-primary">Kami</span></>
              )}
            </h1>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={200} duration={600}>
            <p className="text-[#f7f0e6]/70 leading-relaxed font-sans font-medium text-base sm:text-lg max-w-2xl mt-2">
              {t("Jelajahi produk segar dan pilihan komoditas unggulan kami. Dari daging babi segar dengan ketertelusuran penuh, hingga komoditas andalan Sulawesi lainnya yang diproses secara higienis.", lang)}
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {categories.map((category, i) => (
            <AnimateIn key={category.id} variant="fade-up" delay={i * 120} duration={600} className="h-full">
              <CategoryCard category={category} lang={lang} />
            </AnimateIn>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-muted-foreground">{t("Belum ada kategori publik.", lang)}</p>
          )}
        </div>
      </section>

      {/* WhatsApp CTA Section (Neon Green) */}
      <AnimateIn variant="fade" duration={800}>
        <section className="bg-primary border-t border-foreground/10 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-12 items-center gap-8">
            <div className="md:col-span-8 flex flex-col items-start text-left gap-4">
              <AnimateIn variant="scale-up" duration={700} delay={200}>
                <span className="rounded-full border-2 border-secondary bg-secondary px-4 py-1.5 text-xs font-black tracking-widest uppercase text-primary shadow-[2.5px_2.5px_0px_#1d2b1f]">
                  {t("Kemitraan", lang)}
                </span>
              </AnimateIn>
              <AnimateIn variant="fade-up" delay={350}>
                <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-secondary leading-tight tracking-tight">
                  {t("Butuh pasokan rutin untuk katering atau usaha Anda?", lang)}
                </h2>
                <p className="mt-4 text-secondary/80 font-sans font-medium text-base sm:text-lg max-w-2xl leading-relaxed">
                  {t("Kami melayani kebutuhan katering kawasan industri, restoran, dan pengepul di Palopo, Morowali, dan sekitarnya.", lang)}
                </p>
              </AnimateIn>
            </div>
            <div className="md:col-span-4 flex justify-start md:justify-end">
              <AnimateIn variant="fade-up" delay={500}>
                {settings.whatsapp_number && (
                  <WhatsAppButton
                    phoneNumber={settings.whatsapp_number}
                    message={`Halo ${settings.business_name}, saya tertarik menjadi mitra/pelanggan rutin.`}
                    label={t("Hubungi Kami", lang)}
                    variant="secondary"
                    className="!h-16 md:!h-20 px-10 md:px-14 !text-base md:!text-lg !bg-secondary !text-primary hover:!bg-[#2e4030] shadow-[5px_5px_0px_#1d2b1f] hover:shadow-[2px_2px_0px_#1d2b1f] border-2 border-secondary"
                  />
                )}
              </AnimateIn>
            </div>
          </div>
        </section>
      </AnimateIn>
    </div>
  );
}
