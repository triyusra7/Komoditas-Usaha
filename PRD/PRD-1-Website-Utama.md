# PRD — Website Utama (Company Profile + Catalog + Traceability Publik)

**Versi:** 2.0
**Nama proyek (usulan):** `tri-agri-web`
**Stack:** Next.js (App Router, TypeScript) + Tailwind CSS + shadcn/ui + Supabase (Postgres, Auth, Storage, RLS)
**Konteks:** Website publik untuk usaha komoditas (fokus rilis-1 = **Babi**; menyusul Kopi & Perikanan). Ini "wajah publik" dari sistem. Seluruh isinya **dibaca dari Supabase** yang diisi lewat Admin (lihat `PRD-2-Admin-CMS-ERP.md`). Website ini **read-only** ke database, kecuali submit form kontak.
**Prinsip inti:** Tidak ada konten yang di-hardcode. Owner mengubah semua isi dari Admin → langsung tampil di sini. Traceability tampil **langsung sebagai halaman publik** (tanpa QR di fase ini).

---

## 1. Keputusan Desain (Hasil Klarifikasi dengan Owner)

| Topik | Keputusan |
|---|---|
| Stack | **Next.js + Supabase.** Satu repo & satu database dibagi dengan Admin (PRD 2). Website = folder rute `(public)`, Admin = folder rute `(admin)`. Bukan dua sistem terpisah. |
| Sumber konten | **100% dari database** (Supabase), diisi via Admin. Tidak ada teks/produk/angka yang ditanam di kode. |
| Traceability | **Tampil publik langsung** lewat halaman web biasa (URL/link), **tanpa QR** di fase ini. Skema tetap menyisakan `public_slug` unik agar QR mudah ditambah nanti. |
| Kontrol privasi jejak | Per-event ada flag `is_public`. Info sensitif (mis. nama pemasok, harga beli) bisa disembunyikan owner dari publik. |
| Komoditas rilis-1 | **Babi saja** yang aktif. Kopi & Perikanan tampil sebagai kategori `coming_soon`. Struktur data multi-komoditas sejak awal. |
| Transaksi jual-beli | **Tidak ada e-commerce/keranjang/pembayaran online.** Pembeli menghubungi via WhatsApp/kontak. Website hanya katalog + lead capture. |
| Bahasa | UI **Bahasa Indonesia**. Kode, nama tabel/kolom, komentar teknis: **Inggris**. |
| Harga | Per-produk bisa dipilih tampil/sembunyi (`price_visible`). |
| Rendering | **SSR/ISR (revalidate)** agar isi selalu fresh tapi cepat. Bukan SPA client-only. |
| Perangkat | **Mobile-first** (dipakai pembeli & tim di lapangan lewat HP). |

Implikasi teknis dari keputusan ini ada di tiap bagian di bawah.

---

## 2. Model Konten & Data Website (Ringkas)

```
Owner/Staf input di Admin (PRD 2)
        │  (tulis)
        ▼
   Supabase (Postgres + Storage)  ──  RLS: publik hanya boleh baca is_public = true
        │  (baca via anon key)
        ▼
Website Next.js  ──  PublicDataService  ──  Halaman: Beranda / Tentang / Katalog / Detail Produk / Traceability / Kontak
        │
        ├─ Pengunjung lihat katalog & jejak produk
        └─ Pengunjung isi Form Kontak  ──►  insert ke tabel `leads`  ──►  owner follow-up di Admin
```

Inti: **satu arah data** (Admin menulis, Website membaca). Satu-satunya tulisan dari publik = submit `leads`. Semua filter "boleh publik atau tidak" ditegakkan **dua lapis**: di `PublicDataService` dan di RLS Supabase.

---

## 3. Struktur Halaman & Sitemap

| Route | Halaman | Sumber data | Rendering |
|---|---|---|---|
| `/` | Beranda (hero, ringkasan usaha, kategori, highlight produk, CTA) | `site_settings`, `page_contents('home')`, `commodity_categories`, `products` (featured) | ISR |
| `/tentang` | Tentang Kami (visi, model bisnis, lokasi Palopo & Morowali, statistik) | `page_contents('about')`, `content_blocks` | ISR |
| `/katalog` | Daftar semua kategori komoditas | `commodity_categories` | ISR |
| `/katalog/[categorySlug]` | Produk dalam satu kategori (mis. `/katalog/babi`) | `commodity_categories`, `products` | ISR |
| `/produk/[productSlug]` | Detail produk (foto, deskripsi, harga opsional, status, tombol WA, link jejak) | `products`, `trace_subjects` terkait | ISR + revalidate |
| `/jejak/[public_slug]` | **Halaman Traceability publik** (timeline perjalanan produk/batch) | `trace_subjects`, `trace_events` (is_public) | SSR/ISR |
| `/kontak` | Kontak + Form "Hubungi / Jadi Mitra" | `site_settings`, insert `leads` | SSR (form) |
| `/sitemap.xml`, `/robots.txt` | SEO teknis | generated | build/ISR |

