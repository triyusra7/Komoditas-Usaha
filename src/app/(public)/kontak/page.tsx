import type { Metadata } from "next";

import { WhatsAppButton } from "@/components/whatsapp-button";
import { PublicDataService } from "@/lib/services/public-data-service";
import { createClient } from "@/lib/supabase/server";

import { LeadForm } from "./lead-form";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Hubungi Tri Agri — pemesanan, kemitraan, dan pertanyaan.",
};

export default async function KontakPage() {
  const supabase = await createClient();
  const publicData = new PublicDataService(supabase);
  const settings = await publicData.getSiteSettings();

  return (
    <div className="mx-auto grid max-w-5xl gap-14 px-6 py-16 lg:grid-cols-2">
      <div>
        <span className="rounded-full border border-foreground/20 px-4 py-1.5 text-xs font-bold tracking-widest uppercase">
          Kontak
        </span>
        <h1 className="mt-6 font-heading text-4xl font-bold">
          Hubungi / Jadi Mitra
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Untuk pemesanan, pasokan rutin katering, kemitraan penggemukan, atau sekadar
          bertanya — kami senang mendengar dari Anda.
        </p>

        <dl className="mt-8 space-y-4">
          {settings.whatsapp_number && (
            <div className="flex items-start gap-3">
              <span className="text-xl" aria-hidden="true">💬</span>
              <div>
                <dt className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
                  WhatsApp
                </dt>
                <dd className="font-semibold">+{settings.whatsapp_number}</dd>
              </div>
            </div>
          )}
          {settings.email && (
            <div className="flex items-start gap-3">
              <span className="text-xl" aria-hidden="true">✉️</span>
              <div>
                <dt className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
                  Email
                </dt>
                <dd className="font-semibold">{settings.email}</dd>
              </div>
            </div>
          )}
          {settings.address && (
            <div className="flex items-start gap-3">
              <span className="text-xl" aria-hidden="true">📍</span>
              <div>
                <dt className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
                  Lokasi
                </dt>
                <dd className="font-semibold">{settings.address}</dd>
              </div>
            </div>
          )}
        </dl>

        {settings.whatsapp_number && (
          <div className="mt-8">
            <WhatsAppButton
              phoneNumber={settings.whatsapp_number}
              message={`Halo ${settings.business_name}, saya ingin bertanya.`}
              label="Chat Langsung via WhatsApp"
            />
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-foreground/10 bg-card p-8">
        <h2 className="mb-6 font-heading text-xl font-bold">Kirim Pesan</h2>
        <LeadForm />
      </div>
    </div>
  );
}
