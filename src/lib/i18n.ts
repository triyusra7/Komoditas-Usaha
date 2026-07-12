export type Language = "id" | "en" | "zh";

const STATIC_TRANSLATIONS: Record<string, Record<Language, string>> = {
  // Navigation
  "Beranda": { id: "Beranda", en: "Home", zh: "首页" },
  "Tentang": { id: "Tentang", en: "About", zh: "关于" },
  "Katalog": { id: "Katalog", en: "Catalog", zh: "产品目录" },
  "Kontak": { id: "Kontak", en: "Contact", zh: "联系我们" },
  "Hubungi Kami": { id: "Hubungi Kami", en: "Contact Us", zh: "联系我们" },

  // Hero
  "Dari kandang sampai ke meja Anda —": { id: "Dari kandang sampai ke meja Anda —", en: "From farm to your table —", zh: "从农场到您的餐桌 —" },
  "tertelusur penuh.": { id: "tertelusur penuh.", en: "fully traceable.", zh: "全程可追溯。" },
  "Lihat Katalog": { id: "Lihat Katalog", en: "View Catalog", zh: "查看产品目录" },
  "Hubungi via WhatsApp": { id: "Hubungi via WhatsApp", en: "Contact via WhatsApp", zh: "通过 WhatsApp 联系" },

  // Categories & Featured
  "Komoditas Kami": { id: "Komoditas Kami", en: "Our Commodities", zh: "我们的主要产品" },
  "Fokus rilis pertama: Babi. Kopi & Perikanan menyusul.": { id: "Fokus rilis pertama: Babi. Kopi & Perikanan menyusul.", en: "First release focus: Pork. Coffee & Fisheries to follow.", zh: "首期发布重点：生猪。咖啡与渔业产品即将推出。" },
  "Semua kategori →": { id: "Semua kategori →", en: "All categories →", zh: "所有品类 →" },
  "Produk Unggulan": { id: "Produk Unggulan", en: "Featured Products", zh: "推荐产品" },
  "Setiap produk punya jejak yang bisa Anda periksa sendiri.": { id: "Setiap produk punya jejak yang bisa Anda periksa sendiri.", en: "Every product has a journey you can inspect yourself.", zh: "每件产品都拥有您可以自主查询的追溯档案。" },
  "Semua produk →": { id: "Semua produk →", en: "All products →", zh: "所有产品 →" },
  "Pilihan": { id: "Pilihan", en: "Selection", zh: "精选" },
  "Semua Kategori": { id: "Semua Kategori", en: "All Categories", zh: "所有品类" },
  "Semua Produk": { id: "Semua Produk", en: "All Products", zh: "所有产品" },
  "Setiap produk memiliki riwayat traceability yang dapat Anda periksa secara transparan.": {
    id: "Setiap produk memiliki riwayat traceability yang dapat Anda periksa secara transparan.",
    en: "Every product has a transparent traceability history you can inspect.",
    zh: "每件产品都拥有公开透明的可追溯历程，供您自主查询。"
  },

  // CTA
  "Butuh pasokan rutin untuk katering atau usaha Anda?": { id: "Butuh pasokan rutin untuk katering atau usaha Anda?", en: "Need regular supply for your catering or business?", zh: "您的餐饮服务或企业需要定期供应吗？" },
  "Kami melayani kebutuhan katering kawasan industri, restoran, dan pengepul di Palopo, Morowali, dan sekitarnya.": { id: "Kami melayani kebutuhan katering kawasan industri, restoran, dan pengepul di Palopo, Morowali, dan sekitarnya.", en: "We serve catering needs for industrial zones, restaurants, and wholesalers in Palopo, Morowali, and surrounding areas.", zh: "我们为巴罗波 (Palopo)、莫罗瓦利 (Morowali) 及周边地区的工业区餐饮、餐厅 and 批发商提供供应服务。" },
  "Chat WhatsApp Sekarang": { id: "Chat WhatsApp Sekarang", en: "Chat via WhatsApp", zh: "立即通过 WhatsApp 咨询" },
  "Kirim Pesan": { id: "Kirim Pesan", en: "Send Message", zh: "发送信息" },

  // Tentang Page
  "Tentang Kami": { id: "Tentang Kami", en: "About Us", zh: "关于我们" },
  "Ingin tahu lebih banyak?": { id: "Ingin tahu lebih banyak?", en: "Want to know more?", zh: "想了解更多？" },
  "Kami terbuka untuk kunjungan kandang, kemitraan, dan pertanyaan seputar produk.": { id: "Kami terbuka untuk kunjungan kandang, kemitraan, dan pertanyaan seputar produk.", en: "We are open to farm visits, partnerships, and product inquiries.", zh: "我们欢迎农场参观、业务合作及产品咨询。" },
  "Konten halaman ini sedang disiapkan. Silakan hubungi kami untuk informasi lebih lanjut.": { id: "Konten halaman ini sedang disiapkan. Silakan hubungi kami untuk informasi lebih lanjut.", en: "The content of this page is being prepared. Please contact us for more information.", zh: "本页内容正在准备中。如需了解更多详情，请与我们联系。" },
  "Siapa Kami": { id: "Siapa Kami", en: "Who We Are", zh: "我们是谁" },
  "Penyedia Komoditas Ternak Tertelusur Terpercaya di Sulawesi": { id: "Penyedia Komoditas Ternak Tertelusur Terpercaya di Sulawesi", en: "Trusted Traceable Livestock Commodity Provider in Sulawesi", zh: "苏拉威西值得信赖的可追溯畜牧产品供应商" },
  "Tri Agri didirikan dengan misi membawa standar baru dalam industri peternakan babi di Sulawesi. Melalui kombinasi manajemen pakan yang ketat, sanitasi modern, dan teknologi penelusuran (traceability) digital, kami menghadirkan produk daging babi yang higienis, sehat, dan segar untuk mitra industri dan konsumen langsung.": { id: "Tri Agri didirikan dengan misi membawa standar baru dalam industri peternakan babi di Sulawesi. Melalui kombinasi manajemen pakan yang ketat, sanitasi modern, dan teknologi penelusuran (traceability) digital, kami menghadirkan produk daging babi yang higienis, sehat, dan segar untuk mitra industri dan konsumen langsung.", en: "Tri Agri was founded with a mission to bring new standards to the livestock industry in Sulawesi. Through a combination of strict feed management, modern sanitation, and digital traceability technology, we deliver hygienic, healthy, and fresh pork products to industrial partners and direct consumers.", zh: "Tri Agri 的创立使命是为苏拉威西的生猪养殖业树立新标准。通过严格的饲料管理、现代化的卫生标准以及数字可追溯技术的结合，我们为工业合作伙伴和直接消费者提供卫生、健康、新鲜的猪肉产品。" },
  "Palopo & Morowali": { id: "Palopo & Morowali", en: "Palopo & Morowali", zh: "巴罗波 & 莫罗瓦利" },
  "Dua pusat operasional strategis untuk melayani pasar Sulawesi Selatan, Toraja, dan Kawasan Industri Morowali.": { id: "Dua pusat operasional strategis untuk melayani pasar Sulawesi Selatan, Toraja, dan Kawasan Industri Morowali.", en: "Two strategic operational centers serving the South Sulawesi, Toraja, and Morowali Industrial Zone markets.", zh: "两大战略运营中心，服务于南苏拉威西、塔纳托拉雅以及莫罗瓦利 (IMIP) 工业区市场。" },
  "Visi & Misi": { id: "Visi & Misi", en: "Vision & Mission", zh: "愿景与使命" },
  "Arah & Landasan Kerja Kami": { id: "Arah & Landasan Kerja Kami", en: "Our Direction & Working Foundation", zh: "我们的指引与工作基石" },
  "Misi Kami": { id: "Misi Kami", en: "Our Mission", zh: "我们的使命" },
  "Menjamin kesehatan ternak melalui pakan terformulasi khusus dan perawatan higienis.": { id: "Menjamin kesehatan ternak melalui pakan terformulasi khusus dan perawatan higienis.", en: "Ensuring livestock health through specially formulated feed and hygienic care.", zh: "通过配方饲料和卫生护理，保障牲畜的健康成长。" },
  "Menyediakan daging berkualitas premium dengan sistem penelusuran (traceability) digital yang transparan.": { id: "Menyediakan daging berkualitas premium dengan sistem penelusuran (traceability) digital yang transparan.", en: "Providing premium quality meat with a transparent digital traceability system.", zh: "通过公开透明的数字化追溯系统，提供高品质猪肉产品。" },
  "Menjadi mitra pasokan rutin utama bagi katering industri dan restoran di Sulawesi.": { id: "Menjadi mitra pasokan rutin utama bagi katering industri dan restoran di Sulawesi.", en: "Becoming the main routine supply partner for industrial catering and restaurants in Sulawesi.", zh: "成为苏拉威西工业区餐饮和餐厅的主要定期供应商。" },
  "Menerapkan manajemen limbah ramah lingkungan untuk keberlanjutan sekitar.": { id: "Menerapkan manajemen limbah ramah lingkungan untuk keberlanjutan sekitar.", en: "Implementing eco-friendly waste management for surrounding environmental sustainability.", zh: "实施环保的废弃物管理，促进周边环境的可持续发展。" },
  "Menjadi pemasok komoditas babi dan produk turunan berkualitas tinggi dengan jaminan ketertelusuran penuh demi kepuasan konsumen di Sulawesi.": { id: "Menjadi pemasok komoditas babi dan produk turunan berkualitas tinggi dengan jaminan ketertelusuran penuh demi kepuasan konsumen di Sulawesi.", en: "To be a supplier of high-quality pork commodities and derivative products for consumer satisfaction in Sulawesi.", zh: "致力于成为苏拉威西地区高品质生猪及副产品供应商，提供全程可追溯保障，满足消费者需求。" },
  "Kami berkomitmen menghadirkan produk peternakan berkualitas tinggi dengan jaminan ketertelusuran penuh dari kandang hingga meja Anda.": { id: "Kami berkomitmen menghadirkan produk peternakan berkualitas tinggi dengan jaminan ketertelusuran penuh dari kandang hingga meja Anda.", en: "We are committed to delivering high-quality livestock products with a full traceability guarantee from farm to your table.", zh: "我们致力于提供高品质的畜牧产品，并提供从农场到餐桌的全程可追溯保障。" },
  "Jelajahi produk segar dan pilihan komoditas unggulan kami. Dari daging babi segar dengan ketertelusuran penuh, hingga komoditas andalan Sulawesi lainnya yang diproses secara higienis.": { id: "Jelajahi produk segar dan pilihan komoditas unggulan kami. Dari daging babi segar dengan ketertelusuran penuh, hingga komoditas andalan Sulawesi lainnya yang diproses secara higienis.", en: "Explore our fresh products and premium commodity selections. From fresh pork with complete traceability to other signature Sulawesi commodities processed hygienically.", zh: "探索我们的新鲜产品与优质商品选择。从拥有完整追溯档案的新鲜猪肉，到其他源自苏拉威西、经过卫生加工的特色产品。" },
  "Jelajahi pilihan produk segar berkualitas tinggi dari kategori ini, diproduksi higienis dengan jaminan penelusuran penuh.": { id: "Jelajahi pilihan produk segar berkualitas tinggi dari kategori ini, diproduksi higienis dengan jaminan penelusuran penuh.", en: "Explore our selection of high-quality fresh products from this category, produced hygienically with full traceability guarantee.", zh: "探索该品类下精选的高品质新鲜产品，卫生生产并提供完整的可追溯保障。" },

  // Kontak Page
  "Hubungi / Jadi Mitra": { id: "Hubungi / Jadi Mitra", en: "Contact / Become a Partner", zh: "联系我们 / 成为合作伙伴" },
  "Untuk pemesanan, pasokan rutin katering, kemitraan penggemukan, atau sekadar bertanya — kami senang mendengar dari Anda.": { id: "Untuk pemesanan, pasokan rutin katering, kemitraan penggemukan, atau sekadar bertanya — kami senang mendengar dari Anda.", en: "For orders, regular catering supply, fattening partnerships, or general inquiries — we look forward to hearing from you.", zh: "无论是订购产品、餐饮定期供应、合作养殖，还是普通咨询 —— 我们都非常乐意为您服务。" },
  "WhatsApp": { id: "WhatsApp", en: "WhatsApp", zh: "WhatsApp" },
  "Email": { id: "Email", en: "Email", zh: "电子邮箱" },
  "Lokasi": { id: "Lokasi", en: "Location", zh: "位置" },
  "Chat Langsung via WhatsApp": { id: "Chat Langsung via WhatsApp", en: "Chat via WhatsApp", zh: "直接通过 WhatsApp 沟通" },
  "Nama *": { id: "Nama *", en: "Name *", zh: "姓名 *" },
  "Nama lengkap Anda": { id: "Nama lengkap Anda", en: "Your full name", zh: "您的全名" },
  "Kontak (WhatsApp/Email) *": { id: "Kontak (WhatsApp/Email) *", en: "Contact (WhatsApp/Email) *", zh: "联系方式 (WhatsApp/邮箱) *" },
  "08xx atau email": { id: "08xx atau email", en: "08xx or email", zh: "手机号或邮箱" },
  "Minat": { id: "Minat", en: "Interest", zh: "咨询意向" },
  "Pilih minat Anda (opsional)": { id: "Pilih minat Anda (opsional)", en: "Select your interest (optional)", zh: "选择您的咨询意向（可选）" },
  "Beli produk": { id: "Beli produk", en: "Buy product", zh: "购买产品" },
  "Pasokan rutin / katering": { id: "Pasokan rutin / katering", en: "Regular supply / catering", zh: "定期供应 / 餐饮服务" },
  "Kemitraan": { id: "Kemitraan", en: "Partnership", zh: "业务合作" },
  "Investasi": { id: "Investasi", en: "Investment", zh: "投资合作" },
  "Lainnya": { id: "Lainnya", en: "Other", zh: "其他" },
  "Pesan *": { id: "Pesan *", en: "Message *", zh: "留言内容 *" },
  "Ceritakan kebutuhan Anda...": { id: "Ceritakan kebutuhan Anda...", en: "Tell us about your needs...", zh: "请简述您的需求..." },
  "Mengirim...": { id: "Mengirim...", en: "Sending...", zh: "发送中..." },
  "Pesan terkirim!": { id: "Pesan terkirim!", en: "Message sent!", zh: "信息已发送！" },
  "Terima kasih. Kami akan menghubungi Anda secepatnya.": { id: "Terima kasih. Kami akan menghubungi Anda secepatnya.", en: "Thank you. We will contact you as soon as possible.", zh: "谢谢。我们会尽快与您联系。" },

  // Katalog Page
  "Pilih kategori untuk melihat produk yang tersedia. Kategori bertanda &ldquo;Segera Hadir&rdquo; sedang kami siapkan.": {
    id: "Pilih kategori untuk melihat produk yang tersedia. Kategori bertanda &ldquo;Segera Hadir&rdquo; sedang kami siapkan.",
    en: "Choose a category to view available products. Categories marked &ldquo;Coming Soon&rdquo; are currently being prepared.",
    zh: "选择分类以查看可用产品。标注“即将推出”的品类正在筹备中。"
  },
  "Belum ada kategori publik.": { id: "Belum ada kategori publik.", en: "No public categories yet.", zh: "暂无公开品类。" },
  "← Semua kategori": { id: "← Semua kategori", en: "← All categories", zh: "← 所有品类" },
  "Produk sedang disiapkan": { id: "Produk sedang disiapkan", en: "Products are being prepared", zh: "产品筹备中" },
  "Kami sedang melengkapi katalog kategori ini. Hubungi kami untuk informasi ketersediaan terbaru.": {
    id: "Kami sedang melengkapi katalog kategori ini. Hubungi kami untuk informasi ketersediaan terbaru.",
    en: "We are currently preparing the catalog for this category. Please contact us for availability.",
    zh: "我们正在完善该品类的产品目录。请联系我们以获取最新供应信息。"
  },

  // Produk Page
  "← Kembali ke katalog": { id: "← Kembali ke katalog", en: "← Back to catalog", zh: "← 返回产品目录" },
  "Tersedia": { id: "Tersedia", en: "Available", zh: "有货" },
  "Pre-Order": { id: "Pre-Order", en: "Pre-Order", zh: "预订" },
  "Stok Habis": { id: "Stok Habis", en: "Sold Out", zh: "售罄" },
  "Hubungi untuk harga": { id: "Hubungi untuk harga", en: "Contact for pricing", zh: "联系获取报价" },
  "🔍 Jejak Produk Ini": { id: "🔍 Jejak Produk Ini", en: "🔍 Product Journey / Traceability", zh: "🔍 该产品追溯档案" },
  "Periksa sendiri perjalanan produk ini — dari asal bibit sampai siap potong.": {
    id: "Periksa sendiri perjalanan produk ini — dari asal bibit sampai siap potong.",
    en: "Inspect the journey of this product yourself — from breed sourcing to slaughter-ready.",
    zh: "自主查询此产品的生长历程 —— 从幼崽来源到出栏。"
  },
  "← Lihat produk terkait di katalog": { id: "← Lihat produk terkait di katalog", en: "← See related products in catalog", zh: "← 在目录中查看相关产品" },

  // Jejak Page
  "Riwayat lengkap perjalanan produk — dari asal sampai siap jual.": {
    id: "Riwayat lengkap perjalanan produk — dari asal sampai siap jual.",
    en: "Full history of the product's journey — from sourcing to ready for sale.",
    zh: "完整的产品生命周期档案 —— 从源头到出栏销售。"
  },
  "Kode": { id: "Kode", en: "Code", zh: "编码" },
  "Status": { id: "Status", en: "Status", zh: "状态" },
  "Tahap Tercatat": { id: "Tahap Tercatat", en: "Recorded Stages", zh: "已记录阶段" },
  "Periode": { id: "Periode", en: "Period", zh: "周期" },
  "tahap": { id: "tahap", en: "stages", zh: "阶段" },
  "Data jejak sedang dilengkapi.": { id: "Data jejak sedang dilengkapi.", en: "Traceability data is being finalized.", zh: "追溯数据完善中。" },

  // Footer
  "Navigasi": { id: "Navigasi", en: "Navigation", zh: "导航" },
  "Semua hak dilindungi.": { id: "Semua hak dilindungi.", en: "All rights reserved.", zh: "版权所有。" },
};

