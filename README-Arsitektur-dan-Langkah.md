# README — Rekomendasi Arsitektur & Urutan Langkah

Dokumen ini menjawab pertanyaan inti Anda: **CMS/ERP dan website utama dibuat terpisah atau sekaligus?**, **butuh database atau tidak?**, dan **apa yang sebaiknya dilakukan lebih dulu?**

---

## 1. Rekomendasi Utama: Bangun SATU sistem, dua "wajah" — bukan dua proyek terpisah

**Rekomendasi:** Buat **satu codebase (satu repo Next.js) + satu database (satu project Supabase)**, yang di dalamnya ada dua bagian:

- **Bagian publik** (`(public)`) = website utama / company profile / katalog / traceability publik → **PRD 1**.
- **Bagian admin** (`(admin)`) = CMS + ERP/akuntansi → **PRD 2**.

Kenapa bukan dua sistem terpisah?

- **Datanya sama.** Produk, kategori, dan traceability yang Anda input di admin adalah persis yang tampil di website. Kalau dipisah jadi dua database/sistem, Anda harus sinkronisasi manual — sumber bug dan kerja dobel.
- **Justru itu inti keinginan Anda:** "ganti di admin → langsung berubah di website." Itu paling mudah kalau keduanya berbagi satu database.
- **Lebih murah & lebih cepat** untuk vibe coding: satu deploy (Vercel), satu Supabase, satu auth.
- **Tetap dapat dua PRD.** Anda tetap punya dua dokumen (PRD 1 & PRD 2) untuk dikerjakan bertahap — pemisahan ada di level *modul & folder*, bukan di level *sistem/server*.

> Ringkas: **dua PRD, satu sistem.** Bukan dua website yang berdiri sendiri.

**Kapan pertimbangkan pisah?** Hanya nanti kalau website publik butuh skala trafik sangat besar atau tim berbeda — belum relevan di tahap ini.

---

## 2. Butuh database? Ya — pakai Supabase

Ya, Anda **butuh database**, dan **Supabase adalah pilihan tepat** (Anda sudah bisa membuatnya).

Alasan:

- Traceability, produk, transaksi, dan jurnal semuanya data relasional yang saling terhubung → butuh Postgres (yang dipakai Supabase).
- Supabase sekaligus memberi **Auth** (login owner/staf/investor), **Storage** (foto produk & traceability), dan **Row Level Security** (menegakkan siapa boleh lihat/ubah apa) — jadi Anda tak perlu merakit ini sendiri.
- Ada tier gratis yang cukup untuk mulai.

Yang **tidak** perlu sekarang: bikin backend server sendiri, ORM rumit, atau microservices. Next.js (Server Actions/Route Handlers) + Supabase sudah cukup.

---

## 3. Prinsip yang membuat sistem ini "bisa Anda kontrol sendiri"

- **Tidak ada konten yang di-hardcode di kode.** Semua teks, produk, foto, angka → dari database, diisi lewat Admin. Jadi Anda ubah sendiri tanpa ngoding.
- **Jurnal otomatis.** Anda input transaksi biasa (beli/jual/modal masuk); sistem yang membuat jurnal double-entry dan menyusun Laba/Rugi, Neraca, Arus Kas. Anda tidak perlu paham debit-kredit.
- **Satu skema data dipakai bersama** oleh website & admin — tidak ada duplikasi.

---

## 4. Urutan langkah yang disarankan (roadmap vibe coding)

Kerjakan bertahap. Jangan bangun semua sekaligus. Fokus **Babi dulu**.

**Fase 0 — Persiapan (sebelum ngoding)**
1. Buat project Supabase (catat URL & anon/service key).
2. Buat repo baru; scaffold Next.js (App Router, TypeScript) + Tailwind + shadcn/ui.
3. Siapkan `.env` untuk kunci Supabase. Hubungkan ke Vercel untuk deploy awal (biar cepat lihat hasil).

**Fase 1 — Fondasi data (paling penting duluan)**
4. Definisikan **skema database** untuk: profiles/roles, CMS (settings, pages, categories, products, media, leads), traceability (subjects + events), akuntansi (accounts/COA, journal_entries, journal_lines, transactions, investors, bank_loans, fixed_assets). Buat lewat migration Supabase.
5. Aktifkan **RLS** + policy per peran (owner/staff/investor). Ini fondasi keamanan — jangan ditunda.
6. Seed **Chart of Accounts** default + (opsional) data awal dari business plan.