Kategori `coming_soon` (Kopi, Perikanan) tetap muncul di `/katalog` sebagai kartu "Segera Hadir" tanpa halaman produk.

---

## 4. Master Data / Skema Data yang Dikonsumsi

> Website hanya **membaca** tabel-tabel ini. **Skema kanonik (source of truth) didefinisikan di PRD 2.** Di sini didaftar field yang dipakai website supaya jelas kontraknya. Field ditandai **(publik)** = ikut ditampilkan ke pengunjung.

### 4.1 `site_settings` (identitas & kontak — 1 baris)
| Field | Tipe | Keterangan |
|---|---|---|
| business_name | string | Nama usaha (mis. "Tri Agri") **(publik)** |
| logo_url | string | Logo dari Supabase Storage **(publik)** |
| tagline | string | Slogan singkat di hero **(publik)** |
| hero_text | text | Paragraf pembuka beranda **(publik)** |
| whatsapp_number | string | Nomor WA bisnis (untuk tombol "Pesan via WA") **(publik)** |
| email | string | Email kontak **(publik)** |
| address | string | Alamat/lokasi (Palopo & Morowali) **(publik)** |
| social_links | jsonb | IG/FB/TikTok dll **(publik)** |
| updated_at | timestamp | Untuk cache/revalidate |

### 4.2 `commodity_categories` (kategori komoditas)
| Field | Tipe | Keterangan |
|---|---|---|
| id | uuid | |
| slug | string | untuk URL, mis. `babi`, `kopi` **(publik)** |
| name | string | mis. "Babi", "Kopi", "Perikanan" **(publik)** |
| description | text | deskripsi singkat kategori **(publik)** |
| cover_image | string | gambar sampul kategori **(publik)** |
| status | enum | `active` \| `coming_soon` **(publik)** |
| is_public | boolean | jika false, tidak muncul sama sekali |
| sort | int | urutan tampil |

### 4.3 `products` (produk/menu yang dikatalogkan)
| Field | Tipe | Keterangan |
|---|---|---|
| id | uuid | |
| category_id | ref → commodity_categories | |
| slug | string | untuk URL **(publik)** |
| name | string | mis. "Karkas Babi Duroc", "Daging Babi Potongan Komersial" **(publik)** |
| short_desc | string | ringkasan 1 baris untuk kartu **(publik)** |
| description | text (rich) | deskripsi lengkap **(publik)** |
| breed | string | jenis (Duroc/Landrace/Crossbreed F1) — relevan babi **(publik)** |
| cover_image | string | foto sampul **(publik)** |
| gallery | jsonb (array url) | galeri foto **(publik)** |
| unit | string | satuan jual (kg, ekor, karkas) **(publik)** |
| price_numeric | numeric | harga acuan **(publik jika price_visible)** |
| price_visible | boolean | tampilkan harga ke publik atau tidak |
| availability | enum | `available` \| `preorder` \| `sold_out` **(publik)** |
| is_public | boolean | draft vs publik |
| sort | int | urutan |

### 4.4 `trace_subjects` (subjek jejak: 1 ekor / 1 batch babi; nanti 1 lot kopi)
| Field | Tipe | Keterangan |
|---|---|---|
| id | uuid | |
| public_slug | string (unik) | untuk URL `/jejak/[public_slug]` **(publik)** |
| code | string | kode internal, mis. "BABI-2026-014" **(publik)** |
| category_id | ref | Babi/Kopi/… **(publik)** |
| product_id | ref → products (nullable) | kaitan ke produk katalog **(publik)** |
| commodity_type | enum | `pig` \| `coffee` \| `fishery` — menentukan label timeline **(publik)** |
| title | string | judul jejak, mis. "Babi Duroc #014" **(publik)** |
| current_status | string | status terkini, mis. "Siap Potong" **(publik)** |
| is_public | boolean | jika false, halaman jejak 404 untuk publik |

