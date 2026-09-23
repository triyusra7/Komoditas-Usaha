-- ==============================================================================
-- SEED SCRIPT: Transformasi Komoditas ke Jagung Pakan & Kopi (Sulawesi)
-- Fitur: Menampilkan Traceability Lengkap beserta Bahan-Bahan & Input Pertanian
-- Jalankan skrip ini di SQL Editor dashboard Supabase Anda.
-- ==============================================================================

-- 1. Bersihkan / Update Kategori Komoditas (Menghilangkan Babi)
DELETE FROM trace_events WHERE subject_id IN (
  SELECT id FROM trace_subjects WHERE commodity_type = 'pig' OR code LIKE 'PIG-%'
);
DELETE FROM trace_subjects WHERE commodity_type = 'pig' OR code LIKE 'PIG-%';
DELETE FROM products WHERE category_id IN (
  SELECT id FROM commodity_categories WHERE slug IN ('babi', 'ternak-babi')
);
DELETE FROM commodity_categories WHERE slug IN ('babi', 'ternak-babi');

-- 2. Buat atau Pastikan Kategori Jagung Pakan & Kopi Ada
INSERT INTO commodity_categories (id, name, slug, commodity_type, description, status, is_public, sort_order)
VALUES 
  (
    'c0000000-0000-0000-0000-000000000001',
    'Jagung Pakan',
    'jagung',
    'pig', -- menggunakan enum 'pig' yang di frontend dipetakan menjadi Jagung Pakan (tanpa perlu alter DB)
    'Komoditas jagung pipil kering berkualitas tinggi dari sentra pertanian Sulawesi untuk industri pakan ternak (feed mill) & peternak mandiri.',
    'active',
    true,
    1
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    'Kopi Sulawesi',
    'kopi',
    'coffee',
    'Kopi Arabika & Robusta specialty dan komersial dari dataran tinggi pegunungan Sulawesi (Toraja, Enrekang, Mamasa).',
    'active',
    true,
    2
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  is_public = EXCLUDED.is_public;

-- 3. Tambahkan Produk Jagung Pakan & Kopi
INSERT INTO products (
  id,
  category_id,
  name,
  slug,
  breed,
  short_desc,
  description,
  price_numeric,
  price_visible,
  unit,
  availability,
  status,
  is_public,
  sort,
  gallery
)
VALUES
  (
    'p0000000-0000-0000-0000-000000000001',
    (SELECT id FROM commodity_categories WHERE slug = 'jagung' LIMIT 1),
    'Jagung Pipil Kering Pakan Ternak (Grade A)',
    'jagung-pipil-kering-grade-a',
    'Syngenta NK 212 / Pioneer P35',
    'Kadar air terjamin < 14%, aflatoksin aman < 20 ppb, bebas jamur dan kutu.',
    'Jagung pipil pakan ternak kualitas super hasil budidaya petani mitra Sulawesi. Diproses menggunakan mesin pengering modern (continuous dryer) dan silo berkapasitas besar untuk menjaga nutrisi dan meminimalkan kadar air sehingga daya simpan lama dan aman untuk formulasi ransum unggas maupun ruminansia.',
    5200,
    true,
    'kg',
    'available',
    'published',
    true,
    1,
    '[]'::jsonb
  ),
  (
    'p0000000-0000-0000-0000-000000000002',
    (SELECT id FROM commodity_categories WHERE slug = 'kopi' LIMIT 1),
    'Kopi Arabika Toraja Sapan Specialty Green Bean',
    'kopi-arabika-toraja-sapan',
    'Arabika Typica & S795',
    'Single origin dataran tinggi 1.650 mdpl, cupping score 86.75, petik merah 100%.',
    'Biji kopi mentah (green bean) pilihan dari lereng Gunung Sesean, Tana Toraja. Dipanen dengan metode petik merah selektif, difermentasi terkontrol (fully washed) dan dijemur di atas raised beds. Memiliki profil rasa kompleks dengan aroma rempah manis, brown sugar, dan keasaman sitrus yang bersih.',
    125000,
    true,
    'kg',
    'available',
    'published',
    true,
    2,
    '[]'::jsonb
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  price_numeric = EXCLUDED.price_numeric,
  unit = EXCLUDED.unit,
  status = EXCLUDED.status,
  is_public = EXCLUDED.is_public;

-- 4. Tambahkan Subjek Traceability (Lot Jejak)
INSERT INTO trace_subjects (
  id,
  category_id,
  product_id,
  code,
  public_slug,
  title,
  commodity_type,
  current_status,
  is_public
)
VALUES
  (
    's0000000-0000-0000-0000-000000000001',
    (SELECT id FROM commodity_categories WHERE slug = 'jagung' LIMIT 1),
    (SELECT id FROM products WHERE slug = 'jagung-pipil-kering-grade-a' LIMIT 1),
    'JAGUNG-2026-001',
    'jagung-lot-2026-001',
    'Lot Jagung Pipil Pakan #2026-001 (Sulawesi)',
    'pig',
    'Lolos Uji Lab Pakan & Siap Distribusi Silo',
    true
  ),
  (
    's0000000-0000-0000-0000-000000000002',
    (SELECT id FROM commodity_categories WHERE slug = 'kopi' LIMIT 1),
    (SELECT id FROM products WHERE slug = 'kopi-arabika-toraja-sapan' LIMIT 1),
    'KOPI-2026-001',
    'kopi-toraja-sapan-lot-01',
    'Lot Kopi Arabika Toraja Sapan #01',
    'coffee',
    'Green Bean Siap Kirim (Grade 1 Specialty)',
    true
  )
ON CONFLICT (public_slug) DO UPDATE SET
  title = EXCLUDED.title,
  code = EXCLUDED.code,
  current_status = EXCLUDED.current_status,
  is_public = EXCLUDED.is_public;

-- 5. Tambahkan Riwayat & Peristiwa Traceability Lengkap Beserta Bahan-Bahan / Input Pertanian
-- (A) Peristiwa untuk Jagung Pakan
INSERT INTO trace_events (subject_id, event_type, title, description, location, happened_at, sort, is_public, meta)
VALUES
  (
    's0000000-0000-0000-0000-000000000001',
    'sourcing',
    'Pemilihan Benih Unggul Bersertifikat',
    'Pengadaan benih hibrida berdaya hasil tinggi dan tahan penyakit dari produsen bersertifikasi resmi.',
    'Sentra Pertanian Jagung Sulawesi',
    NOW() - INTERVAL '120 days',
    1,
    true,
    '{
      "varietas_benih": "Syngenta NK 212 / Pioneer P35",
      "sertifikasi": "BPSB (Balai Pengawasan & Sertifikasi Benih)",
      "daya_tumbuh": "98%",
      "mitra_tani": "Gapoktan Harapan Makmur Sulawesi"
    }'::jsonb
  ),
  (
    's0000000-0000-0000-0000-000000000001',
    'planting_inputs',
    'Aplikasi Nutrisi & Bahan Pemupukan Berimbang',
    'Pemberian pupuk dasar dan susulan secara terukur untuk memaksimalkan bobot tongkol dan kandungan protein.',
    'Lahan Mitra Tani Blok B, Sulawesi',
    NOW() - INTERVAL '85 days',
    2,
    true,
    '{
      "bahan_input": "Pupuk Kompos Fermentasi Organik (Dasar)",
      "jenis_pupuk": "NPK 15-15-15 & Urea Terjadwal (35 HST)",
      "pengendalian_hama": "Biopestisida & Perangkap Feromon (Ramah Lingkungan)",
      "sumber_air": "Irigasi Teknis & Tadah Hujan Teratur"
    }'::jsonb
  ),
  (
    's0000000-0000-0000-0000-000000000001',
    'harvest',
    'Pemanenan Serempak Saat Masak Fisiologis',
    'Pemanenan dilakukan saat klobot telah mengering sempurna (lapisan hitam/black layer terbentuk) untuk mencegah butir patah.',
    'Lahan Mitra Tani Blok B, Sulawesi',
    NOW() - INTERVAL '20 days',
    3,
    true,
    '{
      "metode_panen": "Combine Harvester Khusus Jagung",
      "kadar_air_awal": "21.5%",
      "total_tonase": "48 Ton",
      "kondisi_tongkol": "Bebas Jamur Lapangan & Bebas Busuk Tongkol"
    }'::jsonb
  ),
  (
    's0000000-0000-0000-0000-000000000001',
    'drying',
    'Pengeringan Mekanis & Pembersihan Benda Asing',
    'Pengeringan bertahap dengan suhu terkontrol agar biji tidak retak, dilanjutkan pembersihan debu, tongkol, dan kotoran.',
    'Pusat Pengeringan & Silo Komoditas Sulawesi',
    NOW() - INTERVAL '10 days',
    4,
    true,
    '{
      "kadar_air": "13.4% (Standar Industri < 14%)",
      "suhu_pengeringan": "50°C - 55°C (Indirect Heat Batch Dryer)",
      "benda_asing": "< 1.0%",
      "butir_rusak": "< 2.0%",
      "kemasan": "Jumbo Bag 1.000 kg / Curah Bersih"
    }'::jsonb
  ),
  (
    's0000000-0000-0000-0000-000000000001',
    'quality_lab',
    'Pengujian Laboratorium & Sertifikasi Mutu Pakan',
    'Analisis kualitas nutrisi dan keamanan pakan ternak dari sampel representatif di laboratorium terakreditasi.',
    'Laboratorium Pengujian Mutu Pakan Sulawesi',
    NOW() - INTERVAL '2 days',
    5,
    true,
    '{
      "aflatoksin": "12 ppb (Batas Maksimal SNI 20 ppb)",
      "protein_kasar": "8.85%",
      "kadar_serat": "2.2%",
      "kadar_lemak": "3.8%",
      "rekomendasi": "Lolos Uji Mutu - Siap Distribusi ke Pabrik Pakan (Feedmill)"
    }'::jsonb
  );

