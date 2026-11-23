'use strict';
var API_BASE = 'https://top-speed-service-os.vercel.app';
var CART_KEY = 'tsa_cart_v1';
var PHONE_DISPLAY = '(844) 460-7038';
var PHONE_TEL = 'tel:+18444607038';

var ICON_PATHS = {
  refrigerator: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M7 10h10M10 6v1M10 13v2"/>',
  washer: '<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M8 6h.01M11 6h4"/>',
  dryer: '<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M9.5 13a2.5 2.5 0 0 0 5 0"/>',
  oven: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 7.5h.01M12 7.5h.01M16 7.5h.01M8 14h8v4H8z"/>',
  dishwasher: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M5 8h14M9 5.5h6M9 13v3M12 12v4M15 13v3"/>',
  freezer: '<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M12 3v18M6 9l6 3 6-3M6 15l6-3 6 3"/>',
  microwave: '<rect x="3" y="6" width="18" height="12" rx="2"/><rect x="6" y="9" width="9" height="6" rx="1"/><path d="M18 10h.01M18 14h.01"/>',
  disposal: '<circle cx="12" cy="12" r="7"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M8 9l8 6M16 9l-8 6"/>',
  other: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 12h6M12 9v6"/>',
  truck: '<path d="M2 7h11v9H2zM13 10h4l3 3v3h-7z"/><circle cx="6" cy="18" r="1.8"/><circle cx="16" cy="18" r="1.8"/>',
  shield: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
  tag: '<path d="M3 12V4h8l9 9-8 8z"/><circle cx="8" cy="9" r="1.6"/>',
  cart: '<circle cx="9" cy="20" r="1.6"/><circle cx="17" cy="20" r="1.6"/><path d="M2 3h3l2.5 12h10L20 7H6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.8-3.8"/>',
  phone: '<path d="M5 3h4l1.5 5L8 10a13 13 0 0 0 6 6l2-2.5 5 1.5v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
  chat: '<path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5z"/><path d="M8.5 11h7M8.5 14h4"/>',
  check: '<path d="M4 12.5l5 5L20 6.5"/>',
  arrow: '<path d="M4 12h15M13 5l7 7-7 7"/>',
  wrench: '<path d="M14.5 6.5a4 4 0 0 1 5.2-3.8L17 5.5l1.5 3 3-1 2 2.5a4 4 0 0 1-5.5 4.7L8 20.7a2 2 0 0 1-2.8-2.8l6-6.2a4 4 0 0 1 3.3-5.2z"/>'
};
function icon(name, cls) {
  var p = ICON_PATHS[name] || ICON_PATHS.other;
  return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
}
var CATEGORIES = [
  { key: 'REFRIGERATOR', label: 'Refrigerators', icon: 'refrigerator', blurb: 'Fridge & French-door models' },
  { key: 'WASHER', label: 'Washers', icon: 'washer', blurb: 'Top-load & front-load' },
  { key: 'DRYER', label: 'Dryers', icon: 'dryer', blurb: 'Electric & gas dryers' },
  { key: 'OVEN_RANGE', label: 'Ovens & Ranges', icon: 'oven', blurb: 'Ranges, ovens & cooktops' },
  { key: 'DISHWASHER', label: 'Dishwashers', icon: 'dishwasher', blurb: 'Built-in dishwashers' },
  { key: 'FREEZER_ICE_MAKER', label: 'Freezers & Ice Makers', icon: 'freezer', blurb: 'Freezers & ice makers' },
  { key: 'MICROWAVE', label: 'Microwaves', icon: 'microwave', blurb: 'Countertop & over-range' },
  { key: 'GARBAGE_DISPOSAL', label: 'Garbage Disposals', icon: 'disposal', blurb: 'Disposals & more' },
  { key: 'OTHER', label: 'More Appliances', icon: 'other', blurb: 'Other quality finds' }
];
function catInfo(key) { for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].key === key) return CATEGORIES[i]; return CATEGORIES[8]; }
function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function money(cents) { return '$' + (Number(cents || 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function getCart() { try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch (e) { return []; } }
function setCart(c) { localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCartBadge(); }
function cartCount() { return getCart().reduce(function (a, i) { return a + (i.qty || 0); }, 0); }
function cartSubtotalCents(items, productsById) {
  var total = 0;
  (items || []).forEach(function (i) {
    var p = productsById ? productsById[i.productId] : i;
    var price = p ? (p.priceCents != null ? p.priceCents : i.priceCents) : i.priceCents;
    total += Number(price || 0) * Number(i.qty || 0);
  });
  return total;
}
function addToCart(product, qty) {
  var cart = getCart(); var found = null;
  cart.forEach(function (i) { if (i.productId === product.id) found = i; });
  if (found) found.qty += (qty || 1);
  else cart.push({ productId: product.id, qty: qty || 1, title: product.title, priceCents: product.priceCents });
  setCart(cart);
}
function updateCartBadge() { var el = document.getElementById('cart-count'); if (el) el.textContent = String(cartCount()); }
function fetchCatalog() {
  return fetch(API_BASE + '/api/v1/sales-os/catalog').then(function (r) { if (!r.ok) throw new Error('catalog ' + r.status); return r.json(); })
    .then(function (j) { return (j.data && j.data.products) || []; });
}
function fetchProduct(id) {
  return fetch(API_BASE + '/api/v1/sales-os/catalog/' + encodeURIComponent(id)).then(function (r) { if (!r.ok) throw new Error('product ' + r.status); return r.json(); })
    .then(function (j) { return j.data && j.data.product; });
}
function productCard(p) {
  var info = catInfo(p.category);
  var media = (p.photos && p.photos.length) ? '<img src="' + esc(p.photos[0]) + '" alt="' + esc(p.title) + '" loading="lazy">' : icon(info.icon);
  var compare = p.compareAtCents && p.compareAtCents > p.priceCents ? '<span class="compare">' + money(p.compareAtCents) + '</span>' : '';
  var stock = Number(p.stockQty) === 1 ? '<span class="badge">Only 1 available</span>' : '';
  var meta = [p.brand, p.conditionGrade].filter(Boolean).map(esc).join(' · ');
  return '<article class="p-card"><a class="p-media" href="/product.html?id=' + encodeURIComponent(p.id) + '">' + media + '</a><div class="p-body"><h3><a href="/product.html?id=' + encodeURIComponent(p.id) + '" style="text-decoration:none">' + esc(p.title) + '</a></h3><div class="meta">' + meta + '</div><div><span class="price">' + money(p.priceCents) + '</span>' + compare + '</div>' + stock + '<div class="p-actions"><button class="btn" data-add="' + esc(p.id) + '">Add to Cart</button><a class="btn ghost" href="/product.html?id=' + encodeURIComponent(p.id) + '">Details</a></div></div></article>';
}
function bindAddButtons(products) {
  var byId = {}; products.forEach(function (p) { byId[p.id] = p; });
  document.querySelectorAll('[data-add]').forEach(function (btn) {
    btn.addEventListener('click', function () { var p = byId[btn.getAttribute('data-add')]; if (p) { addToCart(p, 1); btn.textContent = 'Added'; setTimeout(function () { btn.textContent = 'Add to Cart'; }, 1200); } });
  });
}
function emptyStateHTML() {
  return '<div class="empty"><h3>Fresh inventory is being inspected and listed</h3><p>Quality used appliances are added as they pass inspection. Call <a href="' + PHONE_TEL + '"><strong>' + PHONE_DISPLAY + '</strong></a> or Ask Speedy to ask about what you need.</p><div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:14px"><a class="btn" href="' + PHONE_TEL + '">Call the Shop</a><a class="btn dark" href="https://topspeedserviceos.com/speedy">Ask Speedy</a></div></div>';
}
if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', updateCartBadge);
if (typeof module !== 'undefined' && module.exports) { module.exports = { cartSubtotalCents: cartSubtotalCents, money: money, catInfo: catInfo }; }
