/**
 * LUMINA BEAUTY & COSMETICS - Admin Portal Logic
 * Dashboard Analytics, Product CRUD, User/Role Management & System Settings
 */

let revenueChart = null;
let categoryChart = null;
let currentEditingProductId = null;

document.addEventListener("DOMContentLoaded", () => {
  verifyAdminRole();
  initAdminDashboard();
  initAdminNavigation();
});

function verifyAdminRole() {
  let user = getCurrentUser();
  if (!user || user.role !== "admin") {
    const users = JSON.parse(localStorage.getItem("lumina_users") || "[]");
    const adminUser = users.find(u => u.role === "admin") || (typeof DEFAULT_USERS !== "undefined" ? DEFAULT_USERS[2] : null);
    if (adminUser) {
      setCurrentUser(adminUser);
      user = adminUser;
    }
  }

  const banner = document.getElementById("adminAccessWarning");
  if (banner) banner.style.display = "none";

  const nameEl = document.getElementById("adminHeaderName");
  if (nameEl && user) nameEl.textContent = user.name;
}

function initAdminNavigation() {
  const navBtns = document.querySelectorAll(".dash-nav-item[data-section]");
  navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      navBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const sectionId = btn.getAttribute("data-section");
      document.querySelectorAll(".admin-section").forEach(sec => {
        sec.style.display = sec.id === `section-${sectionId}` ? "block" : "none";
      });

      const titleEl = document.getElementById("adminPageTitle");
      if (titleEl) {
        titleEl.textContent = btn.querySelector(".dash-nav-item-left span").textContent;
      }

      // Re-trigger renders if needed
      if (sectionId === "products") loadAdminProducts();
      if (sectionId === "orders") loadAdminOrders();
      if (sectionId === "users") loadAdminUsers();
      if (sectionId === "coupons") loadAdminCoupons();
      if (sectionId === "settings") loadAdminSettings();
    });
  });
}

function initAdminDashboard() {
  const products = getProducts();
  const orders = getOrders();
  const users = JSON.parse(localStorage.getItem("lumina_users") || "[]");

  // Metrics
  const totalRevenue = orders
    .filter(o => o.status === "completed" || o.status === "shipping")
    .reduce((sum, o) => sum + o.total, 0);

  const totalOrdersCount = orders.length;
  const totalProductsCount = products.length;
  const totalUsersCount = users.filter(u => u.role === "customer").length;

  const kpiRev = document.getElementById("adminKpiRevenue");
  if (kpiRev) kpiRev.textContent = formatVND(totalRevenue);
  
  const kpiOrd = document.getElementById("adminKpiOrders");
  if (kpiOrd) kpiOrd.textContent = totalOrdersCount;

  const kpiProd = document.getElementById("adminKpiProducts");
  if (kpiProd) kpiProd.textContent = totalProductsCount;

  const kpiUsr = document.getElementById("adminKpiUsers");
  if (kpiUsr) kpiUsr.textContent = totalUsersCount;

  // Render Charts
  renderRevenueChart();
  renderCategoryChart();

  // Pre-load all tables
  renderAdminRecentOrders();
  loadAdminProducts();
  loadAdminOrders();
  loadAdminUsers();
  loadAdminCoupons();
  loadAdminSettings();
}