### 4.5 `trace_events` (event bertahap per subjek — inti traceability)
| Field | Tipe | Keterangan |
|---|---|---|
| id | uuid | |
| subject_id | ref → trace_subjects | |
| event_type | enum | mis. `acquisition`, `transport`, `housing`, `growth`, `health`, `ready_slaughter` (babi); `harvest`, `processing`, `drying`, `packaging` (kopi) **(publik)** |
| title | string | judul tahap **(publik)** |
| description | text | penjelasan tahap **(publik)** |
| location | string | lokasi kejadian (mis. "Kandang Palopo") **(publik)** |
| happened_at | date/timestamp | tanggal kejadian — dipakai untuk urutan timeline **(publik)** |
| photo_url | string (nullable) | foto tahap **(publik)** |
| meta | jsonb | field bebas per tahap (lihat §6) **(sebagian publik)** |
| is_public | boolean | sembunyikan tahap/field sensitif dari publik |
| sort | int | urutan cadangan bila tanggal sama |

### 4.6 `page_contents` + `content_blocks` (isi halaman statis yang bisa diedit owner)
| Field | Tipe | Keterangan |
|---|---|---|
| page_contents.slug | string | `home`, `about` |
| content_blocks.page_id | ref | |
| content_blocks.type | enum | `heading` \| `richtext` \| `image` \| `gallery` \| `stat` \| `cta` **(publik)** |
| content_blocks.payload | jsonb | isi blok (teks/URL/angka) **(publik)** |
| content_blocks.sort | int | urutan blok |

### 4.7 `leads` (satu-satunya tulisan dari publik)
| Field | Tipe | Keterangan |
|---|---|---|
| id | uuid | |
| name | string | nama pengirim |
| contact | string | WA/email/telepon |
| message | text | isi pesan |
| interest | string (nullable) | minat (mis. kategori/produk yang dilihat) |
| source_page | string | halaman asal submit |
| created_at | timestamp | |

---

## 5. Alur per Halaman

### 5.1 Beranda `/`
1. Ambil `site_settings` → render hero (logo, business_name, tagline, hero_text, tombol CTA "Lihat Katalog" & "Hubungi via WA").
2. Ambil `page_contents('home')` + `content_blocks` (urut `sort`) → render section bebas yang diatur owner (mis. "Kenapa kami", statistik).
3. Ambil `commodity_categories` (is_public, urut `sort`) → grid kategori; badge "Segera Hadir" untuk `coming_soon`.
4. Ambil produk **featured** (mis. `products` is_public terbaru/pilihan) → grid highlight.
5. Footer: kontak + sosial dari `site_settings`.

### 5.2 Tentang `/tentang`
1. Render `page_contents('about')` dari blok konten (visi, model bisnis "beli & gemukkan weaner + breeding kecil", lokasi Palopo & Morowali, statistik).
2. Semua teks berasal dari DB (bukan hardcode) agar owner bisa ubah.

### 5.3 Katalog `/katalog` dan `/katalog/[categorySlug]`
1. `/katalog`: daftar kategori is_public. Klik kategori `active` → ke halaman produk kategori; kategori `coming_soon` tidak bisa diklik (atau tampil modal "segera hadir").
2. `/katalog/[categorySlug]`: validasi slug → jika kategori tak ada / not public → 404. Ambil `products` (category_id, is_public, urut `sort`) → grid kartu (cover_image, name, short_desc, breed, availability, harga jika price_visible).
3. Empty state: jika belum ada produk publik, tampilkan pesan ramah + tombol kontak.

### 5.4 Detail Produk `/produk/[productSlug]`
1. Validasi slug → jika tak ada / not public → 404.
2. Render: galeri foto, name, breed, unit, description (rich), availability, harga (jika price_visible; jika tidak → "Hubungi untuk harga").
3. Tombol **"Pesan via WhatsApp"** (prefilled text berisi nama produk) + tombol ke `/kontak`.
4. Jika ada `trace_subjects` terkait produk → tampilkan tombol/section **"Lihat Jejak Produk"** menuju `/jejak/[public_slug]`.
5. SEO: title, meta description, Open Graph pakai cover_image.

### 5.5 Kontak `/kontak`
1. Tampilkan info kontak (WA, email, alamat, jam) dari `site_settings`.
2. Form: `name` (wajib), `contact` (wajib), `message` (wajib), `interest` (opsional). Submit → `PublicDataService.submitLead()` → insert `leads` → tampilkan pesan sukses.
3. Anti-spam sederhana (honeypot field + rate limit dasar). Tidak butuh captcha di fase ini.

