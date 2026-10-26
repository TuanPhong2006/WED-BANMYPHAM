/**
 * LUMINA BEAUTY & COSMETICS - User Profile & Order Tracking Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    showToast("Vui lòng đăng nhập để xem thông tin tài khoản!", "info");
    setTimeout(() => {
      window.location.href = "auth.html";
    }, 1200);
    return;
  }

  loadUserProfile(currentUser);
  loadUserOrders(currentUser);
  initProfileTabs();

  // Kiểm tra hash #orders
  if (window.location.hash === "#orders") {
    switchProfileTab("orders");
  }
});

function loadUserProfile(user) {
  document.querySelectorAll(".profileUserName").forEach(el => el.textContent = user.name);
  document.querySelectorAll(".profileUserEmail").forEach(el => el.textContent = user.email);
  document.querySelectorAll(".profileUserAvatar").forEach(el => el.src = user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80");

  const nameInput = document.getElementById("profileInputName");
  const phoneInput = document.getElementById("profileInputPhone");
  const emailInput = document.getElementById("profileInputEmail");
  const addressInput = document.getElementById("profileInputAddress");

  if (nameInput) nameInput.value = user.name || "";
  if (phoneInput) phoneInput.value = user.phone || "";
  if (emailInput) emailInput.value = user.email || "";
  if (addressInput) addressInput.value = user.address || "";
}

function handleUpdateProfile(event) {
  event.preventDefault();
  const user = getCurrentUser();
  if (!user) return;

  const form = event.target;
  user.name = form.profileName.value.trim();
  user.phone = form.profilePhone.value.trim();
  user.address = form.profileAddress.value.trim();

  // Cập nhật lại trong danh sách users
  const users = JSON.parse(localStorage.getItem("lumina_users") || "[]");
  const idx = users.findIndex(u => u.id === user.id);
  if (idx > -1) {
    users[idx] = { ...users[idx], ...user };
    localStorage.setItem("lumina_users", JSON.stringify(users));
  }

  setCurrentUser(user);
  showToast("Cập nhật thông tin hồ sơ thành công!", "success");
}

function initProfileTabs() {
  const tabBtns = document.querySelectorAll(".profile-nav-btn");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabName = btn.getAttribute("data-tab");
      switchProfileTab(tabName);
    });
  });
}

function switchProfileTab(tabName) {
  document.querySelectorAll(".profile-nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === tabName);
  });

  document.querySelectorAll(".profile-tab-pane").forEach(pane => {
    pane.style.display = pane.id === `tab-${tabName}` ? "block" : "none";
  });
}

function loadUserOrders(user) {
  const allOrders = getOrders();
  // Filter by user ID or user Email
  const userOrders = allOrders.filter(o => o.userId === user.id || o.customerEmail === user.email);

  const container = document.getElementById("userOrdersList");
  if (!container) return;

  if (userOrders.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon"><i class="fa-solid fa-box-open"></i></div>
        <h3>Bạn chưa có đơn hàng nào</h3>
        <p>Khám phá ngay bộ sưu tập mỹ phẩm chính hãng và tận hưởng ưu đãi ngập tràn!</p>
        <a href="shop.html" class="btn-primary"><i class="fa-solid fa-bag-shopping"></i> Khám phá sản phẩm ngay</a>
      </div>
    `;
    return;
  }

  const statusMap = {
    pending: { label: "Chờ xử lý", class: "status-pending" },
    processing: { label: "Đang đóng gói", class: "status-processing" },
    shipping: { label: "Đang giao hàng", class: "status-shipping" },
    completed: { label: "Giao thành công", class: "status-completed" },
    cancelled: { label: "Đã hủy", class: "status-cancelled" }
  };

  container.innerHTML = userOrders.map(order => {
    const st = statusMap[order.status] || { label: order.status, class: "status-pending" };
    return `
      <div class="order-history-card">
        <div class="order-history-header">
          <div>
            <strong style="font-size: 15px; color: var(--secondary);">Đơn hàng: #${order.id}</strong>
            <div style="font-size: 12px; color: var(--text-light); margin-top: 2px;">
              Đặt ngày: ${formatDate(order.createdAt)}
            </div>
          </div>
          <span class="order-status-badge ${st.class}">${st.label}</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px;">
          ${order.items.map(i => `
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <img src="${i.image}" alt="${i.name}" style="width: 48px; height: 48px; border-radius: 6px; object-fit: cover; background: #fdf6f9;" />
                <div>
                  <div style="font-size: 13.5px; font-weight: 600; color: var(--secondary);">${i.name}</div>
                  <small style="color: var(--text-light);">${i.variant} &times; ${i.quantity}</small>
                </div>
              </div>
              <span style="font-weight: 600; font-size: 14px; color: var(--secondary);">${formatVND(i.price * i.quantity)}</span>
            </div>
          `).join('')}
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 14px; border-top: 1px dashed var(--border-light);">
          <div>
            <span style="font-size: 13px; color: var(--text-muted);">Tổng thanh toán: </span>
            <strong style="font-size: 16px; color: var(--primary);">${formatVND(order.total)}</strong>
          </div>
          <button class="btn-secondary" style="padding: 6px 16px; font-size: 13px;" onclick="viewUserOrderDetail('${order.id}')">
            <i class="fa-solid fa-file-invoice"></i> Chi tiết đơn
          </button>
        </div>
      </div>
    `;
  }).join('');
}

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
          <div>Phương thức: ${order.paymentMethod.toUpperCase()}</div>
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
