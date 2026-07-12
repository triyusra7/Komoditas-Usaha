# PRD 2 — Sistem Admin: CMS + ERP (Konten, Traceability, Akuntansi Otomatis)

> **Nama proyek (usulan):** bagian `(admin)` dari repo yang sama dengan `PRD-1` — satu Next.js app, satu Supabase.
> **Stack:** Next.js (App Router, TypeScript) + Tailwind + shadcn/ui + Supabase (Postgres, Auth, Storage, RLS).
> **Cara pakai:** File ini untuk *vibe coding* di Claude Code. Ini "otak" dari sistem — website publik (PRD 1) hanya membaca data yang dikelola di sini.
> **Prinsip akuntansi:** semua transaksi memakai **double-entry** (debit = kredit). Jurnal dibuat OTOMATIS dari aksi bisnis (pembelian, penjualan, setoran investor, dll). Owner cukup input transaksi biasa; jurnal jadi sendiri.

---

## Problem Statement

Sebagai owner, saya butuh satu tempat untuk **mengendalikan semua data** usaha saya tanpa ngoding:

1. **Konten website** — saya ingin mengubah teks, produk, foto, dan info di website publik (PRD 1) kapan saja, sendiri.
2. **Traceability** — saya ingin mencatat pergerakan tiap komoditas: babi (beli bibit dari siapa, di mana, umur/lahir kapan, dibawa pakai apa & berapa lama, lokasi kandang, tumbuh sampai umur berapa, siap potong/karkas), lalu kopi (petani/kebun asal, cara olah, lama proses jadi green bean, daya simpan). Catatan ini yang tampil di website.
3. **Keuangan** — saya ingin mencatat pembelian, penjualan, modal masuk (investor/bank), dan biaya; lalu **otomatis** terbentuk jurnal, sehingga saya bisa melihat **Laba/Rugi, Neraca, dan Arus Kas** yang lengkap. Setidaknya pencatatan akuntansi dasar, agar saya tahu untung/rugi usaha saya secara real.

Saat ini semua masih di kepala/Excel terpisah, tidak terhubung ke website, dan tidak otomatis jadi laporan keuangan.

## Solution

Sebuah **Admin Panel** (login-protected) di dalam aplikasi Next.js yang sama, dengan tiga pilar:

- **CMS** — kelola site settings, halaman, kategori komoditas, produk, media. Perubahan langsung tercermin di website publik.
- **Traceability** — form input event bertahap per subjek jejak (1 ekor / 1 batch babi; nanti 1 lot kopi), generik lintas komoditas, dengan kontrol `is_public` per event.
- **ERP/Akuntansi (basic)** — modul transaksi (pembelian, penjualan, setoran modal, biaya, pembayaran utang bank) yang **otomatis menghasilkan jurnal double-entry** ke buku besar, lalu menyusun **Laba/Rugi, Neraca, Arus Kas, Buku Besar, dan ringkasan rasio**.

Akses berjenjang: **Owner** (penuh), **Staf** (input operasional & traceability, tidak lihat laporan sensitif), **Investor** (read-only laporan keuangan). Rilis pertama fokus **komoditas Babi**.

---

## User Stories

### A. Autentikasi & Peran

1. Sebagai owner, saya ingin login aman ke Admin, agar hanya saya & tim yang bisa mengubah data.
2. Sebagai owner, saya ingin mengundang user dan memberi peran (Owner/Staf/Investor), agar akses sesuai tugas.
3. Sebagai staf, saya ingin hanya bisa mengakses menu operasional & traceability, agar saya tidak sengaja mengubah keuangan.
4. Sebagai investor, saya ingin login dan hanya melihat laporan keuangan (read-only), agar saya bisa memantau tanpa bisa mengubah apa pun.
5. Sebagai sistem, saya ingin RLS Supabase menegakkan batasan peran di level database, agar aman meski API disalahgunakan.

### B. CMS — Kelola Konten Website

6. Sebagai owner, saya ingin mengedit site settings (nama usaha, logo, kontak WA/email, teks hero, sosial), agar identitas website akurat.
7. Sebagai owner, saya ingin membuat/mengubah halaman (Beranda, Tentang) dari blok konten (teks, gambar, galeri, statistik), agar bisa saya susun sendiri.
8. Sebagai owner, saya ingin CRUD kategori komoditas (Babi active; Kopi/Perikanan coming_soon) termasuk urutan tampil, agar arah usaha terlihat.
9. Sebagai owner, saya ingin CRUD produk (nama, deskripsi, kategori, foto sampul, galeri, harga, harga tampil/sembunyi, status, publik/draft), agar katalog terkelola.
10. Sebagai owner, saya ingin upload & mengelola media (foto) ke Supabase Storage, agar dipakai di produk & traceability.
11. Sebagai owner, saya ingin toggle `is_public` pada kategori/produk/halaman, agar hanya yang siap yang tampil di website.
12. Sebagai owner, saya ingin melihat daftar `leads` dari form kontak website, agar saya bisa follow up pembeli/mitra.

