"use client";

import { useActionState, useState } from "react";

import { createAccount } from "./actions";

const TYPE_OPTIONS = [
  { value: "asset", label: "Aset", normal: "debit" },
  { value: "liability", label: "Kewajiban", normal: "credit" },
  { value: "equity", label: "Ekuitas", normal: "credit" },
  { value: "income", label: "Pendapatan", normal: "credit" },
  { value: "expense", label: "Beban", normal: "debit" },
] as const;

type AccountType = (typeof TYPE_OPTIONS)[number]["value"];

/**
 * Arobi-style COA form: code is assigned automatically from the chosen type;
 * normal side follows the type but can be overridden (e.g. contra accounts
 * like Akumulasi Penyusutan: asset with credit normal side).
 */
export function AccountForm({ nextCodeByType }: { nextCodeByType: Record<string, string> }) {
  const [state, formAction, isPending] = useActionState(createAccount, undefined);
  const [type, setType] = useState<AccountType>("asset");
  const [normalSide, setNormalSide] = useState<"debit" | "credit">("debit");

  function handleTypeChange(value: AccountType) {
    setType(value);
    setNormalSide(TYPE_OPTIONS.find((option) => option.value === value)?.normal ?? "debit");
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="acc-code" className="adm-label">
            Kode Akun
          </label>
          <input
            id="acc-code"
            value={nextCodeByType[type] ?? "otomatis"}
            readOnly
            className="adm-input bg-muted text-muted-foreground"
            title="Kode dibuat otomatis oleh sistem"
          />
          <p className="mt-1 text-xs text-muted-foreground">Otomatis dari tipe akun</p>
        </div>
        <div>
          <label htmlFor="acc-type" className="adm-label">
            Tipe
          </label>
          <select
            id="acc-type"
            name="type"
            value={type}
            onChange={(event) => handleTypeChange(event.target.value as AccountType)}
            className="adm-input"
          >
            {TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="acc-name" className="adm-label">
          Nama Akun
        </label>
        <input
          id="acc-name"
          name="name"
          required
          minLength={2}
          placeholder="mis. Beban Listrik Kandang"
          className="adm-input"
        />
      </div>

      <div>
        <p className="adm-label">Posisi Normal</p>
        <div className="inline-flex overflow-hidden rounded-full border-2 border-secondary">
          {(["debit", "credit"] as const).map((side) => (
            <button
              key={side}
              type="button"
              onClick={() => setNormalSide(side)}
              className={`px-6 py-2 text-xs font-extrabold uppercase transition-colors ${
                normalSide === side
                  ? "bg-primary text-secondary"
                  : "bg-background text-muted-foreground hover:bg-muted"
              } ${side === "credit" ? "border-l-2 border-secondary" : ""}`}
            >
              {side === "debit" ? "Debit" : "Kredit"}
            </button>
          ))}
        </div>
        <input type="hidden" name="normalSide" value={normalSide} />
        <p className="mt-1 text-xs text-muted-foreground">
          Mengikuti tipe akun; ubah hanya untuk akun kontra (mis. akumulasi penyusutan).
        </p>
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground/80">
        <input name="isActive" type="checkbox" className="size-4" defaultChecked />
        Akun aktif (bisa dipakai di jurnal)
      </label>

      {state?.error && (
        <p className="rounded-lg bg-[#fbeeec] px-3 py-2 text-sm font-semibold text-[#a3352c]">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="adm-btn adm-btn-primary w-full justify-center disabled:opacity-50"
      >
        {isPending ? "Menyimpan..." : "Simpan Akun"}
      </button>
    </form>
  );
}