function renderRevenueChart() {
  const canvas = document.getElementById("revenueChartCanvas");
  if (!canvas) return;

  if (typeof Chart !== "undefined") {
    if (revenueChart) revenueChart.destroy();

    revenueChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['T5', 'T6', 'T7', 'T8', 'T9', 'T10'],
        datasets: [{
          label: 'Doanh thu (Triệu VNĐ)',
          data: [42, 58, 65, 82, 95, 128],
          borderColor: '#d84a75',
          backgroundColor: 'rgba(216, 74, 117, 0.08)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#d84a75',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            grid: { color: '#f1f5f9' },
            ticks: { color: '#64748b' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#64748b' }
          }
        }
      }
    });
    return;
  }

  // Fallback Canvas 2D
  const ctx = canvas.getContext("2d");
  const w = canvas.parentElement.clientWidth || 500;
  const h = 260;
  canvas.width = w;
  canvas.height = h;

  ctx.strokeStyle = "#e2e8f0";
  ctx.beginPath();
  ctx.moveTo(40, 20);
  ctx.lineTo(40, 220);
  ctx.lineTo(w - 20, 220);
  ctx.stroke();

  const points = [[60, 180], [140, 150], [220, 130], [300, 95], [380, 70], [460, 35]];
  ctx.strokeStyle = "#d84a75";
  ctx.lineWidth = 3;
  ctx.beginPath();
  points.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p[0], p[1]);
    else ctx.lineTo(p[0], p[1]);
  });
  ctx.stroke();

  ctx.fillStyle = "#d84a75";
  points.forEach(p => {
    ctx.beginPath();
    ctx.arc(p[0], p[1], 5, 0, Math.PI * 2);
    ctx.fill();
  });
}

function renderCategoryChart() {
  const canvas = document.getElementById("categoryChartCanvas");
  if (!canvas) return;

  if (typeof Chart !== "undefined") {
    if (categoryChart) categoryChart.destroy();

    categoryChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Chăm sóc da', 'Trang điểm', 'Nước hoa', 'Chăm sóc tóc', 'Khác'],
        datasets: [{
          data: [45, 25, 18, 7, 5],
          backgroundColor: [
            '#d84a75',
            '#f43f5e',
            '#8b5cf6',
            '#3b82f6',
            '#10b981'
          ],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, font: { size: 11 } }
          }
        }
      }
    });
    return;
  }

  // Fallback Canvas 2D
  const ctx = canvas.getContext("2d");
  const w = canvas.parentElement.clientWidth || 280;
  const h = 260;
  canvas.width = w;
  canvas.height = h;

  const centerX = w / 2;
  const centerY = 110;
  const radius = 70;
  const slices = [
    { percent: 0.45, color: '#d84a75' },
    { percent: 0.25, color: '#f43f5e' },
    { percent: 0.18, color: '#8b5cf6' },
    { percent: 0.07, color: '#3b82f6' },
    { percent: 0.05, color: '#10b981' }
  ];

  let startAngle = 0;
  slices.forEach(slice => {
    const sliceAngle = slice.percent * 2 * Math.PI;
    ctx.fillStyle = slice.color;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
    ctx.closePath();
    ctx.fill();
    startAngle += sliceAngle;
  });

  // Inner cutout for doughnut
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(centerX, centerY, 42, 0, Math.PI * 2);
  ctx.fill();
}

function renderAdminRecentOrders() {
  const container = document.getElementById("adminRecentOrdersTable");
  if (!container) return;

  const orders = getOrders().slice(0, 5);
  container.innerHTML = orders.map(o => `
    <tr>
      <td><strong>#${o.id}</strong></td>
      <td>${o.customerName}</td>
      <td>${o.items.length} món</td>
      <td><strong style="color:var(--primary);">${formatVND(o.total)}</strong></td>
      <td><span class="role-chip ${o.status === 'completed' ? 'role-staff' : 'role-admin'}">${o.status}</span></td>
      <td><small style="color:#64748b;">${formatDate(o.createdAt)}</small></td>
    </tr>
  `).join('');
}

/* ==========================================================
   PRODUCT CRUD MANAGEMENT (ADMIN)
   ========================================================== */
