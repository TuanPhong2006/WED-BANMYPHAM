# LUMINA BEAUTY & COSMETICS - DỰ ÁN WEBSITE BÁN MỸ PHẨM CHÍNH HÃNG

Dự án giao diện website thương mại điện tử chuyên ngành **Mỹ phẩm & Chăm sóc sắc đẹp (Beauty & Cosmetics)** được xây dựng hoàn chỉnh bằng **HTML5, CSS3 và Vanilla JavaScript**, chuẩn Responsive trên mọi thiết bị và tích hợp cơ chế lưu trữ dữ liệu động thông qua **LocalStorage**.

---

## 🌟 TỔNG QUAN HỆ THỐNG & CÁC VAI TRÒ (ROLES)

Website được phân quyền đầy đủ thành **3 nhóm vai trò người dùng**:

1. **Khách hàng (Client / Customer):**
   - Mua sắm mỹ phẩm, lọc theo danh mục, thương hiệu, khoảng giá, đánh giá.
   - Thêm giỏ hàng, tùy chọn dung tích/tone màu, mã giảm giá, tính phí vận chuyển tự động.
   - Lưu danh sách yêu thích (Wishlist).
   - Xem chi tiết sản phẩm, thành phần hoạt chất, hướng dẫn sử dụng, gửi đánh giá sao.
   - Đặt hàng đa phương thức (COD, chuyển khoản VietQR, MoMo).
   - Quản lý hồ sơ cá nhân và theo dõi lộ trình đơn hàng thời gian thực.
   - Gửi yêu cầu tư vấn da liễu qua trang Liên hệ.

2. **Nhân viên vận hành & CSKH (Staff Portal - `staff.html`):**
   - Quản lý & điều phối đơn hàng: Duyệt đơn mới, chuyển trạng thái đóng gói, bàn giao shipper, xác nhận hoàn thành, in hóa đơn.
   - Kiểm tra tồn kho nhanh: Xem cảnh báo sắp hết hàng (< 20 cái), điều chỉnh tồn kho tức thì (+1, +10, -1).
   - Trung tâm tư vấn & CSKH: Tiếp nhận câu hỏi gửi từ khách hàng và phản hồi trực tiếp.

3. **Quản trị viên hệ thống (Admin Portal - `admin.html`):**
   - Dashboard thống kê trực quan với biểu đồ **Chart.js** (Doanh thu 6 tháng, Tỷ trọng ngành hàng mỹ phẩm, KPI tăng trưởng).
   - Quản lý sản phẩm (CRUD): Thêm mới, chỉnh sửa, xóa sản phẩm mỹ phẩm với đầy đủ ảnh, giá, tồn kho, phân loại.
   - Quản lý toàn bộ đơn hàng của hệ thống.
   - Quản lý người dùng & phân quyền vai trò (Khách hàng ⇋ Nhân viên ⇋ Quản trị).
   - Quản lý mã giảm giá (Vouchers/Coupons) và Cài đặt cửa hàng.

---

## 📁 CẤU TRÚC THƯ MỤC DỰ ÁN

