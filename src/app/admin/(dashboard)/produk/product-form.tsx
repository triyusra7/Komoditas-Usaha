/* eslint-disable @next/next/no-img-element */
import { ImageInput } from "@/components/admin/image-input";
import type { CommodityCategory, Product } from "@/lib/services/content-service";

export const MAX_PRODUCT_IMAGES = 4;

/** Cover first, then gallery — the exact order the actions persist. */
export function productImages(product: Product): string[] {
  const gallery = Array.isArray(product.gallery)
    ? product.gallery.filter((item): item is string => typeof item === "string")
    : [];
  return [product.cover_image, ...gallery].filter((url): url is string => !!url);
}

/**
 * Shared create/edit product form (server-rendered). When `product` is set the
 * fields are prefilled and existing photos can be unchecked to remove them.
 */
export function ProductForm({
  action,
  categories,
  product,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  categories: CommodityCategory[];
  product?: Product;
  submitLabel: string;
}) {
  const existingImages = product ? productImages(product) : [];

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="categoryId" className="adm-label">
          Kategori
        </label>
        <select
          id="categoryId"
          name="categoryId"
          required
          defaultValue={product?.category_id}
          className="adm-input"
        >
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
        <input
          id="name"
          name="name"
          required
          defaultValue={product?.name}
          placeholder="Karkas Babi Duroc"
          className="adm-input"
        />
      </div>
      <div>
        <label htmlFor="slug" className="adm-label">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          required
          defaultValue={product?.slug}
          placeholder="karkas-babi-duroc"
          className="adm-input"
        />
      </div>
      <div>
        <label htmlFor="breed" className="adm-label">
          Jenis/Breed
        </label>
        <input
          id="breed"
          name="breed"
          defaultValue={product?.breed ?? ""}
          placeholder="Duroc"
          className="adm-input"
        />
      </div>
      <div>
        <label htmlFor="shortDesc" className="adm-label">
          Ringkasan (1 baris, untuk kartu)
        </label>
        <input
          id="shortDesc"
          name="shortDesc"
          defaultValue={product?.short_desc ?? ""}
          className="adm-input"
        />
      </div>
      <div>
        <label htmlFor="description" className="adm-label">
          Deskripsi Lengkap
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={product?.description ?? ""}
          className="adm-input"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="unit" className="adm-label">
            Satuan
          </label>
          <input
            id="unit"
            name="unit"
            defaultValue={product?.unit ?? ""}
            placeholder="kg"
            className="adm-input"
          />
        </div>
        <div>
          <label htmlFor="priceNumeric" className="adm-label">
            Harga (Rp)
          </label>
          <input
            id="priceNumeric"
            name="priceNumeric"
            type="number"
            min={0}
            step="1"
            defaultValue={product?.price_numeric ?? ""}
            className="adm-input"
          />
        </div>
      </div>
      <div>
        <label htmlFor="availability" className="adm-label">
          Ketersediaan
        </label>
        <select
          id="availability"
          name="availability"
          defaultValue={product?.availability ?? "available"}
          className="adm-input"
        >
          <option value="available">Tersedia</option>
          <option value="preorder">Pre-Order</option>
          <option value="sold_out">Habis</option>
        </select>
      </div>

      <div className="rounded-xl border-2 border-foreground/15 p-3">
        <p className="adm-label">Foto Produk (maks. {MAX_PRODUCT_IMAGES})</p>
        {existingImages.length > 0 && (
          <div className="mb-3 grid grid-cols-4 gap-2">
            {existingImages.map((url, index) => (
              <label key={url} className="group relative block cursor-pointer">
                <img
                  src={url}
                  alt={`Foto produk ${index + 1}`}
                  className="aspect-square w-full rounded-lg border-2 border-secondary object-cover"
                />
                <span className="absolute top-1 right-1 flex items-center gap-1 rounded-full border border-secondary bg-background/90 px-1.5 py-0.5 text-[10px] font-bold">
                  <input
                    type="checkbox"
                    name="keepImages"
                    value={url}
                    defaultChecked
                    className="size-3"
                  />
                  pakai
                </span>
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-secondary">
                    sampul
                  </span>
                )}
              </label>
            ))}
          </div>
        )}
        <ImageInput
          name="photos"
          max={MAX_PRODUCT_IMAGES}
          helpText={
            existingImages.length > 0
              ? `Hilangkan centang "pakai" untuk menghapus foto lama. Total foto (lama + baru) maksimal ${MAX_PRODUCT_IMAGES}. Foto pertama menjadi sampul.`
              : `Maksimal ${MAX_PRODUCT_IMAGES} foto, JPG/PNG/WebP ≤ 3 MB. Foto pertama menjadi sampul.`
          }
        />
      </div>

      <button type="submit" className="adm-btn adm-btn-primary w-full justify-center">
        {submitLabel}
      </button>
    </form>
  );
}
