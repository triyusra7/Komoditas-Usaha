import type { Metadata } from "next";

import { PublicDataService } from "@/lib/services/public-data-service";
import { createClient } from "@/lib/supabase/server";

import { LeadForm } from "./lead-form";

export const metadata: Metadata = {
  title: "Kontak",
};

export default async function KontakPage() {
  const supabase = await createClient();
  const publicData = new PublicDataService(supabase);
  const settings = await publicData.getSiteSettings();

  return (
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-12 px-6 py-16 sm:grid-cols-2">
      <div>
        <h1 className="font-heading text-3xl font-bold">Hubungi Kami</h1>
        <div className="mt-6 space-y-2 text-muted-foreground">
          {settings.whatsapp_number && <p>WhatsApp: {settings.whatsapp_number}</p>}
          {settings.email && <p>Email: {settings.email}</p>}
          {settings.address && <p>Alamat: {settings.address}</p>}
        </div>
      </div>
      <LeadForm />
    </div>
  );
}
