import Link from "next/link";

import { PublicDataService } from "@/lib/services/public-data-service";
import { createClient } from "@/lib/supabase/server";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/tentang", label: "Tentang" },
  { href: "/katalog", label: "Katalog" },
  { href: "/kontak", label: "Kontak" },
];

function socialEntries(links: unknown): { label: string; url: string }[] {
  if (!links || typeof links !== "object") return [];
  return Object.entries(links as Record<string, string>)
    .filter(([, url]) => typeof url === "string" && url.startsWith("http"))
    .map(([key, url]) => ({ label: key.charAt(0).toUpperCase() + key.slice(1), url }));
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const publicData = new PublicDataService(supabase);
  const settings = await publicData.getSiteSettings();
  const socials = socialEntries(settings.social_links);
  const waHref = settings.whatsapp_number
    ? `https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}`
    : null;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-heading text-xl font-bold">
            <span aria-hidden="true">🌱</span> {settings.business_name}
          </Link>
          <nav className="hidden gap-8 text-sm font-semibold sm:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-primary">
                {link.label}
              </Link>
            ))}
          </nav>
          {waHref && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full bg-primary px-5 py-2 text-xs font-bold tracking-wide text-primary-foreground uppercase transition-transform hover:-translate-y-0.5 sm:inline-flex"
            >
              Hubungi Kami
            </a>
          )}
        </div>
        <nav className="flex justify-center gap-6 border-t border-foreground/5 py-2 text-xs font-semibold sm:hidden">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-secondary text-secondary-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-3">
          <div>
            <p className="font-heading text-xl font-bold">🌱 {settings.business_name}</p>
            {settings.tagline && <p className="mt-2 text-sm opacity-80">{settings.tagline}</p>}
            {settings.address && <p className="mt-4 text-sm opacity-70">📍 {settings.address}</p>}
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase opacity-60">Navigasi</p>
            <ul className="mt-3 space-y-2 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="opacity-80 hover:opacity-100 hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase opacity-60">Kontak</p>
            <ul className="mt-3 space-y-2 text-sm opacity-80">
              {settings.whatsapp_number && <li>WhatsApp: +{settings.whatsapp_number}</li>}
              {settings.email && <li>Email: {settings.email}</li>}
            </ul>
            {socials.length > 0 && (
              <div className="mt-4 flex gap-3">
                {socials.map((social) => (
                  <a
                    key={social.url}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-secondary-foreground/30 px-3 py-1 text-xs font-semibold opacity-80 hover:opacity-100"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-secondary-foreground/10 py-5 text-center text-xs opacity-60">
          © {new Date().getFullYear()} {settings.business_name}. Semua hak dilindungi.
        </div>
      </footer>
    </div>
  );
}
