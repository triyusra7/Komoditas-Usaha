import type { Metadata } from "next";

import { PublicDataService } from "@/lib/services/public-data-service";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tentang Kami",
};

export default async function TentangPage() {
  const supabase = await createClient();
  const publicData = new PublicDataService(supabase);
  const settings = await publicData.getSiteSettings();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-heading text-3xl font-bold">Tentang {settings.business_name}</h1>
      <div className="mt-6 space-y-4 text-muted-foreground">
        <p>
          {settings.business_name} adalah usaha komoditas yang membangun kepercayaan lewat
          traceability — pembeli dapat melihat perjalanan lengkap setiap produk, dari asal bibit
          sampai siap potong atau olah.
        </p>
        {settings.address && <p>Lokasi: {settings.address}</p>}
      </div>
    </div>
  );
}
