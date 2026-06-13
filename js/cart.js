const CART_KEY = "freshHarvestCart";

function getCart() {
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function addToCart(fruitId, quantity = 1) {
  const fruit = FRUITS.find((f) => f.id === fruitId);
  if (!fruit) return false;

  const cart = getCart();
  const existing = cart.find((item) => item.id === fruitId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: fruit.id,
      name: fruit.name,
      price: fruit.price,
      unit: fruit.unit,
      image: fruit.image,
      quantity,
    });
  }

  saveCart(cart);
  return true;
}

function updateQuantity(fruitId, quantity) {
  const cart = getCart();
  const item = cart.find((i) => i.id === fruitId);
  if (!item) return;

  if (quantity <= 0) {
    removeFromCart(fruitId);
    return;
  }

  item.quantity = quantity;
  saveCart(cart);
}

function removeFromCart(fruitId) {
  const cart = getCart().filter((item) => item.id !== fruitId);
  saveCart(cart);
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

function updateCartBadge() {
  const badges = document.querySelectorAll(".cart-badge");
  const count = getCartCount();
  badges.forEach((badge) => {
    badge.textContent = count;
    badge.style.display = count > 0 ? "flex" : "none";
  });
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = '<span class="toast-icon">✓</span><span class="toast-message"></span>';
    document.body.appendChild(toast);
  }
  toast.querySelector(".toast-message").textContent = message;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function formatPrice(amount) {
  return "GH₵" + amount.toFixed(2);
}

function renderProductCard(fruit) {
  const badge = fruit.badge
    ? `<span class="product-badge">${fruit.badge}</span>`
    : "";
  return `
    <article class="product-card" data-category="${fruit.category}" data-name="${fruit.name.toLowerCase()}">
      <div class="product-image">
        ${badge}
        <img src="${fruit.image}" alt="${fruit.name}" loading="lazy">
      </div>
      <div class="product-body">
        <h3>${fruit.name}</h3>
        <p class="product-desc">${fruit.description}</p>
        <div class="product-footer">
          <div class="product-price">
            ${formatPrice(fruit.price)}
            <small>${fruit.unit}</small>
          </div>
          <button class="btn btn-primary btn-sm add-to-cart-btn" data-id="${fruit.id}">
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  `;
}

function bindAddToCartButtons(container) {
  const root = container || document;
  root.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id, 10);
      if (addToCart(id)) {
        showToast("Added to your cart!");
        btn.textContent = "Added ✓";
        setTimeout(() => {
          btn.textContent = "Add to Cart";
        }, 1500);
      }
    });
  });
}
