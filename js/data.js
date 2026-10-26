/**
 * LUMINA BEAUTY & COSMETICS - Mock Database & Seed Data
 * Tự động khởi tạo dữ liệu vào LocalStorage nếu chưa có
 */

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Tinh Chất Phục Hồi & Tái Tạo Da Advanced Night Repair",
    brand: "Estée Lauder",
    category: "skincare",
    categoryName: "Chăm sóc da",
    price: 2450000,
    originalPrice: 2950000,
    discount: 17,
    rating: 4.9,
    reviewCount: 148,
    stock: 35,
    isHot: true,
    isNew: false,
    isBestSeller: true,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608248597359-0a56e5db3e46?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80"
    ],
    variants: ["30ml", "50ml", "75ml"],
    selectedVariant: "50ml",
    description: "Serum chống lão hóa số 1 thế giới với công nghệ Chronolux™ Power Signal độc quyền, giúp phục hồi da nhanh chóng trong khi ngủ, tăng sinh collagen và cấp ẩm sâu suốt 72 giờ.",
    ingredients: "Hyaluronic Acid, Bifida Ferment Lysate, Tripeptide-32, Chiết xuất hạt Kola, Tocopheryl Acetate (Vitamin E). Không chứa hương liệu tổng hợp, không gây mụn.",
    howToUse: "Sử dụng mỗi tối sau bước toner. Nhỏ 4-5 giọt serum lên lòng bàn tay, xoa đều rồi vỗ nhẹ lên mặt và cổ theo chuyển động hướng lên trên."
  },
  {
    id: 2,
    name: "Kem Dưỡng Ẩm Làm Dịu & Phục Hồi Cicaplast Baume B5+",
    brand: "La Roche-Posay",
    category: "skincare",
    categoryName: "Chăm sóc da",
    price: 365000,
    originalPrice: 420000,
    discount: 13,
    rating: 4.8,
    reviewCount: 320,
    stock: 82,
    isHot: true,
    isNew: false,
    isBestSeller: true,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"
    ],
    variants: ["40ml", "100ml"],
    selectedVariant: "40ml",
    description: "Kem dưỡng làm dịu các vùng da kích ứng, mẩn đỏ, phục hồi màng bảo vệ da bị tổn thương sau nặn mụn hoặc peel da nhờ nồng độ Panthenol 5% và Madecassoside.",
    ingredients: "Aqua/Water, Hydrogenated Polyisobutene, Dimethicone, Glycerin, Butyrospermum Parkii Butter / Shea Butter, Panthenol, Propanediol, Madecassoside, Zinc Gluconate.",
    howToUse: "Thoa 2 lần/ngày sau khi rửa mặt sạch và làm dịu với nước khoáng. Có thể dùng cho mặt, môi và toàn thân."
  },
  {
    id: 3,
    name: "Son Thỏi Lì Cao Cấp Rouge Dior Velvet Finish - #999 Red",
    brand: "Dior",
    category: "makeup",
    categoryName: "Trang điểm",
    price: 1150000,
    originalPrice: 1300000,
    discount: 11,
    rating: 5.0,
    reviewCount: 95,
    stock: 24,
    isHot: true,
    isNew: true,
    isBestSeller: true,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80"
    ],
    variants: ["#999 Đỏ Thuần", "#720 Đỏ Hồng Gỗ", "#772 Hồng Đất", "#100 Nude Thanh Lịch"],
    selectedVariant: "#999 Đỏ Thuần",
    description: "Sắc son đỏ huyền thoại biểu tượng của Dior. Chất son lì mịn như nhung, bền màu đến 16 giờ nhưng vẫn giữ bờ môi ẩm mượt nhờ chiết xuất hoa mẫu đơn đỏ và hoa lựu.",
    ingredients: "Chiết xuất hoa mẫu đơn đỏ, hoa lựu, bơ hạt mỡ hữu cơ, sáp vi tinh thể dưỡng môi mềm mại và ngăn ngừa rãnh môi.",
    howToUse: "Bắt đầu tô từ lòng môi ra viền ngoài. Có thể thoa 1 lớp để tạo hiệu ứng tự nhiên hoặc 2-3 lớp để lên chuẩn sắc đỏ quyền lực."
  },
  {
    id: 4,
    name: "Nước Hoa Nữ N°5 Eau de Parfum Quyến Rũ Huyền Bí",
    brand: "Chanel",
    category: "perfume",
    categoryName: "Nước hoa",
    price: 3950000,
    originalPrice: 4350000,
    discount: 9,
    rating: 4.9,
    reviewCount: 88,
    stock: 15,
    isHot: true,
    isNew: false,
    isBestSeller: true,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
    ],
    variants: ["50ml", "100ml"],
    selectedVariant: "50ml",
    description: "Biểu tượng bất diệt của vẻ đẹp thanh lịch vượt thời gian. Hương thơm hoa cỏ Aldehyde cổ điển mở ra nốt hương tươi mát của hoa cam Neroli, tiếp nối là hoa nhài Grasse và hoa hồng tháng Năm nồng nàn.",
    ingredients: "Hương đầu: Aldehydes, Ylang-Ylang, Neroli, Cam Bergamot. Hương giữa: Hoa hồng, Hoa nhài tím, Iris. Hương cuối: Gỗ đàn hương, Vani, Hổ phách, Xạ hương.",
    howToUse: "Xịt trực tiếp lên các điểm mạch như cổ tay, sau gáy, ngực và khuỷu tay để hương thơm khuếch tán quyến rũ và lưu hương bền lâu."
  },
  {
    id: 5,
    name: "Kem Chống Nắng Nâng Tông Kiềm Dầu Tone Up No Sebum Sunscreen",
    brand: "Innisfree",
    category: "skincare",
    categoryName: "Chăm sóc da",
    price: 290000,
    originalPrice: 350000,
    discount: 17,
    rating: 4.7,
    reviewCount: 240,
    stock: 60,
    isHot: false,
    isNew: true,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80"
    ],
    variants: ["50ml"],
    selectedVariant: "50ml",
    description: "Kem chống nắng vật lý với chỉ số SPF50+ PA++++ bảo vệ da tối ưu trước tia UV. Giúp nâng tông da trắng hồng tự nhiên, kiềm dầu suốt 8 giờ mà không gây bết dính.",
    ingredients: "Zinc Oxide, Titanium Dioxide, Chiết xuất trà xanh đảo Jeju, Dầu hạt hoa hướng dương, Bột khoáng chất kiềm dầu tự nhiên.",
    howToUse: "Thoa đều lên mặt và cổ trước khi ra ngoài 20 phút. Thoa lại sau 3-4 giờ khi hoạt động ngoài trời ra nhiều mồ hôi."
  },
  {
    id: 6,
    name: "Phấn Nước Cushion Che Phủ Hoàn Hảo Neo Cushion Matte",
    brand: "Laneige",
    category: "makeup",
    categoryName: "Trang điểm",
    price: 680000,
    originalPrice: 790000,
    discount: 14,
    rating: 4.8,
    reviewCount: 175,
    stock: 45,
    isHot: false,
    isNew: true,
    isBestSeller: true,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"
    ],
    variants: ["#21N Da Tự Nhiên", "#13N Da Sáng Hồng", "#23N Da Ngăm Nhẹ"],
    selectedVariant: "#21N Da Tự Nhiên",
    description: "Cushion mỏng nhẹ thế hệ mới, che phủ khuyết điểm hoàn hảo đến 24 giờ, chống nước và không bị lem ra khẩu trang. Lớp finish mịn lì tự nhiên không bóng dầu.",
    ingredients: "Công nghệ che phủ hạt phấn siêu mịn, tinh chất lá bạc hà kiểm soát bã nhờn, Vitamin E chống oxy hóa.",
    howToUse: "Dùng bông mút ấn nhẹ lấy lượng phấn vừa đủ, dặm đều từ trong ra ngoài gương mặt. Dặm thêm ở vùng có khuyết điểm."
  },
  {
    id: 7,
    name: "Mặt Nạ Đất Sét Thu Nhỏ Lỗ Chân Lông Rare Earth Deep Pore",
    brand: "Kiehl's",
    category: "skincare",
    categoryName: "Chăm sóc da",
    price: 920000,
    originalPrice: 1050000,
    discount: 12,
    rating: 4.9,
    reviewCount: 160,
    stock: 38,
    isHot: false,
    isNew: false,
    isBestSeller: true,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80"
    ],
    variants: ["125ml", "28ml"],
    selectedVariant: "125ml",
    description: "Mặt nạ đất sét trắng vùng Amazon giúp thải độc cho da, thanh lọc bã nhờn, se khít lỗ chân lông và giảm đáng kể mụn đầu đen chỉ sau 2 tuần.",
    ingredients: "Đất sét trắng Amazonian White Clay, Chiết xuất nha đam Aloe Barbadensis, Bột yến mạch tự nhiên làm dịu da.",
    howToUse: "Thoa một lớp mỏng lên da ẩm sau khi rửa mặt. Để khô trong 10 phút rồi nhẹ nhàng rửa sạch lại bằng nước ấm cùng khăn mềm."
  },
  {
    id: 8,
    name: "Tinh Dầu Dưỡng Tóc Argan Phục Hồi Hư Tổn Moroccanoil Treatment",
    brand: "Moroccanoil",
    category: "haircare",
    categoryName: "Chăm sóc tóc",
    price: 850000,
    originalPrice: 990000,
    discount: 14,
    rating: 4.9,
    reviewCount: 110,
    stock: 50,
    isHot: false,
    isNew: true,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80"
    ],
    variants: ["50ml", "100ml"],
    selectedVariant: "100ml",
    description: "Tinh dầu dưỡng tóc huyền thoại giàu dầu argan chống oxy hóa và vitamin giúp nuôi dưỡng sợi tóc suôn mượt, giảm xơ rối, tăng độ bóng khỏe và bảo vệ khỏi nhiệt.",
    ingredients: "Argania Spinosa (Argan) Kernel Oil, Linum Usitatissimum (Linseed) Seed Extract, Fragrance cao cấp đặc trưng.",
    howToUse: "Bơm 1-2 giọt ra tay, xoa đều rồi vuốt lên phần thân và ngọn tóc khi tóc còn ẩm hoặc sau khi sấy khô."
  },
  {
    id: 9,
    name: "Sữa Dưỡng Thể Cấp Ẩm Trắng Mịn Da Sol de Janeiro Cheirosa",
    brand: "Sol de Janeiro",
    category: "bodycare",
    categoryName: "Chăm sóc cơ thể",
    price: 620000,
    originalPrice: 720000,
    discount: 14,
    rating: 4.8,
    reviewCount: 85,
    stock: 30,
    isHot: true,
    isNew: false,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80"
    ],
    variants: ["150ml", "240ml"],
    selectedVariant: "240ml",
    description: "Kem dưỡng ẩm toàn thân Brazilian Bum Bum Cream với chiết xuất Guaraná giàu caffeine giúp làm săn chắc da, kết hợp cùng bơ Cupuaçu và dầu Açaí mang lại làn da căng mịn ngọt ngào.",
    ingredients: "Guaraná extract, Cupuaçu Butter, Açaí Oil, Dầu dừa hữu cơ, Hương thơm bánh quả hồ trăn và caramel béo ngậy.",
    howToUse: "Thoa đều khắp cơ thể theo chuyển động tròn để kem thẩm thấu nhanh và kích thích tuần hoàn máu."
  },
  {
    id: 10,
    name: "Tinh Chất Niacinamide 10% + Zinc 1% Giảm Mụn Mờ Thâm",
    brand: "The Ordinary",
    category: "skincare",
    categoryName: "Chăm sóc da",
    price: 240000,
    originalPrice: 280000,
    discount: 14,
    rating: 4.7,
    reviewCount: 420,
    stock: 120,
    isHot: false,
    isNew: false,
    isBestSeller: true,
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80"
    ],
    variants: ["30ml", "60ml"],
    selectedVariant: "30ml",
    description: "Serum quốc dân giải quyết triệt để tình trạng dầu thừa, tắc nghẽn lỗ chân lông và làm mờ các vết thâm sau mụn hiệu quả nhanh chóng.",
    ingredients: "Aqua (Water), Niacinamide, Pentylene Glycol, Zinc PCA, Dimethyl Isosorbide, Tamarindus Indica Seed Gum, Xanthan gum, Isoceteth-20.",
    howToUse: "Thoa vài giọt lên toàn bộ gương mặt vào buổi sáng và tối trước khi dùng các loại kem dưỡng ẩm đặc hơn."
  },
  {
    id: 11,
    name: "Bảng Phấn Mắt 9 Ô Phong Cách Hàn Quốc Rom&nd Better Than Eyes",
    brand: "Rom&nd",
    category: "makeup",
    categoryName: "Trang điểm",
    price: 310000,
    originalPrice: 380000,
    discount: 18,
    rating: 4.8,
    reviewCount: 190,
    stock: 55,
    isHot: true,
    isNew: true,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80"
    ],
    variants: ["#01 Dry Mango", "#02 Dry Rose", "#03 Dry Ragras"],
    selectedVariant: "#02 Dry Rose",
    description: "Bảng màu mắt tông hồng khô lãng mạn, hạt phấn mịn tơi siêu bám màu cùng nhũ kim tuyến đa chiều lấp lánh cuốn hút.",
    ingredients: "Bột ngọc trai siêu mịn, silica hấp thụ dầu thừa quanh mí mắt, sắc tố khoáng tự nhiên.",
    howToUse: "Dùng ngón tay hoặc cọ lấy phấn mắt, dặm màu nhạt toàn bầu mắt rồi nhấn màu đậm ở đuôi mắt và điểm nhũ giữa mí."
  },
  {
    id: 12,
    name: "Nước Hoa Unisex Gỗ Trầm & Hoa Hồng Santal 33",
    brand: "Le Labo",
    category: "perfume",
    categoryName: "Nước hoa",
    price: 5400000,
    originalPrice: 5900000,
    discount: 8,
    rating: 5.0,
    reviewCount: 65,
    stock: 12,
    isHot: true,
    isNew: false,
    isBestSeller: true,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
    ],
    variants: ["50ml", "100ml"],
    selectedVariant: "50ml",
    description: "Mùi hương biểu tượng của nghệ thuật chế tác nước hoa thủ công New York. Hương gỗ đàn hương Úc, tuyết tùng hòa quyện cùng da thuộc khói và hoa diên vĩ say đắm.",
    ingredients: "Gỗ đàn hương, Gỗ tuyết tùng Virginia, Thảo quả, Hoa tím Iris, Giấy cói Papyrus, Da thuộc và Hổ phách.",
    howToUse: "Xịt vào các điểm nóng cơ thể. Tránh chà xát cổ tay sau khi xịt để giữ nguyên vẹn các tầng hương."
  }
];

