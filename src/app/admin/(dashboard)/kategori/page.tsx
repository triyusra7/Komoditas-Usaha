import Link from "next/link";

import { CreateButton, FormModal } from "@/components/admin/modal";
import { PageHeader } from "@/components/admin/page-header";
import { requireRole } from "@/lib/auth/access-control";
import { ContentService } from "@/lib/services/content-service";
import { createClient } from "@/lib/supabase/server";

import {
  createCategory,
  deleteCategory,
  toggleCategoryPublic,
  toggleCategoryStatus,
  updateCategory,
} from "./actions";

const COMMODITY_LABEL: Record<string, string> = {
  pig: "🌽 Jagung Pakan",
  coffee: "☕ Kopi",
  fishery: "🌾 Pertanian Lainnya",
};

export default async function KategoriPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; edit?: string }>;
}) {
  await requireRole("owner", "staff");
  const { new: isCreating, edit: editId } = await searchParams;

  const supabase = await createClient();
  const content = new ContentService(supabase);
  const categories = await content.listCategories();
  const editingCategory = editId ? categories.find((c) => c.id === editId) : null;

  return (
    <div>
      <PageHeader
        title="Kategori Komoditas"
        subtitle="Kategori yang tampil di katalog website publik"
        actions={<CreateButton label="Tambah Kategori" />}
      />

      {isCreating && (
        <FormModal
          title="Tambah Kategori"
          subtitle="Kategori baru untuk katalog website"
          closeHref="/admin/kategori"
        >
          <form action={createCategory} className="space-y-4">
            <div>
              <label htmlFor="name" className="adm-label">
                Nama
              </label>
              <input id="name" name="name" required placeholder="Jagung Pakan" className="adm-input" />
            </div>
            <div>
              <label htmlFor="slug" className="adm-label">
                Slug (untuk URL)
              </label>
              <input id="slug" name="slug" required placeholder="jagung" className="adm-input" />
            </div>
            <div>
              <label htmlFor="commodityType" className="adm-label">
                Jenis Komoditas
              </label>
              <select id="commodityType" name="commodityType" defaultValue="pig" className="adm-input">
                <option value="pig">🌽 Jagung Pakan</option>
                <option value="coffee">☕ Kopi</option>
                <option value="fishery">🌾 Pertanian Lainnya</option>
              </select>
            </div>
            <div>
              <label htmlFor="description" className="adm-label">
                Deskripsi
              </label>
              <textarea id="description" name="description" rows={3} className="adm-input" />
            </div>
            <button type="submit" className="adm-btn adm-btn-primary w-full justify-center">
              Simpan Kategori
            </button>
          </form>
        </FormModal>
      )}

      {editingCategory && (
        <FormModal
          title="Edit Kategori"
          subtitle={`Ubah nama, slug, atau deskripsi ${editingCategory.name}`}
          closeHref="/admin/kategori"
        >
          <form action={updateCategory} className="space-y-4">
            <input type="hidden" name="id" value={editingCategory.id} />
            <div>
              <label htmlFor="edit-name" className="adm-label">
                Nama Kategori
              </label>
              <input
                id="edit-name"
                name="name"
                required
                defaultValue={editingCategory.name}
                className="adm-input"
              />
            </div>
            <div>
              <label htmlFor="edit-slug" className="adm-label">
                Slug (untuk URL website)
              </label>
              <input
                id="edit-slug"
                name="slug"
                required
                defaultValue={editingCategory.slug}
                className="adm-input"
              />
            </div>
            <div>
              <label htmlFor="edit-commodityType" className="adm-label">
                Jenis Komoditas
              </label>
              <select
                id="edit-commodityType"
                name="commodityType"
                defaultValue={editingCategory.commodity_type}
                className="adm-input"
              >
                <option value="pig">🌽 Jagung Pakan</option>
                <option value="coffee">☕ Kopi</option>
                <option value="fishery">🌾 Pertanian Lainnya</option>
              </select>
            </div>
            <div>
              <label htmlFor="edit-description" className="adm-label">
                Deskripsi
              </label>
              <textarea
                id="edit-description"
                name="description"
                rows={3}
                defaultValue={editingCategory.description ?? ""}
                className="adm-input"
              />
            </div>
            <button type="submit" className="adm-btn adm-btn-primary w-full justify-center">
              Simpan Perubahan
            </button>
          </form>
        </FormModal>
      )}

      <div className="adm-card p-5">
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
                  <td className="text-muted-foreground">/{category.slug}</td>
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
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/kategori?edit=${category.id}`}
                        className="adm-btn adm-btn-secondary adm-btn-sm"
                      >
                        Edit
                      </Link>
                      <form action={deleteCategory.bind(null, category.id)}>
                        <button type="submit" className="adm-btn adm-btn-danger adm-btn-sm">
                          Hapus
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    Belum ada kategori. Klik &ldquo;Tambah Kategori&rdquo; untuk mulai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
