"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { ImageInput } from "@/components/admin/image-input";
import type { CommodityCategory, Product } from "@/lib/services/content-service";
import { MAX_PRODUCT_IMAGES, productImages } from "./product-helpers";

/**
 * Shared create/edit product form. When `product` is set the
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
  const defaultCatId = product?.category_id ?? (categories[0]?.id || "create_jagung_default");
  const [selectedCatId, setSelectedCatId] = useState<string>(defaultCatId);
  const [isCustomNew, setIsCustomNew] = useState<boolean>(false);

  return (
    <form action={action} className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="categoryId" className="adm-label mb-0">
            Kategori Komoditas
          </label>
          {!isCustomNew ? (
            <button
              type="button"
              onClick={() => setIsCustomNew(true)}
              className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1"
            >
              ➕ Ketik Kategori Baru
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsCustomNew(false)}
              className="text-xs text-muted-foreground hover:underline"
            >
              Batal / Pilih dari Daftar
            </button>
          )}
        </div>

        {!isCustomNew ? (
          <select
            id="categoryId"
            name="categoryId"
            required
            value={selectedCatId}
            onChange={(e) => {
              if (e.target.value === "custom_new") {
                setIsCustomNew(true);
              } else {
                setSelectedCatId(e.target.value);
              }
            }}
            className="adm-input"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
            <option value="custom_new">➕ Tambah Kategori Baru (Ketik Sendiri)...</option>
          </select>
        ) : (
          <div className="rounded-xl border-2 border-primary/30 bg-primary/10 p-3.5 space-y-3">
            <input type="hidden" name="categoryId" value="custom_new" />
            <p className="text-xs font-black uppercase tracking-wider text-secondary">
              ✨ Kategori Baru (Akan Otomatis Disimpan ke Database)
            </p>
            <div>
              <label htmlFor="newCategoryName" className="adm-label text-xs">
                Nama Kategori Komoditas Baru
              </label>
              <input
                id="newCategoryName"
                name="newCategoryName"
                required={isCustomNew}
                placeholder="Contoh: Jagung Pakan / Kakao / Kelapa / Beras"
                className="adm-input text-sm"
              />
            </div>
            <div>
              <label htmlFor="newCategorySlug" className="adm-label text-xs">
                Slug URL (Opsional, contoh: &apos;kakao&apos; untuk /katalog/kakao)
              </label>
              <input
                id="newCategorySlug"
                name="newCategorySlug"
                placeholder="Biarkan kosong untuk otomatisasi"
                className="adm-input text-sm"
              />
            </div>
          </div>
        )}
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
          placeholder="Jagung Pipil Kering Pakan Ternak"
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
          placeholder="jagung-pipil-kering"
          className="adm-input"
        />
      </div>
      <div>
        <label htmlFor="breed" className="adm-label">
          Jenis / Varietas / Grade
        </label>
        <input
          id="breed"
          name="breed"
          defaultValue={product?.breed ?? ""}
          placeholder="NK 212 / Arabika Grade 1"
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
