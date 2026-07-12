import { cookies } from "next/headers";

export type Language = "id" | "en";

export async function getLanguage(): Promise<Language> {
  try {
    const cookieStore = await cookies();
    const lang = cookieStore.get("lang")?.value;
    return lang === "en" ? "en" : "id";
  } catch {
    return "id";
  }
}

const STATIC_TRANSLATIONS: Record<string, Record<Language, string>> = {
  // Navigation
  "Beranda": { id: "Beranda", en: "Home" },
  "Tentang": { id: "Tentang", en: "About Us" },
  "Katalog": { id: "Katalog", en: "Catalog" },
  "Kontak": { id: "Kontak", en: "Contact" },
  "Hubungi Kami": { id: "Hubungi Kami", en: "Contact Us" },

  // Hero
  "Dari kandang sampai ke meja Anda —": { id: "Dari kandang sampai ke meja Anda —", en: "From farm to your table —" },
  "tertelusur penuh.": { id: "tertelusur penuh.", en: "fully traceable." },
  "Lihat Katalog": { id: "Lihat Katalog", en: "View Catalog" },
  "Hubungi via WhatsApp": { id: "Hubungi via WhatsApp", en: "Contact via WhatsApp" },

  // Categories & Featured
  "Komoditas Kami": { id: "Komoditas Kami", en: "Our Commodities" },
  "Fokus rilis pertama: Babi. Kopi & Perikanan menyusul.": { id: "Fokus rilis pertama: Babi. Kopi & Perikanan menyusul.", en: "First release focus: Pork. Coffee & Fisheries to follow." },
  "Semua kategori →": { id: "Semua kategori →", en: "All categories →" },
  "Produk Unggulan": { id: "Produk Unggulan", en: "Featured Products" },
  "Setiap produk punya jejak yang bisa Anda periksa sendiri.": { id: "Setiap produk punya jejak yang bisa Anda periksa sendiri.", en: "Every product has a journey you can inspect yourself." },
  "Semua produk →": { id: "Semua produk →", en: "All products →" },

  // CTA
  "Butuh pasokan rutin untuk katering atau usaha Anda?": { id: "Butuh pasokan rutin untuk katering atau usaha Anda?", en: "Need regular supply for your catering or business?" },
  "Kami melayani kebutuhan katering kawasan industri, restoran, dan pengepul di Palopo, Morowali, dan sekitarnya.": { id: "Kami melayani kebutuhan katering kawasan industri, restoran, dan pengepul di Palopo, Morowali, dan sekitarnya.", en: "We serve catering needs for industrial zones, restaurants, and wholesalers in Palopo, Morowali, and surrounding areas." },
  "Chat WhatsApp Sekarang": { id: "Chat WhatsApp Sekarang", en: "Chat via WhatsApp" },
  "Kirim Pesan": { id: "Kirim Pesan", en: "Send Message" },

  // Tentang Page
  "Tentang Kami": { id: "Tentang Kami", en: "About Us" },
  "Ingin tahu lebih banyak?": { id: "Ingin tahu lebih banyak?", en: "Want to know more?" },
  "Kami terbuka untuk kunjungan kandang, kemitraan, dan pertanyaan seputar produk.": { id: "Kami terbuka untuk kunjungan kandang, kemitraan, dan pertanyaan seputar produk.", en: "We are open to farm visits, partnerships, and product inquiries." },
  "Konten halaman ini sedang disiapkan. Silakan hubungi kami untuk informasi lebih lanjut.": { id: "Konten halaman ini sedang disiapkan. Silakan hubungi kami untuk informasi lebih lanjut.", en: "The content of this page is being prepared. Please contact us for more information." },

  // Kontak Page
  "Hubungi / Jadi Mitra": { id: "Hubungi / Jadi Mitra", en: "Contact / Become a Partner" },
  "Untuk pemesanan, pasokan rutin katering, kemitraan penggemukan, atau sekadar bertanya — kami senang mendengar dari Anda.": { id: "Untuk pemesanan, pasokan rutin katering, kemitraan penggemukan, atau sekadar bertanya — kami senang mendengar dari Anda.", en: "For orders, regular catering supply, fattening partnerships, or general inquiries — we look forward to hearing from you." },
  "WhatsApp": { id: "WhatsApp", en: "WhatsApp" },
  "Email": { id: "Email", en: "Email" },
  "Lokasi": { id: "Lokasi", en: "Location" },
  "Chat Langsung via WhatsApp": { id: "Chat Langsung via WhatsApp", en: "Chat via WhatsApp" },
  "Nama *": { id: "Nama *", en: "Name *" },
  "Nama lengkap Anda": { id: "Nama lengkap Anda", en: "Your full name" },
  "Kontak (WhatsApp/Email) *": { id: "Kontak (WhatsApp/Email) *", en: "Contact (WhatsApp/Email) *" },
  "08xx atau email": { id: "08xx atau email", en: "08xx or email" },
  "Minat": { id: "Minat", en: "Interest" },
  "Pilih minat Anda (opsional)": { id: "Pilih minat Anda (opsional)", en: "Select your interest (optional)" },
  "Beli produk": { id: "Beli produk", en: "Buy product" },
  "Pasokan rutin / katering": { id: "Pasokan rutin / katering", en: "Regular supply / catering" },
  "Kemitraan": { id: "Kemitraan", en: "Partnership" },
  "Investasi": { id: "Investasi", en: "Investment" },
  "Lainnya": { id: "Lainnya", en: "Other" },
  "Pesan *": { id: "Pesan *", en: "Message *" },
  "Ceritakan kebutuhan Anda...": { id: "Ceritakan kebutuhan Anda...", en: "Tell us about your needs..." },
  "Mengirim...": { id: "Mengirim...", en: "Sending..." },
  "Pesan terkirim!": { id: "Pesan terkirim!", en: "Message sent!" },
  "Terima kasih. Kami akan menghubungi Anda secepatnya.": { id: "Terima kasih. Kami akan menghubungi Anda secepatnya.", en: "Thank you. We will contact you as soon as possible." },

  // Katalog Page
  "Pilih kategori untuk melihat produk yang tersedia. Kategori bertanda &ldquo;Segera Hadir&rdquo; sedang kami siapkan.": {
    id: "Pilih kategori untuk melihat produk yang tersedia. Kategori bertanda &ldquo;Segera Hadir&rdquo; sedang kami siapkan.",
    en: "Choose a category to view available products. Categories marked &ldquo;Coming Soon&rdquo; are currently being prepared."
  },
  "Belum ada kategori publik.": { id: "Belum ada kategori publik.", en: "No public categories yet." },
  "← Semua kategori": { id: "← Semua kategori", en: "← All categories" },
  "Produk sedang disiapkan": { id: "Produk sedang disiapkan", en: "Products are being prepared" },
  "Kami sedang melengkapi katalog kategori ini. Hubungi kami untuk informasi ketersediaan terbaru.": {
    id: "Kami sedang melengkapi katalog kategori ini. Hubungi kami untuk informasi ketersediaan terbaru.",
    en: "We are currently preparing the catalog for this category. Please contact us for availability."
  },

  // Produk Page
  "← Kembali ke katalog": { id: "← Kembali ke katalog", en: "← Back to catalog" },
  "Tersedia": { id: "Tersedia", en: "Available" },
  "Pre-Order": { id: "Pre-Order", en: "Pre-Order" },
  "Stok Habis": { id: "Stok Habis", en: "Sold Out" },
  "Hubungi untuk harga": { id: "Hubungi untuk harga", en: "Contact for pricing" },
  "🔍 Jejak Produk Ini": { id: "🔍 Jejak Produk Ini", en: "🔍 Product Journey / Traceability" },
  "Periksa sendiri perjalanan produk ini — dari asal bibit sampai siap potong.": {
    id: "Periksa sendiri perjalanan produk ini — dari asal bibit sampai siap potong.",
    en: "Inspect the journey of this product yourself — from breed sourcing to slaughter-ready."
  },
  "← Lihat produk terkait di katalog": { id: "← Lihat produk terkait di katalog", en: "← See related products in catalog" },

  // Jejak Page
  "Riwayat lengkap perjalanan produk — dari asal sampai siap jual.": {
    id: "Riwayat lengkap perjalanan produk — dari asal sampai siap jual.",
    en: "Full history of the product's journey — from sourcing to ready for sale."
  },
  "Kode": { id: "Kode", en: "Code" },
  "Status": { id: "Status", en: "Status" },
  "Tahap Tercatat": { id: "Tahap Tercatat", en: "Recorded Stages" },
  "Periode": { id: "Periode", en: "Period" },
  "tahap": { id: "tahap", en: "stages" },
  "Data jejak sedang dilengkapi.": { id: "Data jejak sedang dilengkapi.", en: "Traceability data is being finalized." },

  // Footer
  "Navigasi": { id: "Navigasi", en: "Navigation" },
  "Semua hak dilindungi.": { id: "Semua hak dilindungi.", en: "All rights reserved." },
};

