import type { Metadata } from "next";

import { ContentBlocks } from "@/components/content-blocks";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { PublicDataService } from "@/lib/services/public-data-service";
import { createClient } from "@/lib/supabase/server";

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

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <span className="rounded-full border border-foreground/20 px-4 py-1.5 text-xs font-bold tracking-widest uppercase">
        Tentang Kami
      </span>
      <h1 className="mt-6 font-heading text-4xl font-bold sm:text-5xl">
        {settings.business_name}
      </h1>
      {settings.tagline && (
        <p className="mt-3 text-lg text-muted-foreground">{settings.tagline}</p>
      )}

      <div className="mt-12">
        {blocks.length > 0 ? (
          <ContentBlocks blocks={blocks} />
        ) : (
          <p className="text-muted-foreground">
            Konten halaman ini sedang disiapkan. Silakan hubungi kami untuk informasi lebih
            lanjut.
          </p>
        )}
      </div>

      {settings.whatsapp_number && (
        <div className="mt-14 rounded-2xl border border-foreground/10 bg-card p-8 text-center">
          <h2 className="font-heading text-2xl font-bold">Ingin tahu lebih banyak?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Kami terbuka untuk kunjungan kandang, kemitraan, dan pertanyaan seputar produk.
          </p>
          <div className="mt-5 flex justify-center">
            <WhatsAppButton
              phoneNumber={settings.whatsapp_number}
              message={`Halo ${settings.business_name}, saya ingin tahu lebih banyak tentang usaha Anda.`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
