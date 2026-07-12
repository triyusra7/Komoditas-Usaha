import { PageHeader } from "@/components/admin/page-header";
import { formatRupiah } from "@/lib/accounting/period";
import { requireRole } from "@/lib/auth/access-control";
import { createClient } from "@/lib/supabase/server";

import { reverseJournalEntry } from "./actions";
import { TransactionForm } from "./transaction-form";

const SOURCE_LABEL: Record<string, string> = {
  sale: "Penjualan",
  purchase_feed: "Pakan",
  purchase_livestock: "Ternak",
  purchase_medicine: "Obat",
  purchase_asset: "Aset",
  purchase_service: "Jasa",
  investor_contribution: "Modal Investor",
  bank_loan: "Pinjaman Bank",
  loan_repayment: "Cicilan Bank",
  opex: "Operasional",
  depreciation: "Penyusutan",
  reversal: "Reversal",
};

export default async function TransaksiPage() {
  await requireRole("owner");

  const supabase = await createClient();
  const { data: entries } = await supabase
    .from("journal_entries")
    .select("id, entry_date, memo, source_type, status, journal_lines(debit)")
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(25);

  return (
    <div>
      <PageHeader
        title="Transaksi"
        subtitle="Catat transaksi bisnis — jurnal dibuat otomatis"
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="adm-card h-fit p-5 xl:order-2">
          <h3 className="mb-4 text-sm font-bold text-[#1e3f5c]">➕ Catat Transaksi Baru</h3>
          <TransactionForm />
        </div>

        <div className="adm-card p-5 xl:col-span-2">
          <h3 className="mb-4 text-sm font-bold text-[#1e3f5c]">📋 Transaksi Terakhir</h3>
          <div className="overflow-x-auto">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Keterangan</th>
                  <th>Jenis</th>
                  <th className="text-right">Nominal</th>
                  <th>Status</th>
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {(entries ?? []).map((entry) => {
                  const total = entry.journal_lines.reduce((sum, line) => sum + line.debit, 0);
                  return (
                    <tr key={entry.id}>
                      <td className="whitespace-nowrap">
                        {new Date(entry.entry_date).toLocaleDateString("id-ID")}
                      </td>
                      <td className="max-w-56 truncate">{entry.memo}</td>
                      <td>
                        <span className="adm-badge adm-badge-gray">
                          {SOURCE_LABEL[entry.source_type ?? ""] ?? entry.source_type}
                        </span>
                      </td>
                      <td className="adm-amount">{formatRupiah(total)}</td>
                      <td>
                        <span
                          className={`adm-badge ${entry.status === "posted" ? "adm-badge-green" : "adm-badge-red"}`}
                        >
                          {entry.status === "posted" ? "Posted" : "Void"}
                        </span>
                      </td>
                      <td className="text-right">
                        {entry.status === "posted" && (
                          <form action={reverseJournalEntry.bind(null, entry.id)}>
                            <button type="submit" className="adm-btn adm-btn-danger adm-btn-sm">
                              Reversal
                            </button>
                          </form>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {(!entries || entries.length === 0) && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#8896ab]">
                      Belum ada transaksi. Mulai catat dari form di samping.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
