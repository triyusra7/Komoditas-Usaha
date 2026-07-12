"use client";

import { useActionState, useState } from "react";

import { postTransaction } from "./actions";

const TYPE_LABEL: Record<string, string> = {
  sale: "Penjualan",
  purchase_feed: "Pembelian Pakan",
  purchase_livestock: "Pembelian Ternak/Bibit",
  purchase_medicine: "Pembelian Obat/Vaksin",
  purchase_asset: "Pembelian Aset/CAPEX",
  purchase_service: "Pembelian Jasa",
  investor_contribution: "Setoran Modal Investor",
  bank_loan: "Pinjaman Bank Masuk",
  loan_repayment: "Cicilan/Pembayaran Utang Bank",
  opex: "Biaya Operasional",
  depreciation: "Penyusutan Aset Tetap",
};

const CASH_TOGGLE_TYPES = new Set([
  "sale",
  "purchase_feed",
  "purchase_livestock",
  "purchase_medicine",
  "purchase_asset",
  "purchase_service",
  "opex",
]);

export function TransactionForm() {
  const [state, formAction, isPending] = useActionState(postTransaction, undefined);
  const [type, setType] = useState("sale");

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="type" className="adm-label">
          Jenis Transaksi
        </label>
        <select
          id="type"
          name="type"
          value={type}
          onChange={(event) => setType(event.target.value)}
          className="adm-input"
        >
          {Object.entries(TYPE_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

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
          placeholder="Contoh: Penjualan karkas ke katering IMIP"
          className="adm-input"
        />
      </div>

      {type !== "loan_repayment" && (
        <div>
          <label htmlFor="amount" className="adm-label">
            Nominal (Rp)
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            min={0}
            step="1"
            required
            className="adm-input"
          />
        </div>
      )}

      {type === "sale" && (
        <div>
          <label htmlFor="cogsAmount" className="adm-label">
            HPP (opsional, Rp)
          </label>
          <input
            id="cogsAmount"
            name="cogsAmount"
            type="number"
            min={0}
            step="1"
            className="adm-input"
          />
        </div>
      )}

      {type === "loan_repayment" && (
        <>
          <div>
            <label htmlFor="principalAmount" className="adm-label">
              Pokok (Rp)
            </label>
            <input
              id="principalAmount"
              name="principalAmount"
              type="number"
              min={0}
              step="1"
              className="adm-input"
            />
          </div>
          <div>
            <label htmlFor="interestAmount" className="adm-label">
              Bunga (Rp)
            </label>
            <input
              id="interestAmount"
              name="interestAmount"
              type="number"
              min={0}
              step="1"
              className="adm-input"
            />
          </div>
        </>
      )}

      {CASH_TOGGLE_TYPES.has(type) && (
        <label className="flex items-center gap-2 text-sm text-[#4a5568]">
          <input name="isCash" type="checkbox" className="size-4" defaultChecked />
          Tunai (hilangkan centang untuk piutang/utang usaha)
        </label>
      )}

      {state?.error && (
        <p className="rounded-lg bg-[#fdeaea] px-3 py-2 text-sm font-semibold text-[#c53030]">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={isPending} className="adm-btn adm-btn-primary w-full justify-center">
        {isPending ? "Memposting..." : "💾 Posting Transaksi"}
      </button>
      <p className="text-xs text-[#8896ab]">
        Jurnal double-entry dibuat otomatis. Anda tidak perlu memahami debit/kredit.
      </p>
    </form>
  );
}
