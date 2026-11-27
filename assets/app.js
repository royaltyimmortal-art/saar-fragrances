const PRODUCTS = {
  khwab: {
    id: "khwab",
    index: "01",
    name: "Khwab",
    accord: "chocolate · vanilla",
    mood: "THE WARM ONE",
    description:
      "A decadent composition where dark oud, saffron and rose melt into chocolate, butterscotch and caramel before settling into sandalwood, vanilla and white musk.",
    top: ["Oud", "Cambodian Oud", "Cedarwood", "Vanilla", "Saffron", "Rose", "Oakmoss"],
    heart: ["Vanilla", "Citrus", "Chocolate", "Butterscotch", "Caramel"],
    base: ["Sandalwood", "Vanilla", "Patchouli", "White Musk"],
    result: "You lean toward warmth, intimacy and a scent that draws people closer.",
    price: 2499,
    size: "50 ml",
  },
  sukoon: {
    id: "sukoon",
    index: "02",
    name: "Sukoon",
    accord: "fresh fragrance",
    mood: "THE CLEAR ONE",
    description:
      "A vivid fresh fragrance opening with grapefruit, lemon and saffron, grounded by patchouli and sandalwood, then cooled with amber, woods and mint.",
    top: ["Grapefruit", "Lemon", "Saffron"],
    heart: ["Patchouli", "Sandalwood"],
    base: ["Amber", "Woody Notes", "Mint", "Sandalwood"],
    result: "You lean toward clarity, freshness and a presence that feels naturally composed.",
    price: 2499,
    size: "50 ml",
  },
  iraada: {
    id: "iraada",
    index: "03",
    name: "Iraada",
    accord: "chai patti",
    mood: "THE DISTINCT ONE",
    description:
      "A layered chai-patti composition: aromatic spices and herbs over rose, incense and cherry, resting on leather, tonka bean, sandalwood, vetiver, cedar and patchouli.",
    top: ["Almond", "Bergamot", "Spices", "Lavender", "Rosemary", "Thyme", "Peppermint", "Lime"],
    heart: ["Guerlinade Vanilla Tincture", "Bulgarian Rose", "Incense", "Cherry"],
    base: ["Leather", "Tonka Bean", "Sandalwood", "Vetiver", "Cedar", "Patchouli"],
    result: "You lean toward character, grounded confidence and a signature that stays distinct.",
    price: 2499,
    size: "50 ml",
  },
  discovery: {
    id: "discovery",
    index: "SET",
    name: "The First Three",
    accord: "Khwab · Sukoon · Iraada",
    mood: "DISCOVERY BOX",
    description: "Three 8 ml expressions in one discovery box, created to be worn on skin before you choose a full bottle.",
    price: 1299,
    size: "3 × 8 ml",
    photo: "./assets/saar-discovery-8ml.webp",
  },
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const money = (value) => `₹${new Intl.NumberFormat("en-IN").format(value)}`;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const commerceConfig = JSON.parse($("#saar-commerce-config")?.textContent || "{}");
const isShopifyStorefront = Boolean(window.Shopify?.shop || /\.myshopify\.com$/i.test(window.location.hostname));

let toastTimer;
const toast = (message) => {
  const node = $("[data-toast]");
  node.textContent = message;
  node.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => node.classList.remove("is-visible"), 2800);
};

const bottleMarkup = (product, extraClass = "") => `
  <span class="crystal-bottle crystal-bottle--${product.id} ${extraClass}" aria-hidden="true">
    <span class="crystal-bottle__float">
      <span class="crystal-bottle__cap"><span class="crystal-bottle__cap-core"></span></span>
      <span class="crystal-bottle__neck"></span>
      <span class="crystal-bottle__glass">
        <span class="crystal-bottle__liquid"></span>
        <span class="crystal-bottle__facet crystal-bottle__facet--left"></span>
        <span class="crystal-bottle__facet crystal-bottle__facet--right"></span>
        <span class="crystal-bottle__shine"></span>
        <span class="crystal-bottle__label"><b>SAAR</b><small>${product.name.toUpperCase()}</small></span>
      </span>
      <span class="crystal-bottle__base"></span>
    </span>
  </span>`;

// Header and reveal behavior
const header = $("#site-header");
const heroSection = $(".entry-hero");
const updateHeader = () => {
  const heroEnd = heroSection ? heroSection.offsetTop + heroSection.offsetHeight - 120 : 48;
  header.classList.toggle("is-scrolled", window.scrollY > heroEnd);
};
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealNodes = $$(".reveal");
if (reducedMotion || !("IntersectionObserver" in window)) {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -35px" },
  );
  revealNodes.forEach((node) => revealObserver.observe(node));
}

