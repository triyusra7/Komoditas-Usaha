# PRD 1 — Website Utama (Company Profile + Catalog + Traceability Publik)

> **Nama proyek (usulan):** `tri-agri-web` — website publik untuk usaha komoditas (babi dulu, lalu kopi & perikanan).
> **Stack:** Next.js (App Router, TypeScript) + Tailwind CSS + Supabase (Postgres, Auth, Storage).
> **Cara pakai:** File ini dipakai untuk *vibe coding* di Claude Code. Baca juga `PRD-2-Admin-CMS-ERP.md` dan `README-Arsitektur-dan-Langkah.md` — keduanya berbagi satu database Supabase yang sama.
> **Status data:** Konten & angka di website ini TIDAK di-hardcode. Semua ditarik dari Supabase yang diisi lewat Admin (lihat PRD 2).

---

## Problem Statement

Sebagai pemilik usaha komoditas (mulai dari peternakan babi di Palopo & Morowali, lalu kopi Toraja/Wamena dan perikanan), saya belum punya wajah publik yang bisa saya tunjukkan ke calon pembeli, mitra, dan investor. Saya butuh satu tempat online yang:

- Menjelaskan siapa usaha saya dan apa saja yang dijual (katalog).
- Membuktikan kualitas & kepercayaan lewat **traceability** — pembeli bisa melihat perjalanan lengkap tiap produk, dari asal bibit sampai siap potong/olah.
- Bisa saya ubah isinya sendiri kapan saja tanpa ngoding (isi diatur dari Admin/CMS, bukan dari kode).

Tanpa ini, saya kesulitan meyakinkan pembeli premium (mis. katering IMIP Morowali, pengepul Toraja) dan investor bahwa usaha saya kredibel dan tertelusur.

## Solution

Sebuah **website publik** berbasis Next.js yang membaca datanya dari Supabase. Website ini menampilkan company profile, katalog komoditas per kategori, dan halaman traceability publik untuk setiap batch/ekor produk. Semua isi — teks profil, produk, foto, dan data jejak — dikelola dari sistem Admin (PRD 2) dan langsung tampil di sini. Fokus rilis pertama hanya **komoditas Babi**; struktur dibuat multi-komoditas agar Kopi & Perikanan tinggal ditambah nanti tanpa merombak.

Traceability ditampilkan **langsung sebagai halaman web publik** (tanpa QR untuk sekarang) — pembeli membuka halaman produk/batch dan melihat timeline jejaknya.

---

## User Stories

**Pengunjung umum (calon pembeli / mitra / investor)**

1. Sebagai pengunjung, saya ingin melihat halaman beranda yang menjelaskan usaha secara singkat, agar saya cepat paham ini usaha apa.
2. Sebagai pengunjung, saya ingin melihat halaman "Tentang Kami" (visi, model bisnis, lokasi Palopo & Morowali), agar saya percaya usaha ini serius.
3. Sebagai pengunjung, saya ingin melihat daftar kategori komoditas (Babi aktif; Kopi & Perikanan "segera hadir"), agar saya tahu arah usaha ke depan.
4. Sebagai pengunjung, saya ingin membuka katalog Babi dan melihat produk yang tersedia (mis. karkas/daging, jenis Duroc/Landrace/crossbreed), agar saya tahu apa yang bisa dibeli.
5. Sebagai pengunjung, saya ingin melihat detail satu produk (foto, deskripsi, bobot/estimasi, status ketersediaan, harga bila ditampilkan), agar saya bisa menilai sebelum menghubungi.
6. Sebagai pengunjung, saya ingin melihat halaman **traceability** sebuah produk/batch: asal bibit, dari siapa & lokasi mana, umur & tanggal lahir, moda & lama perjalanan ke kandang, lokasi kandang, tumbuh sampai umur berapa, dan status siap potong/karkas — agar saya yakin produknya berkualitas dan tertelusur.
7. Sebagai pengunjung, saya ingin timeline traceability tampil urut dan mudah dibaca (per tahap dengan tanggal), agar saya paham perjalanannya sekilas.
8. Sebagai pengunjung, saya ingin nanti (fase kopi) melihat jejak kopi: kebun/petani asal, cara olah (mis. full wash), lama proses jadi green bean, dan estimasi daya simpan — agar saya percaya pada kualitas kopi.
9. Sebagai pengunjung, saya ingin halaman kontak (WhatsApp, email, lokasi, jam), agar saya bisa memesan atau bertanya.
10. Sebagai pengunjung, saya ingin membuka website dengan nyaman di HP, agar mudah dilihat di lapangan.
11. Sebagai pengunjung, saya ingin website terbuka cepat dan tampil profesional, agar kesan usaha kredibel.
12. Sebagai pengunjung berbahasa Indonesia, saya ingin seluruh isi berbahasa Indonesia, agar mudah dipahami.
13. Sebagai calon investor, saya ingin melihat halaman/ bagian yang menonjolkan traksi & keunggulan (opsional, konten diatur owner), agar saya tertarik.
14. Sebagai pengunjung, saya ingin bisa mengisi form "Hubungi/Jadi Mitra" (nama, kontak, pesan), agar saya bisa menyatakan minat dan owner menerima leadnya.

