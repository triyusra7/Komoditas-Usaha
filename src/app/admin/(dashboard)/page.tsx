import Link from "next/link";

import { PageHeader, StatCard } from "@/components/admin/page-header";
import { FinancialStatements } from "@/lib/accounting/financial-statements";
import { LedgerService } from "@/lib/accounting/ledger-service";
import { getCurrentUser } from "@/lib/auth/access-control";
import { createClient } from "@/lib/supabase/server";

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const firstOfMonth = today.slice(0, 8) + "01";

  const canSeeFinance = user?.role === "owner" || user?.role === "investor";
  const canSeeOps = user?.role === "owner" || user?.role === "staff";

  const [{ count: activeSubjects }, { count: leadsCount }, { count: productsCount }] =
    await Promise.all([
      supabase.from("trace_subjects").select("id", { count: "exact", head: true }),
      supabase.from("leads").select("id", { count: "exact", head: true }),
      supabase.from("products").select("id", { count: "exact", head: true }),
    ]);

  let finance: {
    cash: number;
    revenue: number;
    netIncome: number;
    debt: number;
  } | null = null;

  if (canSeeFinance) {
    const ledger = new LedgerService(supabase);
    const financials = new FinancialStatements(supabase);
    const [kas, bank, utangBank, utangUsaha, incomeStatement] = await Promise.all([
      ledger.getAccountBalance("1100", today),
      ledger.getAccountBalance("1200", today),
      ledger.getAccountBalance("2200", today),
      ledger.getAccountBalance("2100", today),
      financials.incomeStatement({ from: firstOfMonth, to: today }),
    ]);
    finance = {
      cash: kas + bank,
      revenue: incomeStatement.totalIncome,
      netIncome: incomeStatement.netIncome,
      debt: -(utangBank + utangUsaha),
    };
  }

  const { data: recentEntries } = canSeeFinance
    ? await supabase
        .from("journal_entries")
        .select("id, entry_date, memo, source_type, status, journal_lines(debit)")
        .order("created_at", { ascending: false })
        .limit(6)
    : { data: null };

  const { data: recentLeads } = canSeeOps
    ? await supabase
        .from("leads")
        .select("id, name, contact, interest, created_at")
        .order("created_at", { ascending: false })
        .limit(6)
    : { data: null };

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`Ringkasan kondisi usaha per ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`}
      />

      {finance && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Kas & Bank" value={formatRupiah(finance.cash)} icon="💰" />
          <StatCard
            label="Pendapatan Bulan Ini"
            value={formatRupiah(finance.revenue)}
            icon="📈"
          />
          <StatCard
            label="Laba Bulan Ini"
            value={formatRupiah(finance.netIncome)}
            icon="📊"
          />
          <StatCard label="Utang Tersisa" value={formatRupiah(finance.debt)} icon="💳" />
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Subjek Jejak Aktif"
          value={String(activeSubjects ?? 0)}
          sub="ekor/batch tercatat"
          icon="🐖"
        />
        <StatCard
          label="Produk Katalog"
          value={String(productsCount ?? 0)}
          sub="produk di website"
          icon="📦"
        />
        <StatCard
          label="Leads Masuk"
          value={String(leadsCount ?? 0)}
          sub="dari form kontak website"
          icon="📥"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {recentEntries && (
          <div className="adm-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1e3f5c]">🧾 Jurnal Terbaru</h3>
              <Link href="/admin/jurnal" className="text-xs font-semibold text-[#264C70] hover:underline">
                Lihat semua →
              </Link>
            </div>
            {recentEntries.length === 0 ? (
              <p className="py-4 text-sm text-[#8896ab]">Belum ada transaksi tercatat.</p>
            ) : (
              <div className="space-y-0 text-sm">
                {recentEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between border-b border-[#f0f4f8] py-2.5 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{entry.memo ?? "-"}</p>
                      <p className="text-xs text-[#8896ab]">
                        {new Date(entry.entry_date).toLocaleDateString("id-ID")} ·{" "}
                        {entry.source_type}
                      </p>
                    </div>
                    <span className="adm-amount">
                      {formatRupiah(entry.journal_lines.reduce((sum, l) => sum + l.debit, 0))}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {recentLeads && (
          <div className="adm-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1e3f5c]">📥 Leads Terbaru</h3>
              <Link href="/admin/leads" className="text-xs font-semibold text-[#264C70] hover:underline">
                Lihat semua →
              </Link>
            </div>
            {recentLeads.length === 0 ? (
              <p className="py-4 text-sm text-[#8896ab]">Belum ada leads masuk.</p>
            ) : (
              <div className="space-y-0 text-sm">
                {recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between border-b border-[#f0f4f8] py-2.5 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{lead.name}</p>
                      <p className="text-xs text-[#8896ab]">{lead.contact}</p>
                    </div>
                    {lead.interest && (
                      <span className="adm-badge adm-badge-blue">{lead.interest}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