**Fase 2 — Admin dulu, baru publik** *(karena website butuh data dari admin)*
7. Bangun **Auth + peran** (login, undang user, guard).
8. Bangun **CMS** (kelola settings, kategori, produk, media). (PRD 2 bagian B)
9. Bangun **Traceability** input (subjek + events, toggle publik). (PRD 2 bagian C)
10. Bangun **modul Akuntansi**: `LedgerService` + `PostingRules` + transaksi → jurnal otomatis. **Tulis test di sini** (area paling rawan). (PRD 2 bagian D)
11. Bangun **Laporan keuangan** (L/R, Neraca, Arus Kas, dashboard). (PRD 2 bagian E)

**Fase 3 — Website publik**
12. Bangun `PublicDataService` (read-only, hormati `is_public`).
13. Bangun halaman: Beranda, Tentang, Katalog Babi, Detail Produk, **Traceability publik**, Kontak (form → leads). (PRD 1)

**Fase 4 — Rilis & iterasi**
14. Isi konten asli lewat Admin, uji end-to-end, deploy.
15. Setelah stabil, baru tambah **Kopi** (kategori + pola traceability olah/green bean) lalu Perikanan.

---

## 5. Hal-hal baik yang sebaiknya Anda lakukan lebih dulu (di luar teknis)

Sesuai poin 9 permintaan Anda — saran non-koding yang penting:

1. **Kunci identitas & aset dasar** dulu: nama brand/usaha, logo, nomor WA bisnis, email, dan **foto asli** (kandang, babi, lokasi). Website bagus butuh foto nyata, bukan stok.
2. **Tentukan apa yang boleh publik vs rahasia** di traceability. Anda pilih "tampilkan publik", tapi putuskan mis. apakah **nama pemasok/harga beli** disembunyikan (default: sembunyikan info harga & pemasok sensitif).
3. **Siapkan daftar produk awal** yang benar-benar dijual (mis. karkas/kg, potongan komersial) beserta harga acuan — biar katalog tidak kosong saat rilis.
4. **Standarkan cara Anda mencatat** sejak awal: satuan (kg, ekor), lokasi (Palopo/Morowali), tahap event babi (Akuisisi → Transportasi → Kandang → Pertumbuhan → Siap Potong). Konsistensi input = data & laporan rapi.
5. **Rapikan angka keuangan awal** dari business plan (modal Rp 200 jt investor + Rp 300 jt bank, CAPEX Rp 280,8 jt, dst.) untuk jadi **saldo awal** di sistem — supaya Neraca benar sejak hari pertama.
6. **Verifikasi lapangan** yang diminta business plan (harga pakan, pembeli Morowali, pasokan weaner) — ini memengaruhi angka yang nanti Anda catat.
7. **Domain**: beli domain (mis. `.co.id` atau `.com`) lebih awal agar bisa dipakai saat deploy.
8. **Backup & akses**: catat kredensial Supabase/Vercel/domain di tempat aman; tentukan siapa staf yang akan input data.

---

## 6. Ringkasan keputusan

| Pertanyaan | Keputusan |
|---|---|
| Website & CMS/ERP dibuat terpisah atau sekaligus? | **Satu sistem (satu repo + satu DB), dua bagian.** Tetap **dua PRD** untuk pengerjaan bertahap. |
| Butuh database? | **Ya — Supabase** (Postgres + Auth + Storage + RLS). |
| Stack | **Next.js (TypeScript) + Tailwind + shadcn/ui + Supabase.** |
| Kerjakan duluan? | **Skema DB → Admin (CMS, Traceability, Akuntansi) → Website publik.** Fokus **Babi** dulu. |
| Modul paling rawan (wajib di-test) | **`LedgerService` + `PostingRules`** (akuntansi double-entry). |
| Traceability | **Tampil publik langsung** (tanpa QR dulu), data diinput di admin, per-event bisa disembunyikan. |
| Peran user | **Owner (penuh), Staf (operasional), Investor (read-only laporan).** |

---

### Lampiran: file terkait
- `PRD-1-Website-Utama.md` — spesifikasi website publik.
- `PRD-2-Admin-CMS-ERP.md` — spesifikasi admin (CMS + ERP/akuntansi).
- Referensi model bisnis: halaman Notion "Rencana Bisnis Peternakan Babi — Palopo & Morowali".
