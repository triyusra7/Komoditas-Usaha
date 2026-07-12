import type { Metadata } from "next";
import Link from "next/link";

import { AnimateIn } from "@/components/animate-in";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { buttonVariants } from "@/components/ui/button";
import { PublicDataService } from "@/lib/services/public-data-service";
import { createClient } from "@/lib/supabase/server";
import { t } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";
import { cn } from "@/lib/utils";

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
    <div className="bg-[#f7f0e6]">
      {/* Hero Header */}
      <section className="bg-secondary text-[#f7f0e6] pt-20 pb-16 sm:pb-24 border-b border-foreground/10">
        <div className="mx-auto max-w-6xl px-6 flex flex-col items-start gap-6">
          <AnimateIn variant="fade-down" duration={500}>
            <span className="rounded-full border border-[#f7f0e6]/30 px-3.5 py-1 text-xs font-black tracking-widest uppercase text-[#f7f0e6]/90 font-sans">
              {t("Kontak", lang)}
            </span>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={100} duration={700}>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-black text-[#fdfbf7] tracking-tight leading-none max-w-4xl">
              {lang === "zh" ? (
                <>联系我们 / <span className="text-primary">成为合作伙伴</span></>
              ) : lang === "en" ? (
                <>Contact / <span className="text-primary">Become a Partner</span></>
              ) : (
                <>Hubungi / <span className="text-primary">Jadi Mitra</span></>
              )}
            </h1>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={200} duration={600}>
            <p className="text-[#f7f0e6]/70 leading-relaxed font-sans font-medium text-base sm:text-lg max-w-2xl mt-2">
              {t("Untuk pemesanan, pasokan rutin katering, kemitraan penggemukan, atau sekadar bertanya — kami senang mendengar dari Anda.", lang)}
            </p>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={300} className="flex flex-wrap gap-4 mt-4">
            {settings.whatsapp_number && (
              <WhatsAppButton
                phoneNumber={settings.whatsapp_number}
                message={`Halo ${settings.business_name}, saya tertarik menjadi mitra/pelanggan rutin.`}
                label={t("Chat WhatsApp Sekarang", lang)}
                variant="default"
                className="rounded-full"
              />
            )}
            <Link 
              href="/katalog" 
              className={cn(
                buttonVariants({ size: "xl", variant: "outline" }),
                "rounded-full !bg-transparent !text-[#fdfbf7] !border-[#fdfbf7] !shadow-[3px_3px_0px_#fdfbf7] hover:!shadow-[2px_2px_0px_#fdfbf7] hover:!bg-[#fdfbf7]/10"
              )}
            >
              {t("Lihat Katalog", lang)}
            </Link>
          </AnimateIn>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start mt-12">
        <div className="lg:col-span-5">
          <dl className="space-y-4">
            {settings.whatsapp_number && (
              <AnimateIn variant="fade-left" delay={300} duration={500}>
                <div className="flex items-start gap-3">
                  <span className="text-xl" aria-hidden="true">💬</span>
                  <div>
                    <dt className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
                      {t("WhatsApp", lang)}
                    </dt>
                    <dd className="font-semibold text-secondary">+{settings.whatsapp_number}</dd>
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
                    <dd className="font-semibold text-secondary">{settings.email}</dd>
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
                    <dd className="font-semibold text-secondary">{settings.address}</dd>
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

        <div className="lg:col-span-7">
          <AnimateIn variant="fade-right" delay={200} duration={700}>
            <div className="rounded-[18px] border-2 border-secondary bg-[#fdfbf7] p-8 shadow-[4px_4px_0px_#1d2b1f]">
              <h2 className="mb-6 font-heading text-xl font-bold text-secondary">{t("Kirim Pesan", lang)}</h2>
              <LeadForm translations={leadFormTranslations} />
            </div>
          </AnimateIn>
        </div>
      </div>
      </section>
    </div>
  );
}
