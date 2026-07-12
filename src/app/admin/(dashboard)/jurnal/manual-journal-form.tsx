"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { postManualJournal } from "./actions";

export type AccountOption = {
  code: string;
  name: string;
};

type JournalRow = {
  key: number;
  accountCode: string;
  debit: string;
  credit: string;
};

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const EMPTY_ROW = { accountCode: "", debit: "", credit: "" };

/**
 * Jurnal umum ala Arobi: dynamic account rows with live debit/credit totals
 * and a balance indicator; posting is locked until the entry balances.
 */
export function ManualJournalForm({ accounts }: { accounts: AccountOption[] }) {
  const [state, formAction, isPending] = useActionState(postManualJournal, undefined);
  const [rows, setRows] = useState<JournalRow[]>([
    { key: 1, ...EMPTY_ROW },
    { key: 2, ...EMPTY_ROW },
  ]);

  const totalDebit = rows.reduce((sum, row) => sum + (Number(row.debit) || 0), 0);
  const totalCredit = rows.reduce((sum, row) => sum + (Number(row.credit) || 0), 0);
  const filledRows = rows.filter(
    (row) => row.accountCode && (Number(row.debit) > 0 || Number(row.credit) > 0),
  );
  const isBalanced = totalDebit > 0 && totalDebit === totalCredit && filledRows.length >= 2;

  function updateRow(key: number, patch: Partial<JournalRow>) {
    setRows((current) => current.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }

  function addRow() {
    setRows((current) => [...current, { key: Math.max(...current.map((r) => r.key)) + 1, ...EMPTY_ROW }]);
  }

  function removeRow(key: number) {
    setRows((current) => (current.length > 2 ? current.filter((row) => row.key !== key) : current));
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="entryDate" className="adm-label">
            Tanggal
          </label>
          <input id="entryDate" name="entryDate" type="date" required className="adm-input" />
        </div>
        <div>
          <label htmlFor="memo" className="adm-label">
            Keterangan
          </label>
          <input
            id="memo"
            name="memo"
            required
            placeholder="Keterangan jurnal"
            className="adm-input"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border-2 border-foreground/15">
        <table className="adm-table">
          <thead>
            <tr>
              <th className="w-[45%]">Akun</th>
              <th>Debit (Rp)</th>
              <th>Kredit (Rp)</th>
              <th className="w-10" aria-label="Hapus baris" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.key}>
                <td>
                  <select
                    name="accountCode"
                    value={row.accountCode}
                    onChange={(event) => updateRow(row.key, { accountCode: event.target.value })}
                    className="adm-input"
                    aria-label={`Akun baris ${index + 1}`}
                  >
                    <option value="">— pilih akun —</option>
                    {accounts.map((account) => (
                      <option key={account.code} value={account.code}>
                        {account.code} — {account.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    name="debit"
                    type="number"
                    min={0}
                    step="1"
                    value={row.debit}
                    onChange={(event) =>
                      updateRow(row.key, { debit: event.target.value, credit: "" })
                    }
                    className="adm-input text-right"
                    aria-label={`Debit baris ${index + 1}`}
                  />
                </td>
                <td>
                  <input
                    name="credit"
                    type="number"
                    min={0}
                    step="1"
                    value={row.credit}
                    onChange={(event) =>
                      updateRow(row.key, { credit: event.target.value, debit: "" })
                    }
                    className="adm-input text-right"
                    aria-label={`Kredit baris ${index + 1}`}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => removeRow(row.key)}
                    disabled={rows.length <= 2}
                    className="adm-btn adm-btn-danger adm-btn-sm disabled:opacity-40"
                    title="Hapus baris"
                  >
                    <Trash2 aria-hidden="true" className="size-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td className="adm-amount">{formatRupiah(totalDebit)}</td>
              <td className="adm-amount">{formatRupiah(totalCredit)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={addRow} className="adm-btn adm-btn-outline adm-btn-sm">
          <Plus aria-hidden="true" className="size-3.5" strokeWidth={2.75} />
          Baris
        </button>
        <span
          className={`adm-badge ${isBalanced ? "adm-badge-green" : "adm-badge-amber"}`}
          role="status"
        >
          {isBalanced
            ? "Balance — siap diposting"
            : `Selisih ${formatRupiah(Math.abs(totalDebit - totalCredit))}`}
        </span>
      </div>

      {state?.error && (
        <p className="rounded-lg bg-[#fbeeec] px-3 py-2 text-sm font-semibold text-[#a3352c]">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={!isBalanced || isPending}
        className="adm-btn adm-btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Memposting..." : "Post Jurnal"}
      </button>
      <p className="text-xs text-muted-foreground">
        Total debit harus sama dengan total kredit. Jurnal manual tercatat dengan sumber
        &ldquo;manual&rdquo; dan bisa dibatalkan lewat reversal.
      </p>
    </form>
  );
}