const DEFAULT_CATEGORIES = [
  { id: "all", name: "Tất cả sản phẩm", icon: "fa-gem", count: 12 },
  { id: "skincare", name: "Chăm sóc da", icon: "fa-wand-magic-sparkles", count: 5, banner: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80" },
  { id: "makeup", name: "Trang điểm", icon: "fa-palette", count: 3, banner: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80" },
  { id: "perfume", name: "Nước hoa cao cấp", icon: "fa-spray-can-sparkles", count: 2, banner: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80" },
  { id: "haircare", name: "Chăm sóc tóc", icon: "fa-pump-soap", count: 1, banner: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80" },
  { id: "bodycare", name: "Chăm sóc cơ thể", icon: "fa-spa", count: 1, banner: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80" }
];

const DEFAULT_BRANDS = [
  "Estée Lauder", "La Roche-Posay", "Dior", "Chanel", "Innisfree", "Laneige", "Kiehl's", "The Ordinary", "Le Labo", "Rom&nd", "Moroccanoil", "Sol de Janeiro"
];

const DEFAULT_USERS = [
  {
    id: "usr_001",
    email: "khachhang@lumina.vn",
    password: "123",
    name: "Nguyễn Thu Hà",
    phone: "0912 345 678",
    role: "customer",
    address: "Số 18 Tràng Tiền, Hoàn Kiếm, Hà Nội",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    joinDate: "2026-01-10",
    status: "active"
  },
  {
    id: "usr_002",
    email: "nhanvien@lumina.vn",
    password: "123",
    name: "Trần Bảo Ngọc",
    phone: "0988 765 432",
    role: "staff",
    department: "Tư vấn & Vận hành Đơn",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    joinDate: "2025-06-15",
    status: "active"
  },
  {
    id: "usr_003",
    email: "admin@lumina.vn",
    password: "123",
    name: "Phạm Minh Anh",
    phone: "0909 999 888",
    role: "admin",
    department: "Ban Giám Đốc / Quản trị viên",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    joinDate: "2024-01-01",
    status: "active"
  }
];

const DEFAULT_ORDERS = [
  {
    id: "ORD-2026-8801",
    userId: "usr_001",
    customerName: "Nguyễn Thu Hà",
    customerPhone: "0912 345 678",
    customerEmail: "khachhang@lumina.vn",
    shippingAddress: "Số 18 Tràng Tiền, Quận Hoàn Kiếm, Hà Nội",
    items: [
      {
        id: 1,
        name: "Tinh Chất Phục Hồi & Tái Tạo Da Advanced Night Repair",
        price: 2450000,
        variant: "50ml",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 2,
        name: "Kem Dưỡng Ẩm Làm Dịu & Phục Hồi Cicaplast Baume B5+",
        price: 365000,
        variant: "40ml",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
      }
    ],
    subtotal: 2815000,
    discountAmount: 100000,
    shippingFee: 0,
    total: 2715000,
    paymentMethod: "cod",
    paymentStatus: "paid",
    status: "completed",
    note: "Giao trong giờ hành chính",
    createdAt: "2026-10-18T10:30:00Z",
    history: [
      { time: "2026-10-18 10:30", note: "Đơn hàng đã được đặt thành công" },
      { time: "2026-10-18 14:00", note: "Nhân viên đã xác nhận và đóng gói" },
      { time: "2026-10-19 09:15", note: "Đang giao hàng cùng đơn vị ViettelPost" },
      { time: "2026-10-19 16:40", note: "Đã giao hàng thành công" }
    ]
  },
  {
    id: "ORD-2026-8802",
    userId: "usr_001",
    customerName: "Nguyễn Thu Hà",
    customerPhone: "0912 345 678",
    customerEmail: "khachhang@lumina.vn",
    shippingAddress: "Số 18 Tràng Tiền, Quận Hoàn Kiếm, Hà Nội",
    items: [
      {
        id: 3,
        name: "Son Thỏi Lì Cao Cấp Rouge Dior Velvet Finish - #999 Red",
        price: 1150000,
        variant: "#999 Đỏ Thuần",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80"
      }
    ],
    subtotal: 1150000,
    discountAmount: 50000,
    shippingFee: 30000,
    total: 1130000,
    paymentMethod: "banking",
    paymentStatus: "paid",
    status: "shipping",
    note: "Gói quà giúp mình nhé",
    createdAt: "2026-10-20T08:15:00Z",
    history: [
      { time: "2026-10-20 08:15", note: "Đã thanh toán qua QR VietQR" },
      { time: "2026-10-20 10:00", note: "Kho hàng đã xuất hóa đơn & bàn giao shipper" }
    ]
  },
  {
    id: "ORD-2026-8803",
    userId: "usr_guest",
    customerName: "Lê Hoàng Yến",
    customerPhone: "0934 112 233",
    customerEmail: "hoangyen.le@gmail.com",
    shippingAddress: "45/2 Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh",
    items: [
      {
        id: 4,
        name: "Nước Hoa Nữ N°5 Eau de Parfum Quyến Rũ Huyền Bí",
        price: 3950000,
        variant: "50ml",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80"
      }
    ],
    subtotal: 3950000,
    discountAmount: 0,
    shippingFee: 0,
    total: 3950000,
    paymentMethod: "momo",
    paymentStatus: "paid",
    status: "processing",
    note: "Giao hỏa tốc trước 17h",
    createdAt: "2026-10-20T14:20:00Z",
    history: [
      { time: "2026-10-20 14:20", note: "Đơn hàng mới tạo, đang chuẩn bị đóng gói" }
    ]
  },
  {
    id: "ORD-2026-8804",
    userId: "usr_guest",
    customerName: "Vũ Phương Thảo",
    customerPhone: "0977 889 900",
    customerEmail: "phuongthao@outlook.com",
    shippingAddress: "Tòa Keangnam Landmark 72, Nam Từ Liêm, Hà Nội",
    items: [
      {
        id: 5,
        name: "Kem Chống Nắng Nâng Tông Kiềm Dầu Tone Up No Sebum Sunscreen",
        price: 290000,
        variant: "50ml",
        quantity: 2,
        image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80"
      }
    ],
    subtotal: 580000,
    discountAmount: 0,
    shippingFee: 30000,
    total: 610000,
    paymentMethod: "cod",
    paymentStatus: "unpaid",
    status: "pending",
    note: "Gọi trước khi giao",
    createdAt: "2026-10-20T19:45:00Z",
    history: [
      { time: "2026-10-20 19:45", note: "Đơn hàng mới đặt chờ nhân viên duyệt" }
    ]
  }
];

const DEFAULT_COUPONS = [
  { code: "LUMINA10", type: "percent", value: 10, minOrder: 500000, description: "Giảm 10% cho đơn từ 500K", active: true },
  { code: "FREESHIP", type: "fixed", value: 30000, minOrder: 300000, description: "Miễn phí vận chuyển 30K", active: true },
  { code: "BEAUTY50K", type: "fixed", value: 50000, minOrder: 400000, description: "Giảm ngay 50.000đ cho đơn từ 400K", active: true },
  { code: "VIP20", type: "percent", value: 20, minOrder: 1500000, description: "Giảm 20% đơn từ 1.5 Triệu", active: true }
];

const DEFAULT_SUPPORT_MESSAGES = [
  {
    id: "msg_1",
    customerName: "Nguyễn Thu Hà",
    phone: "0912 345 678",
    topic: "Tư vấn chọn kem chống nắng",
    message: "Chào shop, da mình hỗn hợp thiên dầu mùa hè đổ dầu vùng chữ T thì dùng kem chống nắng Innisfree Tone Up có bị bí da không ạ?",
    status: "answered",
    reply: "Dạ chào bạn Thu Hà, dòng Tone Up No Sebum kiềm dầu cực kỳ tốt và mỏng nhẹ, không gây bít tắc lỗ chân lông bạn nhé!",
    time: "2026-10-20 16:30"
  },
  {
    id: "msg_2",
    customerName: "Trịnh Diệu Linh",
    phone: "0945 667 889",
    topic: "Kiểm tra tình trạng đơn hàng",
    message: "Mình vừa đặt đơn nước hoa Chanel N5 chiều nay, shop có thể hỗ trợ giao trước 11h trưa mai giúp mình được không?",
    status: "pending",
    reply: "",
    time: "2026-10-20 20:10"
  },
  {
    id: "msg_3",
    customerName: "Hoàng Mai Chi",
    phone: "0903 221 445",
    topic: "Hỏi về hạn sử dụng sản phẩm",
    message: "Serum Estée Lauder bên mình lô mới sản xuất tháng mấy năm 2026 vậy ạ? Có tem phụ tiếng Việt không?",
    status: "pending",
    reply: "",
    time: "2026-10-20 21:05"
  }
];

const DEFAULT_BLOGS = [
  {
    id: 1,
    title: "Routine Dưỡng Trắng & Căng Bóng Da Chuẩn Hàn Trong 7 Ngày",
    summary: "Bí quyết kết hợp Niacinamide và Vitamin C đúng cách để làn da bật tông rạng rỡ mà không lo kích ứng hay sạm nám.",
    category: "Chăm sóc da",
    author: "BS. Da Liễu Khánh Huyền",
    date: "18 Tháng 10, 2026",
    readTime: "5 phút đọc",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    content: "Làn da thủy tinh (Glass Skin) luôn là ước mơ của phái đẹp. Tuy nhiên việc lạm dụng quá nhiều hoạt chất nồng độ cao cùng lúc thường mang lại tác dụng ngược..."
  },
  {
    id: 2,
    title: "Top 5 Thỏi Son Đỏ Quyền Lực Nhất Định Phải Có Trong Mùa Lễ Hội",
    summary: "Điểm danh những sắc son đỏ kinh điển từ Dior, MAC, YSL giúp tôn da và làm sáng bừng thần thái trong mọi bữa tiệc.",
    category: "Trang điểm",
    author: "Makeup Artist Tuấn Lê",
    date: "15 Tháng 10, 2026",
    readTime: "4 phút đọc",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
    content: "Màu son đỏ không chỉ đơn thuần là một màu trang điểm, đó là tuyên ngôn của sự tự tin, nét kiêu kỳ và quyến rũ không thể chối từ..."
  },
  {
    id: 3,
    title: "Cách Phân Biệt Nước Hoa Thật - Giả Chính Xác Đến 99%",
    summary: "Những chi tiết tinh vi từ vòi xịt, nắp chai, mã batch code và độ lưu hương mà tín đồ hương thơm bắt buộc phải nằm lòng.",
    category: "Nước hoa",
    author: "Chuyên gia Mùi Hương Eric Vũ",
    date: "12 Tháng 10, 2026",
    readTime: "6 phút đọc",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80",
    content: "Thị trường nước hoa ngày càng tinh vi với các kỹ thuật làm giả vỏ hộp và thân chai. Dưới đây là những dấu hiệu nhận biết then chốt..."
  }
];

const DEFAULT_SETTINGS = {
  storeName: "LUMINA BEAUTY & COSMETICS",
  slogan: "Nâng niu vẻ đẹp thuần khiết",
  hotline: "1900 8899",
  phone: "0912 345 678",
  email: "cskh@lumina.vn",
  freeShippingThreshold: 500000,
  standardShippingFee: 30000,
  announcementText: "✨ Miễn phí vận chuyển toàn quốc đơn từ 500.000₫ | Nhập mã LUMINA10 giảm 10%",
  addressHN: "18 Tràng Tiền, Quận Hoàn Kiếm, Hà Nội",
  addressHCM: "72 Lê Thánh Tôn, Bến Nghé, Quận 1, TP. HCM",
  bankName: "Ngân hàng Quân Đội (MB Bank)",
  bankAccount: "9999 8888 6666",
  bankOwner: "CTY CP MY PHAM LUMINA VIET NAM"
};

// Khởi tạo Database trong LocalStorage
function initDatabase() {
  if (!localStorage.getItem("lumina_products")) {
    localStorage.setItem("lumina_products", JSON.stringify(DEFAULT_PRODUCTS));
  }
  if (!localStorage.getItem("lumina_users")) {
    localStorage.setItem("lumina_users", JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem("lumina_orders")) {
    localStorage.setItem("lumina_orders", JSON.stringify(DEFAULT_ORDERS));
  }
  if (!localStorage.getItem("lumina_coupons")) {
    localStorage.setItem("lumina_coupons", JSON.stringify(DEFAULT_COUPONS));
  }
  if (!localStorage.getItem("lumina_messages")) {
    localStorage.setItem("lumina_messages", JSON.stringify(DEFAULT_SUPPORT_MESSAGES));
  }
  if (!localStorage.getItem("lumina_cart")) {
    localStorage.setItem("lumina_cart", JSON.stringify([
      { productId: 1, variant: "50ml", quantity: 1 }
    ]));
  }
  if (!localStorage.getItem("lumina_wishlist")) {
    localStorage.setItem("lumina_wishlist", JSON.stringify([2, 4]));
  }
  if (!localStorage.getItem("lumina_settings")) {
    localStorage.setItem("lumina_settings", JSON.stringify(DEFAULT_SETTINGS));
  }
  // Mặc định đăng nhập user khách hàng để tiện trải nghiệm, hoặc null
  if (!localStorage.getItem("lumina_current_user")) {
    localStorage.setItem("lumina_current_user", JSON.stringify(DEFAULT_USERS[0]));
  }

  // Tự động kiểm tra và cập nhật ảnh mới cho sản phẩm trong LocalStorage nếu có link cũ bị 404
  try {
    const cachedProducts = JSON.parse(localStorage.getItem("lumina_products") || "[]");
    let needsUpdate = false;
    cachedProducts.forEach(p => {
      if (p.id === 7 || (p.image && p.image.includes("1567928805192"))) {
        p.image = "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80";
        p.images = [
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80"
        ];
        needsUpdate = true;
      }
      if (p.id === 9 || (p.image && p.image.includes("1608248597359"))) {
        p.image = "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80";
        p.images = [
          "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80"
        ];
        needsUpdate = true;
      }
    });
    if (needsUpdate) {
      localStorage.setItem("lumina_products", JSON.stringify(cachedProducts));
    }
  } catch (e) {
    console.error("Error updating product cache:", e);
  }
}

function getSystemSettings() {
  return JSON.parse(localStorage.getItem("lumina_settings") || JSON.stringify(DEFAULT_SETTINGS));
}

function saveSystemSettings(settings) {
  localStorage.setItem("lumina_settings", JSON.stringify(settings));
}

function resetDefaultDatabase() {
  localStorage.removeItem("lumina_products");
  localStorage.removeItem("lumina_orders");
  localStorage.removeItem("lumina_coupons");
  localStorage.removeItem("lumina_messages");
  localStorage.removeItem("lumina_cart");
  localStorage.removeItem("lumina_wishlist");
  localStorage.removeItem("lumina_settings");
  initDatabase();
}

// Gọi khởi tạo ngay khi nạp file
initDatabase();