$(".announcement__close").addEventListener("click", () => {
  document.body.classList.add("announcement-closed");
});

const menuButton = $(".menu-button");
const mobileMenu = $("#mobile-menu");
const setMenu = (open) => {
  menuButton.setAttribute("aria-expanded", String(open));
  mobileMenu.classList.toggle("is-open", open);
  mobileMenu.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("is-locked", open);
};

menuButton.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
$$('a[href^="#"]', mobileMenu).forEach((link) => link.addEventListener("click", () => setMenu(false)));

$$('[data-scroll-to]').forEach((button) => {
  button.addEventListener("click", () => {
    document.getElementById(button.dataset.scrollTo)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  });
});

// Premium entry: The House builds desire; The Collection carries the commercial route.
const entryPanels = $("[data-entry-panels]");
const entryVideo = $("[data-entry-video]");
const finePointer = window.matchMedia("(pointer: fine)").matches;

const playEntryVideo = () => {
  if (!entryVideo || reducedMotion) return;
  entryVideo.play().catch(() => {});
};

const pauseEntryVideo = () => {
  if (!entryVideo || !finePointer) return;
  entryVideo.pause();
};

$$('[data-entry-panel]').forEach((panel) => {
  const side = panel.dataset.entryPanel;
  const activate = () => {
    entryPanels?.classList.remove("is-house-active", "is-collection-active");
    entryPanels?.classList.add(`is-${side}-active`);
    if (side === "collection") playEntryVideo();
    else pauseEntryVideo();
  };

  panel.addEventListener("pointerenter", activate);
  panel.addEventListener("focus", activate);
  panel.addEventListener("click", (event) => {
    const target = panel.getAttribute("href");
    if (!target?.startsWith("#") || isShopifyStorefront) return;
    const destination = $(target);
    if (!destination) return;
    event.preventDefault();
    destination.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    window.history.replaceState(null, "", target);
  });
});

entryPanels?.addEventListener("pointerleave", () => {
  entryPanels.classList.remove("is-house-active", "is-collection-active");
  pauseEntryVideo();
});

// The prototype scrolls to its live collection. On Shopify the same entry becomes
// a native /collections/all route without redesigning the section.
if (isShopifyStorefront) {
  $$('[data-shopify-route]').forEach((link) => {
    link.href = link.dataset.shopifyRoute || commerceConfig.collectionPath || "/collections/all";
  });
}

if (!finePointer && !reducedMotion && entryVideo) {
  const startMobileFilm = () => playEntryVideo();
  if ("requestIdleCallback" in window) window.requestIdleCallback(startMobileFilm, { timeout: 900 });
  else window.setTimeout(startMobileFilm, 450);
}

// Product quick view
const productDialog = $("[data-product-dialog]");
let currentProduct = "khwab";

function openProduct(id) {
  const product = PRODUCTS[id];
  if (!product) return;
  currentProduct = id;

  $("[data-dialog-visual]").dataset.tone = id;
  $("[data-dialog-index]").textContent = product.index;
  $("[data-dialog-mood]").textContent = product.mood;
  $("[data-dialog-name]").textContent = product.name;
  $("[data-dialog-accord]").textContent = product.accord;
  $("[data-dialog-description]").textContent = product.description;
  $("[data-dialog-top]").textContent = product.top.join(" · ");
  $("[data-dialog-heart]").textContent = product.heart.join(" · ");
  $("[data-dialog-base]").textContent = product.base.join(" · ");
  $("[data-dialog-size]").textContent = product.size;
  $("[data-dialog-price]").textContent = money(product.price);

  const bottle = $("[data-dialog-bottle]");
  bottle.className = `crystal-bottle crystal-bottle--${id} crystal-bottle--dialog`;
  $("[data-dialog-label]").textContent = product.name.toUpperCase();

  if (typeof productDialog.showModal === "function") productDialog.showModal();
  else productDialog.setAttribute("open", "");
  document.body.classList.add("is-locked");
}

function closeProduct() {
  if (productDialog.open && typeof productDialog.close === "function") productDialog.close();
  else productDialog.removeAttribute("open");
  if (!$("[data-cart]").classList.contains("is-open")) document.body.classList.remove("is-locked");
}

$$('[data-product]').forEach((button) => {
  button.addEventListener("click", () => openProduct(button.dataset.product));
});

// Shop format switcher: full bottles and discovery box remain separate, Shopify-ready views.
const shopViewButtons = $$('[data-shop-view]');
const shopPanels = $$('[data-shop-panel]');
shopViewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const view = button.dataset.shopView;
    shopViewButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    shopPanels.forEach((panel) => {
      const active = panel.dataset.shopPanel === view;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
  });
});

