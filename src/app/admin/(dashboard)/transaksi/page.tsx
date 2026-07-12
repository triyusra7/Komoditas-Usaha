import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireRole } from "@/lib/auth/access-control";
import { createClient } from "@/lib/supabase/server";

import { reverseJournalEntry } from "./actions";
import { TransactionForm } from "./transaction-form";

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);
}

export default async function TransaksiPage() {
  await requireRole("owner");

  const supabase = await createClient();
  const { data: entries } = await supabase
    .from("journal_entries")
    .select("id, entry_date, memo, source_type, status, journal_lines(debit, credit)")
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-bold">Transaksi</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Keterangan</TableHead>
            <TableHead>Jenis</TableHead>
            <TableHead>Nominal</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(entries ?? []).map((entry) => {
            const total = entry.journal_lines.reduce((sum, l) => sum + l.debit, 0);
            return (
              <TableRow key={entry.id}>
                <TableCell>{new Date(entry.entry_date).toLocaleDateString("id-ID")}</TableCell>
                <TableCell className="max-w-xs truncate">{entry.memo}</TableCell>
                <TableCell className="text-muted-foreground">{entry.source_type}</TableCell>
                <TableCell>{formatRupiah(total)}</TableCell>
                <TableCell>
                  <Badge variant={entry.status === "posted" ? "default" : "secondary"}>
                    {entry.status === "posted" ? "Posted" : "Void"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {entry.status === "posted" && (
                    <form action={reverseJournalEntry.bind(null, entry.id)}>
                      <Button type="submit" size="sm" variant="ghost">
                        Reversal
                      </Button>
                    </form>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
          {(!entries || entries.length === 0) && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                Belum ada transaksi.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="max-w-md space-y-4 rounded-lg border border-border p-6">
        <h2 className="font-heading text-lg font-semibold">Catat Transaksi</h2>
        <TransactionForm />
      </div>
    </div>
  );
}
