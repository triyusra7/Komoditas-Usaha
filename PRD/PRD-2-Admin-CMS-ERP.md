# PRD — Sistem Admin: CMS + ERP (Konten, Traceability, Akuntansi Otomatis)

**Versi:** 2.0
**Nama proyek (usulan):** bagian `(admin)` dari repo yang sama dengan `PRD-1-Website-Utama.md`
**Stack:** Next.js (App Router, TypeScript) + Tailwind + shadcn/ui + Supabase (Postgres, Auth, Storage, RLS)
**Konteks:** Ini "otak" dari sistem. Website publik (PRD 1) hanya **membaca** data yang dikelola di sini. Admin melakukan **semua tulis**: kelola konten website, input traceability, dan mencatat transaksi keuangan yang otomatis jadi jurnal + laporan.
**Prinsip inti:** Semua transaksi memakai **double-entry** (total debit = total kredit). Owner cukup input transaksi bisnis biasa (beli/jual/modal masuk) — **jurnal dibuat OTOMATIS**. Owner tidak perlu paham debit/kredit. Fokus rilis-1 = **komoditas Babi**, lokasi Palopo & Morowali.

---

## 1. Keputusan Desain (Hasil Klarifikasi dengan Owner)

| Topik | Keputusan |
|---|---|
| Arsitektur | **Satu repo + satu Supabase** dibagi dengan Website (PRD 1). Admin = rute `(admin)` login-protected. Bukan sistem/database terpisah. |
| Metode akuntansi | **Double-entry** penuh. Setiap transaksi bisnis memicu **jurnal otomatis** lewat lapisan `PostingRules`. Sistem menolak jurnal yang tidak balance. |
| Level akuntansi | **Akuntansi dasar tapi benar**: COA, jurnal, buku besar, Laba/Rugi, Neraca, Arus Kas, Neraca Saldo, rasio. Tanpa pajak/PPN otomatis & payroll di fase ini. |
| Koreksi data | **Reversal/void**, bukan hapus diam-diam — jejak audit tetap ada. |
| Peran user | **Owner** (penuh), **Staf** (input operasional & traceability, tak lihat laporan sensitif), **Investor** (read-only laporan keuangan). Ditegakkan RLS + guard UI. |
| Traceability | Input event bertahap per subjek (1 ekor/1 batch babi; nanti 1 lot kopi). Generic lintas komoditas via field `meta` (jsonb). Per-event flag `is_public`. |
| CMS | Owner mengubah semua isi website dari sini; perubahan langsung tampil di publik (satu DB). |
| Uang | Disimpan `numeric(18,2)` (bukan float). Format tampil Rupiah `id-ID`. |
| Komoditas rilis-1 | **Babi**. COA & posting rules disiapkan untuk babi, tapi struktur generic. |
| Bahasa | UI Indonesia; nama akun boleh Indonesia; kode/tabel/kolom Inggris. |

---

## 2. Model Bisnis & Alur Sistem (Ringkas)

```
INVESTOR setor modal ─┐
BANK beri pinjaman  ──┤─►  Kas bertambah  ──►  jurnal otomatis (Dr Kas / Cr Modal Investor | Utang Bank)
                      │
OWNER beli (bibit,    │
pakan, obat, aset) ───┼─►  Persediaan/Aset/Beban  ──►  jurnal (Dr Persediaan/Aset/Beban / Cr Kas | Utang Usaha)
                      │
BABI dipelihara ──────┼─►  dicatat di TRACEABILITY (asal → transport → kandang → tumbuh → siap potong)
                      │
OWNER jual daging/  ──┘
karkas ──────────────────►  jurnal Pendapatan (Dr Kas/Piutang / Cr Pendapatan)
                            + jurnal HPP (Dr HPP / Cr Persediaan)
                                    │
                    Semua jurnal ──►  Buku Besar  ──►  Laba/Rugi, Neraca, Arus Kas, Rasio
                                    │
                    CMS & Traceability  ──►  ditarik oleh Website publik (PRD 1)
```

Inti: owner memasukkan **transaksi bisnis**, sistem yang menerjemahkan jadi **jurnal double-entry** dan menyusun laporan.

---

## 3. Peran & Hak Akses

