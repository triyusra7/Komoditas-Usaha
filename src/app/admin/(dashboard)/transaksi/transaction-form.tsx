"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { postTransaction } from "./actions";

const TYPE_LABEL: Record<string, string> = {
  sale: "Penjualan",
  purchase_feed: "Pembelian Pakan",
  purchase_livestock: "Pembelian Ternak/Bibit",
  purchase_medicine: "Pembelian Obat",
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
      <div className="space-y-2">
        <Label htmlFor="type">Jenis Transaksi</Label>
        <Select
          name="type"
          value={type}
          onValueChange={(value) => setType(value ?? "sale")}
        >
          <SelectTrigger id="type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(TYPE_LABEL).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="entryDate">Tanggal</Label>
        <Input id="entryDate" name="entryDate" type="date" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="memo">Keterangan</Label>
        <Input id="memo" name="memo" required placeholder="Penjualan karkas ke katering IMIP" />
      </div>

      {type !== "loan_repayment" && (
        <div className="space-y-2">
          <Label htmlFor="amount">Nominal (Rp)</Label>
          <Input id="amount" name="amount" type="number" min={0} step="1" required />
        </div>
      )}

      {type === "sale" && (
        <div className="space-y-2">
          <Label htmlFor="cogsAmount">HPP (opsional, Rp)</Label>
          <Input id="cogsAmount" name="cogsAmount" type="number" min={0} step="1" />
        </div>
      )}

      {type === "loan_repayment" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="principalAmount">Pokok (Rp)</Label>
            <Input id="principalAmount" name="principalAmount" type="number" min={0} step="1" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interestAmount">Bunga (Rp)</Label>
            <Input id="interestAmount" name="interestAmount" type="number" min={0} step="1" />
          </div>
        </>
      )}

      {CASH_TOGGLE_TYPES.has(type) && (
        <div className="flex items-center gap-2">
          <input id="isCash" name="isCash" type="checkbox" className="size-4" defaultChecked />
          <Label htmlFor="isCash">Tunai (uncheck untuk piutang/utang usaha)</Label>
        </div>
      )}

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Memposting..." : "Posting Transaksi"}
      </Button>
    </form>
  );
}
