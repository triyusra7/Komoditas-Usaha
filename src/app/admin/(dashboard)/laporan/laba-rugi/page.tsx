import { PageHeader } from "@/components/admin/page-header";
import { ExportCsvButton, PrintButton } from "@/components/admin/report-buttons";
import { FinancialStatements } from "@/lib/accounting/financial-statements";
import { formatRupiah, resolveMonthPeriod } from "@/lib/accounting/period";
import { requireRole } from "@/lib/auth/access-control";
import { createClient } from "@/lib/supabase/server";

export default async function LabaRugiPage({
  searchParams,
}: {
  searchParams: Promise<{ periode?: string }>;
}) {
  await requireRole("owner", "investor");
  const { periode } = await searchParams;
  const period = resolveMonthPeriod(periode);

  const supabase = await createClient();
  const financials = new FinancialStatements(supabase);
  const statement = await financials.incomeStatement({ from: period.from, to: period.to });

  const csvRows = [
    ...statement.incomeLines.map((line) => ({
      Bagian: "Pendapatan",
      Akun: line.name,
      Nominal: line.amount,
    })),
    ...statement.expenseLines.map((line) => ({
      Bagian: "Beban",
      Akun: line.name,
      Nominal: -line.amount,
    })),
    { Bagian: "", Akun: "LABA BERSIH", Nominal: statement.netIncome },
  ];

  return (
    <div>
      <PageHeader
        title="Laporan Laba Rugi"
        subtitle="Income statement per periode"
        actions={
          <>
            <ExportCsvButton rows={csvRows} filename={`Laba_Rugi_${period.periode}`} />
            <PrintButton />
          </>
        }
      />

      <form method="get" className="adm-filter-bar adm-no-print">
        <div>
          <label htmlFor="periode" className="adm-label">
            Periode
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
          🔍 Tampilkan
        </button>
      </form>

      <div className="adm-card mx-auto max-w-3xl p-6">
        <div className="adm-report-header">
          <h3>TRI AGRI — LAPORAN LABA RUGI</h3>
          <p>Periode {period.label}</p>
        </div>

        <table className="adm-table">
          <tbody>
            <tr>
              <td colSpan={2} className="font-bold text-[#1e3f5c]">
                PENDAPATAN
              </td>
            </tr>
            {statement.incomeLines.map((line) => (
              <tr key={line.code}>
                <td className="pl-8">{line.name}</td>
                <td className="adm-amount">{formatRupiah(line.amount)}</td>
              </tr>
            ))}
            {statement.incomeLines.length === 0 && (
              <tr>
                <td className="pl-8 text-[#8896ab]">Belum ada pendapatan</td>
                <td className="adm-amount">-</td>
              </tr>
            )}
            <tr className="border-t-2 border-[#e8edf2]">
              <td className="font-semibold">Total Pendapatan</td>
              <td className="adm-amount">{formatRupiah(statement.totalIncome)}</td>
            </tr>

            <tr>
              <td colSpan={2} className="pt-5 font-bold text-[#1e3f5c]">
                BEBAN
              </td>
            </tr>
            {statement.expenseLines.map((line) => (
              <tr key={line.code}>
                <td className="pl-8">{line.name}</td>
                <td className="adm-amount text-[#c53030]">({formatRupiah(line.amount)})</td>
              </tr>
            ))}
            {statement.expenseLines.length === 0 && (
              <tr>
                <td className="pl-8 text-[#8896ab]">Belum ada beban</td>
                <td className="adm-amount">-</td>
              </tr>
            )}
            <tr className="border-t-2 border-[#e8edf2]">
              <td className="font-semibold">Total Beban</td>
              <td className="adm-amount text-[#c53030]">
                ({formatRupiah(statement.totalExpense)})
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>LABA / (RUGI) BERSIH</td>
              <td
                className={`adm-amount ${statement.netIncome >= 0 ? "text-[#276749]" : "text-[#c53030]"}`}
              >
                {formatRupiah(statement.netIncome)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