// Progressive luxury interaction: live spotlight and restrained 3D tilt on
// pointer devices; the same product information remains accessible on touch.
const shopProductVisuals = $$(".collection .product-card__visual");
if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
  shopProductVisuals.forEach((visual) => {
    visual.addEventListener("pointermove", (event) => {
      const bounds = visual.getBoundingClientRect();
      const px = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
      const py = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
      visual.style.setProperty("--spot-x", `${(px * 100).toFixed(1)}%`);
      visual.style.setProperty("--spot-y", `${(py * 100).toFixed(1)}%`);
      visual.style.setProperty("--tilt-x", `${((px - 0.5) * 11).toFixed(2)}deg`);
      visual.style.setProperty("--tilt-y", `${((0.5 - py) * 8).toFixed(2)}deg`);
    });
    visual.addEventListener("pointerleave", () => {
      visual.style.setProperty("--spot-x", "50%");
      visual.style.setProperty("--spot-y", "42%");
      visual.style.setProperty("--tilt-x", "0deg");
      visual.style.setProperty("--tilt-y", "0deg");
    });
  });
}

$("[data-dialog-close]").addEventListener("click", closeProduct);
productDialog.addEventListener("close", () => {
  if (!$("[data-cart]").classList.contains("is-open")) document.body.classList.remove("is-locked");
});
productDialog.addEventListener("click", (event) => {
  const bounds = productDialog.getBoundingClientRect();
  const outside =
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom;
  if (outside) closeProduct();
});

// Prototype cart, stored only in this browser
const CART_KEY = "saar-prototype-cart-v2";
let cartState = [];
try {
  const stored = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  if (Array.isArray(stored)) {
    cartState = stored.filter((item) => PRODUCTS[item.id] && Number.isInteger(item.quantity) && item.quantity > 0);
  }
} catch {
  cartState = [];
}

const cartRoot = $("[data-cart]");
const cartItems = $("[data-cart-items]");
const cartEmpty = $("[data-cart-empty]");
const cartFooter = $("[data-cart-footer]");

const saveCart = () => localStorage.setItem(CART_KEY, JSON.stringify(cartState));

function renderCart() {
  const count = cartState.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartState.reduce((total, item) => total + PRODUCTS[item.id].price * item.quantity, 0);

  $$("[data-cart-count]").forEach((node) => (node.textContent = count));
  $("[data-cart-subtotal]").textContent = money(subtotal);
  cartEmpty.hidden = cartState.length > 0;
  cartFooter.hidden = cartState.length === 0;

  cartItems.innerHTML = cartState
    .map((item) => {
      const product = PRODUCTS[item.id];
      const visual = product.photo
        ? `<img class="cart-item__photo" src="${product.photo}" alt="" />`
        : bottleMarkup(product);
      return `
        <article class="cart-item" data-cart-item="${product.id}">
          <div class="cart-item__visual" data-tone="${product.id}">
            ${visual}
          </div>
          <div class="cart-item__info">
            <h3>${product.name}</h3>
            <p>${product.size} · ${product.accord}</p>
            <div class="quantity" aria-label="Quantity for ${product.name}">
              <button type="button" data-quantity="minus" aria-label="Decrease ${product.name} quantity">−</button>
              <span>${item.quantity}</span>
              <button type="button" data-quantity="plus" aria-label="Increase ${product.name} quantity">+</button>
            </div>
          </div>
          <div class="cart-item__price">
            <strong>${money(product.price * item.quantity)}</strong>
            <button type="button" data-remove>Remove</button>
          </div>
        </article>`;
    })
    .join("");

  $$('[data-cart-item]', cartItems).forEach((itemNode) => {
    const id = itemNode.dataset.cartItem;
    $("[data-quantity='minus']", itemNode).addEventListener("click", () => changeQuantity(id, -1));
    $("[data-quantity='plus']", itemNode).addEventListener("click", () => changeQuantity(id, 1));
    $("[data-remove]", itemNode).addEventListener("click", () => removeFromCart(id));
  });
}

function addToCart(id) {
  const existing = cartState.find((item) => item.id === id);
  if (existing) existing.quantity += 1;
  else cartState.push({ id, quantity: 1 });
  saveCart();
  renderCart();
  toast(`${PRODUCTS[id].name} was added to your bag.`);
}

function changeQuantity(id, amount) {
  const item = cartState.find((entry) => entry.id === id);
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) cartState = cartState.filter((entry) => entry.id !== id);
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  cartState = cartState.filter((item) => item.id !== id);
  saveCart();
  renderCart();
  toast(`${PRODUCTS[id].name} was removed.`);
}

