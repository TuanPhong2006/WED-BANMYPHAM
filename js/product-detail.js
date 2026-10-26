/**
 * LUMINA BEAUTY & COSMETICS - Product Detail Page Logic
 */

let currentProduct = null;
let selectedDetailVariant = "";
let currentDetailQty = 1;

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id") || 1;

  currentProduct = getProductById(productId);
  if (!currentProduct) {
    const products = getProducts();
    currentProduct = products[0];
  }

  renderProductDetails();
  initTabs();
  renderRelatedProducts();
});

function renderProductDetails() {
  if (!currentProduct) return;

  // Breadcrumbs & Title
  document.title = `${currentProduct.name} | Lumina Beauty`;
  const crumbEl = document.getElementById("detailCrumbName");
  if (crumbEl) crumbEl.textContent = currentProduct.name;

  // Main Image
  const mainImg = document.getElementById("detailMainImage");
  if (mainImg) {
    mainImg.src = currentProduct.image;
    mainImg.alt = currentProduct.name;
  }

  // Thumbnails
  const thumbsContainer = document.getElementById("detailThumbs");
  if (thumbsContainer) {
    const images = currentProduct.images || [currentProduct.image];
    thumbsContainer.innerHTML = images.map((img, i) => `
      <img src="${img}" class="detail-thumb ${i === 0 ? 'active' : ''}" onclick="changeDetailImage('${img}', this)" alt="Thumbnail ${i}" />
    `).join('');
  }

  // Brand & Name
  const brandEl = document.getElementById("detailBrand");
  if (brandEl) brandEl.textContent = currentProduct.brand;

  const nameEl = document.getElementById("detailName");
  if (nameEl) nameEl.textContent = currentProduct.name;

  // Rating & Review Count
  const starsEl = document.getElementById("detailStars");
  if (starsEl) starsEl.innerHTML = generateStarRating(currentProduct.rating);

  const ratingScoreEl = document.getElementById("detailRatingScore");
  if (ratingScoreEl) ratingScoreEl.textContent = currentProduct.rating;

  const reviewCountEl = document.getElementById("detailReviewCount");
  if (reviewCountEl) reviewCountEl.textContent = `${currentProduct.reviewCount} đánh giá xác thực`;

  // Prices
  const priceEl = document.getElementById("detailPrice");
  if (priceEl) priceEl.textContent = formatVND(currentProduct.price);

  const origPriceEl = document.getElementById("detailOriginalPrice");
  if (origPriceEl) {
    if (currentProduct.originalPrice) {
      origPriceEl.textContent = formatVND(currentProduct.originalPrice);
      origPriceEl.style.display = "inline";
    } else {
      origPriceEl.style.display = "none";
    }
  }

  const discountEl = document.getElementById("detailDiscountTag");
  if (discountEl) {
    if (currentProduct.discount > 0) {
      discountEl.textContent = `Tiết kiệm ${currentProduct.discount}%`;
      discountEl.style.display = "inline-block";
    } else {
      discountEl.style.display = "none";
    }
  }

  // Summary
  const descEl = document.getElementById("detailDescSummary");
  if (descEl) descEl.textContent = currentProduct.description;

  // Variants
  const variants = currentProduct.variants || ["Tiêu chuẩn"];
  selectedDetailVariant = variants[0];
  const variantContainer = document.getElementById("detailVariantChips");
  if (variantContainer) {
    variantContainer.innerHTML = variants.map((v, i) => `
      <button type="button" class="variant-chip ${i === 0 ? 'active' : ''}" onclick="selectDetailVariant(this, '${v}')">${v}</button>
    `).join('');
  }

  // Stock Status
  const stockEl = document.getElementById("detailStockStatus");
  if (stockEl) {
    if (currentProduct.stock > 0) {
      stockEl.className = "qv-stock in-stock";
      stockEl.innerHTML = `<i class="fa-solid fa-check-circle"></i> Còn ${currentProduct.stock} sản phẩm sẵn sàng giao`;
    } else {
      stockEl.className = "qv-stock out-of-stock";
      stockEl.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Tạm hết hàng`;
    }
  }

  // Wishlist Button State
  const wishBtn = document.getElementById("detailWishlistBtn");
  if (wishBtn) {
    const isWished = isInWishlist(currentProduct.id);
    wishBtn.classList.toggle("active", isWished);
    wishBtn.innerHTML = `<i class="fa-${isWished ? 'solid' : 'regular'} fa-heart"></i>`;
  }

  // Tab Contents
  const tabDesc = document.getElementById("tabContentDesc");
  if (tabDesc) tabDesc.innerHTML = `<p>${currentProduct.description}</p><p style="margin-top:14px;">Sản phẩm được nhập khẩu chính ngạch 100%, đầy đủ hóa đơn chứng từ và tem phụ tiếng Việt theo quy định của Bộ Y Tế. Cam kết đền bù 200% nếu phát hiện hàng không chính hãng.</p>`;

  const tabIngr = document.getElementById("tabContentIngredients");
  if (tabIngr) tabIngr.innerHTML = `<p><strong>Thành phần chính:</strong></p><p style="margin-top:8px;">${currentProduct.ingredients || "Chiết xuất thảo mộc thiên nhiên lành tính, không chứa cồn, không paraben, an toàn tuyệt đối cho mọi làn da."}</p>`;

  const tabHow = document.getElementById("tabContentHowToUse");
  if (tabHow) tabHow.innerHTML = `<p><strong>Hướng dẫn các bước sử dụng hiệu quả:</strong></p><p style="margin-top:8px;">${currentProduct.howToUse || "Dùng sáng và tối sau bước làm sạch. Thoa đều một lượng vừa đủ lên da và massage nhẹ nhàng để dưỡng chất thẩm thấu sâu."}</p>`;
}

function changeDetailImage(src, thumbEl) {
  const mainImg = document.getElementById("detailMainImage");
  if (mainImg) mainImg.src = src;
  document.querySelectorAll(".detail-thumb").forEach(t => t.classList.remove("active"));
  thumbEl.classList.add("active");
}

function selectDetailVariant(btn, variant) {
  document.querySelectorAll("#detailVariantChips .variant-chip").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  selectedDetailVariant = variant;
}

function updateDetailQty(delta) {
  currentDetailQty += delta;
  if (currentDetailQty < 1) currentDetailQty = 1;
  if (currentProduct && currentDetailQty > currentProduct.stock) {
    currentDetailQty = currentProduct.stock;
    showToast(`Kho chỉ còn ${currentProduct.stock} sản phẩm`, "warning");
  }
  const qtyInput = document.getElementById("detailQtyInput");
  if (qtyInput) qtyInput.value = currentDetailQty;
}

function handleDetailAddToCart() {
  if (!currentProduct) return;
  addToCart(currentProduct.id, selectedDetailVariant, currentDetailQty);
}

function handleDetailBuyNow() {
  if (!currentProduct) return;
  addToCart(currentProduct.id, selectedDetailVariant, currentDetailQty, false);
  window.location.href = "checkout.html";
}

function handleDetailWishlistToggle() {
  if (!currentProduct) return;
  const isNowIn = toggleWishlist(currentProduct.id);
  const btn = document.getElementById("detailWishlistBtn");
  if (btn) {
    btn.classList.toggle("active", isNowIn);
    btn.innerHTML = `<i class="fa-${isNowIn ? 'solid' : 'regular'} fa-heart"></i>`;
  }
}

function initTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const targetId = btn.getAttribute("data-tab");
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add("active");
    });
  });
}

function submitReview(event) {
  event.preventDefault();
  const form = event.target;
  const name = form.reviewAuthor.value.trim();
  const rating = form.reviewRating.value;
  const comment = form.reviewComment.value.trim();

  if (!name || !comment) {
    showToast("Vui lòng điền đầy đủ họ tên và cảm nhận!", "warning");
    return;
  }

  const reviewList = document.getElementById("reviewsList");
  if (reviewList) {
    const newReview = document.createElement("div");
    newReview.className = "review-item";
    newReview.innerHTML = `
      <div class="review-author">
        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="${name}" class="review-avatar" />
        <div>
          <strong>${name}</strong>
          <div class="stars" style="color: #f59e0b; font-size: 12px; margin-top: 2px;">
            ${generateStarRating(Number(rating))}
          </div>
        </div>
        <small style="margin-left: auto; color: var(--text-light); font-size: 12px;">Vừa xong</small>
      </div>
      <p style="font-size: 14px; color: var(--text-muted); line-height: 1.6;">${comment}</p>
    `;
    reviewList.prepend(newReview);
  }

  form.reset();
  showToast("Cảm ơn bạn đã gửi đánh giá cho sản phẩm!", "success");
}

function renderRelatedProducts() {
  const container = document.getElementById("relatedProductsGrid");
  if (!container || !currentProduct) return;

  const products = getProducts();
  const related = products
    .filter(p => p.id !== currentProduct.id && (p.category === currentProduct.category || p.brand === currentProduct.brand))
    .slice(0, 4);

  container.innerHTML = related.map(p => createProductCardHTML(p)).join('');
}
