import type { Metadata } from "next";

import { AnimateIn } from "@/components/animate-in";
import { ContentBlocks } from "@/components/content-blocks";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { PublicDataService } from "@/lib/services/public-data-service";
import { createClient } from "@/lib/supabase/server";
import { t, tc } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: "Visi, model bisnis, dan lokasi Tri Agri — Palopo & Morowali.",
};

export default async function TentangPage() {
  const supabase = await createClient();
  const publicData = new PublicDataService(supabase);
  const [settings, blocks] = await Promise.all([
    publicData.getSiteSettings(),
    publicData.getPageBlocks("about"),
  ]);
  const lang = await getLanguage();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <AnimateIn variant="fade-down" duration={500}>
        <span className="rounded-full border border-foreground/20 px-4 py-1.5 text-xs font-bold tracking-widest uppercase">
          {t("Tentang Kami", lang)}
        </span>
      </AnimateIn>
      <AnimateIn variant="fade-up" delay={100} duration={700}>
        <h1 className="mt-6 font-heading text-4xl font-bold sm:text-5xl">
          {settings.business_name}
        </h1>
      </AnimateIn>
      {settings.tagline && (
        <AnimateIn variant="fade-up" delay={200} duration={600}>
          <p className="mt-3 text-lg text-muted-foreground">{tc(settings.tagline, lang)}</p>
        </AnimateIn>
      )}

      <AnimateIn variant="fade-up" delay={300} duration={700}>
        <div className="mt-12">
          {blocks.length > 0 ? (
            <ContentBlocks blocks={blocks} lang={lang} />
          ) : (
            <p className="text-muted-foreground">
              {t("Konten halaman ini sedang disiapkan. Silakan hubungi kami untuk informasi lebih lanjut.", lang)}
            </p>
          )}
        </div>
      </AnimateIn>

      {settings.whatsapp_number && (
        <AnimateIn variant="fade-up" delay={100} duration={700}>
          <div className="mt-14 rounded-2xl border border-foreground/10 bg-card p-8 text-center">
            <h2 className="font-heading text-2xl font-bold">{t("Ingin tahu lebih banyak?", lang)}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              {t("Kami terbuka untuk kunjungan kandang, kemitraan, dan pertanyaan seputar produk.", lang)}
            </p>
            <div className="mt-5 flex justify-center">
              <WhatsAppButton
                phoneNumber={settings.whatsapp_number}
                message={`Halo ${settings.business_name}, saya ingin tahu lebih banyak tentang usaha Anda.`}
                label={t("Ingin tahu lebih banyak?", lang)}
              />
            </div>
          </div>
        </AnimateIn>
      )}
    </div>
  );
}
