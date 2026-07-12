import type { Metadata } from "next";
import Link from "next/link";

import { AnimateIn } from "@/components/animate-in";
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

type BlockPayload = {
  text?: string;
  label?: string;
  value?: string;
  url?: string;
};

function getBlockPayload(block: any): BlockPayload {
  return (block.content ?? {}) as BlockPayload;
}

export default async function TentangPage() {
  const supabase = await createClient();
  const publicData = new PublicDataService(supabase);
  const [settings, blocks] = await Promise.all([
    publicData.getSiteSettings(),
    publicData.getPageBlocks("about"),
  ]);
  const lang = await getLanguage();

  // Parse blocks dynamically
  const visionBlocks: any[] = [];
  const modelBlocks: any[] = [];
  const statBlocks: any[] = [];

  let headingCount = 0;
  for (const block of blocks) {
    if (block.block_type === "stat") {
      statBlocks.push(block);
    } else if (block.block_type === "heading") {
      headingCount++;
      if (headingCount === 1) {
        visionBlocks.push(block);
      } else {
        modelBlocks.push(block);
      }
    } else if (block.block_type === "richtext") {
      if (headingCount <= 1) {
        visionBlocks.push(block);
      } else {
        modelBlocks.push(block);
      }
    }
  }

  return (
    <div className="bg-[#f7f0e6]">
      {/* Hero Header */}
      <section className="bg-secondary text-[#f7f0e6] pt-20 pb-16 sm:pb-24 border-b border-foreground/10">
        <div className="mx-auto max-w-6xl px-6 flex flex-col items-start gap-6">
          <AnimateIn variant="fade-down" duration={500}>
            <span className="rounded-full border border-[#f7f0e6]/30 px-3.5 py-1 text-xs font-black tracking-widest uppercase text-[#f7f0e6]/90 font-sans">
              {t("Tentang Kami", lang)}
            </span>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={100} duration={700}>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-black text-[#fdfbf7] tracking-tight leading-none max-w-4xl">
              {t("Tentang", lang)} <span className="text-primary">{settings.business_name}</span>
            </h1>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={200} duration={600}>
            <p className="text-[#f7f0e6]/70 leading-relaxed font-sans font-medium text-base sm:text-lg max-w-2xl mt-2">
              {settings.tagline ? `${tc(settings.tagline, lang)}. ` : ""}
              {t("Kami berkomitmen menghadirkan produk peternakan berkualitas tinggi dengan jaminan ketertelusuran penuh dari kandang hingga meja Anda.", lang)}
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Siapa Kami (About Us Intro) */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24 border-b border-foreground/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col items-start gap-4">
            <AnimateIn variant="fade-down" duration={500}>
              <span className="rounded-full border border-secondary px-3 py-1 text-xs font-black tracking-widest uppercase text-secondary font-sans">
                {t("Siapa Kami", lang)}
              </span>
            </AnimateIn>
            <AnimateIn variant="fade-up" delay={100}>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-secondary tracking-tight">
                {t("Penyedia Komoditas Ternak Tertelusur Terpercaya di Sulawesi", lang)}
              </h2>
            </AnimateIn>
            <AnimateIn variant="fade-up" delay={200}>
              <p className="text-secondary/70 leading-relaxed font-sans font-medium text-base md:text-lg">
                {t("Tri Agri didirikan dengan misi membawa standar baru dalam industri peternakan babi di Sulawesi. Melalui kombinasi manajemen pakan yang ketat, sanitasi modern, dan teknologi penelusuran (traceability) digital, kami menghadirkan produk daging babi yang higienis, sehat, dan segar untuk mitra industri dan konsumen langsung.", lang)}
              </p>
            </AnimateIn>
          </div>
          <div className="lg:col-span-5 hidden lg:flex justify-center" aria-hidden="true">
            <AnimateIn variant="scale-up" delay={300} duration={800}>
              <div className="rounded-[18px] border-2 border-secondary bg-[#f5ebd6] p-8 shadow-[4px_4px_0px_#1d2b1f] text-center flex flex-col justify-center items-center h-full gap-4 max-w-sm mx-auto">
                <span className="text-6xl">📍</span>
                <h3 className="font-heading text-xl font-black text-secondary">{t("Palopo & Morowali", lang)}</h3>
                <p className="text-secondary/70 font-sans font-medium text-sm">
                  {t("Dua pusat operasional strategis untuk melayani pasar Sulawesi Selatan, Toraja, dan Kawasan Industri Morowali.", lang)}
                </p>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section (Light) */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24 border-b border-foreground/10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <AnimateIn variant="fade-down" duration={500}>
            <span className="rounded-full border border-secondary px-3 py-1 text-xs font-black tracking-widest uppercase text-secondary font-sans">
              {t("Visi & Misi", lang)}
            </span>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={100}>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-secondary tracking-tight mt-4">
              {t("Arah & Landasan Kerja Kami", lang)}
            </h2>
          </AnimateIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1: Visi Kami */}
          <AnimateIn variant="fade-up" delay={200} duration={700}>
            <div className="rounded-[18px] border-2 border-secondary bg-[#fdfbf7] p-8 shadow-[6px_6px_0px_#1d2b1f] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#1d2b1f] transition-all duration-300 h-full">
              <h3 className="font-heading text-2xl font-black text-secondary mb-4 flex items-center gap-2">
                <span>🎯</span> {t("Visi Kami", lang)}
              </h3>
              <p className="text-secondary/70 leading-relaxed font-sans font-medium text-base sm:text-lg">
                {visionBlocks.length > 0
                  ? tc(getBlockPayload(visionBlocks.find(b => b.block_type === "richtext") || visionBlocks[0]).text, lang)
                  : t("Menjadi pemasok komoditas babi dan produk turunan berkualitas tinggi dengan jaminan ketertelusuran penuh demi kepuasan konsumen di Sulawesi.", lang)}
              </p>
            </div>
          </AnimateIn>

          {/* Card 2: Misi Kami */}
          <AnimateIn variant="fade-up" delay={350} duration={700}>
            <div className="rounded-[18px] border-2 border-secondary bg-[#fdfbf7] p-8 shadow-[6px_6px_0px_#1d2b1f] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#1d2b1f] transition-all duration-300 h-full">
              <h3 className="font-heading text-2xl font-black text-secondary mb-4 flex items-center gap-2">
                <span>🚀</span> {t("Misi Kami", lang)}
              </h3>
              <ul className="space-y-3 font-sans font-medium text-base text-secondary/70">
                <li className="flex items-start gap-2">
                  <span className="text-secondary font-black">✓</span>
                  <span>{t("Menjamin kesehatan ternak melalui pakan terformulasi khusus dan perawatan higienis.", lang)}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary font-black">✓</span>
                  <span>{t("Menyediakan daging berkualitas premium dengan sistem penelusuran (traceability) digital yang transparan.", lang)}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary font-black">✓</span>
                  <span>{t("Menjadi mitra pasokan rutin utama bagi katering industri dan restoran di Sulawesi.", lang)}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary font-black">✓</span>
                  <span>{t("Menerapkan manajemen limbah ramah lingkungan untuk keberlanjutan sekitar.", lang)}</span>
                </li>
              </ul>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Business Model Section (Dark Green) */}
      {modelBlocks.length > 0 && (
        <section className="bg-secondary text-[#f7f0e6] py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-6 flex flex-col items-center text-center gap-6">
            {modelBlocks.map((block, i) => {
              const p = getBlockPayload(block);
              if (block.block_type === "heading") {
                return (
                  <AnimateIn key={block.id} variant="scale-up" duration={700}>
                    <h2 className="font-heading text-4xl sm:text-5xl font-black text-[#fdfbf7] tracking-tight leading-tight mt-6">
                      {tc(p.text, lang)}
                    </h2>
                  </AnimateIn>
                );
              }
              return (
                <AnimateIn key={block.id} variant="fade-up" delay={i * 100} duration={600}>
                  <p className="leading-relaxed font-sans font-medium text-base md:text-lg text-[#f7f0e6]/80 max-w-3xl">
                    {tc(p.text, lang)}
                  </p>
                </AnimateIn>
              );
            })}

            {/* Stats list under Business Model */}
            {statBlocks.length > 0 && (
              <div className="flex flex-wrap gap-6 justify-center max-w-4xl mx-auto mt-10 w-full">
                {statBlocks.map((stat) => {
                  const p = getBlockPayload(stat);
                  return (
                    <AnimateIn key={stat.id} variant="fade-up" duration={650} className="w-[calc(50%-12px)] sm:w-[220px]">
                      <div className="rounded-[18px] border-2 border-[#fdfbf7] bg-[#243426] p-6 text-center shadow-[4px_4px_0px_#fdfbf7] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#fdfbf7] transition-all duration-300 h-full flex flex-col justify-center">
                        <p className="font-heading font-black text-4xl text-[#fdfbf7]">
                          {p.value}
                        </p>
                        <p className="mt-1 text-xs font-black tracking-widest text-[#f7f0e6]/80 uppercase">
                          {tc(p.label, lang)}
                        </p>
                      </div>
                    </AnimateIn>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* fallback if everything is empty */}
      {blocks.length === 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16 text-center">
          <p className="text-muted-foreground">
            {t("Konten halaman ini sedang disiapkan. Silakan hubungi kami untuk informasi lebih lanjut.", lang)}
          </p>
        </section>
      )}

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