### C. Traceability — Catat Pergerakan Komoditas

13. Sebagai owner/staf, saya ingin membuat "subjek jejak" (mis. 1 ekor babi / 1 batch weaner) dengan kode unik & jenis babi (Duroc/Landrace/crossbreed), agar bisa saya lacak.
14. Sebagai staf, saya ingin mencatat event **Akuisisi Bibit**: pemasok (nama, lokasi), tanggal beli, harga, umur saat beli, tanggal lahir, jenis — agar asal-usul tercatat.
15. Sebagai staf, saya ingin mencatat event **Transportasi**: moda (mis. pickup), asal→tujuan, lama perjalanan, tanggal — agar perjalanan tercatat.
16. Sebagai staf, saya ingin mencatat event **Penempatan Kandang**: lokasi kandang (Palopo/Morowali), tanggal masuk, kondisi — agar posisi tercatat.
17. Sebagai staf, saya ingin mencatat event **Pertumbuhan/Kesehatan** (bobot, umur, vaksin/obat, pakan) bertanggal, agar riwayat pemeliharaan lengkap.
18. Sebagai staf, saya ingin mencatat event **Siap Potong / Karkas** (umur, bobot, tanggal, rendemen), agar status akhir jelas.
19. Sebagai owner, saya ingin setiap event punya toggle `is_public`, agar saya bisa menyembunyikan info sensitif (mis. nama pemasok) dari publik.
20. Sebagai owner, saya ingin struktur event yang fleksibel (field `meta` bebas), agar pola **kopi** (kebun/petani asal, metode olah spt full wash, lama proses jadi green bean, daya simpan) bisa dipakai tanpa ubah skema.
21. Sebagai owner, saya ingin mengaitkan subjek jejak ke produk katalog, agar halaman produk publik bisa menampilkan jejaknya.
22. Sebagai owner, saya ingin melihat semua subjek jejak dalam daftar yang bisa difilter (per kategori/lokasi/status), agar mudah dikelola saat jumlahnya banyak.

### D. ERP / Akuntansi — Transaksi & Jurnal Otomatis

23. Sebagai owner, saya ingin mencatat **Setoran Modal Investor** (nominal, tanggal, nama investor, % kepemilikan) dan sistem otomatis menjurnal (Debit Kas / Kredit Modal Investor), agar ekuitas tercatat benar.
24. Sebagai owner, saya ingin mencatat **Pinjaman Bank** masuk dan otomatis terjurnal (Debit Kas / Kredit Utang Bank), agar kewajiban tercatat.
25. Sebagai owner, saya ingin mencatat **Pembelian** (bibit, pakan, obat, aset/CAPEX, jasa) dengan kategori, dan otomatis terjurnal ke akun yang tepat (Debit Persediaan/Beban/Aset Tetap / Kredit Kas atau Utang Usaha), agar pengeluaran akurat.
26. Sebagai owner, saya ingin mencatat **Penjualan** (produk, qty/kg, harga, tunai/piutang) dan otomatis terjurnal (Debit Kas/Piutang, Kredit Pendapatan; plus HPP bila dilacak), agar pendapatan & laba akurat.
27. Sebagai owner, saya ingin mencatat **Pembayaran biaya operasional** (listrik, gaji, transport, sewa) dan otomatis terjurnal ke beban terkait, agar OPEX terpantau.
28. Sebagai owner, saya ingin mencatat **Cicilan/Pembayaran Utang Bank** yang otomatis memisahkan pokok (kurangi Utang Bank) dan bunga (Beban Bunga), agar utang & beban benar.
29. Sebagai owner, saya ingin mencatat **penyusutan aset tetap** (bisa manual/periodik) yang terjurnal (Debit Beban Penyusutan / Kredit Akumulasi Penyusutan), agar laba mencerminkan biaya aset.
30. Sebagai owner, saya ingin setiap jurnal otomatis selalu **balance (total debit = total kredit)** dan sistem menolak yang tidak balance, agar pembukuan valid.
31. Sebagai owner, saya ingin bisa melihat & (bila perlu) membuat **jurnal manual/penyesuaian** untuk kasus khusus, agar fleksibel.
32. Sebagai owner, saya ingin bisa mengoreksi transaksi lewat **reversal/void** (bukan hapus diam-diam) sehingga jejak audit tetap ada, agar data terpercaya.
33. Sebagai owner, saya ingin **Chart of Accounts (COA)** default yang sudah cocok untuk peternakan (Kas, Bank, Piutang, Persediaan Ternak, Pakan, Aset Tetap, Akumulasi Penyusutan, Utang Bank, Utang Usaha, Modal Investor, Modal Pemilik, Pendapatan, HPP, Beban Pakan, Beban Operasional, Beban Bunga, Beban Penyusutan), agar tidak mulai dari nol.