| Menu / Aksi | Owner | Staf | Investor |
|---|---|---|---|
| Dashboard ringkas | ✅ | ✅ (versi operasional) | ✅ (versi keuangan) |
| CMS (settings, halaman, kategori, produk, media) | ✅ CRUD | ✅ terbatas (produk/media) | ❌ |
| Leads (form kontak) | ✅ | ✅ | ❌ |
| Traceability (subjek + events) | ✅ CRUD | ✅ CRUD | ❌ (atau read) |
| Transaksi keuangan (beli/jual/modal/biaya) | ✅ CRUD | ❌ (atau input terbatas) | ❌ |
| Jurnal, Buku Besar, COA | ✅ | ❌ | ❌ |
| Laporan (L/R, Neraca, Arus Kas, Rasio) | ✅ | ❌ | ✅ read-only |
| Kelola user & peran | ✅ | ❌ | ❌ |

Ditegakkan di **dua lapis**: guard UI + **RLS Supabase** berdasarkan `profiles.role`.

---

## 4. Master Data

Master ditandai **(inti akuntansi)** = terhubung ke mesin jurnal.

### 4.1 `profiles` (user & peran)
| Field | Tipe | Keterangan |
|---|---|---|
| user_id | uuid (ref auth.users) | |
| name | string | |
| role | enum | `owner` \| `staff` \| `investor` |
| is_active | boolean | |

### 4.2 CMS — reuse skema yang dikonsumsi Website (lihat PRD 1 §4)
`site_settings`, `page_contents`, `content_blocks`, `commodity_categories`, `products`, `media_assets`, `leads`. Admin = CRUD penuh atas tabel-tabel ini. **Tidak ada duplikasi skema** — tabel yang sama dibaca Website.

### 4.3 `trace_subjects` (subjek jejak)
| Field | Tipe | Keterangan |
|---|---|---|
| id | uuid | |
| public_slug | string (unik) | untuk URL publik `/jejak/[slug]` |
| code | string | kode internal, mis. "BABI-2026-014" |
| category_id | ref → commodity_categories | |
| product_id | ref → products (nullable) | kaitan ke katalog |
| commodity_type | enum | `pig` \| `coffee` \| `fishery` |
| title | string | |
| current_status | string | status terkini |
| is_public | boolean | |
| created_by | ref → profiles | audit |

### 4.4 `trace_events` (event bertahap)
| Field | Tipe | Keterangan |
|---|---|---|
| id | uuid | |
| subject_id | ref → trace_subjects | |
| event_type | enum | babi: `acquisition`/`transport`/`housing`/`growth`/`health`/`ready_slaughter`; kopi: `sourcing`/`harvest`/`processing`/`drying`/`packaging` |
| title, description | string/text | |
| location | string | |
| happened_at | date | dipakai urutan timeline |
| photo_url | string (nullable) | |
| meta | jsonb | field bebas per tahap (umur, bobot, pemasok, metode olah, dll) |
| is_public | boolean | sembunyikan tahap/field sensitif |
| created_by | ref → profiles | |

### 4.5 `accounts` — Chart of Accounts **(inti akuntansi)**
| Field | Tipe | Keterangan |
|---|---|---|
| id | uuid | |
| code | string | kode akun, mis. "1-100" |
| name | string | mis. "Kas", "Persediaan Ternak" |
| type | enum | `asset` \| `liability` \| `equity` \| `income` \| `expense` |
| normal_side | enum | `debit` \| `credit` (sisi normal) |
| parent_id | ref (nullable) | untuk sub-akun/hierarki |
| is_active | boolean | |

### 4.6 `journal_entries` + `journal_lines` **(inti akuntansi)**
| journal_entries | Tipe | Keterangan |
|---|---|---|
| id | uuid | |
| entry_date | date | |
| memo | string | |
| source_type | enum | `SALE`/`PURCHASE`/`INVESTOR_CONTRIBUTION`/`BANK_LOAN`/`LOAN_REPAYMENT`/`OPEX`/`DEPRECIATION`/`MANUAL` |
| source_id | uuid (nullable) | link ke transaksi bisnis pemicu |
| status | enum | `posted` \| `void` |
| created_by | ref | |

| journal_lines | Tipe | Keterangan |
|---|---|---|
| id | uuid | |
| entry_id | ref → journal_entries | |
| account_id | ref → accounts | |
| debit | numeric(18,2) | |
| credit | numeric(18,2) | |

> **Invarian DB:** trigger memastikan `SUM(debit) = SUM(credit)` per `entry_id`. Baris tak-balance ditolak.

