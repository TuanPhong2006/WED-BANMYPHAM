/**
 * LUMINA BEAUTY & COSMETICS - Main Application Scripts
 * Shared Utilities, Storage Management, Cart/Wishlist Store, UI Toasts & Demo Switcher
 */

// Format tiền tệ VNĐ
function formatVND(amount) {
  if (amount === undefined || amount === null) return "0₫";
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Format ngày tháng
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/* ==========================================================
   STORAGE API
   ========================================================== */
function getProducts() {
  return JSON.parse(localStorage.getItem("lumina_products") || "[]");
}

function saveProducts(products) {
  localStorage.setItem("lumina_products", JSON.stringify(products));
}

function getProductById(id) {
  const products = getProducts();
  return products.find(p => p.id == id);
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("lumina_current_user") || "null");
}

function setCurrentUser(user) {
  if (user) {
    localStorage.setItem("lumina_current_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("lumina_current_user");
  }
  updateAuthUI();
}

function logout() {
  localStorage.removeItem("lumina_current_user");
  showToast("Đã đăng xuất tài khoản thành công!", "info");
  setTimeout(() => {
    window.location.href = "auth.html";
  }, 800);
}

function getOrders() {
  return JSON.parse(localStorage.getItem("lumina_orders") || "[]");
}

function saveOrders(orders) {
  localStorage.setItem("lumina_orders", JSON.stringify(orders));
}

function getCoupons() {
  return JSON.parse(localStorage.getItem("lumina_coupons") || "[]");
}

/* ==========================================================
   CART SYSTEM
   ========================================================== */
function getCart() {
  return JSON.parse(localStorage.getItem("lumina_cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("lumina_cart", JSON.stringify(cart));
  updateBadges();
}

function addToCart(productId, variant, quantity = 1, notify = true) {
  const product = getProductById(productId);
  if (!product) return;

  if (product.stock <= 0) {
    showToast("Sản phẩm hiện đang tạm hết hàng!", "warning");
    return;
  }

  const cart = getCart();
  const selectedVariant = variant || (product.variants && product.variants[0]) || "";
  
  const existingItem = cart.find(item => item.productId == productId && item.variant === selectedVariant);

  if (existingItem) {
    if (existingItem.quantity + quantity > product.stock) {
      showToast(`Kho chỉ còn ${product.stock} sản phẩm!`, "warning");
      return;
    }
    existingItem.quantity += quantity;
  } else {
    cart.push({
      productId: Number(productId),
      variant: selectedVariant,
      quantity: Number(quantity)
    });
  }

  saveCart(cart);
  if (notify) {
    showToast(`Đã thêm "${product.name}" vào giỏ hàng!`, "success");
  }
}

function removeFromCart(index) {
  const cart = getCart();
  if (index >= 0 && index < cart.length) {
    const item = cart[index];
    const product = getProductById(item.productId);
    cart.splice(index, 1);
    saveCart(cart);
    showToast(`Đã xóa "${product ? product.name : 'sản phẩm'}" khỏi giỏ hàng`, "info");
  }
}

function updateCartQuantity(index, quantity) {
  const cart = getCart();
  if (index >= 0 && index < cart.length) {
    const item = cart[index];
    const product = getProductById(item.productId);
    
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }

    if (product && quantity > product.stock) {
      showToast(`Số lượng vượt quá tồn kho (${product.stock})`, "warning");
      item.quantity = product.stock;
    } else {
      item.quantity = Number(quantity);
    }

    saveCart(cart);
  }
}

function getCartDetails() {
  const cart = getCart();
  const products = getProducts();
  let subtotal = 0;
  let totalItems = 0;

  const items = cart.map(item => {
    const product = products.find(p => p.id == item.productId);
    if (!product) return null;
    const lineTotal = product.price * item.quantity;
    subtotal += lineTotal;
    totalItems += item.quantity;

    return {
      ...item,
      product,
      lineTotal
    };
  }).filter(Boolean);

  return {
    items,
    subtotal,
    totalItems
  };
}

/* ==========================================================
   WISHLIST SYSTEM
   ========================================================== */
function getWishlist() {
  return JSON.parse(localStorage.getItem("lumina_wishlist") || "[]");
}

function toggleWishlist(productId) {
  productId = Number(productId);
  let wishlist = getWishlist();
  const product = getProductById(productId);
  const index = wishlist.indexOf(productId);

  if (index > -1) {
    wishlist.splice(index, 1);
    localStorage.setItem("lumina_wishlist", JSON.stringify(wishlist));
    showToast(`Đã xóa "${product ? product.name : 'sản phẩm'}" khỏi danh sách yêu thích`, "info");
  } else {
    wishlist.push(productId);
    localStorage.setItem("lumina_wishlist", JSON.stringify(wishlist));
    showToast(`Đã thêm "${product ? product.name : 'sản phẩm'}" vào yêu thích ❤️`, "success");
  }

  updateBadges();
  return wishlist.includes(productId);
}

function isInWishlist(productId) {
  const wishlist = getWishlist();
  return wishlist.includes(Number(productId));
}

/* ==========================================================
   TOAST NOTIFICATION SYSTEM
   ========================================================== */
function showToast(message, type = "success", duration = 3000) {
  let container = document.getElementById("lumina-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "lumina-toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const icons = {
    success: "fa-circle-check",
    error: "fa-circle-xmark",
    warning: "fa-triangle-exclamation",
    info: "fa-circle-info"
  };

  const toast = document.createElement("div");
  toast.className = `toast-item toast-${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${icons[type] || icons.info} toast-icon"></i>
    <div class="toast-content">${message}</div>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);

  // Animation show
  setTimeout(() => toast.classList.add("show"), 10);

  // Auto remove
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

/* ==========================================================
   UPDATE HEADER BADGES & AUTH UI
   ========================================================== */
function updateBadges() {
  const cart = getCart();
  const wishlist = getWishlist();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalWishlistCount = wishlist.length;

  document.querySelectorAll(".cart-count-badge").forEach(el => {
    el.textContent = totalCartCount;
    el.style.display = totalCartCount > 0 ? "inline-flex" : "none";
  });

  document.querySelectorAll(".wishlist-count-badge").forEach(el => {
    el.textContent = totalWishlistCount;
    el.style.display = totalWishlistCount > 0 ? "inline-flex" : "none";
  });
}

function updateAuthUI() {
  const currentUser = getCurrentUser();
  const userAccountElements = document.querySelectorAll(".user-auth-slot");

  userAccountElements.forEach(slot => {
    if (currentUser) {
      let roleBadge = "";
      if (currentUser.role === "admin") {
        roleBadge = '<span class="role-chip role-admin">Quản trị</span>';
      } else if (currentUser.role === "staff") {
        roleBadge = '<span class="role-chip role-staff">Nhân viên</span>';
      }

      slot.innerHTML = `
        <div class="user-dropdown-wrapper">
          <button class="user-trigger-btn" id="userMenuBtn">
            <img src="${currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}" alt="Avatar" class="user-avatar-mini" />
            <span class="user-name-label">${currentUser.name}</span>
            ${roleBadge}
            <i class="fa-solid fa-chevron-down dropdown-arrow"></i>
          </button>
          <div class="user-dropdown-menu">
            <div class="user-dropdown-header">
              <strong>${currentUser.name}</strong>
              <small>${currentUser.email}</small>
            </div>
            <div class="user-dropdown-links">
              <a href="profile.html"><i class="fa-regular fa-user"></i> Hồ sơ của tôi</a>
              <a href="profile.html#orders"><i class="fa-solid fa-box-archive"></i> Lịch sử đơn hàng</a>
              <a href="wishlist.html"><i class="fa-regular fa-heart"></i> Sản phẩm yêu thích</a>
              ${currentUser.role === "admin" ? '<a href="admin.html" class="portal-link"><i class="fa-solid fa-shield-halved"></i> Trang Quản trị (Admin)</a>' : ''}
              ${currentUser.role === "staff" || currentUser.role === "admin" ? '<a href="staff.html" class="portal-link"><i class="fa-solid fa-headset"></i> Trang Nhân viên (Staff)</a>' : ''}
              <hr />
              <button onclick="logout()" class="logout-btn"><i class="fa-solid fa-arrow-right-from-bracket"></i> Đăng xuất</button>
            </div>
          </div>
        </div>
      `;
    } else {
      slot.innerHTML = `
        <a href="auth.html" class="auth-btn-header">
          <i class="fa-regular fa-user"></i>
          <span>Đăng nhập</span>
        </a>
      `;
    }
  });
}

/* ==========================================================
   DEMO ROLE SWITCHER BAR (Floating Helper for Testing)
   ========================================================== */
function initDemoBar() {
  if (document.getElementById("lumina-demo-bar")) return;

  const demoBar = document.createElement("div");
  demoBar.id = "lumina-demo-bar";
  demoBar.className = "lumina-demo-bar";
  
  const currentUser = getCurrentUser();
  const currentRole = currentUser ? currentUser.role : "guest";

  demoBar.innerHTML = `
    <div class="demo-bar-container">
      <div class="demo-brand">
        <i class="fa-solid fa-sparkles"></i> <strong>LUMINA DEMO ROLE:</strong>
      </div>
      <div class="demo-roles">
        <button class="role-btn ${currentRole === 'customer' ? 'active' : ''}" onclick="switchDemoUser('usr_001')">
          <i class="fa-solid fa-user"></i> Khách hàng (Thu Hà)
        </button>
        <button class="role-btn ${currentRole === 'staff' ? 'active' : ''}" onclick="switchDemoUser('usr_002')">
          <i class="fa-solid fa-headset"></i> Nhân viên (Bảo Ngọc)
        </button>
        <button class="role-btn ${currentRole === 'admin' ? 'active' : ''}" onclick="switchDemoUser('usr_003')">
          <i class="fa-solid fa-crown"></i> Quản trị (Minh Anh)
        </button>
      </div>
      <div class="demo-quick-links">
        <a href="index.html" class="quick-link" title="Về trang chủ"><i class="fa-solid fa-house"></i> Client</a>
        <a href="staff.html" class="quick-link highlight-staff" title="Vào giao diện nhân viên"><i class="fa-solid fa-clipboard-check"></i> Portal NV</a>
        <a href="admin.html" class="quick-link highlight-admin" title="Vào giao diện quản trị"><i class="fa-solid fa-chart-pie"></i> Portal Admin</a>
      </div>
      <button class="demo-close-btn" onclick="toggleDemoBar(false)" title="Ẩn thanh tiện ích">&times;</button>
    </div>
  `;

  document.body.prepend(demoBar);
}

function switchDemoUser(userId) {
  const users = JSON.parse(localStorage.getItem("lumina_users") || "[]");
  const target = users.find(u => u.id === userId);
  if (target) {
    setCurrentUser(target);
    showToast(`Đã chuyển sang vai trò: ${target.name} (${target.role.toUpperCase()})`, "success");
    setTimeout(() => {
      // Nếu là admin hoặc staff muốn chuyển thẳng tới dashboard tương ứng
      if (target.role === "admin" && window.location.pathname.includes("staff.html")) {
        // keep
      } else if (target.role === "staff" && window.location.pathname.includes("admin.html")) {
        window.location.href = "staff.html";
        return;
      }
      window.location.reload();
    }, 400);
  }
}

function toggleDemoBar(show) {
  const bar = document.getElementById("lumina-demo-bar");
  if (bar) {
    bar.style.display = show ? "block" : "none";
  }
}

/* ==========================================================
   QUICK VIEW MODAL
   ========================================================== */
function openQuickView(productId) {
  const product = getProductById(productId);
  if (!product) return;

  let modal = document.getElementById("quickViewModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "quickViewModal";
    modal.className = "lumina-modal";
    document.body.appendChild(modal);
  }

  const inWishlist = isInWishlist(product.id);

  modal.innerHTML = `
    <div class="lumina-modal-overlay" onclick="closeQuickView()"></div>
    <div class="lumina-modal-dialog">
      <button class="modal-close-icon" onclick="closeQuickView()">&times;</button>
      <div class="quick-view-grid">
        <div class="quick-view-gallery">
          <div class="quick-view-main-img">
            <img id="qvMainImage" src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80';" />
            ${product.discount > 0 ? `<span class="badge-discount">-${product.discount}%</span>` : ''}
          </div>
          <div class="quick-view-thumbs">
            ${(product.images || [product.image]).map((img, i) => `
              <img src="${img}" class="qv-thumb ${i === 0 ? 'active' : ''}" onclick="changeQvImage('${img}', this)" alt="Thumb" />
            `).join('')}
          </div>
        </div>
        <div class="quick-view-info">
          <div class="qv-brand">${product.brand}</div>
          <h2 class="qv-title">${product.name}</h2>
          
          <div class="qv-rating">
            <div class="stars">
              ${generateStarRating(product.rating)}
            </div>
            <span class="rating-number">(${product.rating})</span>
            <span class="divider">|</span>
            <span class="review-count">${product.reviewCount} đánh giá</span>
          </div>

          <div class="qv-price-wrap">
            <span class="qv-price">${formatVND(product.price)}</span>
            ${product.originalPrice ? `<span class="qv-original-price">${formatVND(product.originalPrice)}</span>` : ''}
          </div>

          <p class="qv-desc">${product.description}</p>

          <div class="qv-variants">
            <label class="qv-label">Tùy chọn / Phân loại:</label>
            <div class="variant-chips" id="qvVariantChips">
              ${(product.variants || ["Tiêu chuẩn"]).map((v, i) => `
                <button type="button" class="variant-chip ${i === 0 ? 'active' : ''}" onclick="selectQvVariant(this, '${v}')">${v}</button>
              `).join('')}
            </div>
          </div>

          <div class="qv-quantity-wrap">
            <label class="qv-label">Số lượng:</label>
            <div class="quantity-control">
              <button type="button" onclick="changeQvQty(-1)">-</button>
              <input type="number" id="qvQtyInput" value="1" min="1" max="${product.stock}" readonly />
              <button type="button" onclick="changeQvQty(1)">+</button>
            </div>
            <span class="qv-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">
              <i class="fa-solid ${product.stock > 0 ? 'fa-check-circle' : 'fa-circle-xmark'}"></i>
              ${product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
            </span>
          </div>

          <div class="qv-actions">
            <button class="btn-primary btn-add-cart" onclick="submitQuickAddToCart(${product.id})" ${product.stock <= 0 ? 'disabled' : ''}>
              <i class="fa-solid fa-bag-shopping"></i> Thêm vào giỏ hàng
            </button>
            <button class="btn-secondary btn-wishlist-toggle ${inWishlist ? 'active' : ''}" onclick="handleQvWishlist(${product.id}, this)">
              <i class="fa-${inWishlist ? 'solid' : 'regular'} fa-heart"></i>
            </button>
          </div>

          <div class="qv-footer-meta">
            <div><i class="fa-solid fa-shield-heart"></i> Cam kết 100% chính hãng</div>
            <div><i class="fa-solid fa-truck-fast"></i> Miễn phí vận chuyển từ 500K</div>
            <div><i class="fa-solid fa-rotate-left"></i> Đổi trả dễ dàng trong 7 ngày</div>
          </div>

          <div class="qv-more-link">
            <a href="product-detail.html?id=${product.id}">Xem thông tin chi tiết đầy đủ <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeQuickView() {
  const modal = document.getElementById("quickViewModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function changeQvImage(src, thumbEl) {
  document.getElementById("qvMainImage").src = src;
  document.querySelectorAll(".qv-thumb").forEach(t => t.classList.remove("active"));
  thumbEl.classList.add("active");
}

let currentSelectedVariant = "";
function selectQvVariant(btn, variant) {
  document.querySelectorAll("#qvVariantChips .variant-chip").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  currentSelectedVariant = variant;
}

function changeQvQty(delta) {
  const input = document.getElementById("qvQtyInput");
  if (!input) return;
  let val = parseInt(input.value) || 1;
  val += delta;
  const max = parseInt(input.getAttribute("max")) || 99;
  if (val < 1) val = 1;
  if (val > max) val = max;
  input.value = val;
}

function submitQuickAddToCart(productId) {
  const activeVariantBtn = document.querySelector("#qvVariantChips .variant-chip.active");
  const variant = activeVariantBtn ? activeVariantBtn.textContent.trim() : "";
  const qty = parseInt(document.getElementById("qvQtyInput").value) || 1;
  
  addToCart(productId, variant, qty);
  closeQuickView();
}

function handleQvWishlist(productId, btn) {
  const isNowIn = toggleWishlist(productId);
  const icon = btn.querySelector("i");
  if (isNowIn) {
    btn.classList.add("active");
    icon.className = "fa-solid fa-heart";
  } else {
    btn.classList.remove("active");
    icon.className = "fa-regular fa-heart";
  }
}

function generateStarRating(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars += '<i class="fa-solid fa-star"></i>';
    } else if (i - rating <= 0.5) {
      stars += '<i class="fa-solid fa-star-half-stroke"></i>';
    } else {
      stars += '<i class="fa-regular fa-star"></i>';
    }
  }
  return stars;
}

/* ==========================================================
   PRODUCT CARD COMPONENT GENERATOR
   ========================================================== */
function createProductCardHTML(p) {
  const inWishlist = isInWishlist(p.id);
  return `
    <div class="product-card" data-id="${p.id}" data-category="${p.category}">
      <div class="product-badge-wrap">
        ${p.isHot ? '<span class="badge-tag badge-hot">HOT</span>' : ''}
        ${p.isNew ? '<span class="badge-tag badge-new">MỚI</span>' : ''}
        ${p.discount > 0 ? `<span class="badge-tag badge-discount">-${p.discount}%</span>` : ''}
      </div>

      <div class="product-thumb">
        <a href="product-detail.html?id=${p.id}" class="thumb-link">
          <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80';" />
        </a>
        <div class="product-card-actions">
          <button class="action-btn wishlist-btn ${inWishlist ? 'active' : ''}" onclick="handleCardWishlist(${p.id}, this)" title="Yêu thích">
            <i class="fa-${inWishlist ? 'solid' : 'regular'} fa-heart"></i>
          </button>
          <button class="action-btn quick-view-btn" onclick="openQuickView(${p.id})" title="Xem nhanh">
            <i class="fa-solid fa-eye"></i>
          </button>
        </div>
      </div>

      <div class="product-info">
        <div class="product-brand">${p.brand}</div>
        <h3 class="product-title">
          <a href="product-detail.html?id=${p.id}">${p.name}</a>
        </h3>

        <div class="product-rating">
          <div class="stars">${generateStarRating(p.rating)}</div>
          <span class="count">(${p.reviewCount})</span>
        </div>

        <div class="product-price-row">
          <div class="prices">
            <span class="price-current">${formatVND(p.price)}</span>
            ${p.originalPrice ? `<span class="price-original">${formatVND(p.originalPrice)}</span>` : ''}
          </div>
          <button class="btn-quick-add" onclick="addToCart(${p.id}, '${p.variants ? p.variants[0] : ''}', 1)" title="Thêm vào giỏ">
            <i class="fa-solid fa-bag-shopping"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

function handleCardWishlist(productId, btn) {
  const isNowIn = toggleWishlist(productId);
  const icon = btn.querySelector("i");
  if (isNowIn) {
    btn.classList.add("active");
    icon.className = "fa-solid fa-heart";
  } else {
    btn.classList.remove("active");
    icon.className = "fa-regular fa-heart";
  }
}

/* ==========================================================
   SEARCH BAR SUBMISSION
   ========================================================== */
function initHeaderSearch() {
  const searchForms = document.querySelectorAll(".header-search-form");
  searchForms.forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input[name='q']");
      if (input && input.value.trim()) {
        window.location.href = `shop.html?search=${encodeURIComponent(input.value.trim())}`;
      }
    });
  });
}

/* ==========================================================
   MOBILE MENU TOGGLE
   ========================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById("mobileMenuToggle");
  const navDrawer = document.getElementById("mobileNavDrawer");
  const overlay = document.getElementById("mobileNavOverlay");
  const closeBtn = document.getElementById("mobileNavClose");

  if (toggleBtn && navDrawer) {
    toggleBtn.addEventListener("click", () => {
      navDrawer.classList.add("active");
      if (overlay) overlay.classList.add("active");
    });

    const close = () => {
      navDrawer.classList.remove("active");
      if (overlay) overlay.classList.remove("active");
    };

    if (closeBtn) closeBtn.addEventListener("click", close);
    if (overlay) overlay.addEventListener("click", close);
  }
}

/* ==========================================================
   ORDER DETAIL MODAL (GLOBAL)
   ========================================================== */
function viewUserOrderDetail(orderId) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  let modal = document.getElementById("orderDetailModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "orderDetailModal";
    modal.className = "lumina-modal";
    document.body.appendChild(modal);
  }

  const statusMap = {
    pending: "Chờ nhân viên duyệt",
    processing: "Đang đóng gói tại kho",
    shipping: "Đang trên đường giao",
    completed: "Đã giao thành công",
    cancelled: "Đã hủy đơn"
  };

  modal.innerHTML = `
    <div class="lumina-modal-overlay" onclick="closeUserOrderDetail()"></div>
    <div class="lumina-modal-dialog" style="max-width: 650px;">
      <button class="modal-close-icon" onclick="closeUserOrderDetail()">&times;</button>
      <div style="padding-bottom: 16px; margin-bottom: 20px; border-bottom: 1px solid var(--border-light);">
        <h3 style="font-family: var(--font-serif); font-size: 22px; color: var(--secondary);">Chi Tiết Đơn Hàng #${order.id}</h3>
        <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">Thời gian tạo: ${formatDate(order.createdAt)} | Tình trạng: <strong>${statusMap[order.status] || order.status}</strong></p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; font-size: 13px; background: var(--bg-surface); padding: 16px; border-radius: var(--radius-sm);">
        <div>
          <strong style="display:block; margin-bottom: 4px; color: var(--secondary);">Thông tin người nhận:</strong>
          <div>${order.customerName}</div>
          <div>${order.customerPhone}</div>
          <div>${order.shippingAddress}</div>
        </div>
        <div>
          <strong style="display:block; margin-bottom: 4px; color: var(--secondary);">Thanh toán:</strong>
          <div>Phương thức: ${order.paymentMethod ? order.paymentMethod.toUpperCase() : 'COD'}</div>
          <div>Trạng thái: ${order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</div>
          ${order.note ? `<div>Ghi chú: "${order.note}"</div>` : ''}
        </div>
      </div>

      <h4 style="font-size: 15px; margin-bottom: 12px; color: var(--secondary);">Danh sách sản phẩm:</h4>
      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
        ${order.items.map(i => `
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-light); padding-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <img src="${i.image}" alt="${i.name}" style="width: 40px; height: 40px; border-radius: 4px; object-fit: cover;" />
              <div>
                <strong style="font-size: 13.5px; color: var(--secondary);">${i.name}</strong>
                <div style="font-size: 12px; color: var(--text-light);">${i.variant} &times; ${i.quantity}</div>
              </div>
            </div>
            <span style="font-weight: 600; font-size: 14px; color: var(--primary);">${formatVND(i.price * i.quantity)}</span>
          </div>
        `).join('')}
      </div>

      <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13.5px; border-top: 1px solid var(--border-color); padding-top: 14px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between;">
          <span>Tạm tính:</span>
          <span>${formatVND(order.subtotal)}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Giảm giá voucher:</span>
          <span style="color: #ef4444;">-${formatVND(order.discountAmount || 0)}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Phí giao hàng:</span>
          <span>${order.shippingFee === 0 ? 'Miễn phí' : formatVND(order.shippingFee)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; color: var(--secondary); border-top: 1px dashed var(--border-light); padding-top: 8px;">
          <span>Tổng thanh toán:</span>
          <span style="color: var(--primary); font-size: 18px;">${formatVND(order.total)}</span>
        </div>
      </div>

      <h4 style="font-size: 15px; margin-bottom: 12px; color: var(--secondary);">Lịch sử vận chuyển:</h4>
      <div style="border-left: 2px solid var(--primary); padding-left: 16px; display: flex; flex-direction: column; gap: 10px; font-size: 13px;">
        ${(order.history || []).map(h => `
          <div>
            <strong style="color: var(--secondary);">${h.time}:</strong> <span style="color: var(--text-muted);">${h.note}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeUserOrderDetail() {
  const modal = document.getElementById("orderDetailModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function syncSystemSettingsUI() {
  if (typeof getSystemSettings === "function") {
    const s = getSystemSettings();
    if (s && s.announcementText) {
      document.querySelectorAll(".announcement-text").forEach(el => {
        el.innerHTML = `<i class="fa-solid fa-sparkles"></i> ${s.announcementText}`;
      });
    }
  }
}

// Chạy khởi tạo khi DOM ready
document.addEventListener("DOMContentLoaded", () => {
  updateBadges();
  updateAuthUI();
  initDemoBar();
  initHeaderSearch();
  initMobileMenu();
  syncSystemSettingsUI();
});
