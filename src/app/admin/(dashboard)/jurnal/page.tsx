import { PageHeader } from "@/components/admin/page-header";
import { reverseJournalEntry } from "@/app/admin/(dashboard)/transaksi/actions";
import { formatRupiah } from "@/lib/accounting/period";
import { requireRole } from "@/lib/auth/access-control";
import { createClient } from "@/lib/supabase/server";

export default async function JurnalPage() {
  await requireRole("owner");

  const supabase = await createClient();
  const { data: entries } = await supabase
    .from("journal_entries")
    .select(
      "id, entry_date, memo, source_type, status, journal_lines(debit, credit, accounts(code, name))",
    )
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <PageHeader
        title="Daftar Jurnal"
        subtitle="Semua jurnal double-entry — dibuat otomatis dari transaksi"
      />

      <div className="space-y-3">
        {(entries ?? []).map((entry) => {
          const total = entry.journal_lines.reduce((sum, line) => sum + line.debit, 0);
          return (
            <details key={entry.id} className="adm-card group">
              <summary className="flex cursor-pointer items-center justify-between gap-4 p-4 [&::-webkit-details-marker]:hidden">
                <div className="flex min-w-0 items-center gap-4">
                  <span className="text-lg" aria-hidden="true">
                    🧾
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{entry.memo ?? "-"}</p>
                    <p className="text-xs text-[#8896ab]">
                      {new Date(entry.entry_date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      · {entry.source_type}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="adm-amount text-sm">{formatRupiah(total)}</span>
                  <span
                    className={`adm-badge ${entry.status === "posted" ? "adm-badge-green" : "adm-badge-red"}`}
                  >
                    {entry.status === "posted" ? "Posted" : "Void"}
                  </span>
                  <span className="text-xs text-[#8896ab] group-open:rotate-180">▼</span>
                </div>
              </summary>
              <div className="border-t border-[#f0f4f8] px-4 pb-4">
                <table className="adm-table mt-3">
                  <thead>
                    <tr>
                      <th>Akun</th>
                      <th className="text-right">Debit</th>
                      <th className="text-right">Kredit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entry.journal_lines.map((line, index) => {
                      const account = line.accounts as unknown as {
                        code: string;
                        name: string;
                      };
                      return (
                        <tr key={index}>
                          <td>
                            <span className="font-semibold">{account.code}</span> —{" "}
                            {account.name}
                          </td>
                          <td className="adm-amount">
                            {line.debit ? formatRupiah(line.debit) : "-"}
                          </td>
                          <td className="adm-amount">
                            {line.credit ? formatRupiah(line.credit) : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {entry.status === "posted" && (
                  <form action={reverseJournalEntry.bind(null, entry.id)} className="mt-3">
                    <button type="submit" className="adm-btn adm-btn-danger adm-btn-sm">
                      ↩️ Reversal (batalkan dengan jurnal pembalik)
                    </button>
                  </form>
                )}
              </div>
            </details>
          );
        })}

        {(!entries || entries.length === 0) && (
          <div className="adm-card p-10 text-center text-sm text-[#8896ab]">
            Belum ada jurnal. Catat transaksi di menu <b>Transaksi</b> — jurnal akan dibuat
            otomatis.
          </div>
        )}
      </div>
    </div>
  );
}