### 4.7 `transactions` (lapisan bisnis ramah-user) **(inti akuntansi)**
| Field | Tipe | Keterangan |
|---|---|---|
| id | uuid | |
| type | enum | jenis transaksi bisnis (= `source_type` di atas) |
| trx_date | date | |
| counterparty_id | ref (nullable) | supplier/customer/investor |
| amount | numeric | total nilai |
| payment_mode | enum | `cash` \| `credit` |
| meta | jsonb | detail (item, qty, kg, split pokok/bunga, dll) |
| journal_entry_id | ref (nullable) | hasil posting otomatis |

### 4.8 Master pendukung
`suppliers`, `customers`, `investors` (nama, nominal setor, % kepemilikan), `bank_loans` (pokok, bunga, tenor, jadwal), `fixed_assets` (nilai perolehan, umur ekonomis, metode & akumulasi penyusutan).

---

## 5. Chart of Accounts (COA) — Usulan Awal untuk Peternakan Babi

| Kode area | Akun | Type |
|---|---|---|
| Kas & Bank | Kas, Bank | asset |
| Piutang | Piutang Usaha | asset |
| Persediaan | Persediaan Ternak (babi hidup), Persediaan Pakan, Persediaan Daging/Karkas | asset |
| Aset Tetap | Kandang & Bangunan, Peralatan Kandang, Mesin Pakan, Peralatan Potong & Cold Storage, Ternak Induk/Pejantan (breeding), Akumulasi Penyusutan | asset (kontra) |
| Kewajiban | Utang Usaha, Utang Bank | liability |
| Ekuitas | Modal Investor, Modal Pemilik (lahan), Laba Ditahan | equity |
| Pendapatan | Pendapatan Penjualan Daging/Karkas, Pendapatan Penjualan Babi Hidup | income |
| Beban Pokok | Harga Pokok Penjualan (HPP) | expense |
| Beban Operasional | Beban Pakan, Beban Obat/Vaksin, Beban Gaji, Beban Transport, Beban Listrik & Air, Beban Perizinan, Beban Operasional Lainnya | expense |
| Beban Non-operasional | Beban Bunga, Beban Penyusutan | expense |

Format kode akun agar konsisten (mis. 1-xxx aset, 2-xxx kewajiban, 3-xxx ekuitas, 4-xxx pendapatan, 5-xxx HPP, 6-xxx beban).

---

## 6. Alur Modul & Jurnal Otomatis (Posting Rules)

Owner input transaksi biasa; `PostingRules` menerjemahkan ke baris jurnal. Semua contoh di bawah **otomatis**.

### 6.1 Setoran Modal Investor (`INVESTOR_CONTRIBUTION`)
Input: investor, nominal, tanggal, % kepemilikan.
→ Jurnal: **Dr Kas / Cr Modal Investor**

### 6.2 Pinjaman Bank Masuk (`BANK_LOAN`)
Input: pokok, bunga %, tenor.
→ Jurnal: **Dr Kas / Cr Utang Bank**

### 6.3 Pembelian (`PURCHASE`)
Input: jenis (bibit/pakan/obat/aset/jasa), item, qty, harga, mode bayar.
- Bibit/babi hidup → **Dr Persediaan Ternak / Cr Kas atau Utang Usaha**
- Pakan → **Dr Persediaan Pakan (atau Beban Pakan) / Cr Kas/Utang**
- Aset (kandang, mesin, cold storage) → **Dr Aset Tetap / Cr Kas/Utang**
- Jasa/operasional → **Dr Beban terkait / Cr Kas/Utang**
- Bayar Utang Usaha → **Dr Utang Usaha / Cr Kas/Bank**

### 6.4 Penjualan (`SALE`)
Input: produk, qty/kg, harga, mode bayar (tunai/kredit).
- Pendapatan → **Dr Kas (tunai) / Piutang Usaha (kredit) / Cr Pendapatan Penjualan**
- HPP (jika persediaan dilacak) → **Dr HPP / Cr Persediaan Ternak/Daging**
- Pelunasan Piutang → **Dr Kas/Bank / Cr Piutang Usaha**

### 6.5 Biaya Operasional (`OPEX`)
Input: kategori (listrik, gaji, transport, sewa), nominal.
→ Jurnal: **Dr Beban terkait / Cr Kas/Bank**