### E. Laporan Keuangan

34. Sebagai owner, saya ingin melihat **Laba/Rugi** untuk periode pilihan (bulan/tahun), agar tahu untung/rugi.
35. Sebagai owner, saya ingin melihat **Neraca** per tanggal (Aset = Kewajiban + Ekuitas), agar tahu posisi keuangan.
36. Sebagai owner, saya ingin melihat **Arus Kas** (operasi/investasi/pendanaan, minimal metode langsung dari mutasi kas), agar tahu uang masuk-keluar.
37. Sebagai owner, saya ingin melihat **Buku Besar & Neraca Saldo (Trial Balance)** per akun, agar bisa menelusuri angka.
38. Sebagai owner, saya ingin dashboard ringkas (kas saat ini, pendapatan & laba bulan ini, utang tersisa, jumlah babi/ekor aktif), agar cepat lihat kondisi.
39. Sebagai owner, saya ingin ekspor laporan ke Excel/PDF/CSV, agar bisa dipakai untuk bank/investor.
40. Sebagai investor, saya ingin melihat L/R, Neraca, Arus Kas, dan rasio (marjin, ROE, DER, DSCR) read-only, agar bisa menilai kinerja (sesuai business plan).
41. Sebagai owner, saya ingin semua angka laporan berasal dari jurnal (bukan diketik ulang), agar konsisten dan otomatis.

### F. Non-fungsional

42. Sebagai sistem, semua nilai uang disimpan sebagai integer minor unit / `numeric` (hindari float), agar tidak ada error pembulatan.
43. Sebagai sistem, setiap perubahan penting punya `created_by`, `created_at`, dan audit trail, agar tertelusur.
44. Sebagai sistem, Admin responsif (bisa dipakai di HP staf di kandang), agar input lapangan mudah.
45. Sebagai sistem, data multi-komoditas & multi-lokasi didukung sejak awal di skema meski UI menonjolkan Babi/Palopo–Morowali dulu.

## Implementation Decisions

**Arsitektur**

- Satu repo, satu Next.js app: rute `(public)` (PRD 1) + `(admin)`. Satu Supabase project (Postgres + Auth + Storage). Alternatif "dua sistem terpisah" ditolak — lihat `README-Arsitektur-dan-Langkah.md`.
- **Server Actions / Route Handlers** untuk semua mutasi Admin memakai Supabase dengan session user (bukan service key di client). RLS aktif di semua tabel.
- Peran disimpan di tabel `profiles.role` (`owner|staff|investor`); RLS & guard UI mengacu ke sini.

**Modul inti (deep modules — diuji terpisah)**

- **`LedgerService`** — jantung akuntansi. Interface stabil & sempit:
  `postTransaction(input): JournalEntry` (menerima transaksi bisnis, menghasilkan journal entry berisi ≥2 lines yang balance), `reverseEntry(entryId)`, `getTrialBalance(asOf)`, `getAccountBalance(accountId, range)`. Aturan invarian: total debit = total kredit; menolak posting tak-balance; tidak pernah menghapus, hanya reversal. Ini modul PALING kritikal.
- **`PostingRules`** — memetakan *jenis transaksi bisnis* → *baris jurnal*. Mis. `SALE` → Debit Kas/Piutang, Kredit Pendapatan (+ opsi HPP/Persediaan). `PURCHASE_FEED` → Debit Beban/Persediaan Pakan, Kredit Kas/Utang. `INVESTOR_CONTRIBUTION`, `BANK_LOAN`, `LOAN_REPAYMENT` (split pokok/bunga), `DEPRECIATION`, `OPEX`. Tabel/aturan ini yang membuat "jurnal otomatis". Terpisah dari `LedgerService` agar aturan bisa berubah tanpa menyentuh mesin buku besar.
- **`FinancialStatements`** — menyusun L/R, Neraca, Arus Kas dari saldo akun + klasifikasi COA. Interface: `incomeStatement(range)`, `balanceSheet(asOf)`, `cashFlow(range)`, `ratios(range)`.
- **`TraceabilityService`** — CRUD subjek jejak + events; enforce `is_public`; query untuk publik (dipakai PRD 1). Generic terhadap `commodity_type`.
- **`ContentService`** — CRUD site settings, pages/blocks, categories, products, media.
- **`AccessControl`** — resolusi peran + helper guard (dipakai UI & server actions), selaras dengan RLS.

