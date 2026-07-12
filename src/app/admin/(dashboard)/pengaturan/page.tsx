import { PageHeader } from "@/components/admin/page-header";
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
    <div>
      <PageHeader
        title="Pengaturan Situs"
        subtitle="Identitas & kontak yang tampil di website publik"
      />

      <div className="adm-card max-w-xl p-6">
        <form action={updateSiteSettings} className="space-y-4">
          <div>
            <label htmlFor="businessName" className="adm-label">
              Nama Usaha
            </label>
            <input
              id="businessName"
              name="businessName"
              defaultValue={settings.business_name}
              required
              className="adm-input"
            />
          </div>
          <div>
            <label htmlFor="tagline" className="adm-label">
              Tagline (slogan singkat di hero)
            </label>
            <input
              id="tagline"
              name="tagline"
              defaultValue={settings.tagline ?? ""}
              className="adm-input"
            />
          </div>
          <div>
            <label htmlFor="heroText" className="adm-label">
              Teks Hero (paragraf pembuka beranda)
            </label>
            <textarea
              id="heroText"
              name="heroText"
              rows={3}
              defaultValue={settings.hero_text ?? ""}
              className="adm-input"
            />
          </div>
          <div>
            <label htmlFor="whatsappNumber" className="adm-label">
              Nomor WhatsApp (format 62xxx)
            </label>
            <input
              id="whatsappNumber"
              name="whatsappNumber"
              defaultValue={settings.whatsapp_number ?? ""}
              className="adm-input"
            />
          </div>
          <div>
            <label htmlFor="email" className="adm-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={settings.email ?? ""}
              className="adm-input"
            />
          </div>
          <div>
            <label htmlFor="address" className="adm-label">
              Alamat
            </label>
            <input
              id="address"
              name="address"
              defaultValue={settings.address ?? ""}
              className="adm-input"
            />
          </div>
          <button type="submit" className="adm-btn adm-btn-primary">
            Simpan Pengaturan
          </button>
        </form>
      </div>
    </div>
  );
}
