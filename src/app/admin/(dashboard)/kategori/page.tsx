import { PageHeader } from "@/components/admin/page-header";
import { requireRole } from "@/lib/auth/access-control";
import { ContentService } from "@/lib/services/content-service";
import { createClient } from "@/lib/supabase/server";

import {
  createCategory,
  deleteCategory,
  toggleCategoryPublic,
  toggleCategoryStatus,
} from "./actions";

const COMMODITY_LABEL: Record<string, string> = {
  pig: "🐖 Babi",
  coffee: "☕ Kopi",
  fishery: "🐟 Perikanan",
};

export default async function KategoriPage() {
  await requireRole("owner", "staff");

  const supabase = await createClient();
  const content = new ContentService(supabase);
  const categories = await content.listCategories();

  return (
    <div>
      <PageHeader
        title="Kategori Komoditas"
        subtitle="Kategori yang tampil di katalog website publik"
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="adm-card p-5 xl:col-span-2">
          <div className="overflow-x-auto">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Slug</th>
                  <th>Jenis</th>
                  <th>Status</th>
                  <th>Publik</th>
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="font-semibold">{category.name}</td>
                    <td className="text-[#8896ab]">/{category.slug}</td>
                    <td>{COMMODITY_LABEL[category.commodity_type] ?? category.commodity_type}</td>
                    <td>
                      <form
                        action={toggleCategoryStatus.bind(
                          null,
                          category.id,
                          category.status === "active" ? "coming_soon" : "active",
                        )}
                      >
                        <button
                          type="submit"
                          className={`adm-badge ${category.status === "active" ? "adm-badge-green" : "adm-badge-amber"} cursor-pointer`}
                          title="Klik untuk ganti status"
                        >
                          {category.status === "active" ? "Aktif" : "Segera Hadir"}
                        </button>
                      </form>
                    </td>
                    <td>
                      <form action={toggleCategoryPublic.bind(null, category.id, !category.is_public)}>
                        <button
                          type="submit"
                          className={`adm-badge ${category.is_public ? "adm-badge-blue" : "adm-badge-gray"} cursor-pointer`}
                          title="Klik untuk toggle publik/draft"
                        >
                          {category.is_public ? "Publik" : "Draft"}
                        </button>
                      </form>
                    </td>
                    <td className="text-right">
                      <form action={deleteCategory.bind(null, category.id)}>
                        <button type="submit" className="adm-btn adm-btn-danger adm-btn-sm">
                          Hapus
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#8896ab]">
                      Belum ada kategori.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="adm-card h-fit p-5">
          <h3 className="mb-4 text-sm font-bold text-[#1e3f5c]">➕ Tambah Kategori</h3>
          <form action={createCategory} className="space-y-4">
            <div>
              <label htmlFor="name" className="adm-label">
                Nama
              </label>
              <input id="name" name="name" required placeholder="Babi" className="adm-input" />
            </div>
            <div>
              <label htmlFor="slug" className="adm-label">
                Slug (untuk URL)
              </label>
              <input id="slug" name="slug" required placeholder="babi" className="adm-input" />
            </div>
            <div>
              <label htmlFor="commodityType" className="adm-label">
                Jenis Komoditas
              </label>
              <select id="commodityType" name="commodityType" defaultValue="pig" className="adm-input">
                <option value="pig">🐖 Babi</option>
                <option value="coffee">☕ Kopi</option>
                <option value="fishery">🐟 Perikanan</option>
              </select>
            </div>
            <div>
              <label htmlFor="description" className="adm-label">
                Deskripsi
              </label>
              <textarea id="description" name="description" rows={3} className="adm-input" />
            </div>
            <button type="submit" className="adm-btn adm-btn-primary w-full justify-center">
              💾 Simpan Kategori
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
