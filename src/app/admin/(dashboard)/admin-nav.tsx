"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Boxes,
  FolderTree,
  Inbox,
  Landmark,
  LayoutDashboard,
  Library,
  PawPrint,
  Receipt,
  Scale,
  Settings,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";

const NAV_ICONS: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  leads: Inbox,
  transaksi: Wallet,
  jurnal: Receipt,
  coa: Library,
  "buku-besar": BookOpen,
  "neraca-saldo": Scale,
  "laba-rugi": BarChart3,
  neraca: Landmark,
  "arus-kas": TrendingUp,
  traceability: PawPrint,
  produk: Boxes,
  kategori: FolderTree,
  pengaturan: Settings,
};

export type NavSection = {
  title: string;
  items: { href: string; label: string; icon: string }[];
};

export function AdminNav({ sections }: { sections: NavSection[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto py-3">
      {sections.map((section) => (
        <div key={section.title} className="mb-1">
          <p className="adm-nav-section">{section.title}</p>
          {section.items.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = NAV_ICONS[item.icon] ?? LayoutDashboard;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="adm-nav-item"
                data-active={isActive}
              >
                <Icon aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.25} />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
