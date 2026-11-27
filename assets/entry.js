const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;
const commerceConfig = JSON.parse($("#saar-commerce-config")?.textContent || "{}");
const isShopifyStorefront = Boolean(window.Shopify?.shop || /\.myshopify\.com$/i.test(window.location.hostname));

const entryPanels = $("[data-entry-panels]");
const entryVideo = $("[data-entry-video]");
const soundButton = $("[data-entry-sound]");
const soundLabel = $("[data-entry-sound-label]");

if (entryVideo) entryVideo.volume = 0.82;

const playEntryVideo = () => {
  if (!entryVideo || reducedMotion) return;
  entryVideo.play().catch(() => {});
};

const pauseEntryVideo = () => {
  if (!entryVideo || !finePointer) return;
  entryVideo.pause();
};

const setSound = (enabled) => {
  if (!entryVideo || !soundButton || !soundLabel) return;
  entryVideo.muted = !enabled;
  soundButton.setAttribute("aria-pressed", String(enabled));
  soundButton.setAttribute("aria-label", enabled ? "Mute the SAAR film" : "Play the SAAR film with music");
  soundButton.classList.toggle("is-on", enabled);
  soundLabel.textContent = enabled ? "Music on · mute" : "Play film + music";
  if (enabled) playEntryVideo();
};

soundButton?.addEventListener("click", () => {
  setSound(entryVideo?.muted ?? true);
});

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
});

entryPanels?.addEventListener("pointerleave", () => {
  entryPanels.classList.remove("is-house-active", "is-collection-active");
  pauseEntryVideo();
});

if (!finePointer && !reducedMotion && entryVideo) {
  const startMobileFilm = () => playEntryVideo();
  if ("requestIdleCallback" in window) window.requestIdleCallback(startMobileFilm, { timeout: 900 });
  else window.setTimeout(startMobileFilm, 450);
}

if (isShopifyStorefront) {
  $$('[data-shopify-route]').forEach((link) => {
    link.href = link.dataset.shopifyRoute || commerceConfig.collectionPath || "/collections/all";
  });
}

const menuButton = $(".menu-button");
const mobileMenu = $("#mobile-menu");
const setMenu = (open) => {
  menuButton?.setAttribute("aria-expanded", String(open));
  mobileMenu?.classList.toggle("is-open", open);
  mobileMenu?.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("is-locked", open);
};

menuButton?.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
$$('a', mobileMenu).forEach((link) => link.addEventListener("click", () => setMenu(false)));

$(".announcement__close")?.addEventListener("click", () => {
  document.body.classList.add("announcement-closed");
});

try {
  const cart = JSON.parse(localStorage.getItem("saar-prototype-cart-v2") || "[]");
  const count = Array.isArray(cart) ? cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0) : 0;
  $$(".bag-count").forEach((node) => (node.textContent = count));
} catch {
  // The entrance remains usable when storage is unavailable.
}
