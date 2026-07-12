/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ImageIcon, Pencil } from "lucide-react";

import { CreateButton, FormModal } from "@/components/admin/modal";
import { PageHeader } from "@/components/admin/page-header";
import { formatRupiah } from "@/lib/accounting/period";
import { requireRole } from "@/lib/auth/access-control";
import { ContentService } from "@/lib/services/content-service";
import { createClient } from "@/lib/supabase/server";

import { createProduct, deleteProduct, togglePriceVisible, toggleProductPublic, updateProduct } from "./actions";
import { ProductForm, productImages } from "./product-form";

const AVAILABILITY_LABEL: Record<string, string> = {
  available: "Tersedia",
  preorder: "Pre-Order",
  sold_out: "Habis",
};

export default async function ProdukPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; edit?: string }>;
}) {
  await requireRole("owner", "staff");
  const { new: isCreating, edit: editId } = await searchParams;

  const supabase = await createClient();
  const content = new ContentService(supabase);
  const [products, categories] = await Promise.all([
    content.listProducts(),
    content.listCategories(),
  ]);

  const editingProduct = editId ? products.find((product) => product.id === editId) : undefined;

  return (
    <div>
      <PageHeader
        title="Produk"
        subtitle="Katalog produk yang tampil di website publik"
        actions={<CreateButton label="Tambah Produk" />}
      />

      {isCreating && (
        <FormModal
          title="Tambah Produk"
          subtitle="Produk baru untuk katalog website"
          closeHref="/admin/produk"
        >
          <ProductForm action={createProduct} categories={categories} submitLabel="Simpan Produk" />
        </FormModal>
      )}

      {editingProduct && (
        <FormModal
          title="Edit Produk"
          subtitle={`Mengubah "${editingProduct.name}" — perubahan langsung tampil di website`}
          closeHref="/admin/produk"
        >
          <ProductForm
            action={updateProduct.bind(null, editingProduct.id)}
            categories={categories}
            product={editingProduct}
            submitLabel="Simpan Perubahan"
          />
        </FormModal>
      )}

      <div className="adm-card p-5">
        <div className="overflow-x-auto">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Produk</th>
                <th>Jenis</th>
                <th className="text-right">Harga</th>
                <th>Harga Tampil</th>
                <th>Ketersediaan</th>
                <th>Publik</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const images = productImages(product);
                return (
                  <tr key={product.id}>
                    <td className="max-w-60">
                      <div className="flex items-center gap-3">
                        {images[0] ? (
                          <img
                            src={images[0]}
                            alt={product.name}
                            className="size-11 shrink-0 rounded-lg border-2 border-secondary object-cover"
                          />
                        ) : (
                          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-foreground/25 text-muted-foreground">
                            <ImageIcon aria-hidden="true" className="size-4" />
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{product.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            /{product.slug}
                            {images.length > 0 && ` · ${images.length} foto`}
                          </p>
                        </div>
                      </div>
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
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`?edit=${product.id}`}
                          scroll={false}
                          className="adm-btn adm-btn-outline adm-btn-sm"
                        >
                          <Pencil aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
                          Edit
                        </Link>
                        <form action={deleteProduct.bind(null, product.id)}>
                          <button type="submit" className="adm-btn adm-btn-danger adm-btn-sm">
                            Hapus
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    Belum ada produk. Klik &ldquo;Tambah Produk&rdquo; untuk mulai.
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
