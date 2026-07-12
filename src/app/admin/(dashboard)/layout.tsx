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
      title: "📌 Utama",
      roles: ["owner", "staff", "investor"],
      items: [
        { href: "/admin", label: "Dashboard", icon: "🏠" },
        { href: "/admin/leads", label: "Leads", icon: "📥" },
      ],
    },
    {
      title: "💰 Keuangan",
      roles: ["owner"],
      items: [
        { href: "/admin/transaksi", label: "Transaksi", icon: "🧮" },
        { href: "/admin/jurnal", label: "Jurnal", icon: "🧾" },
        { href: "/admin/coa", label: "Chart of Accounts", icon: "📒" },
      ],
    },
    {
      title: "📊 Laporan Keuangan",
      roles: ["owner", "investor"],
      items: [
        { href: "/admin/laporan/buku-besar", label: "Buku Besar", icon: "📚" },
        { href: "/admin/laporan/neraca-saldo", label: "Neraca Saldo", icon: "⚖️" },
        { href: "/admin/laporan/laba-rugi", label: "Laba Rugi", icon: "📊" },
        { href: "/admin/laporan/neraca", label: "Neraca", icon: "🏛️" },
        { href: "/admin/laporan/arus-kas", label: "Arus Kas", icon: "💹" },
      ],
    },
    {
      title: "🐖 Traceability",
      roles: ["owner", "staff"],
      items: [{ href: "/admin/traceability", label: "Subjek Jejak", icon: "🔍" }],
    },
    {
      title: "🌐 Website (CMS)",
      roles: ["owner", "staff"],
      items: [
        { href: "/admin/produk", label: "Produk", icon: "📦" },
        { href: "/admin/kategori", label: "Kategori", icon: "🗂️" },
        { href: "/admin/pengaturan", label: "Pengaturan Situs", icon: "⚙️" },
      ],
    },
  ];

  const leadsAllowed: UserRole[] = ["owner", "staff"];
  return all
    .filter((section) => section.roles.includes(role))
    .map((section) => ({
      title: section.title,
      items:
        section.title === "📌 Utama" && !leadsAllowed.includes(role)
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
    <div className="adm flex h-screen overflow-hidden bg-[#f8f9fb]">
      {/* Sidebar */}
      <aside className="adm-sidebar flex w-64 shrink-0 flex-col text-white">
        <div className="flex items-center gap-3 border-b border-white/15 px-4 py-4">
          <div className="adm-brand-icon flex size-10 shrink-0 items-center justify-center rounded-[10px] text-lg">
            🌱
          </div>
          <div>
            <h2 className="text-[15px] font-bold tracking-wide">TRI AGRI</h2>
            <p className="mt-0.5 text-[11px] text-[#c8d8e8]">CMS + ERP v1.0</p>
          </div>
        </div>
        <AdminNav sections={sections} />
        <div className="border-t border-white/15 p-3">
          <form action={signOut}>
            <button
              type="submit"
              className="w-full rounded-lg border border-white/25 py-2 text-xs font-semibold text-[#e0eaf3] transition-colors hover:bg-white/10"
            >
              🚪 Keluar
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="adm-topbar flex h-16 shrink-0 items-center justify-between px-7">
          <div>
            <h1 className="text-[16px] font-bold text-[#1e3f5c]">Panel Admin Tri Agri</h1>
            <p className="text-xs text-[#5a6a7e]">Palopo & Morowali · Komoditas Babi</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="adm-badge adm-badge-blue">{ROLE_LABEL[user.role]}</span>
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#264C70] to-[#1e3f5c] text-sm font-bold text-white">
                {initials}
              </div>
              <span className="hidden text-sm font-semibold text-[#2d3748] sm:block">
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
