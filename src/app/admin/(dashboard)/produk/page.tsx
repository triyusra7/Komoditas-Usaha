import { PageHeader } from "@/components/admin/page-header";
import { formatRupiah } from "@/lib/accounting/period";
import { requireRole } from "@/lib/auth/access-control";
import { ContentService } from "@/lib/services/content-service";
import { createClient } from "@/lib/supabase/server";

import { createProduct, deleteProduct, togglePriceVisible, toggleProductPublic } from "./actions";

const AVAILABILITY_LABEL: Record<string, string> = {
  available: "Tersedia",
  preorder: "Pre-Order",
  sold_out: "Habis",
};

export default async function ProdukPage() {
  await requireRole("owner", "staff");

  const supabase = await createClient();
  const content = new ContentService(supabase);
  const [products, categories] = await Promise.all([
    content.listProducts(),
    content.listCategories(),
  ]);

  return (
    <div>
      <PageHeader title="Produk" subtitle="Katalog produk yang tampil di website publik" />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="adm-card p-5 xl:col-span-2">
          <div className="overflow-x-auto">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Jenis</th>
                  <th className="text-right">Harga</th>
                  <th>Harga Tampil</th>
                  <th>Ketersediaan</th>
                  <th>Publik</th>
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="max-w-48">
                      <p className="truncate font-semibold">{product.name}</p>
                      <p className="truncate text-xs text-[#8896ab]">/{product.slug}</p>
                    </td>
                    <td>{product.breed ?? "-"}</td>
                    <td className="adm-amount">
                      {product.price_numeric != null ? formatRupiah(product.price_numeric) : "-"}
                    </td>
                    <td>
                      <form action={togglePriceVisible.bind(null, product.id, !product.price_visible)}>
                        <button
                          type="submit"
                          className={`adm-badge ${product.price_visible ? "adm-badge-blue" : "adm-badge-gray"} cursor-pointer`}
                        >
                          {product.price_visible ? "Tampil" : "Sembunyi"}
                        </button>
                      </form>
                    </td>
                    <td>
                      <span className="adm-badge adm-badge-gray">
                        {AVAILABILITY_LABEL[product.availability] ?? product.availability}
                      </span>
                    </td>
                    <td>
                      <form action={toggleProductPublic.bind(null, product.id, !product.is_public)}>
                        <button
                          type="submit"
                          className={`adm-badge ${product.is_public ? "adm-badge-green" : "adm-badge-gray"} cursor-pointer`}
                        >
                          {product.is_public ? "Publik" : "Draft"}
                        </button>
                      </form>
                    </td>
                    <td className="text-right">
                      <form action={deleteProduct.bind(null, product.id)}>
                        <button type="submit" className="adm-btn adm-btn-danger adm-btn-sm">
                          Hapus
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-[#8896ab]">
                      Belum ada produk.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="adm-card h-fit p-5">
          <h3 className="mb-4 text-sm font-bold text-[#1e3f5c]">➕ Tambah Produk</h3>
          <form action={createProduct} className="space-y-4">
            <div>
              <label htmlFor="categoryId" className="adm-label">
                Kategori
              </label>
              <select id="categoryId" name="categoryId" required className="adm-input">
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="name" className="adm-label">
                Nama Produk
              </label>
              <input id="name" name="name" required placeholder="Karkas Babi Duroc" className="adm-input" />
            </div>
            <div>
              <label htmlFor="slug" className="adm-label">
                Slug
              </label>
              <input id="slug" name="slug" required placeholder="karkas-babi-duroc" className="adm-input" />
            </div>
            <div>
              <label htmlFor="breed" className="adm-label">
                Jenis/Breed
              </label>
              <input id="breed" name="breed" placeholder="Duroc" className="adm-input" />
            </div>
            <div>
              <label htmlFor="shortDesc" className="adm-label">
                Ringkasan (1 baris, untuk kartu)
              </label>
              <input id="shortDesc" name="shortDesc" className="adm-input" />
            </div>
            <div>
              <label htmlFor="description" className="adm-label">
                Deskripsi Lengkap
              </label>
              <textarea id="description" name="description" rows={3} className="adm-input" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="unit" className="adm-label">
                  Satuan
                </label>
                <input id="unit" name="unit" placeholder="kg" className="adm-input" />
              </div>
              <div>
                <label htmlFor="priceNumeric" className="adm-label">
                  Harga (Rp)
                </label>
                <input id="priceNumeric" name="priceNumeric" type="number" min={0} step="1" className="adm-input" />
              </div>
            </div>
            <div>
              <label htmlFor="availability" className="adm-label">
                Ketersediaan
              </label>
              <select id="availability" name="availability" defaultValue="available" className="adm-input">
                <option value="available">Tersedia</option>
                <option value="preorder">Pre-Order</option>
                <option value="sold_out">Habis</option>
              </select>
            </div>
            <button type="submit" className="adm-btn adm-btn-primary w-full justify-center">
              💾 Simpan Produk
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