**Owner (dari sisi konsumsi data — pengelolaannya ada di PRD 2)**

15. Sebagai owner, saya ingin setiap perubahan yang saya buat di Admin langsung tampil di website publik, agar saya tak perlu ngoding untuk update.
16. Sebagai owner, saya ingin bisa menyembunyikan/menampilkan produk & kategori, agar hanya yang siap yang publik.
17. Sebagai owner, saya ingin memilih apakah harga ditampilkan publik atau disembunyikan per produk, agar fleksibel terhadap strategi harga.
18. Sebagai owner, saya ingin memilih data jejak mana yang boleh publik (mis. sembunyikan nama pemasok bila sensitif), agar privasi bisnis terjaga.

**Sistem / non-fungsional**

19. Sebagai sistem, halaman traceability publik hanya menampilkan record yang ditandai `is_public = true`, agar data internal tidak bocor.
20. Sebagai sistem, saya ingin SEO dasar (title, meta description, Open Graph) per halaman produk & traceability, agar mudah dibagikan dan ditemukan.
21. Sebagai sistem, gambar dioptimalkan (next/image) dan disimpan di Supabase Storage, agar cepat & hemat.
22. Sebagai sistem, halaman katalog & traceability menggunakan rendering yang selalu menampilkan data terbaru (SSR/ISR dengan revalidate), agar isi tidak basi.

## Implementation Decisions

**Arsitektur ringkas**

- Website publik = bagian `(public)` dari **satu** aplikasi Next.js. Admin (PRD 2) = bagian `(admin)` di aplikasi yang sama, satu repo, satu database Supabase. (Alasan & alternatif dijelaskan di `README-Arsitektur-dan-Langkah.md`.)
- Website publik hanya melakukan **read** ke Supabase memakai `anon key` + Row Level Security (RLS) yang hanya mengizinkan baca baris `is_public/published = true`. Tidak ada tulis dari sisi publik kecuali submit form kontak (insert ke tabel `leads`).
- Rendering: gunakan Server Components + `revalidate` (ISR) agar konten selalu fresh tapi tetap cepat. Halaman yang sangat dinamis boleh SSR penuh.

**Modul yang dibangun (frontend publik)**

- `PublicDataService` (deep module) — satu-satunya pintu baca data publik dari Supabase. Interface stabil: `getSiteSettings()`, `getCategories()`, `getProducts({categorySlug})`, `getProductBySlug(slug)`, `getTraceabilityByProduct(productId)`, `getTraceabilityBySlug(public_slug)`, `getPageContent(slug)`, `submitLead(payload)`. Mengembalikan tipe domain (bukan baris mentah). Semua filter `is_public` diberlakukan di sini + di RLS (dua lapis).
- `content-blocks` — komponen render blok CMS (heading, rich text, gambar, galeri, statistik) agar halaman "Tentang/Beranda" bisa disusun dari data.
- `catalog` — daftar kategori & grid produk, halaman detail produk.
- `traceability-timeline` (deep module UI) — menerima list "tahap jejak" ternormalisasi dan merender timeline urut waktu, agnostik komoditas (babi sekarang, kopi/ikan nanti). Interface: `<TraceabilityTimeline stages={Stage[]} commodityType={...} />`.
- `lead-form` — form kontak/mitra → insert `leads`.
- `seo` — helper metadata per halaman.

