/**
 * LUMINA BEAUTY & COSMETICS - Checkout Page Logic
 */

let checkoutSummary = null;
let selectedPaymentMethod = "cod";

document.addEventListener("DOMContentLoaded", () => {
  const { items, subtotal } = getCartDetails();

  if (!items || items.length === 0) {
    showToast("Giỏ hàng đang trống! Vui lòng chọn sản phẩm trước.", "warning");
    setTimeout(() => {
      window.location.href = "shop.html";
    }, 1500);
    return;
  }

  // Load summary or calculate
  const savedData = sessionStorage.getItem("lumina_checkout_data");
  if (savedData) {
    checkoutSummary = JSON.parse(savedData);
  } else {
    const shippingFee = subtotal >= 500000 ? 0 : 30000;
    checkoutSummary = {
      subtotal,
      discountAmount: 0,
      shippingFee,
      total: subtotal + shippingFee,
      couponCode: null
    };
  }

  prefillUserInfo();
  renderOrderReview(items);
  initPaymentMethodSelector();
});

function prefillUserInfo() {
  const user = getCurrentUser();
  if (user) {
    const nameInput = document.getElementById("billingName");
    const phoneInput = document.getElementById("billingPhone");
    const emailInput = document.getElementById("billingEmail");
    const addressInput = document.getElementById("billingAddress");

    if (nameInput && !nameInput.value) nameInput.value = user.name || "";
    if (phoneInput && !phoneInput.value) phoneInput.value = user.phone || "";
    if (emailInput && !emailInput.value) emailInput.value = user.email || "";
    if (addressInput && !addressInput.value) addressInput.value = user.address || "";
  }
}

function renderOrderReview(items) {
  const listContainer = document.getElementById("checkoutItemsList");
  if (listContainer) {
    listContainer.innerHTML = items.map(item => `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px dashed var(--border-light);">
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${item.product.image}" alt="${item.product.name}" style="width: 48px; height: 48px; border-radius: 6px; object-fit: cover;" />
          <div>
            <div style="font-size: 13.5px; font-weight: 600; color: var(--secondary); max-width: 220px; line-height: 1.3;">${item.product.name}</div>
            <small style="color: var(--text-light);">${item.variant} &times; ${item.quantity}</small>
          </div>
        </div>
        <div style="font-weight: 700; font-size: 14px; color: var(--secondary);">
          ${formatVND(item.lineTotal)}
        </div>
      </div>
    `).join('');
  }

  const subtotalEl = document.getElementById("coSubtotal");
  if (subtotalEl) subtotalEl.textContent = formatVND(checkoutSummary.subtotal);

  const discountRow = document.getElementById("coDiscountRow");
  const discountEl = document.getElementById("coDiscountAmount");
  if (discountRow && discountEl) {
    if (checkoutSummary.discountAmount > 0) {
      discountRow.style.display = "flex";
      discountEl.textContent = `-${formatVND(checkoutSummary.discountAmount)}`;
    } else {
      discountRow.style.display = "none";
    }
  }

  const shippingEl = document.getElementById("coShippingFee");
  if (shippingEl) {
    shippingEl.textContent = checkoutSummary.shippingFee === 0 ? "Miễn phí" : formatVND(checkoutSummary.shippingFee);
  }

  const totalEl = document.getElementById("coFinalTotal");
  if (totalEl) totalEl.textContent = formatVND(checkoutSummary.total);
}

function initPaymentMethodSelector() {
  const cards = document.querySelectorAll(".payment-method-card");
  const qrBox = document.getElementById("bankQrDetails");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      cards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      const radio = card.querySelector("input[type='radio']");
      if (radio) {
        radio.checked = true;
        selectedPaymentMethod = radio.value;
      }

      if (qrBox) {
        qrBox.style.display = selectedPaymentMethod === "banking" ? "flex" : "none";
      }
    });
  });
}

