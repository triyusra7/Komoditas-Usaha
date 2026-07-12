import { PageHeader } from "@/components/admin/page-header";
import { requireRole } from "@/lib/auth/access-control";
import { createClient } from "@/lib/supabase/server";

const TYPE_LABEL: Record<string, { label: string; badge: string }> = {
  asset: { label: "Aset", badge: "adm-badge-blue" },
  liability: { label: "Kewajiban", badge: "adm-badge-amber" },
  equity: { label: "Ekuitas", badge: "adm-badge-green" },
  income: { label: "Pendapatan", badge: "adm-badge-green" },
  expense: { label: "Beban", badge: "adm-badge-red" },
};

export default async function CoaPage() {
  await requireRole("owner");

  const supabase = await createClient();
  const { data: accounts } = await supabase
    .from("accounts")
    .select("code, name, type, normal_side, is_active")
    .order("code");

  return (
    <div>
      <PageHeader
        title="Chart of Accounts"
        subtitle="Daftar akun perkiraan — dipakai mesin jurnal otomatis"
      />

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
              </tr>
            </thead>
            <tbody>
              {(accounts ?? []).map((account) => {
                const type = TYPE_LABEL[account.type] ?? TYPE_LABEL.asset;
                return (
                  <tr key={account.code}>
                    <td className="font-bold">{account.code}</td>
                    <td>{account.name}</td>
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
