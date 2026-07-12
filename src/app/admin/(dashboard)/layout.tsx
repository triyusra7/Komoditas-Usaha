import Link from "next/link";

import { signOut } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/access-control";
import type { UserRole } from "@/lib/auth/access-control";

type NavItem = { href: string; label: string; roles: UserRole[] };

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", roles: ["owner", "staff", "investor"] },
  { href: "/admin/produk", label: "Produk", roles: ["owner", "staff"] },
  { href: "/admin/kategori", label: "Kategori", roles: ["owner", "staff"] },
  { href: "/admin/traceability", label: "Traceability", roles: ["owner", "staff"] },
  { href: "/admin/transaksi", label: "Transaksi", roles: ["owner"] },
  { href: "/admin/laporan", label: "Laporan Keuangan", roles: ["owner", "investor"] },
  { href: "/admin/leads", label: "Leads", roles: ["owner", "staff"] },
  { href: "/admin/pengaturan", label: "Pengaturan", roles: ["owner"] },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(user.role));

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="flex w-64 shrink-0 flex-col justify-between border-r border-border bg-sidebar text-sidebar-foreground">
        <div>
          <div className="border-b border-sidebar-border px-6 py-5">
            <span className="font-heading text-lg font-bold">Tri Agri</span>
            <p className="text-xs text-sidebar-foreground/70">{user.fullName}</p>
          </div>
          <nav className="flex flex-col gap-1 p-3">
            {visibleItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <form action={signOut} className="p-3">
          <Button type="submit" variant="outline" size="sm" className="w-full">
            Keluar
          </Button>
        </form>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
