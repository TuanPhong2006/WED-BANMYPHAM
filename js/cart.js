/**
 * LUMINA BEAUTY & COSMETICS - Cart Page Logic
 */

let appliedCoupon = null;
const FREE_SHIPPING_THRESHOLD = 500000;
const STANDARD_SHIPPING_FEE = 30000;

document.addEventListener("DOMContentLoaded", () => {
  // Check if coupon saved in sessionStorage
  const savedCoupon = sessionStorage.getItem("lumina_applied_coupon");
  if (savedCoupon) {
    appliedCoupon = JSON.parse(savedCoupon);
  }
  renderCart();
});

function renderCart() {
  const { items, subtotal } = getCartDetails();
  const container = document.getElementById("cartItemsContainer");
  const emptyBox = document.getElementById("cartEmptyBox");
  const layout = document.getElementById("cartLayout");

  if (!items || items.length === 0) {
    if (layout) layout.style.display = "none";
    if (emptyBox) emptyBox.style.display = "block";
    return;
  }

  if (layout) layout.style.display = "grid";
  if (emptyBox) emptyBox.style.display = "none";

  // Render Table Rows
  if (container) {
    container.innerHTML = items.map((item, index) => `
      <tr>
        <td>
          <div class="cart-item-info">
            <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-img" />
            <div>
              <a href="product-detail.html?id=${item.product.id}" class="cart-item-name">${item.product.name}</a>
              <span class="cart-item-variant">${item.variant || 'Tiêu chuẩn'}</span>
            </div>
          </div>
        </td>
        <td>
          <span class="cart-item-price">${formatVND(item.product.price)}</span>
        </td>
        <td>
          <div class="quantity-control">
            <button type="button" onclick="changeItemQty(${index}, -1)">-</button>
            <input type="number" value="${item.quantity}" readonly />
            <button type="button" onclick="changeItemQty(${index}, 1)">+</button>
          </div>
        </td>
        <td>
          <span class="cart-item-price" style="color: var(--secondary);">${formatVND(item.lineTotal)}</span>
        </td>
        <td>
          <button class="cart-remove-btn" onclick="handleRemoveItem(${index})" title="Xóa">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  // Free shipping progress bar
  const shippingMsg = document.getElementById("freeShippingMsg");
  const progressFill = document.getElementById("freeShippingProgress");
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  if (progressFill) progressFill.style.width = `${progressPercent}%`;

  if (shippingMsg) {
    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      shippingMsg.innerHTML = `<span style="color:#10b981; font-weight:600;"><i class="fa-solid fa-circle-check"></i> Chúc mừng! Bạn được MIỄN PHÍ VẬN CHUYỂN cho đơn hàng này!</span>`;
    } else {
      const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
      shippingMsg.innerHTML = `Mua thêm <strong>${formatVND(remaining)}</strong> để được <strong>MIỄN PHÍ VẬN CHUYỂN</strong> toàn quốc!`;
    }
  }

  // Calculations
  let discountAmount = 0;
  if (appliedCoupon) {
    if (subtotal >= appliedCoupon.minOrder) {
      if (appliedCoupon.type === "percent") {
        discountAmount = (subtotal * appliedCoupon.value) / 100;
      } else {
        discountAmount = appliedCoupon.value;
      }
    } else {
      showToast(`Mã ${appliedCoupon.code} chỉ áp dụng cho đơn từ ${formatVND(appliedCoupon.minOrder)}`, "warning");
      appliedCoupon = null;
      sessionStorage.removeItem("lumina_applied_coupon");
    }
  }

  let shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || (appliedCoupon && appliedCoupon.code === "FREESHIP") ? 0 : STANDARD_SHIPPING_FEE;
  let finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  // Update Summary Elements
  const subtotalEl = document.getElementById("cartSubtotal");
  if (subtotalEl) subtotalEl.textContent = formatVND(subtotal);

  const discountRow = document.getElementById("cartDiscountRow");
  const discountEl = document.getElementById("cartDiscountAmount");
  if (discountRow && discountEl) {
    if (discountAmount > 0) {
      discountRow.style.display = "flex";
      discountEl.textContent = `-${formatVND(discountAmount)}`;
    } else {
      discountRow.style.display = "none";
    }
  }

  const shippingEl = document.getElementById("cartShippingFee");
  if (shippingEl) {
    shippingEl.textContent = shippingFee === 0 ? "Miễn phí" : formatVND(shippingFee);
  }

  const totalEl = document.getElementById("cartFinalTotal");
  if (totalEl) totalEl.textContent = formatVND(finalTotal);

  // Save current order summary to session for checkout page
  sessionStorage.setItem("lumina_checkout_data", JSON.stringify({
    subtotal,
    discountAmount,
    shippingFee,
    total: finalTotal,
    couponCode: appliedCoupon ? appliedCoupon.code : null
  }));
}

function changeItemQty(index, delta) {
  const cart = getCart();
  if (cart[index]) {
    const newQty = cart[index].quantity + delta;
    updateCartQuantity(index, newQty);
    renderCart();
  }
}

function handleRemoveItem(index) {
  removeFromCart(index);
  renderCart();
}

function clearAllCart() {
  if (confirm("Bạn có chắc chắn muốn xóa toàn bộ sản phẩm trong giỏ hàng?")) {
    saveCart([]);
    renderCart();
    showToast("Đã làm trống giỏ hàng!", "info");
  }
}

function applyCartCoupon() {
  const input = document.getElementById("couponInput");
  if (!input) return;
  const code = input.value.trim().toUpperCase();

  if (!code) {
    showToast("Vui lòng nhập mã giảm giá!", "warning");
    return;
  }

  const coupons = getCoupons();
  const found = coupons.find(c => c.code === code && c.active);

  if (!found) {
    showToast("Mã giảm giá không tồn tại hoặc đã hết hạn!", "error");
    return;
  }

  const { subtotal } = getCartDetails();
  if (subtotal < found.minOrder) {
    showToast(`Đơn hàng tối thiểu để áp dụng mã là ${formatVND(found.minOrder)}`, "warning");
    return;
  }

  appliedCoupon = found;
  sessionStorage.setItem("lumina_applied_coupon", JSON.stringify(found));
  showToast(`Áp dụng thành công mã "${found.code}"!`, "success");
  renderCart();
}
