/**
 * LUMINA BEAUTY & COSMETICS - Shop Page Logic
 * Filtering by Category, Brand, Price, Rating, Search & Sorting
 */

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const itemsPerPage = 8;

let currentFilter = {
  category: "all",
  brands: [],
  maxPrice: 6000000,
  minRating: 0,
  sortBy: "default",
  searchQuery: ""
};

document.addEventListener("DOMContentLoaded", () => {
  allProducts = getProducts();
  
  // Lấy params từ URL nếu có
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get("category");
  const searchParam = urlParams.get("search");

  if (catParam) {
    currentFilter.category = catParam;
  }
  if (searchParam) {
    currentFilter.searchQuery = searchParam.trim().toLowerCase();
    const searchInputs = document.querySelectorAll(".header-search-form input[name='q']");
    searchInputs.forEach(i => i.value = searchParam);
  }

  initFilterUI();
  applyFilters();
});

function initFilterUI() {
  // Render Categories Widget
  const catContainer = document.getElementById("shopCategoryList");
  if (catContainer) {
    catContainer.innerHTML = DEFAULT_CATEGORIES.map(c => {
      const count = c.id === "all" ? allProducts.length : allProducts.filter(p => p.category === c.id).length;
      const isActive = currentFilter.category === c.id;
      return `
        <button class="category-item-btn ${isActive ? 'active' : ''}" onclick="selectCategoryFilter('${c.id}')">
          <span><i class="fa-solid ${c.icon}"></i> ${c.name}</span>
          <span class="item-count">${count}</span>
        </button>
      `;
    }).join('');
  }

  // Render Brands Checkboxes
  const brandContainer = document.getElementById("shopBrandList");
  if (brandContainer) {
    brandContainer.innerHTML = DEFAULT_BRANDS.map(brand => {
      const count = allProducts.filter(p => p.brand === brand).length;
      return `
        <label class="checkbox-label">
          <input type="checkbox" value="${brand}" onchange="toggleBrandFilter('${brand}', this.checked)" />
          <span>${brand} (${count})</span>
        </label>
      `;
    }).join('');
  }

  // Price Slider
  const priceSlider = document.getElementById("priceSlider");
  const priceDisplay = document.getElementById("priceDisplay");
  if (priceSlider && priceDisplay) {
    priceSlider.addEventListener("input", (e) => {
      currentFilter.maxPrice = Number(e.target.value);
      priceDisplay.textContent = formatVND(currentFilter.maxPrice);
    });
    priceSlider.addEventListener("change", () => {
      applyFilters();
    });
  }

  // Sort Dropdown
  const sortSelect = document.getElementById("shopSortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentFilter.sortBy = e.target.value;
      applyFilters();
    });
  }
}

function selectCategoryFilter(catId) {
  currentFilter.category = catId;
  document.querySelectorAll("#shopCategoryList .category-item-btn").forEach(btn => {
    btn.classList.remove("active");
  });
  event.currentTarget.classList.add("active");
  currentPage = 1;
  applyFilters();
}

function toggleBrandFilter(brand, isChecked) {
  if (isChecked) {
    currentFilter.brands.push(brand);
  } else {
    currentFilter.brands = currentFilter.brands.filter(b => b !== brand);
  }
  currentPage = 1;
  applyFilters();
}

function applyFilters() {
  allProducts = getProducts();

  filteredProducts = allProducts.filter(p => {
    // Lọc theo danh mục
    if (currentFilter.category !== "all" && p.category !== currentFilter.category) {
      return false;
    }

    // Lọc theo thương hiệu
    if (currentFilter.brands.length > 0 && !currentFilter.brands.includes(p.brand)) {
      return false;
    }

    // Lọc theo khoảng giá
    if (p.price > currentFilter.maxPrice) {
      return false;
    }

    // Lọc theo từ khóa tìm kiếm
    if (currentFilter.searchQuery) {
      const q = currentFilter.searchQuery;
      const matchName = p.name.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchCat = (p.categoryName || "").toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchCat) {
        return false;
      }
    }

    return true;
  });

  // Sắp xếp
  if (currentFilter.sortBy === "price-asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (currentFilter.sortBy === "price-desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (currentFilter.sortBy === "rating") {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  } else if (currentFilter.sortBy === "newest") {
    filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  } else if (currentFilter.sortBy === "bestseller") {
    filteredProducts.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
  }

  renderProductsGrid();
  renderPagination();
}

function renderProductsGrid() {
  const container = document.getElementById("shopProductsGrid");
  const countLabel = document.getElementById("shopCountLabel");
  if (!container) return;

  if (countLabel) {
    countLabel.textContent = filteredProducts.length;
  }

  if (filteredProducts.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
        <h3>Không tìm thấy sản phẩm phù hợp</h3>
        <p>Rất tiếc, không có sản phẩm nào khớp với bộ lọc hoặc từ khóa của bạn. Hãy thử chọn danh mục khác hoặc xóa bộ lọc.</p>
        <button class="btn-primary" onclick="resetFilters()">
          <i class="fa-solid fa-rotate-left"></i> Đặt lại bộ lọc
        </button>
      </div>
    `;
    return;
  }

  // Phân trang
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  container.innerHTML = paginated.map(p => createProductCardHTML(p)).join('');
}

function renderPagination() {
  const container = document.getElementById("shopPagination");
  if (!container) return;

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  if (totalPages <= 1) {
    container.innerHTML = "";
    return;
  }

  let html = "";
  if (currentPage > 1) {
    html += `<button class="page-btn" onclick="changePage(${currentPage - 1})"><i class="fa-solid fa-chevron-left"></i></button>`;
  }

  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
  }

  if (currentPage < totalPages) {
    html += `<button class="page-btn" onclick="changePage(${currentPage + 1})"><i class="fa-solid fa-chevron-right"></i></button>`;
  }

  container.innerHTML = html;
}

function changePage(page) {
  currentPage = page;
  renderProductsGrid();
  renderPagination();
  window.scrollTo({ top: 300, behavior: "smooth" });
}

function resetFilters() {
  currentFilter = {
    category: "all",
    brands: [],
    maxPrice: 6000000,
    minRating: 0,
    sortBy: "default",
    searchQuery: ""
  };
  
  const priceSlider = document.getElementById("priceSlider");
  if (priceSlider) priceSlider.value = 6000000;
  const priceDisplay = document.getElementById("priceDisplay");
  if (priceDisplay) priceDisplay.textContent = formatVND(6000000);
  
  document.querySelectorAll("#shopBrandList input[type='checkbox']").forEach(cb => cb.checked = false);
  document.querySelectorAll("#shopCategoryList .category-item-btn").forEach((btn, idx) => {
    btn.classList.toggle("active", idx === 0);
  });

  currentPage = 1;
  applyFilters();
}
