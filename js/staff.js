/**
 * LUMINA BEAUTY & COSMETICS - Staff Portal Logic
 * Order Operations, Fast Inventory Check & Customer Support
 */

let currentStaffFilter = "all";
let staffOrders = [];

document.addEventListener("DOMContentLoaded", () => {
  verifyStaffRole();
  loadStaffOrders();
  loadStaffInventory();
  loadStaffMessages();
});

function verifyStaffRole() {
  let user = getCurrentUser();
  if (!user || (user.role !== "staff" && user.role !== "admin")) {
    const users = JSON.parse(localStorage.getItem("lumina_users") || "[]");
    const staffUser = users.find(u => u.role === "staff") || (typeof DEFAULT_USERS !== "undefined" ? DEFAULT_USERS[1] : null);
    if (staffUser) {
      setCurrentUser(staffUser);
      user = staffUser;
    }
  }

  const banner = document.getElementById("staffAccessWarning");
  if (banner) banner.style.display = "none";

  const nameEl = document.getElementById("staffHeaderName");
  if (nameEl && user) nameEl.textContent = user.name;
  const roleEl = document.getElementById("staffHeaderRole");
  if (roleEl && user) roleEl.textContent = user.role === "admin" ? "Quản trị viên (Quyền Staff)" : "Nhân viên Vận hành";
}

/* ==========================================================
   ORDER PROCESSING (STAFF)
   ========================================================== */
function loadStaffOrders() {
  staffOrders = getOrders();
  renderStaffOrders();
  updateStaffCounts();
}

function filterStaffOrders(status) {
  currentStaffFilter = status;
  document.querySelectorAll(".staff-tab-pill").forEach(p => {
    p.classList.toggle("active", p.getAttribute("data-status") === status);
  });
  renderStaffOrders();
}

