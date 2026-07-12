import Link from "next/link";
import { Check, Pencil, X } from "lucide-react";

import { CreateButton, FormModal } from "@/components/admin/modal";
import { PageHeader } from "@/components/admin/page-header";
import { requireRole } from "@/lib/auth/access-control";
import { createClient } from "@/lib/supabase/server";

import { AccountForm } from "./account-form";
import { updateAccountName } from "./actions";

const TYPE_PREFIX: Record<string, number> = {
  asset: 1,
  liability: 2,
  equity: 3,
  income: 4,
  expense: 5,
};

/** Mirrors the server action's code generator so the form can preview the code. */
function nextCodeByType(codes: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [type, prefix] of Object.entries(TYPE_PREFIX)) {
    const max = codes
      .map(Number)
      .filter((code) => Number.isFinite(code) && Math.floor(code / 1000) === prefix)
      .reduce((acc, code) => Math.max(acc, code), prefix * 1000);
    result[type] = String(max + 10);
  }
  return result;
}

const TYPE_LABEL: Record<string, { label: string; badge: string }> = {
  asset: { label: "Aset", badge: "adm-badge-blue" },
  liability: { label: "Kewajiban", badge: "adm-badge-amber" },
  equity: { label: "Ekuitas", badge: "adm-badge-green" },
  income: { label: "Pendapatan", badge: "adm-badge-green" },
  expense: { label: "Beban", badge: "adm-badge-red" },
};

export default async function CoaPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; new?: string }>;
}) {
  await requireRole("owner");
  const { edit: editingCode, new: isCreating } = await searchParams;

  const supabase = await createClient();
  const { data: accounts } = await supabase
    .from("accounts")
    .select("code, name, type, normal_side, is_active")
    .order("code");

  return (
    <div>
      <PageHeader
        title="Chart of Accounts"
        subtitle="Akun bawaan dibuat otomatis — bisa ubah nama & tambah akun baru"
        actions={<CreateButton label="Tambah Akun" />}
      />

      {isCreating && (
        <FormModal
          title="Tambah Akun COA"
          subtitle="Kode akun dibuat otomatis dari tipe yang dipilih"
          closeHref="/admin/coa"
        >
          <AccountForm nextCodeByType={nextCodeByType((accounts ?? []).map((a) => a.code))} />
        </FormModal>
      )}

      <div className="adm-card p-5">
        <div className="overflow-x-auto">
          <table className="adm-table">
            <thead>
              <tr>
                <th className="w-24">Kode</th>
                <th>Nama Akun</th>
                <th>Tipe</th>
                <th>Posisi Normal</th>
                <th>Status</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {(accounts ?? []).map((account) => {
                const type = TYPE_LABEL[account.type] ?? TYPE_LABEL.asset;
                const isEditing = editingCode === account.code;
                return (
                  <tr key={account.code}>
                    <td className="font-bold">{account.code}</td>
                    <td>
                      {isEditing ? (
                        <form
                          action={updateAccountName.bind(null, account.code)}
                          className="flex max-w-sm items-center gap-2"
                        >
                          <input
                            name="name"
                            defaultValue={account.name}
                            required
                            minLength={2}
                            autoFocus
                            className="adm-input"
                            aria-label={`Nama baru untuk akun ${account.code}`}
                          />
                          <button
                            type="submit"
                            className="adm-btn adm-btn-primary adm-btn-sm"
                            title="Simpan nama"
                          >
                            <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />
                            Simpan
                          </button>
                          <Link
                            href="/admin/coa"
                            className="adm-btn adm-btn-outline adm-btn-sm"
                            title="Batal"
                          >
                            <X aria-hidden="true" className="size-3.5" strokeWidth={3} />
                          </Link>
                        </form>
                      ) : (
                        account.name
                      )}
                    </td>
                    <td>
                      <span className={`adm-badge ${type.badge}`}>{type.label}</span>
                    </td>
                    <td className="capitalize">{account.normal_side}</td>
                    <td>
                      <span
                        className={`adm-badge ${account.is_active ? "adm-badge-green" : "adm-badge-gray"}`}
                      >
                        {account.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="text-right">
                      {!isEditing && (
                        <Link
                          href={`?edit=${account.code}`}
                          className="adm-btn adm-btn-outline adm-btn-sm"
                          scroll={false}
                        >
                          <Pencil aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
                          Ubah Nama
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
