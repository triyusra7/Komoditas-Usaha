import type { Metadata } from "next";

import { AnimateIn } from "@/components/animate-in";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { PublicDataService } from "@/lib/services/public-data-service";
import { createClient } from "@/lib/supabase/server";
import { t } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";

import { LeadForm } from "./lead-form";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Hubungi Tri Agri — pemesanan, kemitraan, dan pertanyaan.",
};

export default async function KontakPage() {
  const supabase = await createClient();
  const publicData = new PublicDataService(supabase);
  const settings = await publicData.getSiteSettings();
  const lang = await getLanguage();

  const leadFormTranslations = {
    successTitle: t("Pesan terkirim!", lang),
    successDesc: t("Terima kasih. Kami akan menghubungi Anda secepatnya.", lang),
    labelName: t("Nama *", lang),
    placeholderName: t("Nama lengkap Anda", lang),
    labelContact: t("Kontak (WhatsApp/Email) *", lang),
    placeholderContact: t("08xx atau email", lang),
    labelInterest: t("Minat", lang),
    placeholderInterest: t("Pilih minat Anda (opsional)", lang),
    interestBuy: t("Beli produk", lang),
    interestSupply: t("Pasokan rutin / katering", lang),
    interestPartner: t("Kemitraan", lang),
    interestInvest: t("Investasi", lang),
    interestOther: t("Lainnya", lang),
    labelMessage: t("Pesan *", lang),
    placeholderMessage: t("Ceritakan kebutuhan Anda...", lang),
    btnSubmit: t("Kirim Pesan", lang),
    btnSubmitting: t("Mengirim...", lang),
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-14 px-6 py-16 lg:grid-cols-2">
      <div>
        <AnimateIn variant="fade-down" duration={500}>
          <span className="rounded-full border border-foreground/20 px-4 py-1.5 text-xs font-bold tracking-widest uppercase">
            {t("Kontak", lang)}
          </span>
        </AnimateIn>
        <AnimateIn variant="fade-up" delay={100} duration={700}>
          <h1 className="mt-6 font-heading text-4xl font-bold">
            {t("Hubungi / Jadi Mitra", lang)}
          </h1>
        </AnimateIn>
        <AnimateIn variant="fade-up" delay={200} duration={600}>
          <p className="mt-3 max-w-md text-muted-foreground">
            {t("Untuk pemesanan, pasokan rutin katering, kemitraan penggemukan, atau sekadar bertanya — kami senang mendengar dari Anda.", lang)}
          </p>
        </AnimateIn>

        <dl className="mt-8 space-y-4">
          {settings.whatsapp_number && (
            <AnimateIn variant="fade-left" delay={300} duration={500}>
              <div className="flex items-start gap-3">
                <span className="text-xl" aria-hidden="true">💬</span>
                <div>
                  <dt className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    {t("WhatsApp", lang)}
                  </dt>
                  <dd className="font-semibold">+{settings.whatsapp_number}</dd>
                </div>
              </div>
            </AnimateIn>
          )}
          {settings.email && (
            <AnimateIn variant="fade-left" delay={400} duration={500}>
              <div className="flex items-start gap-3">
                <span className="text-xl" aria-hidden="true">✉️</span>
                <div>
                  <dt className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    {t("Email", lang)}
                  </dt>
                  <dd className="font-semibold">{settings.email}</dd>
                </div>
              </div>
            </AnimateIn>
          )}
          {settings.address && (
            <AnimateIn variant="fade-left" delay={500} duration={500}>
              <div className="flex items-start gap-3">
                <span className="text-xl" aria-hidden="true">📍</span>
                <div>
                  <dt className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    {t("Lokasi", lang)}
                  </dt>
                  <dd className="font-semibold">{settings.address}</dd>
                </div>
              </div>
            </AnimateIn>
          )}
        </dl>

        {settings.whatsapp_number && (
          <AnimateIn variant="fade-up" delay={600} duration={600}>
            <div className="mt-8">
              <WhatsAppButton
                phoneNumber={settings.whatsapp_number}
                message={`Halo ${settings.business_name}, saya ingin bertanya.`}
                label={t("Chat Langsung via WhatsApp", lang)}
              />
            </div>
          </AnimateIn>
        )}
      </div>

      <AnimateIn variant="fade-right" delay={200} duration={700}>
        <div className="rounded-3xl border border-foreground/10 bg-card p-8">
          <h2 className="mb-6 font-heading text-xl font-bold">{t("Kirim Pesan", lang)}</h2>
          <LeadForm translations={leadFormTranslations} />
        </div>
      </AnimateIn>
    </div>
  );
}
