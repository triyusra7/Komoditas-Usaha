import { PageHeader } from "@/components/admin/page-header";
import { ExportCsvButton, PrintButton } from "@/components/admin/report-buttons";
import { FinancialStatements } from "@/lib/accounting/financial-statements";
import { formatRupiah, resolveMonthPeriod } from "@/lib/accounting/period";
import { requireRole } from "@/lib/auth/access-control";
import { createClient } from "@/lib/supabase/server";

export default async function NeracaPage({
  searchParams,
}: {
  searchParams: Promise<{ periode?: string }>;
}) {
  await requireRole("owner", "investor");
  const { periode } = await searchParams;
  const period = resolveMonthPeriod(periode);

  const supabase = await createClient();
  const financials = new FinancialStatements(supabase);
  const sheet = await financials.balanceSheet(period.to);

  const csvRows = [
    ...sheet.assetLines.map((l) => ({ Bagian: "Aset", Akun: l.name, Nominal: l.amount })),
    ...sheet.liabilityLines.map((l) => ({ Bagian: "Kewajiban", Akun: l.name, Nominal: l.amount })),
    ...sheet.equityLines.map((l) => ({ Bagian: "Ekuitas", Akun: l.name, Nominal: l.amount })),
  ];

  return (
    <div>
      <PageHeader
        title="Laporan Neraca"
        subtitle="Balance sheet — posisi keuangan per tanggal"
        actions={
          <>
            <ExportCsvButton rows={csvRows} filename={`Neraca_${period.periode}`} />
            <PrintButton />
          </>
        }
      />

      <form method="get" className="adm-filter-bar adm-no-print">
        <div>
          <label htmlFor="periode" className="adm-label">
            Per akhir bulan
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

      <div className="adm-card mx-auto max-w-3xl p-6">
        <div className="adm-report-header">
          <h3>TRI AGRI — LAPORAN NERACA</h3>
          <p>
            Per{" "}
            {new Date(period.to).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <table className="adm-table">
          <tbody>
            <tr>
              <td colSpan={2} className="font-bold text-secondary">
                ASET
              </td>
            </tr>
            {sheet.assetLines.map((line) => (
              <tr key={line.code}>
                <td className="pl-8">{line.name}</td>
                <td className="adm-amount">{formatRupiah(line.amount)}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-[#e8edf2]">
              <td className="font-semibold">Total Aset</td>
              <td className="adm-amount">{formatRupiah(sheet.totalAssets)}</td>
            </tr>

            <tr>
              <td colSpan={2} className="pt-5 font-bold text-secondary">
                KEWAJIBAN
              </td>
            </tr>
            {sheet.liabilityLines.map((line) => (
              <tr key={line.code}>
                <td className="pl-8">{line.name}</td>
                <td className="adm-amount">{formatRupiah(line.amount)}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-[#e8edf2]">
              <td className="font-semibold">Total Kewajiban</td>
              <td className="adm-amount">{formatRupiah(sheet.totalLiabilities)}</td>
            </tr>

            <tr>
              <td colSpan={2} className="pt-5 font-bold text-secondary">
                EKUITAS
              </td>
            </tr>
            {sheet.equityLines.map((line) => (
              <tr key={line.code}>
                <td className="pl-8">{line.name}</td>
                <td className="adm-amount">{formatRupiah(line.amount)}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-[#e8edf2]">
              <td className="font-semibold">Total Ekuitas</td>
              <td className="adm-amount">{formatRupiah(sheet.totalEquity)}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>TOTAL KEWAJIBAN + EKUITAS</td>
              <td className="adm-amount">
                {formatRupiah(sheet.totalLiabilities + sheet.totalEquity)}
              </td>
            </tr>
          </tfoot>
        </table>

        <p
          className={`mt-4 rounded-lg px-4 py-2.5 text-sm font-semibold ${
            sheet.isBalanced ? "bg-[#e6f7ee] text-[#276749]" : "bg-[#fdeaea] text-[#c53030]"
          }`}
        >
          {sheet.isBalanced
            ? "✓ Balance — Aset = Kewajiban + Ekuitas."
            : "✗ TIDAK BALANCE — periksa kembali jurnal Anda."}
        </p>
      </div>
    </div>
  );
}
