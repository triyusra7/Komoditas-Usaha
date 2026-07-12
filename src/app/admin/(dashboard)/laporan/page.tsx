import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FinancialStatements } from "@/lib/accounting/financial-statements";
import { LedgerService } from "@/lib/accounting/ledger-service";
import { requireRole } from "@/lib/auth/access-control";
import { createClient } from "@/lib/supabase/server";

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);
}

function formatPercent(ratio: number | null): string {
  return ratio === null ? "-" : `${(ratio * 100).toFixed(1)}%`;
}

export default async function LaporanPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  await requireRole("owner", "investor");
  const { from, to } = await searchParams;

  const today = new Date().toISOString().slice(0, 10);
  const firstOfYear = `${new Date().getFullYear()}-01-01`;
  const range = { from: from ?? firstOfYear, to: to ?? today };

  const supabase = await createClient();
  const ledger = new LedgerService(supabase);
  const financials = new FinancialStatements(supabase);

  const [trialBalance, incomeStatement, balanceSheet, cashFlow, ratios] = await Promise.all([
    ledger.getTrialBalance(range.to),
    financials.incomeStatement(range),
    financials.balanceSheet(range.to),
    financials.cashFlow(range),
    financials.ratios(range),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-heading text-2xl font-bold">Laporan Keuangan</h1>
        <p className="text-sm text-muted-foreground">
          Periode {range.from} — {range.to}
        </p>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Marjin Laba Bersih</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-bold">
            {formatPercent(ratios.netProfitMargin)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">ROE</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-bold">
            {formatPercent(ratios.returnOnEquity)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">DER</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-bold">
            {ratios.debtToEquityRatio?.toFixed(2) ?? "-"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">DSCR</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-bold">
            {ratios.debtServiceCoverageRatio?.toFixed(2) ?? "-"}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold">Laba/Rugi</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Akun</TableHead>
              <TableHead className="text-right">Nominal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incomeStatement.incomeLines.map((line) => (
              <TableRow key={line.code}>
                <TableCell>{line.name}</TableCell>
                <TableCell className="text-right">{formatRupiah(line.amount)}</TableCell>
              </TableRow>
            ))}
            {incomeStatement.expenseLines.map((line) => (
              <TableRow key={line.code}>
                <TableCell>({line.name})</TableCell>
                <TableCell className="text-right">-{formatRupiah(line.amount)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell className="font-semibold">Laba Bersih</TableCell>
              <TableCell className="text-right font-semibold">
                {formatRupiah(incomeStatement.netIncome)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold">Neraca (per {range.to})</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Akun</TableHead>
              <TableHead className="text-right">Nominal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-semibold">Aset</TableCell>
              <TableCell />
            </TableRow>
            {balanceSheet.assetLines.map((line) => (
              <TableRow key={line.code}>
                <TableCell className="pl-6">{line.name}</TableCell>
                <TableCell className="text-right">{formatRupiah(line.amount)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell className="font-semibold">Kewajiban</TableCell>
              <TableCell />
            </TableRow>
            {balanceSheet.liabilityLines.map((line) => (
              <TableRow key={line.code}>
                <TableCell className="pl-6">{line.name}</TableCell>
                <TableCell className="text-right">{formatRupiah(line.amount)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell className="font-semibold">Ekuitas</TableCell>
              <TableCell />
            </TableRow>
            {balanceSheet.equityLines.map((line) => (
              <TableRow key={line.code}>
                <TableCell className="pl-6">{line.name}</TableCell>
                <TableCell className="text-right">{formatRupiah(line.amount)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell className="font-semibold">Total Aset</TableCell>
              <TableCell className="text-right font-semibold">
                {formatRupiah(balanceSheet.totalAssets)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Total Kewajiban + Ekuitas</TableCell>
              <TableCell className="text-right font-semibold">
                {formatRupiah(balanceSheet.totalLiabilities + balanceSheet.totalEquity)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        {!balanceSheet.isBalanced && (
          <p className="text-sm text-destructive">
            Peringatan: Neraca tidak balance. Periksa kembali jurnal.
          </p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold">Arus Kas</h2>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Operasi</TableCell>
              <TableCell className="text-right">{formatRupiah(cashFlow.operating)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Investasi</TableCell>
              <TableCell className="text-right">{formatRupiah(cashFlow.investing)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Pendanaan</TableCell>
              <TableCell className="text-right">{formatRupiah(cashFlow.financing)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Perubahan Kas Bersih</TableCell>
              <TableCell className="text-right font-semibold">
                {formatRupiah(cashFlow.netChangeInCash)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold">Neraca Saldo (Trial Balance)</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode</TableHead>
              <TableHead>Akun</TableHead>
              <TableHead className="text-right">Debit</TableHead>
              <TableHead className="text-right">Kredit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trialBalance.map((row) => (
              <TableRow key={row.accountCode}>
                <TableCell>{row.accountCode}</TableCell>
                <TableCell>{row.accountName}</TableCell>
                <TableCell className="text-right">{formatRupiah(row.debit)}</TableCell>
                <TableCell className="text-right">{formatRupiah(row.credit)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