/** Dynamic database content translations */
const CONTENT_TRANSLATIONS: Record<string, Record<Language, string>> = {
  "Babi": { id: "Babi", en: "Pork", zh: "生猪" },
  "Kopi": { id: "Kopi", en: "Coffee", zh: "咖啡" },
  "Perikanan": { id: "Perikanan", en: "Fisheries", zh: "渔业" },
  "Babi jenis Duroc, Landrace, dan Crossbreed F1 — digemukkan di kandang Palopo & Morowali dengan pencatatan pertumbuhan rutin.": {
    id: "Babi jenis Duroc, Landrace, dan Crossbreed F1 — digemukkan di kandang Palopo & Morowali dengan pencatatan pertumbuhan rutin.",
    en: "Duroc, Landrace, and Crossbreed F1 pigs — fattened in Palopo & Morowali farms with regular growth monitoring.",
    zh: "杜洛克 (Duroc)、长白 (Landrace) 及 F1 杂交猪 —— 在巴罗波 (Palopo) 与莫罗瓦利 (Morowali) 农场进行育肥，并记录日常生长数据。"
  },
  "Kopi Arabika Toraja & Wamena, diolah full wash langsung dari petani. Segera hadir.": {
    id: "Kopi Arabika Toraja & Wamena, diolah full wash langsung dari petani. Segera hadir.",
    en: "Toraja & Wamena Arabica Coffee, processed via full wash directly from farmers. Coming soon.",
    zh: "塔纳托拉雅 (Toraja) 与瓦梅纳 (Wamena) 阿拉比卡咖啡，由农户直接进行全水洗处理。即将推出。"
  },
  "Hasil perikanan segar dari perairan Sulawesi. Segera hadir.": {
    id: "Hasil perikanan segar dari perairan Sulawesi. Segera hadir.",
    en: "Fresh fishery products sourced from Sulawesi waters. Coming soon.",
    zh: "源自苏拉威西海域的新鲜渔业产品。即将推出。"
  },

  // Product names & breeds
  "Karkas Babi Duroc": {
    id: "Karkas Babi Duroc",
    en: "Duroc Pork Carcass",
    zh: "杜洛克猪胴体"
  },
  "Karkas babi Duroc dari kandang Palopo. Dipelihara 8-9 bulan dengan pakan terkontrol dan pencatatan bobot rutin. Rendemen karkas rata-rata di atas 75%. Setiap karkas dapat ditelusuri riwayatnya melalui halaman jejak produk.": {
    id: "Karkas babi Duroc dari kandang Palopo. Dipelihara 8-9 bulan dengan pakan terkontrol dan pencatatan bobot rutin. Rendemen karkas rata-rata di atas 75%. Setiap karkas dapat ditelusuri riwayatnya melalui halaman jejak produk.",
    en: "Duroc pork carcass from Palopo farm. Raised for 8-9 months with controlled feed and regular weight tracking. Average carcass yield above 75%. The history of each carcass can be traced via the product journey page.",
    zh: "源自巴罗波农场的杜洛克猪胴体。经过 8-9 个月的科学饲喂，并进行定期称重记录。平均屠宰率超过 75%。可通过产品追溯页面查询每只猪的生长历程。"
  },
  "Karkas utuh babi Duroc umur potong 8-9 bulan, rendemen 75%+.": {
    id: "Karkas utuh babi Duroc umur potong 8-9 bulan, rendemen 75%+.",
    en: "Whole Duroc pork carcass, slaughter age 8-9 months, yield 75%+.",
    zh: "8-9 个月出栏的整只杜洛克猪胴体，屠宰率 75% 以上。"
  },
  "Daging Babi Potongan Komersial": {
    id: "Daging Babi Potongan Komersial",
    en: "Commercial Pork Cuts",
    zh: "商业分割猪肉"
  },
  "Potongan komersial dari karkas pilihan: loin, belly (samcan), shoulder, dan ham. Dipotong higienis dan dikemas vakum. Cocok untuk katering, restoran, dan kebutuhan rumah tangga di Palopo & Morowali.": {
    id: "Potongan komersial dari karkas pilihan: loin, belly (samcan), shoulder, dan ham. Dipotong higienis dan dikemas vakum. Cocok untuk katering, restoran, dan kebutuhan rumah tangga di Palopo & Morowali.",
    en: "Commercial cuts from premium carcasses: loin, belly, shoulder, and ham. Hygienically cut and vacuum packed. Ideal for catering, restaurants, and household needs in Palopo & Morowali.",
    zh: "精选优质胴体进行商业分割：里脊、五花、梅花/前腿肉和后腿肉。卫生切割并进行真空包装，适用于餐饮服务、餐厅以及巴罗波与莫罗瓦利居民的家庭日常需求。"
  },
  "Potongan komersial siap masak: loin, belly, shoulder, ham.": {
    id: "Potongan komersial siap masak: loin, belly, shoulder, ham.",
    en: "Ready-to-cook commercial cuts: loin, belly, shoulder, ham.",
    zh: "即烹型商业分割肉：里脊、五花肉、前腿肉、后腿肉。"
  },
  "Babi Hidup Siap Potong": {
    id: "Babi Hidup Siap Potong",
    en: "Live Pig (Slaughter-ready)",
    zh: "待宰活猪"
  },
  "Babi hidup siap potong dengan bobot 90-110 kg. Setiap ekor punya kode jejak yang bisa Anda periksa: asal bibit, riwayat pakan, vaksinasi, dan perkembangan bobot. Harga mengikuti bobot timbang dan kondisi pasar — hubungi kami untuk penawaran.": {
    id: "Babi hidup siap potong dengan bobot 90-110 kg. Setiap ekor punya kode jejak yang bisa Anda periksa: asal bibit, riwayat pakan, vaksinasi, dan perkembangan bobot. Harga mengikuti bobot timbang dan kondisi pasar — hubungi kami untuk penawaran.",
    en: "Slaughter-ready live pigs with 90-110 kg weight. Each head has a trace code you can inspect: breed origin, feed history, vaccination, and weight progress. Price depends on weight scale and market conditions — contact us for quotes.",
    zh: "体重在 90-110 公斤的待宰活猪。每只猪都拥有专属追溯编码，您可以查询其幼崽来源、饲喂记录、疫苗接种和体重增长情况。价格根据实际称重及市场行情决定 —— 欢迎联系我们获取报价。"
  },
  "Babi hidup bobot 90-110 kg, siap potong, jejak lengkap.": {
    id: "Babi hidup bobot 90-110 kg, siap potong, jejak lengkap.",
    en: "Live pig weight 90-110 kg, slaughter-ready, complete traceability.",
    zh: "体重 90-110 公斤的活猪，待宰，提供完整追溯数据。"
  },
  "Bibit Weaner Crossbreed F1": {
    id: "Bibit Weaner Crossbreed F1",
    en: "F1 Crossbreed Weaner Piglets",
    zh: "F1 杂交断奶仔猪"
  },
  "Bibit weaner Crossbreed F1 umur 6-8 minggu, sudah melalui vaksinasi dasar dan pemeriksaan kesehatan. Cocok untuk mitra penggemukan. Ketersediaan terbatas per batch — pre-order disarankan.": {
    id: "Bibit weaner Crossbreed F1 umur 6-8 minggu, sudah melalui vaksinasi dasar dan pemeriksaan kesehatan. Cocok untuk mitra penggemukan. Ketersediaan terbatas per batch — pre-order disarankan.",
    en: "F1 Crossbreed weaner piglets aged 6-8 weeks, completed basic vaccinations and health checks. Suitable for fattening partners. Limited availability per batch — pre-order recommended.",
    zh: "6-8 周龄的 F1 杂交断奶仔猪，已完成基础疫苗接种和健康检查。适用于合作育肥农场。每批次供应数量有限 —— 建议提前预订。"
  },
  "Weaner umur 6-8 minggu untuk penggemukan, kesehatan terverifikasi.": {
    id: "Weaner umur 6-8 minggu untuk penggemukan, kesehatan terverifikasi.",
    en: "Weaners aged 6-8 weeks for fattening, verified health status.",
    zh: "用于育肥的 6-8 周龄仔猪，健康状态已验证。"
  },
  "Duroc / Landrace": { id: "Duroc / Landrace", en: "Duroc / Landrace", zh: "杜洛克 / 长白" },
  "Duroc / Crossbreed F1": { id: "Duroc / Crossbreed F1", en: "Duroc / Crossbreed F1", zh: "杜洛克 / F1 杂交猪" },
  "Crossbreed F1": { id: "Crossbreed F1", en: "Crossbreed F1", zh: "F1 杂交猪" },

  // Site settings
  "Komoditas tertelusur dari Sulawesi": { id: "Komoditas tertelusur dari Sulawesi", en: "Traceable commodities from Sulawesi", zh: "来自苏拉威西的可追溯产品" },
  "Peternakan babi di Palopo & Morowali dengan pencatatan jejak penuh — setiap ekor tercatat dari akuisisi bibit sampai siap potong. Menyusul: kopi Toraja & perikanan.": {
    id: "Peternakan babi di Palopo & Morowali dengan pencatatan jejak penuh — setiap ekor tercatat dari akuisisi bibit sampai siap potong. Menyusul: kopi Toraja & perikanan.",
    en: "Pig farming in Palopo & Morowali with complete traceability — each head is recorded from breed sourcing to slaughter-ready. Coming soon: Toraja coffee & fisheries.",
    zh: "位于巴罗波与莫罗瓦利的生猪养殖场，提供全程追溯记录 —— 每只猪从幼崽引进到出栏皆有据可查。即将推出：托拉雅咖啡与渔业产品。"
  },
  "Palopo & Morowali, Sulawesi": { id: "Palopo & Morowali, Sulawesi", en: "Palopo & Morowali, Sulawesi", zh: "苏拉威西，巴罗波 & 莫罗瓦利" },

  // Traceability subjects
  "Babi Duroc #001": { id: "Babi Duroc #001", en: "Duroc Pig #001", zh: "杜洛克生猪 #001" },
  "Babi Crossbreed F1 #014": { id: "Babi Crossbreed F1 #014", en: "F1 Crossbreed Pig #014", zh: "F1 杂交生猪 #014" },
  "Siap Potong": { id: "Siap Potong", en: "Slaughter-ready", zh: "准备出栏" },
  "Pertumbuhan": { id: "Pertumbuhan", en: "Growth", zh: "生长期" },

  // Traceability events
  "Akuisisi Bibit": { id: "Akuisisi Bibit", en: "Breed Acquisition", zh: "幼崽引进" },
  "Weaner Duroc jantan dibeli dari peternak mitra di Toraja Utara. Kondisi sehat, nafsu makan baik.": {
    id: "Weaner Duroc jantan dibeli dari peternak mitra di Toraja Utara. Kondisi sehat, nafsu makan baik.",
    en: "Male Duroc weaner purchased from a partner breeder in North Toraja. Healthy condition, good appetite.",
    zh: "从北托拉雅的合作伙伴处引进杜洛克雄性仔猪。健康状况良好，食欲旺盛。"
  },
  "Toraja Utara": { id: "Toraja Utara", en: "North Toraja", zh: "北托拉雅" },
  "Transportasi ke Kandang": { id: "Transportasi ke Kandang", en: "Transport to Farm", zh: "运送至农场" },
  "Diangkut dengan pickup berkandang ventilasi. Perjalanan lancar tanpa stres berarti.": {
    id: "Diangkut dengan pickup berkandang ventilasi. Perjalanan lancar tanpa stres berarti.",
    en: "Transported using a ventilated pickup. Smooth trip without significant stress.",
    zh: "采用通风良好的皮卡车进行运输。运输过程顺利，无明显应激反应。"
  },
  "Toraja Utara → Palopo": { id: "Toraja Utara → Palopo", en: "North Toraja → Palopo", zh: "北托拉雅 → 巴罗波" },
  "Penempatan Kandang": { id: "Penempatan Kandang", en: "Housing Placement", zh: "入舍安置" },
  "Masuk kandang karantina 2 minggu, lalu pindah ke pen penggemukan blok A.": {
    id: "Masuk kandang karantina 2 minggu, lalu pindah ke pen penggemukan blok A.",
    en: "Entered quarantine pen for 2 weeks, then moved to fattening pen block A.",
    zh: "进入隔离舍观察两周，随后转入育肥舍 A 区。"
  },
  "Kandang Palopo": { id: "Kandang Palopo", en: "Palopo Farm", zh: "巴罗波农场" },
  "Pertumbuhan Bulan ke-4": { id: "Pertumbuhan Bulan ke-4", en: "Month 4 Growth", zh: "第 4 个月生长期" },
  "Perkembangan bobot sesuai target. Pakan konsentrat + hijauan fermentasi.": {
    id: "Perkembangan bobot sesuai target. Pakan konsentrat + hijauan fermentasi.",
    en: "Weight progress on track. Concentrated feed + fermented forage.",
    zh: "体重增长符合预期目标。饲喂精饲料 + 发酵粗饲料。"
  },
  "Vaksinasi & Pemeriksaan": { id: "Vaksinasi & Pemeriksaan", en: "Vaccination & Health Check", zh: "疫苗接种与检疫" },
  "Vaksinasi hog cholera booster dan pemeriksaan kesehatan menyeluruh. Hasil: sehat.": {
    id: "Vaksinasi hog cholera booster dan pemeriksaan kesehatan menyeluruh. Hasil: sehat.",
    en: "Hog cholera booster vaccination and thorough health check. Result: healthy.",
    zh: "接种猪瘟强化疫苗并进行全面健康检查。结果：健康。"
  },
  "Mencapai bobot potong optimal. Estimasi rendemen karkas 76%.": {
    id: "Mencapai bobot potong optimal. Estimasi rendemen karkas 76%.",
    en: "Reached optimal slaughter weight. Estimated carcass yield 76%.",
    zh: "达到最佳出栏体重。预计屠宰率 76%。"
  },
  "Weaner Crossbreed F1 betina dari batch mitra Palopo.": {
    id: "Weaner Crossbreed F1 betina dari batch mitra Palopo.",
    en: "Female F1 Crossbreed weaner from Palopo partner batch.",
    zh: "源自巴罗波合作伙伴批次的雌性 F1 杂交仔猪。"
  },
  "Palopo": { id: "Palopo", en: "Palopo", zh: "巴罗波" },
  "Langsung masuk kandang Morowali blok B setelah karantina singkat.": {
    id: "Langsung masuk kandang Morowali blok B setelah karantina singkat.",
    en: "Moved directly to Morowali pen block B after a short quarantine.",
    zh: "在进行简短的隔离观察后，直接送入莫罗瓦利农场 B 区。"
  },
  "Kandang Morowali": { id: "Kandang Morowali", en: "Morowali Farm", zh: "莫罗瓦利农场" },
  "Pertumbuhan Bulan ke-2": { id: "Pertumbuhan Bulan ke-2", en: "Month 2 Growth", zh: "第 2 个月生长期" },
  "Bobot naik konsisten, target potong Desember 2026.": {
    id: "Bobot naik konsisten, target potong Desember 2026.",
    en: "Consistent weight gain, slaughter target December 2026.",
    zh: "体重稳定增长，计划于 2026 年 12 月出栏。"
  },
  "Vaksinasi Dasar": { id: "Vaksinasi Dasar", en: "Basic Vaccination", zh: "基础免疫" },
  "Vaksin hog cholera dosis pertama.": {
    id: "Vaksin hog cholera dosis pertama.",
    en: "First dose hog cholera vaccine.",
    zh: "接种第一剂猪瘟疫苗。"
  },

  // Product names
  "Babi Hidup (Slaughter)": { id: "Babi Hidup (Slaughter)", en: "Live Pig (Slaughter)", zh: "待宰活猪" },
  "Karkas Babi (Pork Carcass)": { id: "Karkas Babi (Pork Carcass)", en: "Pork Carcass", zh: "猪胴体" },
  "Babi Ekstra Lemak": { id: "Babi Ekstra Lemak", en: "Extra Fat Pig", zh: "高脂猪" },
  "Anakan Babi (Weaner)": { id: "Anakan Babi (Weaner)", en: "Weaner Pig", zh: "断奶仔猪" },

  // Traceability stages (EventType labels)
  "Transportasi": { id: "Transportasi", en: "Transportation", zh: "运输环节" },
  "Kesehatan": { id: "Kesehatan", en: "Health Track", zh: "健康监测" },
  "Siap Potong / Karkas": { id: "Siap Potong / Karkas", en: "Slaughter-ready / Carcass", zh: "出栏 / 胴体" },

  // Page blocks - Home page
  "Kenapa Tri Agri": { id: "Kenapa Tri Agri", en: "Why Tri Agri", zh: "为什么选择 Tri Agri" },
  "Kami percaya pembeli premium berhak tahu asal-usul produknya. Karena itu setiap ekor babi di kandang kami tercatat: dari siapa bibitnya dibeli, bagaimana perjalanannya, apa pakannya, sampai kapan siap potong.": {
    id: "Kami percaya pembeli premium berhak tahu asal-usul produknya. Karena itu setiap ekor babi di kandang kami tercatat: dari siapa bibitnya dibeli, bagaimana perjalanannya, apa pakannya, sampai kapan siap potong.",
    en: "We believe premium buyers deserve to know the origin of their products. That is why every pig in our farm is recorded: from whom the breed was purchased, how its journey went, what its feed was, until when it is ready for slaughter.",
    zh: "我们相信优质客户有权了解产品的来源。因此，我们农场里的每一只猪都有完整记录：包括幼崽购自何处、运输过程、饲料种类以及出栏时间。"
  },
  "Ekor dalam pemeliharaan": { id: "Ekor dalam pemeliharaan", en: "Heads under breeding", zh: "在栏生猪数" },
  "Lokasi kandang": { id: "Lokasi kandang", en: "Farm locations", zh: "农场分布" },
  "Rendemen karkas rata-rata": { id: "Rendemen karkas rata-rata", en: "Average carcass yield", zh: "平均屠宰率" },
  "Tahap jejak per ekor": { id: "Tahap jejak per ekor", en: "Trace stages per head", zh: "单只猪可追溯阶段" },

  // Page blocks - About page
  "Visi Kami": { id: "Visi Kami", en: "Our Vision", zh: "我们的愿景" },
  "Menjadi pemasok komoditas tertelusur terpercaya di Sulawesi — mulai dari daging babi berkualitas untuk pasar Palopo & Morowali, lalu berkembang ke kopi Toraja/Wamena dan hasil perikanan.": {
    id: "Menjadi pemasok komoditas tertelusur terpercaya di Sulawesi — mulai dari daging babi berkualitas untuk pasar Palopo & Morowali, lalu berkembang ke kopi Toraja/Wamena dan hasil perikanan.",
    en: "To be a trusted traceable commodity supplier in Sulawesi — starting from quality pork for the Palopo & Morowali markets, then expanding into Toraja/Wamena coffee and fishery products.",
    zh: "致力于成为苏拉威西地区值得信赖的可追溯商品供应商 —— 从满足巴罗波和莫罗瓦利市场的高品质猪肉开始，进而扩展到托拉雅/瓦梅纳咖啡以及渔业产品。"
  },
  "Model Bisnis": { id: "Model Bisnis", en: "Business Model", zh: "商业模式" },
  "Kami membeli weaner (anak babi lepas sapih) dari pemasok terverifikasi, menggemukkannya 6-8 bulan di kandang sendiri dengan pakan terkontrol, lalu menjualnya sebagai babi hidup siap potong, karkas, atau potongan komersial. Sebagian kecil induk dipelihara untuk breeding jangka panjang.": {
    id: "Kami membeli weaner (anak babi lepas sapih) dari pemasok terverifikasi, menggemukkannya 6-8 bulan di kandang sendiri dengan pakan terkontrol, lalu menjualnya sebagai babi hidup siap potong, karkas, atau potongan komersial. Sebagian kecil induk dipelihara untuk breeding jangka panjang.",
    en: "We purchase weaners (weaned piglets) from verified suppliers, fatten them for 6-8 months in our own pens with controlled feed, and sell them as slaughter-ready live pigs, carcasses, or commercial cuts. A small number of sows are raised for long-term breeding.",
    zh: "我们从经过验证的供应商处购买断奶仔猪，在自有农场中进行 6-8 个月的科学育肥，随后作为出栏活猪、胴体或商业分割猪肉销售。我们还保留了少量的母猪进行长期繁育。"
  },
  "Kandang utama di Palopo (Sulawesi Selatan) melayani pasar lokal dan Toraja. Kandang kedua di Morowali (Sulawesi Tengah) melayani kebutuhan katering kawasan industri IMIP dan sekitarnya.": {
    id: "Kandang utama di Palopo (Sulawesi Selatan) melayani pasar lokal dan Toraja. Kandang kedua di Morowali (Sulawesi Tengah) melayani kebutuhan katering kawasan industri IMIP dan sekitarnya.",
    en: "The main farm in Palopo (South Sulawesi) serves local and Toraja markets. The second farm in Morowali (Central Sulawesi) serves the catering needs of the IMIP industrial zone and surroundings.",
    zh: "位于巴罗波 (南苏拉威西) 的主农场服务于本地及托拉雅市场。位于莫罗瓦利 (中苏拉威西) 的第二农场主要服务于 IMIP 工业区餐饮及周边需求。"
  },
  "Berdiri": { id: "Berdiri", en: "Established", zh: "成立时间" },
  "Kapasitas kandang": { id: "Kapasitas kandang", en: "Farm capacity", zh: "农场容量" },
  "200 ekor": { id: "200 ekor", en: "200 heads", zh: "200 头" },
  "Tim lapangan": { id: "Tim lapangan", en: "Field team", zh: "现场团队" },
  "5 orang": { id: "5 orang", en: "5 people", zh: "5 人" },
};

export function t(key: string, lang: Language): string {
  if (STATIC_TRANSLATIONS[key]) {
    return STATIC_TRANSLATIONS[key][lang] || STATIC_TRANSLATIONS[key]["id"] || key;
  }
  return key;
}

export function tc(text: string | null | undefined, lang: Language): string {
  if (!text) return "";
  if (lang === "id") return text;
  
  // Try exact match in STATIC_TRANSLATIONS
  if (STATIC_TRANSLATIONS[text]) {
    return STATIC_TRANSLATIONS[text][lang] || STATIC_TRANSLATIONS[text]["id"] || text;
  }
  
  // Try exact match
  if (CONTENT_TRANSLATIONS[text]) {
    return CONTENT_TRANSLATIONS[text][lang] || CONTENT_TRANSLATIONS[text]["id"] || text;
  }
  
  // Try partial mappings for sentences or dynamic blocks
  let translated = text;
  for (const [key, valueObj] of Object.entries(CONTENT_TRANSLATIONS)) {
    const replacement = valueObj[lang] || valueObj["id"] || key;
    translated = translated.replaceAll(key, replacement);
  }
  
  return translated;
}
