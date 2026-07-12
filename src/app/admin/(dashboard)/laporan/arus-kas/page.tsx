import { PageHeader } from "@/components/admin/page-header";
import { ExportCsvButton, PrintButton } from "@/components/admin/report-buttons";
import { FinancialStatements } from "@/lib/accounting/financial-statements";
import { formatRupiah, resolveMonthPeriod } from "@/lib/accounting/period";
import { requireRole } from "@/lib/auth/access-control";
import { createClient } from "@/lib/supabase/server";

export default async function ArusKasPage({
  searchParams,
}: {
  searchParams: Promise<{ periode?: string }>;
}) {
  await requireRole("owner", "investor");
  const { periode } = await searchParams;
  const period = resolveMonthPeriod(periode);

  const supabase = await createClient();
  const financials = new FinancialStatements(supabase);
  const cashFlow = await financials.cashFlow({ from: period.from, to: period.to });

  const sections = [
    { label: "Arus Kas dari Aktivitas Operasi", value: cashFlow.operating },
    { label: "Arus Kas dari Aktivitas Investasi", value: cashFlow.investing },
    { label: "Arus Kas dari Aktivitas Pendanaan", value: cashFlow.financing },
  ];

  const csvRows = [
    ...sections.map((section) => ({ Aktivitas: section.label, Nominal: section.value })),
    { Aktivitas: "PERUBAHAN KAS BERSIH", Nominal: cashFlow.netChangeInCash },
  ];

  return (
    <div>
      <PageHeader
        title="Laporan Arus Kas"
        subtitle="Metode langsung dari mutasi kas/bank"
        actions={
          <>
            <ExportCsvButton rows={csvRows} filename={`Arus_Kas_${period.periode}`} />
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
          <h3>TRI AGRI — LAPORAN ARUS KAS</h3>
          <p>Periode {period.label}</p>
        </div>

        <table className="adm-table">
          <tbody>
            {sections.map((section) => (
              <tr key={section.label}>
                <td className="font-semibold">{section.label}</td>
                <td
                  className={`adm-amount ${section.value < 0 ? "text-[#c53030]" : "text-[#276749]"}`}
                >
                  {formatRupiah(section.value)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>PERUBAHAN KAS BERSIH</td>
              <td
                className={`adm-amount ${cashFlow.netChangeInCash < 0 ? "text-[#c53030]" : "text-[#276749]"}`}
              >
                {formatRupiah(cashFlow.netChangeInCash)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