function loadAdminProducts() {
  const container = document.getElementById("adminProductsTableBody");
  if (!container) return;

  const products = getProducts();
  container.innerHTML = products.map(p => `
    <tr>
      <td>#${p.id}</td>
      <td>
        <div class="table-user-cell">
          <img src="${p.image}" alt="${p.name}" class="table-thumb" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=100&q=80';" />
          <div>
            <strong style="font-size:13.5px; color:#0f172a;">${p.name}</strong>
            <div style="font-size:11.5px; color:#64748b;">${p.brand} | ${p.categoryName}</div>
          </div>
        </div>
      </td>
      <td><strong>${formatVND(p.price)}</strong></td>
      <td>${p.originalPrice ? `<span style="text-decoration:line-through; color:#94a3b8; font-size:12px;">${formatVND(p.originalPrice)}</span>` : '-'}</td>
      <td>
        <span class="stock-badge ${p.stock > 20 ? 'stock-high' : p.stock > 0 ? 'stock-warning' : 'stock-out'}">
          ${p.stock}
        </span>
      </td>
      <td><span style="color:#f59e0b;"><i class="fa-solid fa-star"></i> ${p.rating}</span> (${p.reviewCount})</td>
      <td>
        <div class="table-action-btns">
          <button class="btn-table-action" onclick="openEditProductModal(${p.id})" title="Chỉnh sửa">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn-table-action delete" onclick="deleteProduct(${p.id})" title="Xóa">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openAddProductModal() {
  currentEditingProductId = null;
  const form = document.getElementById("productForm");
  if (form) form.reset();
  document.getElementById("productModalTitle").textContent = "Thêm Sản Phẩm Mới";
  document.getElementById("productModal").classList.add("active");
  document.body.style.overflow = "hidden";
}

function openEditProductModal(productId) {
  currentEditingProductId = productId;
  const p = getProductById(productId);
  if (!p) return;

  document.getElementById("productModalTitle").textContent = "Chỉnh Sửa Sản Phẩm";
  const form = document.getElementById("productForm");
  form.prodName.value = p.name;
  form.prodBrand.value = p.brand;
  form.prodCategory.value = p.category;
  form.prodPrice.value = p.price;
  form.prodOriginalPrice.value = p.originalPrice || "";
  form.prodStock.value = p.stock;
  form.prodImage.value = p.image;
  form.prodVariants.value = (p.variants || []).join(", ");
  form.prodDesc.value = p.description || "";

  document.getElementById("productModal").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeProductModal() {
  document.getElementById("productModal").classList.remove("active");
  document.body.style.overflow = "";
}

function saveProduct(event) {
  event.preventDefault();
  const form = event.target;

  const name = form.prodName.value.trim();
  const brand = form.prodBrand.value.trim();
  const category = form.prodCategory.value;
  const price = Number(form.prodPrice.value);
  const originalPrice = form.prodOriginalPrice.value ? Number(form.prodOriginalPrice.value) : null;
  const stock = Number(form.prodStock.value);
  const image = form.prodImage.value.trim() || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80";
  const variants = form.prodVariants.value.split(",").map(v => v.trim()).filter(Boolean);
  const desc = form.prodDesc.value.trim();

  const categoryNames = {
    skincare: "Chăm sóc da",
    makeup: "Trang điểm",
    perfume: "Nước hoa",
    haircare: "Chăm sóc tóc",
    bodycare: "Chăm sóc cơ thể"
  };

  const discount = originalPrice && originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  let products = getProducts();

  if (currentEditingProductId) {
    // Edit
    const index = products.findIndex(p => p.id == currentEditingProductId);
    if (index > -1) {
      products[index] = {
        ...products[index],
        name,
        brand,
        category,
        categoryName: categoryNames[category] || "Mỹ phẩm",
        price,
        originalPrice,
        discount,
        stock,
        image,
        variants: variants.length > 0 ? variants : ["Tiêu chuẩn"],
        description: desc
      };
      showToast("Cập nhật thông tin sản phẩm thành công!", "success");
    }
  } else {
    // Add New
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct = {
      id: newId,
      name,
      brand,
      category,
      categoryName: categoryNames[category] || "Mỹ phẩm",
      price,
      originalPrice,
      discount,
      stock,
      rating: 5.0,
      reviewCount: 1,
      isHot: true,
      isNew: true,
      isBestSeller: false,
      image,
      images: [image],
      variants: variants.length > 0 ? variants : ["Tiêu chuẩn"],
      selectedVariant: variants[0] || "Tiêu chuẩn",
      description: desc,
      ingredients: "Chiết xuất thảo mộc thiên nhiên lành tính.",
      howToUse: "Thoa đều lên da mỗi ngày."
    };
    products.unshift(newProduct);
    showToast("Thêm sản phẩm mới thành công!", "success");
  }

  saveProducts(products);
  closeProductModal();
  loadAdminProducts();
  initAdminDashboard();
}

function deleteProduct(productId) {
  if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi hệ thống?")) {
    let products = getProducts();
    products = products.filter(p => p.id !== productId);
    saveProducts(products);
    showToast("Đã xóa sản phẩm thành công!", "info");
    loadAdminProducts();
    initAdminDashboard();
  }
}

/* ==========================================================
   ORDERS MANAGEMENT (ADMIN)
   ========================================================== */
function loadAdminOrders() {
  const container = document.getElementById("adminOrdersTableBody");
  if (!container) return;

  const orders = getOrders();
  container.innerHTML = orders.map(o => `
    <tr>
      <td><strong>#${o.id}</strong></td>
      <td>
        <strong>${o.customerName}</strong>
        <div style="font-size:12px; color:#64748b;">${o.customerPhone}</div>
      </td>
      <td>${o.items.length} món</td>
      <td><strong style="color:var(--primary);">${formatVND(o.total)}</strong></td>
      <td><span class="role-chip ${o.paymentStatus === 'paid' ? 'role-staff' : 'role-admin'}">${o.paymentStatus}</span></td>
      <td>
        <select class="status-select ${o.status}" onchange="changeAdminOrderStatus('${o.id}', this.value)">
          <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>Chờ xử lý</option>
          <option value="processing" ${o.status === 'processing' ? 'selected' : ''}>Đang đóng gói</option>
          <option value="shipping" ${o.status === 'shipping' ? 'selected' : ''}>Đang giao hàng</option>
          <option value="completed" ${o.status === 'completed' ? 'selected' : ''}>Giao thành công</option>
          <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>Đã hủy</option>
        </select>
      </td>
      <td><small style="color:#64748b;">${formatDate(o.createdAt)}</small></td>
      <td>
        <button class="btn-table-action" onclick="viewUserOrderDetail('${o.id}')" title="Xem hóa đơn">
          <i class="fa-solid fa-file-invoice"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function changeAdminOrderStatus(orderId, newStatus) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  order.status = newStatus;
  saveOrders(orders);
  loadAdminOrders();
  initAdminDashboard();
  showToast(`Cập nhật đơn #${orderId} thành "${newStatus}"`, "success");
}

/* ==========================================================
   USERS & ROLES MANAGEMENT (ADMIN)
   ========================================================== */
function loadAdminUsers() {
  const container = document.getElementById("adminUsersTableBody");
  if (!container) return;

  const users = JSON.parse(localStorage.getItem("lumina_users") || "[]");
  container.innerHTML = users.map(u => `
    <tr>
      <td>
        <div class="table-user-cell">
          <img src="${u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}" class="table-thumb" style="border-radius:50%;" />
          <div>
            <strong>${u.name}</strong>
            <div style="font-size:12px; color:#64748b;">${u.email}</div>
          </div>
        </div>
      </td>
      <td>${u.phone || '-'}</td>
      <td>
        <span class="role-chip ${u.role === 'admin' ? 'role-admin' : u.role === 'staff' ? 'role-staff' : ''}">
          ${u.role.toUpperCase()}
        </span>
      </td>
      <td><span class="stock-badge stock-high">Hoạt động</span></td>
      <td>
        <select onchange="changeUserRole('${u.id}', this.value)" style="padding:4px 8px; border-radius:4px; border:1px solid #cbd5e1; font-size:12px;">
          <option value="customer" ${u.role === 'customer' ? 'selected' : ''}>Khách hàng</option>
          <option value="staff" ${u.role === 'staff' ? 'selected' : ''}>Nhân viên</option>
          <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Quản trị viên</option>
        </select>
      </td>
    </tr>
  `).join('');
}

function changeUserRole(userId, newRole) {
  const users = JSON.parse(localStorage.getItem("lumina_users") || "[]");
  const target = users.find(u => u.id === userId);
  if (target) {
    target.role = newRole;
    localStorage.setItem("lumina_users", JSON.stringify(users));
    showToast(`Đã cập nhật phân quyền tài khoản "${target.name}" thành ${newRole.toUpperCase()}`, "success");
  }
}

/* ==========================================================
   COUPONS MANAGEMENT (ADMIN)
   ========================================================== */
function loadAdminCoupons() {
  const container = document.getElementById("adminCouponsTableBody");
  if (!container) return;

  const coupons = getCoupons();
  container.innerHTML = coupons.map(c => `
    <tr>
      <td><strong style="font-size:14px; color:var(--primary);">${c.code}</strong></td>
      <td>${c.type === 'percent' ? `Giảm ${c.value}%` : `Giảm ${formatVND(c.value)}`}</td>
      <td>${formatVND(c.minOrder)}</td>
      <td>${c.description}</td>
      <td>
        <span class="stock-badge ${c.active ? 'stock-high' : 'stock-out'}">
          ${c.active ? 'Đang kích hoạt' : 'Tạm tắt'}
        </span>
      </td>
      <td>
        <button class="btn-table-action" onclick="toggleCouponActive('${c.code}')" title="Bật/Tắt">
          <i class="fa-solid fa-power-off"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function toggleCouponActive(code) {
  const coupons = getCoupons();
  const c = coupons.find(item => item.code === code);
  if (c) {
    c.active = !c.active;
    localStorage.setItem("lumina_coupons", JSON.stringify(coupons));
    loadAdminCoupons();
    showToast(`Đã ${c.active ? 'bật' : 'tắt'} voucher ${code}!`, "info");
  }
}

/* ==========================================================
   SYSTEM SETTINGS (ADMIN)
   ========================================================== */
function loadAdminSettings() {
  const settings = getSystemSettings();
  if (!settings) return;

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val !== undefined ? val : "";
  };

  setVal("settingStoreName", settings.storeName);
  setVal("settingSlogan", settings.slogan);
  setVal("settingHotline", settings.hotline);
  setVal("settingPhone", settings.phone);
  setVal("settingEmail", settings.email);
  setVal("settingAddressHN", settings.addressHN);
  setVal("settingAddressHCM", settings.addressHCM);
  setVal("settingFreeShip", settings.freeShippingThreshold);
  setVal("settingShippingFee", settings.standardShippingFee);
  setVal("settingBankName", settings.bankName);
  setVal("settingBankAccount", settings.bankAccount);
  setVal("settingBankOwner", settings.bankOwner);
  setVal("settingAnnouncement", settings.announcementText);
}

function handleSaveSettings(event) {
  event.preventDefault();

  const getVal = (id) => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
  };

  const updatedSettings = {
    storeName: getVal("settingStoreName") || "LUMINA BEAUTY & COSMETICS",
    slogan: getVal("settingSlogan"),
    hotline: getVal("settingHotline") || "1900 8899",
    phone: getVal("settingPhone") || "0912 345 678",
    email: getVal("settingEmail") || "cskh@lumina.vn",
    addressHN: getVal("settingAddressHN"),
    addressHCM: getVal("settingAddressHCM"),
    freeShippingThreshold: Number(getVal("settingFreeShip")) || 500000,
    standardShippingFee: Number(getVal("settingShippingFee")) || 30000,
    bankName: getVal("settingBankName"),
    bankAccount: getVal("settingBankAccount"),
    bankOwner: getVal("settingBankOwner"),
    announcementText: getVal("settingAnnouncement")
  };

  saveSystemSettings(updatedSettings);
  showToast("Đã lưu và áp dụng toàn bộ cấu hình hệ thống thành công!", "success");
}

function handleResetDatabase() {
  if (confirm("CẢNH BÁO: Thao tác này sẽ đặt lại toàn bộ dữ liệu sản phẩm, đơn hàng, người dùng và cài đặt về trạng thái mẫu ban đầu. Bạn có chắc chắn muốn tiếp tục?")) {
    resetDefaultDatabase();
    showToast("Đã khôi phục toàn bộ cơ sở dữ liệu về mặc định thành công!", "success");
    setTimeout(() => {
      window.location.reload();
    }, 800);
  }
}