```
E:\Tuan_Phong\
├── index.html                   # Trang chủ (Hero banner, Flash Sale, Bestseller, Routine, Reviews)
├── about.html                   # Trang Giới thiệu (Sứ mệnh, Giá trị cốt lõi, Đội ngũ chuyên gia)
├── shop.html                    # Trang Cửa hàng (Bộ lọc danh mục, thương hiệu, giá, sắp xếp, phân trang)
├── product-detail.html          # Trang Chi tiết sản phẩm (Gallery ảnh, Phân loại, Tabs thành phần, Đánh giá)
├── cart.html                    # Trang Giỏ hàng (Bảng sản phẩm, Thanh freeship, Mã voucher, Tổng tiền)
├── checkout.html                # Trang Thanh toán (Form giao hàng, VietQR mockup, COD, Đặt hàng)
├── wishlist.html                # Trang Yêu thích (Danh sách đã lưu, chuyển nhanh vào giỏ hàng)
├── contact.html                 # Trang Liên hệ (Showroom, Form gửi tư vấn, FAQ Accordion)
├── auth.html                    # Trang Đăng nhập, Đăng ký, Quên mật khẩu & Đăng nhập nhanh
├── profile.html                 # Trang Hồ sơ cá nhân (Cập nhật thông tin, Lịch sử đơn hàng, Sổ địa chỉ)
├── blog.html                    # Trang Cẩm nang làm đẹp & Kiến thức chăm sóc da
├── staff.html                   # Giao diện Nhân viên (Xử lý đơn hàng, kho hàng, tin nhắn CSKH)
├── admin.html                   # Giao diện Quản trị viên (Dashboard Chart.js, CRUD sản phẩm, phân quyền)
├── README.md                    # Hướng dẫn chi tiết sử dụng và kiểm thử
├── css/
│   ├── style.css                # Design system, màu sắc luxury rose blush, header, footer, card, modal, toast
│   ├── shop.css                 # Style cho shop, bộ lọc, chi tiết sản phẩm, giỏ hàng, checkout, profile
│   └── dashboard.css            # Style giao diện quản trị Admin & Nhân viên, biểu đồ, bảng biểu
└── js/
    ├── data.js                  # Cơ sở dữ liệu mẫu ban đầu (Sản phẩm, User, Đơn hàng, Voucher)
    ├── main.js                  # Xử lý chung: Giỏ hàng, Wishlist, Toast, Modal xem nhanh, Thanh Demo Role
    ├── shop.js                  # Xử lý lọc, tìm kiếm, sắp xếp và phân trang cửa hàng
    ├── product-detail.js        # Xử lý chi tiết sản phẩm, đổi ảnh gallery, viết review
    ├── cart.js                  # Xử lý tăng giảm số lượng giỏ hàng, áp dụng mã giảm giá
    ├── checkout.js              # Xử lý đặt hàng, thanh toán VietQR và tạo đơn mới
    ├── profile.js               # Quản lý hồ sơ cá nhân và chi tiết đơn hàng
    ├── staff.js                 # Xử lý nghiệp vụ nhân viên (Duyệt đơn, kho, CSKH)
    └── admin.js                 # Xử lý nghiệp vụ quản trị (Biểu đồ Chart.js, CRUD sản phẩm, phân quyền)
```

---

## 🚀 HƯỚNG DẪN MỞ & KIỂM THỬ WEBSITE

1. Không cần cài đặt bất kỳ server phức tạp nào. Bạn chỉ cần:
   - Click đúp chuột trực tiếp vào file `index.html` để mở trên trình duyệt (Chrome, Edge, Firefox, Cốc Cốc, Safari,...).
   - Hoặc mở thư mục bằng Visual Studio Code và chạy extension **Live Server**.

2. **Thanh Chuyển Đổi Nhanh (Lumina Demo Role):**
   - Trên cùng mỗi trang luôn có thanh công cụ ghim cố định giúp thầy cô và người đánh giá chuyển đổi tức thì giữa 3 vai trò:
     - 👤 **Khách hàng (Nguyễn Thu Hà)**
     - 🎧 **Nhân viên (Trần Bảo Ngọc)**
     - 👑 **Quản trị viên (Phạm Minh Anh)**
   - Kèm theo nút truy cập nhanh vào **Client Store**, **Portal NV (staff.html)** và **Portal Admin (admin.html)**.

3. **Tài khoản đăng nhập kiểm thử thủ công (Trang `auth.html`):**
   - **Khách hàng:** `khachhang@lumina.vn` / Mật khẩu: `123`
   - **Nhân viên:** `nhanvien@lumina.vn` / Mật khẩu: `123`
   - **Quản trị viên:** `admin@lumina.vn` / Mật khẩu: `123`

---

## 💡 CÁC TÍNH NĂNG NỔI BẬT ĐƯỢC TÍCH HỢP

- **Đồng bộ hóa dữ liệu thời gian thực giữa các trang (LocalStorage):**
  - Khách hàng đặt đơn tại `checkout.html` -> Ngay lập tức hiển thị tại trang Nhân viên `staff.html` và Admin `admin.html`.
  - Khách hàng gửi tin nhắn tại `contact.html` -> Nhân viên tại `staff.html` nhận được và trả lời trực tiếp.
  - Admin thêm hoặc sửa sản phẩm tại `admin.html` -> Sản phẩm xuất hiện ngay lập tức tại trang chủ `index.html` và cửa hàng `shop.html`.
- **Mã giảm giá tích hợp sẵn:**
  - `LUMINA10`: Giảm 10% cho đơn từ 500K.
  - `FREESHIP`: Miễn phí vận chuyển 30K.
  - `BEAUTY50K`: Giảm ngay 50.000₫ cho đơn từ 400K.
  - `VIP20`: Giảm 20% cho đơn từ 1.500.000₫.
- **Biểu đồ doanh thu tương tác:** Tích hợp thư viện Chart.js hiển thị doanh thu 6 tháng và biểu đồ tròn tỷ trọng các danh mục mỹ phẩm.
- **Giao diện chuẩn thẩm mỹ ngành làm đẹp:** Sử dụng tông màu Rose Blush kết hợp Deep Plum và Champagne Gold, tạo cảm giác sang trọng, tinh tế và cao cấp.