function processCheckout(event) {
  event.preventDefault();
  const form = event.target;

  const name = form.customerName.value.trim();
  const phone = form.customerPhone.value.trim();
  const email = form.customerEmail.value.trim();
  const province = form.customerProvince.value.trim();
  const address = form.customerAddress.value.trim();
  const note = form.customerNote ? form.customerNote.value.trim() : "";

  if (!name || !phone || !address || !province) {
    showToast("Vui lòng điền đầy đủ thông tin giao hàng bắt buộc!", "warning");
    return;
  }

  const { items } = getCartDetails();
  const currentUser = getCurrentUser();

  const newOrderId = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrder = {
    id: newOrderId,
    userId: currentUser ? currentUser.id : "usr_guest",
    customerName: name,
    customerPhone: phone,
    customerEmail: email || (currentUser ? currentUser.email : "khach@lumina.vn"),
    shippingAddress: `${address}, ${province}`,
    items: items.map(i => ({
      id: i.product.id,
      name: i.product.name,
      price: i.product.price,
      variant: i.variant,
      quantity: i.quantity,
      image: i.product.image
    })),
    subtotal: checkoutSummary.subtotal,
    discountAmount: checkoutSummary.discountAmount,
    shippingFee: checkoutSummary.shippingFee,
    total: checkoutSummary.total,
    paymentMethod: selectedPaymentMethod,
    paymentStatus: selectedPaymentMethod === "cod" ? "unpaid" : "paid",
    status: "pending",
    note: note,
    createdAt: new Date().toISOString(),
    history: [
      { time: formatDate(new Date()), note: "Đơn hàng đã được tạo thành công trên hệ thống" }
    ]
  };

  // Lưu đơn hàng vào LocalStorage
  const orders = getOrders();
  orders.unshift(newOrder);
  saveOrders(orders);

  // Xóa giỏ hàng & session checkout
  saveCart([]);
  sessionStorage.removeItem("lumina_checkout_data");
  sessionStorage.removeItem("lumina_applied_coupon");

  // Hiển thị modal xác nhận đơn hàng thành công
  showOrderSuccessModal(newOrder);
}

function showOrderSuccessModal(order) {
  let modal = document.getElementById("orderSuccessModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "orderSuccessModal";
    modal.className = "lumina-modal active";
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="lumina-modal-overlay"></div>
    <div class="lumina-modal-dialog" style="max-width: 540px; text-align: center; padding: 40px 30px;">
      <div style="width: 70px; height: 70px; border-radius: 50%; background: #d1fae5; color: #10b981; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 20px;">
        <i class="fa-solid fa-check"></i>
      </div>
      <h2 style="font-family: var(--font-serif); font-size: 26px; color: var(--secondary); margin-bottom: 10px;">Đặt Hàng Thành Công!</h2>
      <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 24px;">
        Cảm ơn quý khách <strong>${order.customerName}</strong>. Đơn hàng <strong>#${order.id}</strong> đã được tiếp nhận và nhân viên Lumina sẽ liên hệ xác nhận trong ít phút.
      </p>

      <div style="background: var(--bg-surface); border-radius: var(--radius-md); padding: 18px; text-align: left; margin-bottom: 28px; font-size: 13.5px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <span>Mã đơn hàng:</span>
          <strong>${order.id}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <span>Phương thức thanh toán:</span>
          <strong>${order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : order.paymentMethod === 'banking' ? 'Chuyển khoản VietQR' : 'Ví điện tử MoMo'}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <span>Tổng thanh toán:</span>
          <strong style="color: var(--primary); font-size: 16px;">${formatVND(order.total)}</strong>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span>Địa chỉ nhận:</span>
          <span style="max-width: 280px; text-align: right; color: var(--secondary);">${order.shippingAddress}</span>
        </div>
      </div>

      <div style="display: flex; gap: 14px; justify-content: center;">
        <a href="profile.html#orders" class="btn-primary" style="flex:1;">
          <i class="fa-solid fa-box-open"></i> Xem đơn hàng
        </a>
        <a href="shop.html" class="btn-secondary" style="flex:1;">
          <i class="fa-solid fa-bag-shopping"></i> Tiếp tục mua sắm
        </a>
      </div>
    </div>
  `;

  document.body.style.overflow = "hidden";
}