---

## 6. Halaman Traceability `/jejak/[public_slug]` (fitur pembeda utama — detail)

Ini nilai jual utama. Buat sekredibel & sejelas mungkin.

**Alur render:**
1. Ambil `trace_subjects` by `public_slug`. Jika tidak ada atau `is_public=false` → 404.
2. Header jejak: `title`, `code`, kategori, `current_status`, foto sampul, link balik ke produk terkait.
3. Ambil `trace_events` (subject_id, `is_public=true`, urut `happened_at` menaik lalu `sort`).
4. Render **timeline vertikal**: tiap event = kartu berisi ikon `event_type`, `title`, `happened_at` (format `dd MMM yyyy`), `location`, `description`, `photo_url`, dan field terpilih dari `meta`.

**Pola event untuk Babi (`commodity_type = pig`):**
| event_type | Field `meta` yang ditampilkan (jika is_public) |
|---|---|
| `acquisition` (Akuisisi Bibit) | pemasok*, lokasi asal, umur saat beli, tanggal lahir, jenis (breed), harga beli* |
| `transport` (Transportasi) | moda (mis. pickup), asal → tujuan, lama perjalanan (jam) |
| `housing` (Penempatan Kandang) | lokasi kandang (Palopo/Morowali), tanggal masuk, kondisi |
| `growth` (Pertumbuhan) | bobot (kg), umur, catatan pakan |
| `health` (Kesehatan) | vaksin/obat, tanggal |
| `ready_slaughter` (Siap Potong/Karkas) | umur, bobot potong, rendemen karkas (%), tanggal |

*) field bertanda bintang = sensitif; default `is_public=false` (disembunyikan) — owner bisa buka bila mau.

**Pola event untuk Kopi (`commodity_type = coffee`) — fase berikutnya, skema sudah siap:**
| event_type | Field `meta` |
|---|---|
| `sourcing` (Asal) | petani/kebun, lokasi, cara beli (petani langsung/tengkulak/pasar) |
| `harvest` (Panen) | tanggal, varietas (Arabika Toraja/Wamena) |
| `transport` (Perjalanan) | lama perjalanan ke tempat olah |
| `processing` (Pengolahan) | metode (mis. full wash), lama proses |
| `drying` (Pengeringan) | metode, lama, kadar air target |
| `packaging` (Green Bean) | tanggal jadi green bean, estimasi daya simpan |

Karena `meta` bertipe `jsonb`, penambahan komoditas baru **tidak butuh perubahan skema** — hanya konfigurasi label di frontend.

**Empty/edge state:** subjek tanpa event publik → tampilkan "Data jejak sedang dilengkapi".

---

## 7. Komponen & Modul Frontend

| Modul | Peran | Interface ringkas |
|---|---|---|
| **`PublicDataService`** (deep module) | Satu-satunya pintu baca data publik. Semua filter `is_public`/`price_visible` diberlakukan di sini + RLS. Mengembalikan tipe domain, bukan baris mentah. | `getSiteSettings()`, `getCategories()`, `getProductsByCategory(slug)`, `getProductBySlug(slug)`, `getFeaturedProducts()`, `getTraceBySlug(public_slug)`, `getPageContent(slug)`, `submitLead(payload)` |
| `CategoryGrid` / `ProductGrid` / `ProductCard` | Tampilan katalog | props data terstruktur |
| `ProductDetail` | Halaman detail + tombol WA | |
| `TraceabilityTimeline` (deep module UI) | Render timeline agnostik komoditas dari array event ternormalisasi | `<TraceabilityTimeline subject={...} events={Event[]} commodityType={...} />` |
| `ContentBlocks` | Render blok CMS (heading/richtext/image/gallery/stat/cta) | `<ContentBlocks blocks={Block[]} />` |
| `LeadForm` | Form kontak → `submitLead` | validasi + honeypot |
| `WhatsAppButton` | Tombol WA dengan pesan prefilled | `href = https://wa.me/<no>?text=...` |
| `seo` helper | Metadata per halaman (title, description, OG) | `buildMetadata({...})` |

---

## 8. SEO & Non-Functional Requirements