**Kontrak data (dikonsumsi; sumber kebenaran skema ada di PRD 2)**

- `site_settings`: nama usaha, logo, kontak, teks hero, sosial.
- `commodity_categories`: `id, slug, name, description, status(active|coming_soon), is_public, sort`.
- `products`: `id, category_id, slug, name, description, cover_image, price_numeric, price_visible(bool), status, is_public, ...`.
- `trace_subjects` + `trace_events`: satu "subjek jejak" (mis. 1 ekor/1 batch) punya banyak event bertahap (`event_type, title, description, location, happened_at, meta jsonb, is_public`). Setiap subjek punya `public_slug` unik. Struktur generik agar muat pola babi & kopi. (Skema kanonik didefinisikan di PRD 2.)
- `page_contents` / `content_blocks`: isi halaman statis yang bisa diedit owner.
- `leads`: submission form kontak.

**Keputusan teknis lain**

- Bahasa UI: Indonesia. Kode, nama tabel/kolom, komentar teknis: Inggris.
- Uang ditampilkan format Rupiah (`Intl.NumberFormat('id-ID')`).
- Tidak ada QR code untuk sekarang (traceability diakses via halaman/link biasa). Skema tetap menyisakan `public_slug` unik per subjek jejak agar QR mudah ditambah nanti.
- Multi-komoditas sejak awal di level skema; UI rilis-1 hanya menonjolkan Babi.

## Testing Decisions

**Prinsip:** uji **perilaku eksternal**, bukan detail implementasi. Fokus pada apa yang dilihat pengunjung dan aturan visibilitas data.

- **`PublicDataService`** — unit test dengan Supabase test/local: pastikan produk/record dengan `is_public=false` TIDAK pernah ikut terambil; harga tidak muncul saat `price_visible=false`; kategori `coming_soon` tetap tampil tapi tanpa produk. Ini modul paling kritikal untuk diuji.
- **`traceability-timeline`** — component test: diberi array events acak-urutan, harus render urut `happened_at` menaik; event `is_public=false` tidak dirender.
- **`lead-form`** — test submit valid → memanggil `submitLead` sekali; validasi field wajib.
- **E2E ringan (Playwright)** — alur: buka beranda → kategori Babi → detail produk → halaman traceability tampil timeline. Cukup 1–2 happy path.
- **Yang TIDAK diuji berlebihan:** styling/pixel, layout internal komponen, isi teks CMS (itu data, bukan logika).

## Out of Scope (PRD ini)

- Semua fungsi pengelolaan/editing data, upload, dan akuntansi → ada di **PRD 2**.
- E-commerce / keranjang / pembayaran online (pemesanan lewat kontak WA dulu).
- Multi-bahasa (i18n) — hanya Indonesia dulu.
- QR code, akun pembeli, notifikasi, blog/berita (bisa jadi enhancement).
- Kopi & Perikanan sebagai konten aktif (struktur siap, konten menyusul).

## Further Notes

- Rilis pertama = **Babi saja**. Prioritaskan: Beranda, Tentang, Katalog Babi, Detail Produk, Traceability, Kontak.
- Halaman traceability adalah pembeda utama (nilai jual + kepercayaan) — buat sejelas dan sekredibel mungkin (tanggal, lokasi, foto tiap tahap).
- Konten awal bisa diambil dari ringkasan business plan (model bisnis, lokasi, jenis babi) tapi harus tetap berasal dari DB agar bisa diedit owner.
- Referensi contoh usaha sejenis dari business plan: ccfarmbali.com.