function renderStaffOrders() {
  const container = document.getElementById("staffOrdersTableBody");
  if (!container) return;

  const filtered = staffOrders.filter(o => {
    if (currentStaffFilter === "all") return true;
    return o.status === currentStaffFilter;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 40px; color: #94a3b8;">
          <i class="fa-solid fa-inbox" style="font-size: 32px; display: block; margin-bottom: 8px;"></i>
          Không có đơn hàng nào trong mục này.
        </td>
      </tr>
    `;
    return;
  }

  const statusMap = {
    pending: { label: "Chờ xử lý", class: "pending" },
    processing: { label: "Đang đóng gói", class: "processing" },
    shipping: { label: "Đang giao", class: "shipping" },
    completed: { label: "Hoàn thành", class: "completed" },
    cancelled: { label: "Đã hủy", class: "cancelled" }
  };

  container.innerHTML = filtered.map(order => {
    const st = statusMap[order.status] || { label: order.status, class: "pending" };
    return `
      <tr>
        <td><strong>#${order.id}</strong></td>
        <td>
          <div style="font-weight: 600; color: #0f172a;">${order.customerName}</div>
          <small style="color: #64748b;">${order.customerPhone}</small>
        </td>
        <td>
          <span style="font-size: 13px;">${order.items.length} món</span>
          <div style="font-size: 11.5px; color: #64748b; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${order.items.map(i => i.name).join(', ')}
          </div>
        </td>
        <td><strong style="color: var(--primary);">${formatVND(order.total)}</strong></td>
        <td>
          <select class="status-select ${st.class}" onchange="changeOrderStatus('${order.id}', this.value)">
            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Chờ xử lý</option>
            <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Đang đóng gói</option>
            <option value="shipping" ${order.status === 'shipping' ? 'selected' : ''}>Đang giao hàng</option>
            <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Giao thành công</option>
            <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Hủy đơn</option>
          </select>
        </td>
        <td>
          <small style="color: #64748b;">${formatDate(order.createdAt)}</small>
        </td>
        <td>
          <div class="table-action-btns">
            <button class="btn-table-action" onclick="viewStaffOrderDetail('${order.id}')" title="Xem chi tiết & In hóa đơn">
              <i class="fa-solid fa-eye"></i>
            </button>
            ${order.status === 'pending' ? `
              <button class="btn-table-action" style="background:#eff6ff; color:#3b82f6;" onclick="quickAdvanceOrder('${order.id}', 'processing')" title="Duyệt đơn nhanh">
                <i class="fa-solid fa-check"></i>
              </button>
            ` : ''}
            ${order.status === 'processing' ? `
              <button class="btn-table-action" style="background:#ede9fe; color:#8b5cf6;" onclick="quickAdvanceOrder('${order.id}', 'shipping')" title="Bàn giao shipper">
                <i class="fa-solid fa-truck-fast"></i>
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function updateStaffCounts() {
  const pendingCount = staffOrders.filter(o => o.status === "pending").length;
  const processingCount = staffOrders.filter(o => o.status === "processing").length;
  const shippingCount = staffOrders.filter(o => o.status === "shipping").length;

  const countEl = document.getElementById("staffPendingBadge");
  if (countEl) countEl.textContent = pendingCount;

  const kpiPending = document.getElementById("staffKpiPending");
  if (kpiPending) kpiPending.textContent = pendingCount;

  const kpiProcessing = document.getElementById("staffKpiProcessing");
  if (kpiProcessing) kpiProcessing.textContent = processingCount;

  const kpiShipping = document.getElementById("staffKpiShipping");
  if (kpiShipping) kpiShipping.textContent = shippingCount;
}

function changeOrderStatus(orderId, newStatus) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  const statusNotes = {
    pending: "Đơn hàng chuyển sang trạng thái Chờ xử lý",
    processing: "Nhân viên xác nhận đơn và đang đóng gói sản phẩm",
    shipping: "Đơn hàng đã bàn giao cho đơn vị vận chuyển",
    completed: "Đơn hàng đã giao thành công và hoàn tất",
    cancelled: "Đơn hàng đã bị hủy bởi nhân viên"
  };

  order.status = newStatus;
  if (!order.history) order.history = [];
  order.history.push({
    time: formatDate(new Date()),
    note: statusNotes[newStatus] || `Cập nhật trạng thái: ${newStatus}`
  });

  saveOrders(orders);
  staffOrders = orders;
  renderStaffOrders();
  updateStaffCounts();
  showToast(`Đã cập nhật trạng thái đơn #${orderId} sang "${newStatus}"`, "success");
}

function quickAdvanceOrder(orderId, nextStatus) {
  changeOrderStatus(orderId, nextStatus);
}

function viewStaffOrderDetail(orderId) {
  viewUserOrderDetail(orderId); // Reuse clean modal
}

/* ==========================================================
   INVENTORY LOOKUP & FAST STOCK (STAFF)
   ========================================================== */
function loadStaffInventory() {
  const container = document.getElementById("staffInventoryTableBody");
  if (!container) return;

  const products = getProducts();
  container.innerHTML = products.map(p => {
    let stockClass = "stock-high";
    let stockText = "Đủ hàng";
    if (p.stock <= 0) {
      stockClass = "stock-out";
      stockText = "Hết hàng";
    } else if (p.stock < 20) {
      stockClass = "stock-warning";
      stockText = "Sắp hết";
    }

    return `
      <tr>
        <td>
          <div class="table-user-cell">
            <img src="${p.image}" alt="${p.name}" class="table-thumb" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=100&q=80';" />
            <div>
              <strong style="color:#0f172a; font-size:13.5px;">${p.name}</strong>
              <div style="font-size:11.5px; color:#64748b;">${p.brand} | ${p.categoryName}</div>
            </div>
          </div>
        </td>
        <td><strong style="color:var(--primary);">${formatVND(p.price)}</strong></td>
        <td><span class="stock-badge ${stockClass}">${stockText} (${p.stock})</span></td>
        <td>
          <div style="display:flex; align-items:center; gap:6px;">
            <button class="btn-table-action" onclick="adjustProductStock(${p.id}, -1)">-1</button>
            <strong style="min-width:32px; text-align:center;">${p.stock}</strong>
            <button class="btn-table-action" onclick="adjustProductStock(${p.id}, 1)">+1</button>
            <button class="btn-table-action" onclick="adjustProductStock(${p.id}, 10)">+10</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function adjustProductStock(productId, delta) {
  const products = getProducts();
  const product = products.find(p => p.id == productId);
  if (!product) return;

  product.stock = Math.max(0, product.stock + delta);
  saveProducts(products);
  loadStaffInventory();
  showToast(`Đã cập nhật tồn kho "${product.name}": ${product.stock} cái`, "info");
}

/* ==========================================================
   CUSTOMER SUPPORT MESSAGES (STAFF)
   ========================================================== */
function loadStaffMessages() {
  const container = document.getElementById("staffMessagesContainer");
  if (!container) return;

  const messages = JSON.parse(localStorage.getItem("lumina_messages") || "[]");
  container.innerHTML = messages.map(msg => `
    <div style="background:#fff; border-radius:8px; border:1px solid #e2e8f0; padding:18px; margin-bottom:14px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <div>
          <strong style="font-size:14px; color:#0f172a;">${msg.customerName}</strong>
          <small style="color:#64748b; margin-left:8px;">${msg.phone} - ${msg.time}</small>
        </div>
        <span class="role-chip ${msg.status === 'answered' ? 'role-staff' : 'role-admin'}">
          ${msg.status === 'answered' ? 'Đã phản hồi' : 'Chờ tư vấn'}
        </span>
      </div>
      <div style="font-size:13.5px; color:#334155; margin-bottom:10px;">
        <span style="font-weight:600; color:var(--primary);">[${msg.topic}]</span>: ${msg.message}
      </div>
      ${msg.reply ? `
        <div style="background:#f8fafc; border-left:3px solid var(--primary); padding:10px 14px; font-size:13px; color:#475569; margin-top:8px;">
          <strong>Phản hồi của Lumina:</strong> ${msg.reply}
        </div>
      ` : `
        <div style="display:flex; gap:8px; margin-top:10px;">
          <input type="text" id="replyInput_${msg.id}" placeholder="Nhập câu trả lời tư vấn cho khách hàng..." class="form-control" style="font-size:13px;" />
          <button class="btn-primary" style="padding:6px 16px; font-size:13px;" onclick="replyToCustomer('${msg.id}')">
            <i class="fa-solid fa-paper-plane"></i> Gửi
          </button>
        </div>
      `}
    </div>
  `).join('');
}

function replyToCustomer(msgId) {
  const input = document.getElementById(`replyInput_${msgId}`);
  if (!input || !input.value.trim()) {
    showToast("Vui lòng nhập nội dung phản hồi!", "warning");
    return;
  }

  const messages = JSON.parse(localStorage.getItem("lumina_messages") || "[]");
  const target = messages.find(m => m.id === msgId);
  if (target) {
    target.reply = input.value.trim();
    target.status = "answered";
    localStorage.setItem("lumina_messages", JSON.stringify(messages));
    loadStaffMessages();
    showToast("Đã gửi phản hồi hỗ trợ khách hàng!", "success");
  }
}
