"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { t, type Language } from "@/lib/i18n";

type NavigationProps = {
  links: { href: string; label: string }[];
  lang: Language;
  mobile?: boolean;
};

export function Navigation({ links, lang, mobile = false }: NavigationProps) {
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") {
      return pathname === "/";
    }
    if (href === "/katalog") {
      return (
        pathname === "/katalog" ||
        pathname.startsWith("/katalog/") ||
        pathname.startsWith("/produk/") ||
        pathname.startsWith("/jejak/")
      );
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  if (mobile) {
    return (
      <nav className="flex justify-center gap-6 border-t border-foreground/5 py-2 text-xs font-semibold sm:hidden">
        {links.map((link) => {
          const active = isLinkActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "nav-link-animated transition-colors hover:text-primary",
                active && "is-active"
              )}
            >
              {t(link.label, lang)}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="hidden gap-8 text-sm font-semibold sm:flex">
      {links.map((link) => {
        const active = isLinkActive(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "nav-link-animated transition-colors hover:text-primary",
              active && "is-active"
            )}
          >
            {t(link.label, lang)}
          </Link>
        );
      })}
    </nav>
  );
}
