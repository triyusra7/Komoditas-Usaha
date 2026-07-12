import Link from "next/link";

import { PublicDataService } from "@/lib/services/public-data-service";
import { createClient } from "@/lib/supabase/server";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/tentang", label: "Tentang" },
  { href: "/katalog", label: "Katalog" },
  { href: "/kontak", label: "Kontak" },
];

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const publicData = new PublicDataService(supabase);
  const settings = await publicData.getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-heading text-xl font-bold">
            {settings.business_name}
          </Link>
          <nav className="flex gap-6 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-primary">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-6 py-10 text-sm">
          <p className="font-heading text-lg font-bold">{settings.business_name}</p>
          {settings.address && <p className="mt-2 opacity-80">{settings.address}</p>}
          <div className="mt-4 flex flex-wrap gap-4 opacity-80">
            {settings.whatsapp_number && <span>WhatsApp: {settings.whatsapp_number}</span>}
            {settings.email && <span>Email: {settings.email}</span>}
          </div>
          <p className="mt-6 text-xs opacity-60">
            © {new Date().getFullYear()} {settings.business_name}. Semua hak dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
}