function openCart() {
  if (productDialog.open) closeProduct();
  cartRoot.classList.add("is-open");
  cartRoot.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
  window.setTimeout(() => $("[data-cart-close]", $(".cart__header"))?.focus(), 350);
}

function closeCart() {
  cartRoot.classList.remove("is-open");
  cartRoot.setAttribute("aria-hidden", "true");
  if (!productDialog.open) document.body.classList.remove("is-locked");
}

$$('[data-add]').forEach((button) => button.addEventListener("click", () => {
  if (isShopifyStorefront && button.dataset.shopifyHandle) {
    window.location.assign(`${commerceConfig.productPath || "/products/"}${button.dataset.shopifyHandle}`);
    return;
  }
  addToCart(button.dataset.add);
}));
$("[data-dialog-add]").addEventListener("click", () => {
  if (isShopifyStorefront) {
    const handle = $(`[data-add="${currentProduct}"]`)?.dataset.shopifyHandle || currentProduct;
    window.location.assign(`${commerceConfig.productPath || "/products/"}${handle}`);
    return;
  }
  addToCart(currentProduct);
});
$$('[data-cart-open]').forEach((button) => button.addEventListener("click", () => {
  if (isShopifyStorefront) {
    window.location.assign(commerceConfig.cartPath || "/cart");
    return;
  }
  openCart();
}));
$$('[data-cart-close]').forEach((button) => {
  button.addEventListener("click", () => {
    const scrollTarget = button.dataset.scrollAfter;
    closeCart();
    if (scrollTarget) {
      window.setTimeout(
        () => document.getElementById(scrollTarget)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" }),
        380,
      );
    }
  });
});

$("[data-prototype-checkout]").addEventListener("click", () => {
  toast("Prototype only — secure Shopify checkout will connect here at launch.");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartRoot.classList.contains("is-open")) closeCart();
});

renderCart();

if (!isShopifyStorefront && new URLSearchParams(window.location.search).get("bag") === "open") {
  openCart();
}

// Scent finder
const quizSteps = $$("[data-quiz-step]");
const progressSteps = $$(".finder__progress span");
const resultPanel = $("[data-quiz-result]");
const quizScores = { khwab: 0, sukoon: 0, iraada: 0 };
let quizStep = 1;
let quizResult = "sukoon";

function showQuizStep(step) {
  quizSteps.forEach((panel) => {
    const active = Number(panel.dataset.quizStep) === step;
    panel.hidden = !active;
    panel.classList.toggle("is-active", active);
    if (active) {
      panel.classList.remove("is-entering");
      requestAnimationFrame(() => panel.classList.add("is-entering"));
    }
  });
  progressSteps.forEach((line, index) => line.classList.toggle("is-active", index < step));
}

function showQuizResult() {
  quizSteps.forEach((panel) => (panel.hidden = true));
  quizResult = Object.entries(quizScores).sort((a, b) => b[1] - a[1])[0][0];
  const product = PRODUCTS[quizResult];

  $("[data-result-name]").textContent = product.name;
  $("[data-result-copy]").textContent = `${product.result} Current direction: ${product.accord}.`;
  $("[data-result-visual]").innerHTML = bottleMarkup(product);
  resultPanel.hidden = false;
  resultPanel.classList.remove("is-entering");
  requestAnimationFrame(() => resultPanel.classList.add("is-entering"));
  progressSteps.forEach((line) => line.classList.add("is-active"));
}

$$('[data-quiz-answer]').forEach((button) => {
  button.addEventListener("click", () => {
    quizScores[button.dataset.quizAnswer] += 1;
    if (quizStep < 3) {
      quizStep += 1;
      showQuizStep(quizStep);
    } else {
      showQuizResult();
    }
  });
});

$("[data-result-view]").addEventListener("click", () => openProduct(quizResult));
$("[data-quiz-reset]").addEventListener("click", () => {
  Object.keys(quizScores).forEach((key) => (quizScores[key] = 0));
  quizStep = 1;
  resultPanel.hidden = true;
  showQuizStep(1);
});

// Honest prototype signup
$("[data-signup-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const email = new FormData(form).get("email");
  localStorage.setItem("saar-prototype-email", String(email));
  form.reset();
  toast("You’re on the prototype founding list. Shopify Email will replace this at launch.");
});

// Keep FAQ interaction composed: one answer at a time.
$$('.faq details').forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    $$('.faq details').forEach((other) => {
      if (other !== detail) other.removeAttribute("open");
    });
  });
});

$("[data-year]").textContent = new Date().getFullYear();
