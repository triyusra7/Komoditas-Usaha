export type Language = "id" | "en" | "zh";

const STATIC_TRANSLATIONS: Record<string, Record<Language, string>> = {
  // Navigation
  "Beranda": { id: "Beranda", en: "Home", zh: "首页" },
  "Tentang": { id: "Tentang", en: "About", zh: "关于" },
  "Katalog": { id: "Katalog", en: "Catalog", zh: "产品目录" },
  "Kontak": { id: "Kontak", en: "Contact", zh: "联系我们" },
  "Hubungi Kami": { id: "Hubungi Kami", en: "Contact Us", zh: "联系我们" },

  // Hero
  "Dari lahan & kebun terbaik Sulawesi —": { id: "Dari lahan & kebun terbaik Sulawesi —", en: "From the finest farms & plantations of Sulawesi —", zh: "源自苏拉威西精选农田与庄园 —" },
  "tertelusur penuh.": { id: "tertelusur penuh.", en: "fully traceable.", zh: "全程可追溯。" },
  "Lihat Katalog": { id: "Lihat Katalog", en: "View Catalog", zh: "查看产品目录" },
  "Hubungi via WhatsApp": { id: "Hubungi via WhatsApp", en: "Contact via WhatsApp", zh: "通过 WhatsApp 联系" },

  // Categories & Featured
  "Komoditas Kami": { id: "Komoditas Kami", en: "Our Commodities", zh: "我们的主要产品" },
  "Komoditas unggulan: Jagung Pakan & Kopi Sulawesi.": { id: "Komoditas unggulan: Jagung Pakan & Kopi Sulawesi.", en: "Featured commodities: Feed Corn & Sulawesi Coffee.", zh: "核心特色产品：饲料玉米与苏拉威西咖啡。" },
  "Fokus rilis pertama: Babi. Kopi & Perikanan menyusul.": { id: "Komoditas unggulan: Jagung Pakan & Kopi Sulawesi.", en: "Featured commodities: Feed Corn & Sulawesi Coffee.", zh: "核心特色产品：饲料玉米与苏拉威西咖啡。" },
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
  "Butuh pasokan rutin jagung pakan atau green bean kopi untuk usaha Anda?": { id: "Butuh pasokan rutin jagung pakan atau green bean kopi untuk usaha Anda?", en: "Need regular supply of feed corn or green bean coffee for your business?", zh: "您的企业需要定期采购饲料玉米或咖啡生豆吗？" },
  "Kami melayani kebutuhan pabrik pakan, peternak mandiri, roastery, dan distributor komoditas di Sulawesi dan sekitarnya.": { id: "Kami melayani kebutuhan pabrik pakan, peternak mandiri, roastery, dan distributor komoditas di Sulawesi dan sekitarnya.", en: "We serve feed mills, independent farmers, roasteries, and commodity distributors across Sulawesi and beyond.", zh: "我们为苏拉威西及周边地区的饲料加工厂、独立养殖户、烘焙工坊及贸易商提供供应服务。" },
  "Butuh pasokan rutin untuk katering atau usaha Anda?": { id: "Butuh pasokan rutin jagung pakan atau green bean kopi untuk usaha Anda?", en: "Need regular supply of feed corn or green bean coffee for your business?", zh: "您的企业需要定期采购饲料玉米或咖啡生豆吗？" },
  "Kami melayani kebutuhan katering kawasan industri, restoran, dan pengepul di Palopo, Morowali, dan sekitarnya.": { id: "Kami melayani kebutuhan pabrik pakan, peternak mandiri, roastery, dan distributor komoditas di Sulawesi dan sekitarnya.", en: "We serve feed mills, independent farmers, roasteries, and commodity distributors across Sulawesi and beyond.", zh: "我们为苏拉威西及周边地区的饲料加工厂、独立养殖户、烘焙工坊及贸易商提供供应服务。" },
  "Chat WhatsApp Sekarang": { id: "Chat WhatsApp Sekarang", en: "Chat via WhatsApp", zh: "立即通过 WhatsApp 咨询" },
  "Kirim Pesan": { id: "Kirim Pesan", en: "Send Message", zh: "发送信息" },

  // Tentang Page
  "Tentang Kami": { id: "Tentang Kami", en: "About Us", zh: "关于我们" },
  "Ingin tahu lebih banyak?": { id: "Ingin tahu lebih banyak?", en: "Want to know more?", zh: "想了解更多？" },
  "Kami terbuka untuk kunjungan kebun, kemitraan petani, dan pertanyaan seputar produk.": { id: "Kami terbuka untuk kunjungan kebun, kemitraan petani, dan pertanyaan seputar produk.", en: "We are open to farm visits, farmer partnerships, and product inquiries.", zh: "我们欢迎农场参观、农户合作及产品咨询。" },
  "Kami terbuka untuk kunjungan kandang, kemitraan, dan pertanyaan seputar produk.": { id: "Kami terbuka untuk kunjungan kebun, kemitraan petani, dan pertanyaan seputar produk.", en: "We are open to farm visits, farmer partnerships, and product inquiries.", zh: "我们欢迎农场参观、农户合作及产品咨询。" },
  "Konten halaman ini sedang disiapkan. Silakan hubungi kami untuk informasi lebih lanjut.": { id: "Konten halaman ini sedang disiapkan. Silakan hubungi kami untuk informasi lebih lanjut.", en: "The content of this page is being prepared. Please contact us for more information.", zh: "本页内容正在准备中。如需了解更多详情，请与我们联系。" },
  "Siapa Kami": { id: "Siapa Kami", en: "Who We Are", zh: "我们是谁" },
  "Penyedia Komoditas Jagung Pakan & Kopi Tertelusur di Sulawesi": { id: "Penyedia Komoditas Jagung Pakan & Kopi Tertelusur di Sulawesi", en: "Trusted Provider of Traceable Feed Corn & Coffee in Sulawesi", zh: "苏拉威西值得信赖的可追溯饲料玉米与咖啡供应商" },
  "Penyedia Komoditas Ternak Tertelusur Terpercaya di Sulawesi": { id: "Penyedia Komoditas Jagung Pakan & Kopi Tertelusur di Sulawesi", en: "Trusted Provider of Traceable Feed Corn & Coffee in Sulawesi", zh: "苏拉威西值得信赖的可追溯饲料玉米与咖啡供应商" },
  "Tri Agri didirikan dengan misi membawa standar baru dalam rantai pasok agribisnis di Sulawesi. Melalui kemitraan erat dengan petani jagung dan perkebunan kopi, kontrol mutu bahan dan kadar air yang ketat, serta teknologi penelusuran (traceability) digital, kami menghadirkan jagung pakan berkualitas tinggi dan green bean kopi pilihan untuk mitra industri dan konsumen.": {
    id: "Tri Agri didirikan dengan misi membawa standar baru dalam rantai pasok agribisnis di Sulawesi. Melalui kemitraan erat dengan petani jagung dan perkebunan kopi, kontrol mutu bahan dan kadar air yang ketat, serta teknologi penelusuran (traceability) digital, kami menghadirkan jagung pakan berkualitas tinggi dan green bean kopi pilihan untuk mitra industri dan konsumen.",
    en: "Tri Agri was founded with a mission to bring new standards to the agribusiness supply chain in Sulawesi. Through close partnerships with corn farmers and coffee plantations, strict quality control of materials and moisture, and digital traceability technology, we deliver high-quality feed corn and premium green beans to industrial partners and consumers.",
    zh: "Tri Agri 的创立使命是为苏拉威西的农业供应链树立新标准。通过与玉米种植农户及咖啡庄园的紧密合作、严格的原料与水分品控，以及数字化追溯技术，我们为工业合作伙伴及客户提供高品质饲料玉米和精选咖啡生豆。"
  },
  "Sentra Sulawesi": { id: "Sentra Sulawesi", en: "Sulawesi Agricultural Hub", zh: "苏拉威西农业核心基地" },
  "Palopo & Morowali": { id: "Sentra Sulawesi", en: "Sulawesi Agricultural Hub", zh: "苏拉威西农业核心基地" },
  "Pusat kemitraan jagung pakan dan kopi dataran tinggi terbaik untuk memasok kebutuhan industri pakan dan roastery.": {
    id: "Pusat kemitraan jagung pakan dan kopi dataran tinggi terbaik untuk memasok kebutuhan industri pakan dan roastery.",
    en: "Partnership center for high-grade feed corn and highland coffee supplying feed mills and specialty roasteries.",
    zh: "优质饲料玉米与高海拔咖啡合作中心，持续供应饲料工业及精品咖啡烘焙厂需求。"
  },
  "Dua pusat operasional strategis untuk melayani pasar Sulawesi Selatan, Toraja, dan Kawasan Industri Morowali.": {
    id: "Pusat kemitraan jagung pakan dan kopi dataran tinggi terbaik untuk memasok kebutuhan industri pakan dan roastery.",
    en: "Partnership center for high-grade feed corn and highland coffee supplying feed mills and specialty roasteries.",
    zh: "优质饲料玉米与高海拔咖啡合作中心，持续供应饲料工业及精品咖啡烘焙厂需求。"
  },
  "Visi & Misi": { id: "Visi & Misi", en: "Vision & Mission", zh: "愿景与使命" },
  "Arah & Landasan Kerja Kami": { id: "Arah & Landasan Kerja Kami", en: "Our Direction & Working Foundation", zh: "我们的指引与工作基石" },
  "Misi Kami": { id: "Misi Kami", en: "Our Mission", zh: "我们的使命" },
  "Mendukung produktivitas petani mitra melalui pendampingan benih unggul, pupuk berimbang, dan pasca-panen terstandar.": {
    id: "Mendukung produktivitas petani mitra melalui pendampingan benih unggul, pupuk berimbang, dan pasca-panen terstandar.",
    en: "Supporting partner farmers through superior seeds, balanced fertilization, and standardized post-harvest practices.",
    zh: "通过优质良种指导、平衡施肥方案及标准化采后加工，助力合作农户提高生产力。"
  },
  "Menyediakan jagung pakan berkadar air rendah (<14%) dan bebas aflatoksin untuk industri pakan ternak.": {
    id: "Menyediakan jagung pakan berkadar air rendah (<14%) dan bebas aflatoksin untuk industri pakan ternak.",
    en: "Supplying low-moisture (<14%) and aflatoxin-free feed corn for livestock feed mills.",
    zh: "为畜禽饲料加工厂提供低水分 (<14%) 且无黄曲霉毒素的优质饲料玉米。"
  },
  "Menghasilkan green bean kopi specialty dan fine robusta dengan profil rasa prima dan ketertelusuran kebun asal.": {
    id: "Menghasilkan green bean kopi specialty dan fine robusta dengan profil rasa prima dan ketertelusuran kebun asal.",
    en: "Producing specialty arabica and fine robusta green beans with exquisite taste profiles and plantation traceability.",
    zh: "出品拥有卓越风味轮廓和源头庄园全程追溯的精品阿拉比卡与精细罗布斯塔咖啡生豆。"
  },
  "Menerapkan sistem penelusuran digital (traceability) transparan di setiap batch komoditas.": {
    id: "Menerapkan sistem penelusuran digital (traceability) transparan di setiap batch komoditas.",
    en: "Implementing transparent digital traceability across every commodity batch.",
    zh: "在每个批次的大宗商品中实施公开透明的数字化追溯系统。"
  },
  "Menjadi pemasok komoditas jagung pakan dan kopi terpercaya dengan jaminan ketertelusuran penuh dan transparansi bahan demi kepuasan mitra di Indonesia.": {
    id: "Menjadi pemasok komoditas jagung pakan dan kopi terpercaya dengan jaminan ketertelusuran penuh dan transparansi bahan demi kepuasan mitra di Indonesia.",
    en: "To be a trusted supplier of feed corn and coffee with complete traceability and material transparency for partner satisfaction across Indonesia.",
    zh: "致力于成为印度尼西亚值得信赖的饲料玉米与咖啡供应商，提供全流程追溯与用料透明保障，满足商业伙伴需求。"
  },
  "Jelajahi komoditas unggulan kami: jagung pakan berkualitas tinggi dengan kadar air terkontrol dan biji kopi pilihan dari kebun-kebun terbaik Sulawesi dengan ketertelusuran penuh.": {
    id: "Jelajahi komoditas unggulan kami: jagung pakan berkualitas tinggi dengan kadar air terkontrol dan biji kopi pilihan dari kebun-kebun terbaik Sulawesi dengan ketertelusuran penuh.",
    en: "Explore our signature commodities: high-grade feed corn with controlled moisture and select coffee beans from Sulawesi's finest plantations with complete traceability.",
    zh: "探索我们的核心特色商品：水分严控的高品质饲料玉米，以及源自苏拉威西精选庄园、全程可追溯的优质咖啡豆。"
  },
  "Jelajahi pilihan produk segar berkualitas tinggi dari kategori ini, diproduksi higienis dengan jaminan penelusuran penuh.": { id: "Jelajahi pilihan produk segar berkualitas tinggi dari kategori ini, diproduksi higienis dengan jaminan penelusuran penuh.", en: "Explore our selection of high-quality products from this category with full traceability guarantee.", zh: "探索该品类下精选的高品质产品，提供完整的可追溯保障。" },

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
  "Jagung Pakan": { id: "Jagung Pakan", en: "Feed Corn", zh: "饲料玉米" },
  "Kopi": { id: "Kopi", en: "Coffee", zh: "咖啡" },
  "Perikanan": { id: "Perikanan", en: "Fisheries", zh: "渔业" },
  "Jagung": { id: "Jagung", en: "Corn", zh: "玉米" },
  "Babi": { id: "Jagung Pakan", en: "Feed Corn", zh: "饲料玉米" },

  "Jagung pipil kering kualitas super untuk bahan pakan ternak. Dipanen dari lahan mitra Sulawesi dengan kadar air terkontrol (<14%).": {
    id: "Jagung pipil kering kualitas super untuk bahan pakan ternak. Dipanen dari lahan mitra Sulawesi dengan kadar air terkontrol (<14%).",
    en: "Premium dry shelled corn for animal feed raw materials. Harvested from Sulawesi partner farms with controlled moisture (<14%).",
    zh: "特级烘干脱粒饲料玉米。源自苏拉威西合作农场，水分严控 (<14%)，富含营养。"
  },
  "Kopi Arabika Toraja & Sulawesi Specialty, dipetik merah dan diolah terstandar langsung dari petani.": {
    id: "Kopi Arabika Toraja & Sulawesi Specialty, dipetik merah dan diolah terstandar langsung dari petani.",
    en: "Toraja & Sulawesi Specialty Arabica Coffee, 100% red-cherry picked and processed directly with farmers.",
    zh: "托拉雅与苏拉威西精品阿拉比卡咖啡，严格全红果采摘，由合作农户标准化精制。"
  },
  "Hasil komoditas pertanian dan perkebunan berkualitas tinggi dari Sulawesi.": {
    id: "Hasil komoditas pertanian dan perkebunan berkualitas tinggi dari Sulawesi.",
    en: "High-quality agricultural and plantation commodities from Sulawesi.",
    zh: "源自苏拉威西的优质农产品与大宗经济作物。"
  },

  // Product names
  "Jagung Pipil Kering Pakan Ternak": {
    id: "Jagung Pipil Kering Pakan Ternak",
    en: "Dry Shelled Feed Corn",
    zh: "烘干脱粒饲料玉米"
  },
  "Jagung pipil kering kadar air rendah (<14%), bebas jamur dan aflatoksin, kaya karbohidrat dan protein untuk formulasi pakan ternak unggas dan ruminansia.": {
    id: "Jagung pipil kering kadar air rendah (<14%), bebas jamur dan aflatoksin, kaya karbohidrat dan protein untuk formulasi pakan ternak unggas dan ruminansia.",
    en: "Low-moisture (<14%) dry shelled corn, free of mold and aflatoxins, rich in carbohydrates and protein for poultry and ruminant feed formulations.",
    zh: "低水分 (<14%) 烘干玉米粒，无霉变及黄曲霉毒素，富含碳水化合物与粗蛋白，专供禽类与反刍动物饲料调配。"
  },
  "Jagung pipil kering kadar air <14%, bebas aflatoksin, standar pakan industri.": {
    id: "Jagung pipil kering kadar air <14%, bebas aflatoksin, standar pakan industri.",
    en: "Dry shelled corn with moisture <14%, aflatoxin-safe, industrial feed standard.",
    zh: "含水率 <14% 烘干脱粒玉米，符合工业饲料检测安全标准。"
  },

  "Kopi Arabika Toraja Green Bean": {
    id: "Kopi Arabika Toraja Green Bean",
    en: "Toraja Arabica Green Bean",
    zh: "托拉雅阿拉比卡咖啡生豆"
  },
  "Biji kopi Arabika Toraja pilihan dari ketinggian 1.400-1.600 mdpl. Proses Full Wash / Wet Hulled dengan sortasi ketat Grade 1, defect rendah, dan cupping score 84+.": {
    id: "Biji kopi Arabika Toraja pilihan dari ketinggian 1.400-1.600 mdpl. Proses Full Wash / Wet Hulled dengan sortasi ketat Grade 1, defect rendah, dan cupping score 84+.",
    en: "Selected Toraja Arabica green beans from 1,400-1,600 masl altitude. Full Wash / Wet Hulled with strict Grade 1 sorting, low defect, and cupping score 84+.",
    zh: "精选托拉雅高海拔 (1400-1600米) 阿拉比卡咖啡生豆。全水洗/湿刨处理，严格 Grade 1 手工挑瑕，SCAA 杯测分数 84+。"
  },
  "Green bean Arabika Toraja Grade 1, ketinggian 1.500 mdpl, cupping score 84+.": {
    id: "Green bean Arabika Toraja Grade 1, ketinggian 1.500 mdpl, cupping score 84+.",
    en: "Toraja Arabica Green Bean Grade 1, altitude 1,500 masl, cupping score 84+.",
    zh: "托拉雅阿拉比卡一级生豆，海拔 1500 米，杯测 84 分以上。"
  },

  "Kopi Robusta Sulawesi Premium": {
    id: "Kopi Robusta Sulawesi Premium",
    en: "Premium Sulawesi Robusta Coffee",
    zh: "苏拉威西特级罗布斯塔咖啡"
  },
  "Kopi Robusta petik merah dengan bodi tebal dan aroma cokelat karamel khas Sulawesi. Cocok untuk blend espresso komersial dan industri kopi.": {
    id: "Kopi Robusta petik merah dengan bodi tebal dan aroma cokelat karamel khas Sulawesi. Cocok untuk blend espresso komersial dan industri kopi.",
    en: "Red-picked Robusta coffee with bold body and signature chocolate caramel aroma from Sulawesi. Ideal for commercial espresso blends and coffee industry.",
    zh: "全红果采摘罗布斯塔咖啡，醇厚度高，带有典型的黑巧焦糖风味，适用于商用浓缩拼配及速溶原料。"
  },

  // Site settings
  "Komoditas tertelusur dari Sulawesi": { id: "Komoditas tertelusur dari Sulawesi", en: "Traceable commodities from Sulawesi", zh: "来自苏拉威西的可追溯产品" },
  "Kemitraan petani jagung pakan dan kebun kopi di Sulawesi dengan pencatatan jejak penuh — mulai dari benih, pemupukan, hingga hasil uji laboratorium.": {
    id: "Kemitraan petani jagung pakan dan kebun kopi di Sulawesi dengan pencatatan jejak penuh — mulai dari benih, pemupukan, hingga hasil uji laboratorium.",
    en: "Partnerships with corn farmers and coffee plantations in Sulawesi with complete traceability — from seeds and fertilization to laboratory test results.",
    zh: "苏拉威西饲料玉米及咖啡庄园深度合作，提供全程追溯档案 —— 从良种、施肥到实验室化验报告全面透明。"
  },
  "Sentra Agribisnis Sulawesi": { id: "Sentra Agribisnis Sulawesi", en: "Sulawesi Agribusiness Hub", zh: "苏拉威西农业商务中心" },

  // Traceability subjects
  "Batch Jagung Pakan Pipil #001": { id: "Batch Jagung Pakan Pipil #001", en: "Feed Corn Batch #001", zh: "饲料玉米批次 #001" },
  "Lot Kopi Arabika Toraja #001": { id: "Lot Kopi Arabika Toraja #001", en: "Toraja Arabica Lot #001", zh: "托拉雅阿拉比卡咖啡批次 #001" },
  "Siap Distribusi": { id: "Siap Distribusi", en: "Ready for Delivery", zh: "已达标可发运" },
  "Selesai Uji Lab": { id: "Selesai Uji Lab", en: "Lab Tested", zh: "完成化验" },
  "Proses Pengeringan": { id: "Proses Pengeringan", en: "Drying Stage", zh: "烘干脱水阶段" },

  // Traceability events - Corn
  "Asal Lahan & Benih Unggul": { id: "Asal Lahan & Benih Unggul", en: "Farm Origin & Superior Seeds", zh: "种植地块与良种引进" },
  "Penanaman & Input Pemupukan Berimbang": { id: "Penanaman & Input Pemupukan Berimbang", en: "Planting & Balanced Inputs", zh: "播种与平衡施肥" },
  "Panen Tongkol Jagung": { id: "Panen Tongkol Jagung", en: "Corn Cob Harvest", zh: "成熟采收" },
  "Pengeringan & Kadar Air": { id: "Pengeringan & Kadar Air", en: "Drying & Moisture Control", zh: "脱粒烘干与水分检测" },
  "Uji Laboratorium & Standar Mutu": { id: "Uji Laboratorium & Standar Mutu", en: "Lab Quality & Aflatoxin Test", zh: "实验室化验与质量评定" },
  "Pengemasan & Siap Pasok Pakan": { id: "Pengemasan & Siap Pasok Pakan", en: "Packaging & Feed Supply Delivery", zh: "定量包装与发运" },

  // Traceability events - Coffee
  "Asal Kebun & Petani Toraja": { id: "Asal Kebun & Petani Toraja", en: "Toraja Plantation & Partner Farmers", zh: "托拉雅庄园与农户建档" },
  "Panen Petik Merah 100%": { id: "Panen Petik Merah 100%", en: "100% Red Cherry Harvest", zh: "100% 全红果人工采摘" },
  "Pengolahan Pasca-Panen Full Wash": { id: "Pengolahan Pasca-Panen Full Wash", en: "Full Wash Post-Harvest Processing", zh: "全水洗后处理工序" },
  "Pengeringan di Raised Bed": { id: "Pengeringan di Raised Bed", en: "Sun-Drying on Raised Beds", zh: "高架棚日晒脱水" },
  "Hulling & Sortasi Biji Grade 1": { id: "Hulling & Sortasi Biji Grade 1", en: "Hulling & Grade 1 Defect Sorting", zh: "脱壳精选与手工剔瑕" },
  "Uji Cita Rasa & Cupping Lab SCAA": { id: "Uji Cita Rasa & Cupping Lab SCAA", en: "SCAA Cupping & Moisture Lab Test", zh: "SCAA 杯测与水分检测" },
  "Pengemasan Green Bean GrainPro": { id: "Pengemasan Green Bean GrainPro", en: "GrainPro Hermetic Packaging", zh: "GrainPro 气密高保鲜包装" },

  // Traceability stages (EventType labels)
  "Asal Lahan & Benih": { id: "Asal Lahan & Benih", en: "Origin & Seeds", zh: "地块与良种" },
  "Tanam & Pemupukan": { id: "Tanam & Pemupukan", en: "Planting & Fertilizer", zh: "播种施肥" },
  "Panen Tongkol": { id: "Panen Tongkol", en: "Corn Harvest", zh: "玉米采收" },
  "Uji Lab & Mutu": { id: "Uji Lab & Mutu", en: "Lab & Quality Testing", zh: "化验品控" },
  "Siap Pasok Pakan": { id: "Siap Pasok Pakan", en: "Ready for Feed Supply", zh: "饲料出库" },
  "Asal Kebun & Petani": { id: "Asal Kebun & Petani", en: "Plantation Origin", zh: "庄园农户" },
  "Pengolahan Pasca-Panen": { id: "Pengolahan Pasca-Panen", en: "Post-Harvest Processing", zh: "采后精制" },
  "Hulling & Sortasi Biji": { id: "Hulling & Sortasi Biji", en: "Hulling & Sorting", zh: "脱壳精选" },
  "Uji Cita Rasa (Cupping)": { id: "Uji Cita Rasa (Cupping)", en: "Cupping Test", zh: "风味杯测" },
  "Kemasan Green Bean": { id: "Kemasan Green Bean", en: "Green Bean Packaging", zh: "生豆包装" },

  // Page blocks - Home page
  "Kenapa Tri Agri": { id: "Kenapa Tri Agri", en: "Why Tri Agri", zh: "为什么选择 Tri Agri" },
  "Kami percaya pembeli dan mitra industri berhak tahu asal-usul dan bahan komoditas yang mereka beli. Setiap batch jagung dan kopi kami tercatat: benih/varietas, pupuk, perlakuan lahan, metode pengeringan, hingga hasil uji mutu laboratorium.": {
    id: "Kami percaya pembeli dan mitra industri berhak tahu asal-usul dan bahan komoditas yang mereka beli. Setiap batch jagung dan kopi kami tercatat: benih/varietas, pupuk, perlakuan lahan, metode pengeringan, hingga hasil uji mutu laboratorium.",
    en: "We believe buyers and industrial partners deserve to know the origin and input materials of their commodities. Every batch of our corn and coffee is transparently tracked: seeds/variety, fertilizers, farm care, drying methods, and laboratory quality tests.",
    zh: "我们坚信工业合作伙伴有权获知所采购农产品的真实源头与投入物料。我们的每批玉米与咖啡均有完整记录：良种品系、肥料施用、地块管理、烘干脱水及实验室化验结果。"
  },
  "Ton jagung tersalurkan": { id: "Ton jagung tersalurkan", en: "Tons of corn delivered", zh: "已供应饲料玉米吨数" },
  "Mitra petani aktif": { id: "Mitra petani aktif", en: "Active partner farmers", zh: "签约合作农户" },
  "Rata-rata kadar air jagung": { id: "Rata-rata kadar air jagung", en: "Average corn moisture", zh: "平均玉米含水率" },
  "Tahap jejak mutu per batch": { id: "Tahap jejak mutu per batch", en: "Quality stages per batch", zh: "每批次追溯质检节点" },

  // Page blocks - About page
  "Visi Kami": { id: "Visi Kami", en: "Our Vision", zh: "我们的愿景" },
  "Menjadi pemasok komoditas agribisnis tertelusur terpercaya di Sulawesi — mengutamakan jagung pakan berkualitas tinggi dan green bean kopi specialty dengan ketertelusuran penuh untuk pasar nasional dan ekspor.": {
    id: "Menjadi pemasok komoditas agribisnis tertelusur terpercaya di Sulawesi — mengutamakan jagung pakan berkualitas tinggi dan green bean kopi specialty dengan ketertelusuran penuh untuk pasar nasional dan ekspor.",
    en: "To be the most trusted traceable agribusiness commodity supplier in Sulawesi — specializing in high-grade feed corn and specialty coffee green beans with complete transparency for domestic and export markets.",
    zh: "致力于成为苏拉威西地区最受信赖的可追溯农产品供应商 —— 专注供应高品质饲料玉米及精品咖啡生豆，以全流程透明度服务国内及国际贸易市场。"
  },
  "Model Bisnis": { id: "Model Bisnis", en: "Business Model", zh: "商业模式" },
  "Kami membangun kemitraan langsung dengan petani jagung dan kelompok tani kopi di Sulawesi. Kami mendampingi standardisasi benih unggul, pemupukan berimbang, serta penanganan pasca-panen (dryer & wet-mill) sehingga menghasilkan komoditas dengan spesifikasi mutu tinggi, kadar air terkontrol, dan catatan jejak digital yang dapat diaudit langsung oleh mitra pembeli.": {
    id: "Kami membangun kemitraan langsung dengan petani jagung dan kelompok tani kopi di Sulawesi. Kami mendampingi standardisasi benih unggul, pemupukan berimbang, serta penanganan pasca-panen (dryer & wet-mill) sehingga menghasilkan komoditas dengan spesifikasi mutu tinggi, kadar air terkontrol, dan catatan jejak digital yang dapat diaudit langsung oleh mitra pembeli.",
    en: "We build direct partnerships with corn farmers and coffee farmer groups in Sulawesi. We support high-yield seed varieties, balanced inputs, and modern post-harvest handling (dryers & wet-mills) to deliver high-spec commodities with strictly controlled moisture and verifiable digital records.",
    zh: "我们与苏拉威西各地的玉米种植户及咖啡庄园建立产地直采合作。协同推行优选良种、平衡施肥及现代化采后处理（机械烘干与水洗处理站），确保出产商品具备高规格标准、低含水率与数字化追溯可信度。"
  },
  "Sentra kemitraan jagung di dataran subur Sulawesi Selatan dan pengolahan kopi arabika di Toraja Utara & Enrekang.": {
    id: "Sentra kemitraan jagung di dataran subur Sulawesi Selatan dan pengolahan kopi arabika di Toraja Utara & Enrekang.",
    en: "Corn partnership center across fertile South Sulawesi plains and arabica coffee processing stations in North Toraja & Enrekang.",
    zh: "玉米合作种植基地分布于南苏拉威西沃野，高海拔阿拉比卡咖啡加工处理站位于北托拉雅及恩雷康。"
  },
  "Berdiri": { id: "Berdiri", en: "Established", zh: "成立时间" },
  "Kapasitas dryer & gudang": { id: "Kapasitas dryer & gudang", en: "Dryer & storage capacity", zh: "烘干及仓储产能" },
  "500 ton/bln": { id: "500 ton/bln", en: "500 tons/mo", zh: "500 吨/月" },
  "Mitra kelompok tani": { id: "Mitra kelompok tani", en: "Farmer groups", zh: "合作农户社" },
  "12 kelompok": { id: "12 kelompok", en: "12 groups", zh: "12 个合作社" },
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
