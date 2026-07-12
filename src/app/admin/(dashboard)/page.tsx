import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LedgerService } from "@/lib/accounting/ledger-service";
import { getCurrentUser } from "@/lib/auth/access-control";
import { createClient } from "@/lib/supabase/server";

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);
}

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const canSeeFinance = user?.role === "owner" || user?.role === "investor";

  const [{ count: activeSubjects }, { count: leadsCount }] = await Promise.all([
    supabase
      .from("trace_subjects")
      .select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }),
  ]);

  let kasBalance: number | null = null;
  if (canSeeFinance) {
    const ledger = new LedgerService(supabase);
    const [kas, bank] = await Promise.all([
      ledger.getAccountBalance("1100", today),
      ledger.getAccountBalance("1200", today),
    ]);
    kasBalance = kas + bank;
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {canSeeFinance && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Kas &amp; Bank</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {kasBalance !== null ? formatRupiah(kasBalance) : "-"}
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Subjek Jejak Aktif</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{activeSubjects ?? 0}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Leads Masuk</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{leadsCount ?? 0}</CardContent>
        </Card>
      </div>
    </div>
  );
}
