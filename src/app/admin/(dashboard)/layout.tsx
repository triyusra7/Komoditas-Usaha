import { LogOut, Sprout } from "lucide-react";

import { signOut } from "@/app/admin/actions";
import { requireUser } from "@/lib/auth/access-control";
import type { UserRole } from "@/lib/auth/access-control";

import { AdminNav, type NavSection } from "./admin-nav";

const ROLE_LABEL: Record<UserRole, string> = {
  owner: "Owner",
  staff: "Staf",
  investor: "Investor",
};

function navSectionsForRole(role: UserRole): NavSection[] {
  const all: (NavSection & { roles: UserRole[] })[] = [
    {
      title: "Utama",
      roles: ["owner", "staff", "investor"],
      items: [
        { href: "/admin", label: "Dashboard", icon: "dashboard" },
        { href: "/admin/leads", label: "Leads", icon: "leads" },
      ],
    },
    {
      title: "Keuangan",
      roles: ["owner"],
      items: [
        { href: "/admin/transaksi", label: "Transaksi", icon: "transaksi" },
        { href: "/admin/jurnal", label: "Jurnal", icon: "jurnal" },
        { href: "/admin/coa", label: "Chart of Accounts", icon: "coa" },
      ],
    },
    {
      title: "Laporan Keuangan",
      roles: ["owner", "investor"],
      items: [
        { href: "/admin/laporan/buku-besar", label: "Buku Besar", icon: "buku-besar" },
        { href: "/admin/laporan/neraca-saldo", label: "Neraca Saldo", icon: "neraca-saldo" },
        { href: "/admin/laporan/laba-rugi", label: "Laba Rugi", icon: "laba-rugi" },
        { href: "/admin/laporan/neraca", label: "Neraca", icon: "neraca" },
        { href: "/admin/laporan/arus-kas", label: "Arus Kas", icon: "arus-kas" },
      ],
    },
    {
      title: "Traceability",
      roles: ["owner", "staff"],
      items: [
        { href: "/admin/traceability", label: "Subjek Jejak", icon: "traceability" },
      ],
    },
    {
      title: "Website (CMS)",
      roles: ["owner", "staff"],
      items: [
        { href: "/admin/produk", label: "Produk", icon: "produk" },
        { href: "/admin/kategori", label: "Kategori", icon: "kategori" },
        { href: "/admin/pengaturan", label: "Pengaturan Situs", icon: "pengaturan" },
      ],
    },
  ];

  const leadsAllowed: UserRole[] = ["owner", "staff"];
  return all
    .filter((section) => section.roles.includes(role))
    .map((section) => ({
      title: section.title,
      items:
        section.title === "Utama" && !leadsAllowed.includes(role)
          ? section.items.filter((item) => item.href !== "/admin/leads")
          : section.items,
    }));
}

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const sections = navSectionsForRole(user.role);
  const initials = user.fullName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="adm flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="adm-sidebar flex w-64 shrink-0 flex-col text-[#f7f0e6]">
        <div className="flex items-center gap-3 border-b-2 border-[#f7f0e6]/15 px-4 py-4">
          <div className="adm-brand-icon flex size-10 shrink-0 items-center justify-center rounded-xl text-secondary">
            <Sprout aria-hidden="true" className="size-5" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="font-heading text-base font-black tracking-tight">Tri Agri</h2>
            <p className="mt-0.5 text-[11px] font-medium tracking-wide text-[#f7f0e6]/55 uppercase">
              CMS + ERP
            </p>
          </div>
        </div>
        <AdminNav sections={sections} />
        <div className="border-t-2 border-[#f7f0e6]/15 p-3">
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#f7f0e6]/30 py-2 text-xs font-bold tracking-wide text-[#f7f0e6]/85 uppercase transition-colors hover:border-[#f7f0e6]/60 hover:bg-[#f7f0e6]/10 hover:text-[#f7f0e6]"
            >
              <LogOut aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
              Keluar
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="adm-topbar flex h-16 shrink-0 items-center justify-between px-7">
          <div>
            <h1 className="font-heading text-[17px] font-black tracking-tight text-secondary">
              Panel Admin Tri Agri
            </h1>
            <p className="text-xs font-medium text-muted-foreground">
              Palopo & Morowali · Komoditas Babi
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="adm-badge adm-badge-green">{ROLE_LABEL[user.role]}</span>
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-full border-2 border-secondary bg-primary text-sm font-black text-secondary shadow-[2px_2px_0px_#1d2b1f]">
                {initials}
              </div>
              <span className="hidden text-sm font-bold text-secondary sm:block">
                {user.fullName}
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-7">{children}</main>
      </div>
    </div>
  );
}
