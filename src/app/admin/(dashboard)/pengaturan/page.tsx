import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requireRole } from "@/lib/auth/access-control";
import { ContentService } from "@/lib/services/content-service";
import { createClient } from "@/lib/supabase/server";

import { updateSiteSettings } from "./actions";

export default async function PengaturanPage() {
  await requireRole("owner");

  const supabase = await createClient();
  const content = new ContentService(supabase);
  const settings = await content.getSiteSettings();

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="font-heading text-2xl font-bold">Pengaturan Situs</h1>
      <form action={updateSiteSettings} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="businessName">Nama Usaha</Label>
          <Input
            id="businessName"
            name="businessName"
            defaultValue={settings.business_name}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="heroHeading">Judul Hero</Label>
          <Input id="heroHeading" name="heroHeading" defaultValue={settings.hero_heading ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="heroSubheading">Subjudul Hero</Label>
          <Input
            id="heroSubheading"
            name="heroSubheading"
            defaultValue={settings.hero_subheading ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsappNumber">Nomor WhatsApp</Label>
          <Input
            id="whatsappNumber"
            name="whatsappNumber"
            defaultValue={settings.whatsapp_number ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={settings.email ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Alamat</Label>
          <Input id="address" name="address" defaultValue={settings.address ?? ""} />
        </div>
        <Button type="submit">Simpan Pengaturan</Button>
      </form>
    </div>
  );
}