-- (B) Peristiwa untuk Kopi Sulawesi
INSERT INTO trace_events (subject_id, event_type, title, description, location, happened_at, sort, is_public, meta)
VALUES
  (
    's0000000-0000-0000-0000-000000000002',
    'sourcing',
    'Asal Kebun Dataran Tinggi & Sertifikasi Varietas',
    'Berasal dari perkebunan rakyat di lereng pegunungan Toraja dengan naungan pohon lamtoro dan alpukat.',
    'Desa Sapan, Tana Toraja (1.650 mdpl)',
    NOW() - INTERVAL '90 days',
    1,
    true,
    '{
      "elevasi": "1.650 mdpl",
      "varietas": "Arabika Typica & S795",
      "mitra_tani": "Koperasi Petani Lereng Sesean",
      "sistem_tanam": "Agroforestri Naungan Alami (Shade Grown)"
    }'::jsonb
  ),
  (
    's0000000-0000-0000-0000-000000000002',
    'planting_inputs',
    'Perawatan Kebun & Pemupukan Organik Alami',
    'Penggunaan nutrisi ramah lingkungan untuk menjaga kesuburan tanah vulkanik dan mikroba tanah.',
    'Kebun Kopi Sapan Toraja',
    NOW() - INTERVAL '60 days',
    2,
    true,
    '{
      "bahan_input": "Kompos Kulit Ceri Kopi Daur Ulang & Pupuk Kandang Kambing Fermentasi",
      "pengendalian_hama": "Kultur Teknis Pemangkasan & Bio-agen Beauveria bassiana",
      "tanpa_kimia_berbahaya": "100% Non-pestisida Kimia Sintetis"
    }'::jsonb
  ),
  (
    's0000000-0000-0000-0000-000000000002',
    'harvest',
    'Petik Merah Selektif 100% (Selective Picking)',
    'Petani hanya memanen buah kopi (ceri) yang telah matang sempurna secara manual.',
    'Kebun Kopi Sapan Toraja',
    NOW() - INTERVAL '30 days',
    3,
    true,
    '{
      "seleksi_buah": "100% Red Ripe Cherries",
      "tingkat_kemanisan_brix": "22.5° Brix",
      "metode_petik": "Manual Hand Picked",
      "flotasi_awal": "Pembersihan buah apung (floater) di bak mata air pegunungan"
    }'::jsonb
  ),
  (
    's0000000-0000-0000-0000-000000000002',
    'processing',
    'Pengolahan Pascapanen Fully Washed & Penjemuran',
    'Pengupasan kulit ceri (pulping), fermentasi basah 36 jam, dan pengeringan di atas para-para (raised beds).',
    'Wet Mill Stasiun Pengolahan Kopi Toraja',
    NOW() - INTERVAL '18 days',
    4,
    true,
    '{
      "metode_olah": "Fully Washed (Fermentasi Basah 36 Jam)",
      "media_jemur": "African Raised Beds dengan Sirkulasi Udara Terbuka",
      "lama_jemur": "14 Hari",
      "kadar_air": "11.2%"
    }'::jsonb
  ),
  (
    's0000000-0000-0000-0000-000000000002',
    'cupping',
    'Uji Cita Rasa (Cupping) & Quality Grading',
    'Sesi sensory cupping oleh Licensed Q-Grader sesuai standar Specialty Coffee Association (SCA).',
    'Laboratorium Sensory & Lab Uji Mutu Toraja',
    NOW() - INTERVAL '5 days',
    5,
    true,
    '{
      "cupping_score": "86.75 (Specialty Grade 1)",
      "tasting_notes": "Brown Sugar, Citrus Orange, Dark Chocolate, Clean Herbal Finish",
      "acidity": "Bright Citric",
      "body": "Medium Smooth Silky",
      "defect_rate": "< 1% (Bebas Primary Defect)",
      "kemasan": "GrainPro Hermetic Bag 60 kg + Karung Goni"
    }'::jsonb
  );

-- Selesai!
-- Catatan:
-- 1. URL Jejak Jagung dapat diakses langsung di: /jejak/jagung-lot-2026-001
-- 2. URL Jejak Kopi dapat diakses langsung di: /jejak/kopi-toraja-sapan-lot-01
-- 3. Semua bahan-bahan / input pertanian akan otomatis terdisplay di tab "Detail Metadata & Bahan/Input"