- **SEO:** title + meta description + Open Graph per halaman produk & jejak; `sitemap.xml` & `robots.txt` otomatis; URL rapi (slug).
- **Performa:** `next/image` untuk semua gambar; ISR `revalidate` (mis. 60–300 dtk) agar cepat & fresh; target Lighthouse ≥ 90 (mobile).
- **Keamanan:** publik hanya `anon key`; RLS mengunci baca ke `is_public=true`; tidak ada operasi tulis publik selain insert `leads`; validasi input form.
- **Aksesibilitas:** kontras WCAG AA, `alt` pada gambar, fokus keyboard, struktur heading benar.
- **Responsif:** mobile-first; uji di layar HP.
- **Uang:** format Rupiah `Intl.NumberFormat('id-ID')`.
- **Multi-komoditas:** skema & routing siap Babi/Kopi/Perikanan sejak awal; UI rilis-1 menonjolkan Babi.
- **Bahasa:** UI Indonesia; kode/skema Inggris.

---

## 9. Design System (Usulan Awal — bisa disesuaikan)

- **Nuansa:** bersih, natural, terpercaya (tema agribisnis premium). Warna dasar hijau/earth-tone + aksen hangat; hindari kesan "template murah".
- **Tipografi:** 1 font display untuk judul + 1 font sans untuk body (mis. Inter). Ukuran & spacing konsisten (skala Tailwind).
- **Komponen:** pakai shadcn/ui (Card, Button, Badge, Dialog) agar konsisten & cepat.
- **Foto asli wajib** (kandang, babi, lokasi) — bukan stok — untuk kredibilitas.
- Konsisten satu tema; jangan campur banyak gaya.

---

## 10. Asumsi & Hal Terbuka (Perlu Dikonfirmasi Owner)

1. **Domain & branding:** nama usaha final + logo + nomor WA bisnis belum dikunci — dibutuhkan untuk `site_settings`.
2. **Harga publik:** default banyak produk `price_visible=false` ("Hubungi untuk harga")? Owner tentukan per produk.
3. **Field jejak sensitif:** default sembunyikan nama pemasok & harga beli dari publik. Konfirmasi bila ingin ditampilkan.
4. **Pemesanan:** fase ini via WA saja (tanpa cart/checkout). Kalau nanti butuh transaksi online, itu scope terpisah.
5. **Bahasa:** hanya Indonesia (belum ada i18n Inggris).
6. **Konten awal Tentang/Beranda:** perlu materi asli owner (foto + teks) agar tidak kosong saat rilis.
7. **QR code:** belum di fase ini; `public_slug` sudah disiapkan untuk mengaktifkannya nanti tanpa migrasi.

---

## 11. Definition of Done

- [ ] Website & Admin berbagi **satu repo + satu Supabase**; rute publik terpisah dari rute admin
- [ ] Semua konten (settings, halaman, kategori, produk, jejak) **ditarik dari DB**, bukan hardcode
- [ ] Beranda menampilkan hero, kategori, highlight produk, dan CTA dari data
- [ ] Halaman Tentang render dari blok konten yang bisa diedit owner
- [ ] `/katalog` menampilkan kategori (Babi `active`, Kopi/Perikanan `coming_soon`)
- [ ] `/katalog/babi` menampilkan produk babi is_public; empty state ada
- [ ] Detail produk menampilkan foto/galeri, deskripsi, harga (hormati `price_visible`), tombol WA, dan link jejak bila ada
- [ ] `/jejak/[public_slug]` menampilkan timeline urut `happened_at`; event `is_public=false` tidak muncul; field sensitif tersembunyi sesuai flag
- [ ] Form Kontak menyimpan ke `leads` dan muncul di Admin; validasi & honeypot aktif
- [ ] RLS diverifikasi: data non-publik & harga tersembunyi tidak pernah bocor ke publik
- [ ] SEO dasar (title/description/OG), `sitemap.xml`, `robots.txt` aktif; gambar via `next/image`
- [ ] Responsif mobile + kontras WCAG AA lulus cek dasar
- [ ] Terpasang & bisa dibuka (deploy Vercel), isi bisa diubah owner tanpa ngoding

---

### Lampiran
- `PRD-2-Admin-CMS-ERP.md` — spesifikasi Admin (CMS + ERP/akuntansi), **source of truth skema data**.
- `README-Arsitektur-dan-Langkah.md` — rekomendasi arsitektur, keputusan database, urutan langkah.
- Referensi model bisnis: halaman Notion "Rencana Bisnis Peternakan Babi — Palopo & Morowali". Contoh usaha sejenis: ccfarmbali.com.
