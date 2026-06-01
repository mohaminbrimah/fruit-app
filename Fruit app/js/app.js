document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  initMobileNav();
  setActiveNavLink();
});

function initMobileNav() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", nav.classList.contains("open"));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });
}

function setActiveNavLink() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === current || (current === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

function initShopPage() {
  const grid = document.getElementById("products-grid");
  if (!grid) return;

  grid.innerHTML = FRUITS.map(renderProductCard).join("");
  bindAddToCartButtons(grid);

  const filterBtns = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("fruit-search");

  function applyFilters() {
    const activeFilter = document.querySelector(".filter-btn.active")?.dataset.filter || "all";
    const query = (searchInput?.value || "").toLowerCase().trim();

    document.querySelectorAll(".product-card").forEach((card) => {
      const category = card.dataset.category;
      const name = card.dataset.name;
      const matchCategory = activeFilter === "all" || category === activeFilter;
      const matchSearch = !query || name.includes(query);
      card.style.display = matchCategory && matchSearch ? "" : "none";
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilters();
    });
  });

  searchInput?.addEventListener("input", applyFilters);
}

function initHomeFeatured() {
  const grid = document.getElementById("featured-products");
  if (!grid) return;

  const featured = FRUITS.filter((f) => f.badge).slice(0, 4);
  grid.innerHTML = featured.map(renderProductCard).join("");
  bindAddToCartButtons(grid);
}

function initCartPage() {
  const container = document.getElementById("cart-container");
  const summary = document.getElementById("cart-summary");
  if (!container) return;

  function render() {
    const cart = getCart();

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="empty-cart">
          <div class="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Browse our fresh selection and add your favorite fruits.</p>
          <a href="shop.html" class="btn btn-primary">Shop Fruits</a>
        </div>
      `;
      if (summary) summary.style.display = "none";
      return;
    }

    if (summary) summary.style.display = "";

    container.innerHTML = `
      <div class="cart-items">
        ${cart
          .map(
            (item) => `
          <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
              <h3>${item.name}</h3>
              <p class="cart-item-price">${formatPrice(item.price)} <small>${item.unit}</small></p>
              <div class="qty-controls">
                <button class="qty-btn qty-minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn qty-plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
              </div>
            </div>
            <div>
              <p style="font-weight:700;color:var(--primary)">${formatPrice(item.price * item.quantity)}</p>
              <button class="remove-btn" data-id="${item.id}">Remove</button>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    const subtotal = getCartTotal();
    const shipping = subtotal >= 150 ? 0 : 25;
    const total = subtotal + shipping;

    if (summary) {
      document.getElementById("subtotal").textContent = formatPrice(subtotal);
      document.getElementById("shipping").textContent =
        shipping === 0 ? "FREE" : formatPrice(shipping);
      document.getElementById("total").textContent = formatPrice(total);
    }

    container.querySelectorAll(".qty-minus").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.dataset.id, 10);
        const item = getCart().find((i) => i.id === id);
        if (item) updateQuantity(id, item.quantity - 1);
        render();
      });
    });

    container.querySelectorAll(".qty-plus").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.dataset.id, 10);
        const item = getCart().find((i) => i.id === id);
        if (item) updateQuantity(id, item.quantity + 1);
        render();
      });
    });

    container.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        removeFromCart(parseInt(btn.dataset.id, 10));
        render();
      });
    });
  }

  document.getElementById("checkout-btn")?.addEventListener("click", () => {
    const modal = document.getElementById("checkout-modal");
    if (modal) modal.classList.add("open");
  });

  document.getElementById("modal-close")?.addEventListener("click", () => {
    document.getElementById("checkout-modal")?.classList.remove("open");
    clearCart();
    render();
  });

  render();
}

function initGalleryPage() {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;

  grid.innerHTML = GALLERY_IMAGES.map(
    (img) => `
    <div class="gallery-item">
      <img src="${img.src}" alt="${img.title}" loading="lazy">
      <div class="gallery-overlay"><span>${img.title}</span></div>
    </div>
  `
  ).join("");
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = document.getElementById("form-message");
    if (msg) {
      msg.classList.add("success");
      msg.textContent = "Thank you! We'll get back to you within 24 hours.";
    }
    form.reset();
  });
}

// Page-specific init
document.addEventListener("DOMContentLoaded", () => {
  initHomeFeatured();
  initShopPage();
  initCartPage();
  initGalleryPage();
  initContactForm();
});
