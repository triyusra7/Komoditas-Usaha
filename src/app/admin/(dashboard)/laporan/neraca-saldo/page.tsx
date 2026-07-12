import { PageHeader } from "@/components/admin/page-header";
import { ExportCsvButton, PrintButton } from "@/components/admin/report-buttons";
import { LedgerService } from "@/lib/accounting/ledger-service";
import { formatRupiah, resolveMonthPeriod } from "@/lib/accounting/period";
import { requireRole } from "@/lib/auth/access-control";
import { createClient } from "@/lib/supabase/server";

export default async function NeracaSaldoPage({
  searchParams,
}: {
  searchParams: Promise<{ periode?: string }>;
}) {
  await requireRole("owner", "investor");
  const { periode } = await searchParams;
  const period = resolveMonthPeriod(periode);

  const supabase = await createClient();
  const ledger = new LedgerService(supabase);
  const rows = await ledger.getTrialBalance(period.to);

  const totalDebit = rows.reduce((sum, row) => sum + row.debit, 0);
  const totalCredit = rows.reduce((sum, row) => sum + row.credit, 0);
  const isBalanced = Math.round(totalDebit * 100) === Math.round(totalCredit * 100);

  const csvRows = rows.map((row) => ({
    Kode: row.accountCode,
    Akun: row.accountName,
    Debit: row.debit,
    Kredit: row.credit,
  }));

  return (
    <div>
      <PageHeader
        title="Neraca Saldo"
        subtitle="Trial balance — saldo semua akun"
        actions={
          <>
            <ExportCsvButton rows={csvRows} filename={`Neraca_Saldo_${period.periode}`} />
            <PrintButton />
          </>
        }
      />

      <form method="get" className="adm-filter-bar adm-no-print">
        <div>
          <label htmlFor="periode" className="adm-label">
            Periode (s.d. akhir bulan)
          </label>
          <input
            id="periode"
            type="month"
            name="periode"
            defaultValue={period.periode}
            className="adm-input w-44"
          />
        </div>
        <button type="submit" className="adm-btn adm-btn-primary adm-btn-sm">
          Tampilkan
        </button>
      </form>

      <div className="adm-card p-5">
        <div className="adm-report-header">
          <h3>TRI AGRI — NERACA SALDO</h3>
          <p>Per {new Date(period.to).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="adm-table">
            <thead>
              <tr>
                <th className="w-24">Kode</th>
                <th>Nama Akun</th>
                <th className="text-right">Debit</th>
                <th className="text-right">Kredit</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.accountCode}>
                  <td className="font-semibold">{row.accountCode}</td>
                  <td>{row.accountName}</td>
                  <td className="adm-amount">{row.debit ? formatRupiah(row.debit) : "-"}</td>
                  <td className="adm-amount">{row.credit ? formatRupiah(row.credit) : "-"}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted-foreground">
                    Belum ada jurnal posted sampai periode ini.
                  </td>
                </tr>
              )}
            </tbody>
            {rows.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan={2}>TOTAL</td>
                  <td className="adm-amount">{formatRupiah(totalDebit)}</td>
                  <td className="adm-amount">{formatRupiah(totalCredit)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {rows.length > 0 && (
          <p
            className={`mt-4 rounded-lg px-4 py-2.5 text-sm font-semibold ${
              isBalanced ? "bg-[#e6f7ee] text-[#276749]" : "bg-[#fdeaea] text-[#c53030]"
            }`}
          >
            {isBalanced
              ? "✓ Balance — total debit sama dengan total kredit."
              : "✗ TIDAK BALANCE — periksa kembali jurnal Anda."}
          </p>
        )}
      </div>
    </div>
  );
}