### 6.6 Cicilan / Pembayaran Utang Bank (`LOAN_REPAYMENT`)
Input: total bayar; sistem split **pokok** & **bunga** dari jadwal.
→ Jurnal: **Dr Utang Bank (pokok) + Dr Beban Bunga (bunga) / Cr Kas/Bank**

### 6.7 Penyusutan Aset Tetap (`DEPRECIATION`)
Input/otomatis periodik dari `fixed_assets` (garis lurus).
→ Jurnal: **Dr Beban Penyusutan / Cr Akumulasi Penyusutan**

### 6.8 Jurnal Manual / Penyesuaian (`MANUAL`)
Owner boleh input jurnal manual (mis. koreksi, opname). Tetap wajib balance.

### 6.9 Koreksi
Transaksi salah → **reversal/void** (buat jurnal pembalik), bukan hapus. Saldo kembali seperti semula, jejak audit tersimpan.

---

## 7. Laporan Keuangan

| Laporan | Isi | Sumber |
|---|---|---|
| Dashboard | Kas saat ini, pendapatan & laba bulan ini, utang tersisa, jumlah babi/ekor aktif, alert stok pakan minimum | agregasi buku besar + traceability |
| Laba/Rugi | Pendapatan − HPP − Beban (operasional, bunga, penyusutan) = Laba Bersih; per periode | akun income/expense |
| Neraca | Aset = Kewajiban + Ekuitas; per tanggal | saldo akun asset/liability/equity |
| Arus Kas | Kas operasi / investasi / pendanaan (metode langsung dari mutasi kas) | mutasi akun Kas/Bank |
| Buku Besar | Mutasi per akun | journal_lines |
| Neraca Saldo (Trial Balance) | Saldo semua akun; total debit = total kredit | journal_lines |
| Rasio | Marjin laba bersih, ROE, Debt-to-Equity, DSCR (ikut definisi business plan) | turunan L/R + Neraca |

- Semua angka **berasal dari jurnal** (bukan diketik ulang).
- Ekspor: mulai **CSV/Excel**, PDF menyusul.
- Investor melihat L/R, Neraca, Arus Kas, Rasio (read-only).

---

## 8. Modul Teknis (Deep Modules — diuji terpisah)