/** Dynamic database content translations */
const CONTENT_TRANSLATIONS: Record<string, string> = {
  "Babi": "Pork",
  "Kopi": "Coffee",
  "Perikanan": "Fisheries",
  "Babi jenis Duroc, Landrace, dan Crossbreed F1 — digemukkan di kandang Palopo & Morowali dengan pencatatan pertumbuhan rutin.":
    "Duroc, Landrace, and Crossbreed F1 pigs — fattened in Palopo & Morowali farms with regular growth monitoring.",
  "Kopi Arabika Toraja & Wamena, diolah full wash langsung dari petani. Segera hadir.":
    "Toraja & Wamena Arabica Coffee, processed via full wash directly from farmers. Coming soon.",
  "Hasil perikanan segar dari perairan Sulawesi. Segera hadir.":
    "Fresh fishery products sourced from Sulawesi waters. Coming soon.",

  // Product names & breeds
  "Karkas Babi Duroc": "Duroc Pork Carcass",
  "Karkas babi Duroc dari kandang Palopo. Dipelihara 8-9 bulan dengan pakan terkontrol dan pencatatan bobot rutin. Rendemen karkas rata-rata di atas 75%. Setiap karkas dapat ditelusuri riwayatnya melalui halaman jejak produk.":
    "Duroc pork carcass from Palopo farm. Raised for 8-9 months with controlled feed and regular weight tracking. Average carcass yield above 75%. The history of each carcass can be traced via the product journey page.",
  "Karkas utuh babi Duroc umur potong 8-9 bulan, rendemen 75%+.":
    "Whole Duroc pork carcass, slaughter age 8-9 months, yield 75%+.",
  "Daging Babi Potongan Komersial": "Commercial Pork Cuts",
  "Potongan komersial dari karkas pilihan: loin, belly (samcan), shoulder, dan ham. Dipotong higienis dan dikemas vakum. Cocok untuk katering, restoran, dan kebutuhan rumah tangga di Palopo & Morowali.":
    "Commercial cuts from premium carcasses: loin, belly, shoulder, and ham. Hygienically cut and vacuum packed. Ideal for catering, restaurants, and household needs in Palopo & Morowali.",
  "Potongan komersial siap masak: loin, belly, shoulder, ham.":
    "Ready-to-cook commercial cuts: loin, belly, shoulder, ham.",
  "Babi Hidup Siap Potong": "Live Pig (Slaughter-ready)",
  "Babi hidup siap potong dengan bobot 90-110 kg. Setiap ekor punya kode jejak yang bisa Anda periksa: asal bibit, riwayat pakan, vaksinasi, dan perkembangan bobot. Harga mengikuti bobot timbang dan kondisi pasar — hubungi kami untuk penawaran.":
    "Slaughter-ready live pigs with 90-110 kg weight. Each head has a trace code you can inspect: breed origin, feed history, vaccination, and weight progress. Price depends on weight scale and market conditions — contact us for quotes.",
  "Babi hidup bobot 90-110 kg, siap potong, jejak lengkap.":
    "Live pig weight 90-110 kg, slaughter-ready, complete traceability.",
  "Bibit Weaner Crossbreed F1": "F1 Crossbreed Weaner Piglets",
  "Bibit weaner Crossbreed F1 umur 6-8 minggu, sudah melalui vaksinasi dasar dan pemeriksaan kesehatan. Cocok untuk mitra penggemukan. Ketersediaan terbatas per batch — pre-order disarankan.":
    "F1 Crossbreed weaner piglets aged 6-8 weeks, completed basic vaccinations and health checks. Suitable for fattening partners. Limited availability per batch — pre-order recommended.",
  "Weaner umur 6-8 minggu untuk penggemukan, kesehatan terverifikasi.":
    "Weaners aged 6-8 weeks for fattening, verified health status.",
  "Duroc / Landrace": "Duroc / Landrace",
  "Duroc / Crossbreed F1": "Duroc / Crossbreed F1",
  "Crossbreed F1": "Crossbreed F1",

  // Site settings
  "Komoditas tertelusur dari Sulawesi": "Traceable commodities from Sulawesi",
  "Peternakan babi di Palopo & Morowali dengan pencatatan jejak penuh — setiap ekor tercatat dari akuisisi bibit sampai siap potong. Menyusul: kopi Toraja & perikanan.":
    "Pig farming in Palopo & Morowali with complete traceability — each head is recorded from breed sourcing to slaughter-ready. Coming soon: Toraja coffee & fisheries.",
  "Palopo & Morowali, Sulawesi": "Palopo & Morowali, Sulawesi",

  // Traceability subjects
  "Babi Duroc #001": "Duroc Pig #001",
  "Babi Crossbreed F1 #014": "F1 Crossbreed Pig #014",
  "Siap Potong": "Slaughter-ready",
  "Pertumbuhan": "Growth",

  // Traceability events
  "Akuisisi Bibit": "Breed Acquisition",
  "Weaner Duroc jantan dibeli dari peternak mitra di Toraja Utara. Kondisi sehat, nafsu makan baik.":
    "Male Duroc weaner purchased from a partner breeder in North Toraja. Healthy condition, good appetite.",
  "Toraja Utara": "North Toraja",
  "Transportasi ke Kandang": "Transport to Farm",
  "Diangkut dengan pickup berkandang ventilasi. Perjalanan lancar tanpa stres berarti.":
    "Transported using a ventilated pickup. Smooth trip without significant stress.",
  "Toraja Utara → Palopo": "North Toraja → Palopo",
  "Penempatan Kandang": "Housing Placement",
  "Masuk kandang karantina 2 minggu, lalu pindah ke pen penggemukan blok A.":
    "Entered quarantine pen for 2 weeks, then moved to fattening pen block A.",
  "Kandang Palopo": "Palopo Farm",
  "Pertumbuhan Bulan ke-4": "Month 4 Growth",
  "Perkembangan bobot sesuai target. Pakan konsentrat + hijauan fermentasi.":
    "Weight progress on track. Concentrated feed + fermented forage.",
  "Vaksinasi & Pemeriksaan": "Vaccination & Health Check",
  "Vaksinasi hog cholera booster dan pemeriksaan kesehatan menyeluruh. Hasil: sehat.":
    "Hog cholera booster vaccination and thorough health check. Result: healthy.",
  "Mencapai bobot potong optimal. Estimasi rendemen karkas 76%.":
    "Reached optimal slaughter weight. Estimated carcass yield 76%.",
  "Weaner Crossbreed F1 betina dari batch mitra Palopo.":
    "Female F1 Crossbreed weaner from Palopo partner batch.",
  "Palopo": "Palopo",
  "Langsung masuk kandang Morowali blok B setelah karantina singkat.":
    "Moved directly to Morowali pen block B after a short quarantine.",
  "Kandang Morowali": "Morowali Farm",
  "Pertumbuhan Bulan ke-2": "Month 2 Growth",
  "Bobot naik konsisten, target potong Desember 2026.":
    "Consistent weight gain, slaughter target December 2026.",
  "Vaksinasi Dasar": "Basic Vaccination",
  "Vaksin hog cholera dosis pertama.":
    "First dose hog cholera vaccine.",

  // Product names
  "Babi Hidup (Slaughter)": "Live Pig (Slaughter)",
  "Karkas Babi (Pork Carcass)": "Pork Carcass",
  "Babi Ekstra Lemak": "Extra Fat Pig",
  "Anakan Babi (Weaner)": "Weaner Pig",

  // Traceability stages (EventType labels)
  "Transportasi": "Transportation",
  "Kesehatan": "Health Track",
  "Siap Potong / Karkas": "Slaughter-ready / Carcass",

  // Page blocks - Home page
  "Kenapa Tri Agri": "Why Tri Agri",
  "Kami percaya pembeli premium berhak tahu asal-usul produknya. Karena itu setiap ekor babi di kandang kami tercatat: dari siapa bibitnya dibeli, bagaimana perjalanannya, apa pakannya, sampai kapan siap potong.":
    "We believe premium buyers deserve to know the origin of their products. That is why every pig in our farm is recorded: from whom the breed was purchased, how its journey went, what its feed was, until when it is ready for slaughter.",
  "Ekor dalam pemeliharaan": "Heads under breeding",
  "Lokasi kandang": "Farm locations",
  "Rendemen karkas rata-rata": "Average carcass yield",
  "Tahap jejak per ekor": "Trace stages per head",

  // Page blocks - About page
  "Visi Kami": "Our Vision",
  "Menjadi pemasok komoditas tertelusur terpercaya di Sulawesi — mulai dari daging babi berkualitas untuk pasar Palopo & Morowali, lalu berkembang ke kopi Toraja/Wamena dan hasil perikanan.":
    "To be a trusted traceable commodity supplier in Sulawesi — starting from quality pork for the Palopo & Morowali markets, then expanding into Toraja/Wamena coffee and fishery products.",
  "Model Bisnis": "Business Model",
  "Kami membeli weaner (anak babi lepas sapih) dari pemasok terverifikasi, menggemukkannya 6-8 bulan di kandang sendiri dengan pakan terkontrol, lalu menjualnya sebagai babi hidup siap potong, karkas, atau potongan komersial. Sebagian kecil induk dipelihara untuk breeding jangka panjang.":
    "We purchase weaners (weaned piglets) from verified suppliers, fatten them for 6-8 months in our own pens with controlled feed, and sell them as slaughter-ready live pigs, carcasses, or commercial cuts. A small number of sows are raised for long-term breeding.",
  "Kandang utama di Palopo (Sulawesi Selatan) melayani pasar lokal dan Toraja. Kandang kedua di Morowali (Sulawesi Tengah) melayani kebutuhan katering kawasan industri IMIP dan sekitarnya.":
    "The main farm in Palopo (South Sulawesi) serves local and Toraja markets. The second farm in Morowali (Central Sulawesi) serves the catering needs of the IMIP industrial zone and surroundings.",
  "Berdiri": "Established",
  "Kapasitas kandang": "Farm capacity",
  "200 ekor": "200 heads",
  "Tim lapangan": "Field team",
  "5 orang": "5 people",
};

export function t(key: string, lang: Language): string {
  if (STATIC_TRANSLATIONS[key]) {
    return STATIC_TRANSLATIONS[key][lang];
  }
  return key;
}

export function tc(text: string | null | undefined, lang: Language): string {
  if (!text) return "";
  if (lang === "id") return text;
  
  // Try exact match
  if (CONTENT_TRANSLATIONS[text]) {
    return CONTENT_TRANSLATIONS[text];
  }
  
  // Try partial mappings for sentences or dynamic blocks
  let translated = text;
  for (const [key, value] of Object.entries(CONTENT_TRANSLATIONS)) {
    translated = translated.replaceAll(key, value);
  }
  
  return translated;
}
