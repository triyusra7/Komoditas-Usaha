import { PageHeader } from "@/components/admin/page-header";
import { ExportCsvButton, PrintButton } from "@/components/admin/report-buttons";
import { LedgerService } from "@/lib/accounting/ledger-service";
import { formatRupiah, resolveMonthPeriod } from "@/lib/accounting/period";
import { requireRole } from "@/lib/auth/access-control";
import { createClient } from "@/lib/supabase/server";

export default async function BukuBesarPage({
  searchParams,
}: {
  searchParams: Promise<{ akun?: string; periode?: string }>;
}) {
  await requireRole("owner", "investor");
  const { akun, periode } = await searchParams;
  const period = resolveMonthPeriod(periode);

  const supabase = await createClient();
  const { data: accounts } = await supabase
    .from("accounts")
    .select("code, name")
    .eq("is_active", true)
    .order("code");

  const selectedAccount = accounts?.find((a) => a.code === akun) ?? null;

  const ledger = new LedgerService(supabase);
  const rows = selectedAccount
    ? await ledger.getLedgerRows(selectedAccount.code, period.from, period.to)
    : [];

  const rowsWithBalance = rows.reduce<(typeof rows[number] & { balance: number })[]>(
    (acc, row) => {
      const previous = acc.length > 0 ? acc[acc.length - 1].balance : 0;
      return [...acc, { ...row, balance: previous + row.debit - row.credit }];
    },
    [],
  );

  const csvRows = rowsWithBalance.map((row) => ({
    Tanggal: row.entryDate,
    Keterangan: row.memo,
    Sumber: row.sourceType,
    Debit: row.debit,
    Kredit: row.credit,
    Saldo: row.balance,
  }));

  return (
    <div>
      <PageHeader
        title="Buku Besar"
        subtitle="Mutasi per akun (ledger)"
        actions={
          <>
            <ExportCsvButton rows={csvRows} filename={`Buku_Besar_${akun ?? ""}_${period.periode}`} />
            <PrintButton />
          </>
        }
      />

      <form method="get" className="adm-filter-bar adm-no-print">
        <div>
          <label htmlFor="akun" className="adm-label">
            Akun
          </label>
          <select id="akun" name="akun" defaultValue={akun ?? ""} className="adm-input w-72">
            <option value="">-- Pilih Akun --</option>
            {(accounts ?? []).map((account) => (
              <option key={account.code} value={account.code}>
                {account.code} — {account.name}
              </option>
            ))}
          </select>
        </div>
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

      <div className="adm-card p-5">
        <div className="adm-report-header">
          <h3>TRI AGRI — BUKU BESAR</h3>
          <p>
            {selectedAccount
              ? `Akun ${selectedAccount.code} · ${selectedAccount.name} · Periode ${period.label}`
              : `Periode ${period.label}`}
          </p>
        </div>

        {!selectedAccount ? (
          <p className="py-10 text-center text-sm text-[#8896ab]">
            Pilih akun lalu klik <b>Tampilkan</b> untuk melihat mutasinya.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Keterangan</th>
                  <th>Sumber</th>
                  <th className="text-right">Debit</th>
                  <th className="text-right">Kredit</th>
                  <th className="text-right">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {rowsWithBalance.map((row, index) => (
                  <tr key={index}>
                    <td>{new Date(row.entryDate).toLocaleDateString("id-ID")}</td>
                    <td>{row.memo}</td>
                    <td>
                      <span className="adm-badge adm-badge-gray">{row.sourceType}</span>
                    </td>
                    <td className="adm-amount">{row.debit ? formatRupiah(row.debit) : "-"}</td>
                    <td className="adm-amount">{row.credit ? formatRupiah(row.credit) : "-"}</td>
                    <td className="adm-amount">{formatRupiah(row.balance)}</td>
                  </tr>
                ))}
                {rowsWithBalance.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#8896ab]">
                      Tidak ada mutasi pada periode ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