| Modul | Peran | Interface ringkas |
|---|---|---|
| **`LedgerService`** (kritikal #1) | Mesin buku besar. Membuat entry balance, tolak yang tak-balance, tidak pernah hapus (hanya reversal). | `postTransaction(input): JournalEntry`, `reverseEntry(entryId)`, `getTrialBalance(asOf)`, `getAccountBalance(accountId, range)` |
| **`PostingRules`** | Memetakan jenis transaksi bisnis → baris jurnal (lihat §6). Terpisah dari LedgerService agar aturan bisa berubah tanpa sentuh mesin. | `buildLines(transaction): JournalLine[]` |
| **`FinancialStatements`** | Menyusun L/R, Neraca, Arus Kas, rasio dari saldo akun + klasifikasi COA. | `incomeStatement(range)`, `balanceSheet(asOf)`, `cashFlow(range)`, `ratios(range)` |
| **`TraceabilityService`** | CRUD subjek + events; enforce `is_public`; query untuk publik (dipakai PRD 1). | `createSubject`, `addEvent`, `listSubjects(filter)`, `getPublicTrace(slug)` |
| **`ContentService`** | CRUD site settings, pages/blocks, categories, products, media. | CRUD standar |
| **`AccessControl`** | Resolusi peran + guard, selaras RLS. | `can(user, action, resource)` |

---

## 9. Non-Functional Requirements

- Satu repo & satu Supabase dibagi dengan Website; semua mutasi lewat Server Actions/Route Handlers dengan session user (**bukan** service key di client).
- **RLS aktif di semua tabel**; peran dari `profiles.role`.
- Uang `numeric(18,2)`; hindari float; pembulatan konsisten.
- Audit trail: `created_by`, `created_at` pada record penting; koreksi via reversal.
- Admin **responsif** (dipakai staf di HP di kandang).
- Multi-komoditas & multi-lokasi didukung skema sejak awal (UI menonjolkan Babi/Palopo–Morowali dulu).
- Backup: manfaatkan backup Supabase; catat kredensial dengan aman.

---

## 10. Testing Decisions

**Prinsip:** uji perilaku & invarian, bukan detail internal. Akuntansi = **wajib** diuji.

- **`LedgerService`** (prioritas #1): setiap posting balance; posting tak-balance ditolak; trial balance selalu seimbang setelah rangkaian transaksi acak; `reverseEntry` mengembalikan saldo. (Property-based test bila bisa.)
- **`PostingRules`**: untuk tiap `type` (SALE, PURCHASE_*, INVESTOR_CONTRIBUTION, BANK_LOAN, LOAN_REPAYMENT, OPEX, DEPRECIATION) verifikasi akun debit/kredit & nominal, termasuk split pokok/bunga.
- **`FinancialStatements`**: skenario benih data → Neraca (Aset = Kewajiban+Ekuitas **harus sama**), L/R, Arus Kas cocok mutasi kas; rasio terhadap angka diketahui.
- **`TraceabilityService`**: event `is_public=false` tak pernah keluar di query publik; urutan by `happened_at`.
- **RLS/`AccessControl`**: staf tak bisa baca laporan keuangan; investor tak bisa menulis; owner penuh — diuji dengan JWT tiap peran di Supabase local.
- **E2E (Playwright)**: "catat penjualan → jurnal muncul → L/R bertambah"; "buat subjek jejak + events → tampil di Website publik".

---

## 11. Asumsi & Hal Terbuka (Perlu Dikonfirmasi Owner)

1. **Saldo awal:** perlu input saldo awal dari business plan (Modal Investor Rp 200 jt, Utang Bank Rp 300 jt, CAPEX Rp 280,8 jt, dll) agar Neraca benar sejak hari-1. Disediakan menu **Saldo Awal**.
2. **HPP/persediaan:** apakah HPP dihitung perpetual (moving average) atau disederhanakan (beban langsung)? Default usulan: catat persediaan ternak & pakan, HPP saat jual. Bisa disederhanakan bila owner mau.
3. **Penyusutan:** garis lurus, periodik (bulanan/tahunan) — konfirmasi umur ekonomis per aset.
4. **Input staf ke keuangan:** default staf **tidak** menyentuh keuangan (hanya operasional/traceability). Bisa dibuka terbatas bila perlu.
5. **Pajak & payroll:** di luar scope fase ini (hanya pencatatan dasar).
6. **Breeding (anak babi lahir):** pencatatan aset biologis anak sendiri — fase ini disederhanakan (biaya masuk beban/persediaan), model aset biologis penuh menyusul bila diperlukan.
7. **Waste/kematian ternak (mortalitas):** dicatat sebagai penyesuaian persediaan/beban — konfirmasi perlakuan yang diinginkan.

---

## 12. Definition of Done

- [ ] Admin login-protected; peran Owner/Staf/Investor aktif & ditegakkan RLS
- [ ] Owner bisa undang user & set peran
- [ ] CMS: CRUD site settings, halaman/blok, kategori, produk, media — perubahan langsung tampil di Website
- [ ] Leads dari form Website muncul & bisa dikelola
- [ ] Traceability: CRUD subjek + events, toggle `is_public`, `meta` fleksibel; tampil di Website publik
- [ ] COA default ter-seed; menu Saldo Awal berfungsi
- [ ] Setiap transaksi bisnis (§6) menghasilkan **jurnal otomatis yang balance**; tak-balance ditolak
- [ ] Cicilan bank ter-split pokok vs bunga otomatis
- [ ] Penyusutan menghasilkan jurnal yang benar
- [ ] Koreksi via reversal/void bekerja; tak ada hapus diam-diam
- [ ] Laporan L/R, Neraca (seimbang), Arus Kas, Buku Besar, Neraca Saldo, Rasio menampilkan data riil dari jurnal
- [ ] Investor bisa lihat laporan read-only; tak bisa mengubah apa pun
- [ ] Dashboard menampilkan ringkasan + alert stok pakan minimum
- [ ] Ekspor CSV/Excel berfungsi
- [ ] Test lulus untuk `LedgerService`, `PostingRules`, `FinancialStatements`, RLS peran

---

### Lampiran
- `PRD-1-Website-Utama.md` — spesifikasi Website publik (konsumen data ini).
- `README-Arsitektur-dan-Langkah.md` — rekomendasi arsitektur, database, urutan langkah.
- Referensi model bisnis & angka: halaman Notion "Rencana Bisnis Peternakan Babi — Palopo & Morowali".