**Skema data (garis besar — sumber kebenaran untuk kedua PRD)**

- `profiles(user_id, name, role, ...)`
- CMS: `site_settings`, `page_contents`, `content_blocks`, `commodity_categories`, `products`, `media_assets`, `leads`
- Traceability: `trace_subjects(id, code, public_slug, category_id, product_id, commodity_type, current_status, is_public)`, `trace_events(id, subject_id, event_type, title, description, location, happened_at, meta jsonb, is_public, created_by)`
- Akuntansi:
  - `accounts` (COA: `code, name, type[asset|liability|equity|income|expense], normal_side, parent_id`)
  - `journal_entries(id, entry_date, memo, source_type, source_id, status[posted|void], created_by)`
  - `journal_lines(id, entry_id, account_id, debit numeric, credit numeric)`
  - `transactions` (lapisan bisnis ramah-user: `type, date, counterparty, amount, meta`) yang memicu `PostingRules` → membuat `journal_entries`.
  - Master pendukung: `investors`, `bank_loans`, `fixed_assets` (untuk penyusutan), `suppliers`, `customers`.
- **Invarian DB:** trigger/check memastikan `SUM(debit)=SUM(credit)` per `journal_entry`. Uang pakai `numeric(18,2)`.

**Keputusan lain**

- Rilis-1: fokus Babi & lokasi Palopo/Morowali; COA & posting rules disiapkan untuk itu, tapi generic.
- Bahasa UI Indonesia; nama akun boleh Indonesia; kode/tabel/kolom Inggris.
- Ekspor: mulai CSV/Excel (paling mudah), PDF menyusul.
- Investor read-only ditegakkan di RLS + UI.

## Testing Decisions

**Prinsip:** uji perilaku & invarian akuntansi, bukan detail internal. Akuntansi = area WAJIB diuji karena salah sedikit = laporan salah.

- **`LedgerService`** (prioritas #1): setiap `postTransaction` menghasilkan entry balance; posting tak-balance ditolak; trial balance selalu seimbang setelah rangkaian transaksi acak; `reverseEntry` mengembalikan saldo ke semula. Property-based test bila memungkinkan.
- **`PostingRules`**: untuk tiap `type` transaksi (SALE, PURCHASE_*, INVESTOR_CONTRIBUTION, BANK_LOAN, LOAN_REPAYMENT, OPEX, DEPRECIATION), verifikasi akun debit/kredit & nominal (termasuk split pokok/bunga pada cicilan).
- **`FinancialStatements`**: skenario benih data → L/R, Neraca (Aset = Kewajiban+Ekuitas HARUS sama), Arus Kas cocok dengan mutasi kas. Uji rasio (marjin, ROE, DER, DSCR) terhadap angka yang diketahui.
- **`TraceabilityService`**: event `is_public=false` tak pernah keluar di query publik; urutan by `happened_at`.
- **`AccessControl` / RLS**: staf tak bisa baca laporan keuangan; investor tak bisa menulis apa pun; owner penuh. Uji lewat Supabase local dengan JWT tiap peran.
- **E2E (Playwright)**: alur "catat penjualan → jurnal muncul → L/R bertambah"; "buat subjek jejak + events → tampil di website publik".
- **Prior art:** pola pengujian double-entry ledger & statement reconciliation umum di aplikasi akuntansi; gunakan sebagai acuan.

## Out of Scope (PRD ini)

- Payroll penuh, pajak otomatis (PPh/PPN), faktur pajak resmi — cukup pencatatan dasar.
- Multi-currency (hanya IDR).
- Integrasi bank/otomatis rekonsiliasi bank, e-invoice.
- Manajemen stok pakan real-time canggih (mulai sederhana).
- Fitur publik (rendering website) → PRD 1.
- Mobile app native (pakai web responsif).

## Further Notes

- Alur mental owner: **"saya input transaksi biasa (beli/jual/modal), jurnal & laporan jadi sendiri."** Jaga UX ke arah itu — jangan paksa owner paham debit/kredit.
- Sediakan COA default + data awal sesuai business plan (modal Rp 200 jt investor, Rp 300 jt bank, CAPEX Rp 280,8 jt, dsb) sebagai contoh seed opsional.
- Rasio & target di dashboard investor sebaiknya mengikuti definisi di business plan (marjin laba bersih, ROE, DER, DSCR) agar konsisten dengan pitch.
- Traceability & produk berbagi tabel yang sama dengan website (PRD 1) — jangan duplikasi skema.
