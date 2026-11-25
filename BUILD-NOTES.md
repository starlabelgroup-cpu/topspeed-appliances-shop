# Top Speed Appliances — Storefront Build Notes (Phase C, build portion)

Static vanilla HTML/CSS/JS site, no build step, for topspeedappliances.com.
Staged only — NOT pushed to GitHub and NO Vercel project created (coordinator handles pushes/deploys).

## ⚠️ TSA FAVICON: LINK TAGS WIRED, favicon.svg PENDING-INSERT

- Ramone-directed (2026-11-23 ~05:56 EST): the shop ships with a dedicated TSA favicon (TSA lettering + speedometer-gauge symbol), being designed in parallel and staged at `~/workspace/tsa-favicon/` (favicon.svg + NOTES.md).
- Checked at packaging time (2026-11-23 ~05:57 EST): `~/workspace/tsa-favicon/` does **not exist yet** — no favicon.svg, no NOTES.md.
- Action taken: the standard link tag is wired in the `<head>` of **every page** (index, category, product, cart):
  `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`
- **No substitute favicon was designed** (per instruction). The site ships **without** a root `favicon.svg` file.
- Coordinator follow-up: when `~/workspace/tsa-favicon/favicon.svg` lands, copy it to the storefront repo root as `favicon.svg` (no HTML change needed), and add any ICO/PNG fallback link lines that `~/workspace/tsa-favicon/NOTES.md` specifies at that time. Until then browsers will 404 `/favicon.svg` — cosmetic only, no page impact.

## Files

| File | Purpose |
|---|---|
| `index.html` | Hero (logo lockup, headline, Shop + Call CTAs), 9-category grid, Featured section fed live from the catalog API (designed empty state when array is empty), trust blocks, ecosystem strip (Repair booking / Pepper Lists / Refer & Earn) |
| `category.html` | Reads `?c=<CAT>`, filters catalog client-side, in-category search, product cards |
| `product.html` | Deep-link page per product (`?id=`), photos/specs/warranty/fulfillment from data, Add to Cart, Call + Ask Speedy |
| `cart.html` | localStorage cart, qty/remove, subtotal-only totals, checkout form → POST orders API, order-id + Complete Payment link on success, call-us fallback on failure (never fake success, never shows "paid") |
| `app.js` | Shared logic: API base, category/icon maps (inline SVG paths), catalog/product fetch, product-card renderer, cart (localStorage `tsa_cart_v1`), `cartSubtotalCents` / `money` (Node-exported for testing) |
| `styles.css` | Shared styles; Carbon Black #0E0E10 / Top Speed Red #E5161A / Graphite #34343A / Victory White; responsive 320–1366px, `overflow-x:hidden` |
| `assets/logo-symbol.svg`, `assets/logo-lockup.svg` | Interim geometric TS-mark logos created in-house (see Stubs) |
| `robots.txt` | Allow-all + named AI-crawler groups (GPTBot, ChatGPT-User, Google-Extended, PerplexityBot, ClaudeBot, anthropic-ai, cohere-ai, Meta-ExternalAgent, Applebot-Extended, Bytespider, CCBot, Amazonbot) + sitemap line |
| `sitemap.xml` | Home + 9 category pages + cart |
| `llms.txt` | Truthful facts only: what the shop is, categories, phone, hours, address, inventory-listed-as-available, Service OS links |
| `vercel.json` | Minimal: `cleanUrls:false`, `trailingSlash:false`, `X-Content-Type-Options: nosniff` header |
| `BUILD-NOTES.md` | This file |

## API contract coded against

Production base: `https://top-speed-service-os.vercel.app`

- `GET /api/v1/sales-os/catalog` → `{ data: { products: [...], vendor: {...} } }` — ACTIVE only; empty array = honest launch state → designed empty state ("Fresh inventory is being inspected and listed — call (844) 460-7038 or Ask Speedy…").
- `GET /api/v1/sales-os/catalog/:id` → `{ data: { product } }`.
- `POST /api/v1/sales-os/orders` with `{ customer:{name,phone,email}, items:[{productId, qty}], fulfillment:'PICKUP'|'DELIVERY', notes }` → `{ data: { order, checkout } }`. Checkout URL read defensively from `checkout.url || checkout.checkoutUrl || checkout.paymentUrl`. Payment state stays PENDING in copy: success screen says the order "is confirmed once payment completes — it is not paid yet" and shows a "Complete Payment" button only when a URL is returned.
- Product fields used: `id, title, category, brand, conditionGrade, priceCents, compareAtCents, stockQty, photos[], warrantyDays, deliveryAvailable, pickupAvailable, description`.
- Totals: subtotal only = Σ price×qty. No tax or shipping invented; delivery copy reads "Delivery quoted at checkout confirmation."

## Locked facts used (nothing invented)

Top Speed Appliances · (844) 460-7038 / tel:+18444607038 · Mon–Fri 8am–7pm · Coconut Creek, FL (service-area business — no public street address) · "The Faster, The Better." · Booking https://topspeedserviceos.com/book · Ask Speedy = link to https://topspeedserviceos.com/speedy (no widget code copied) · Pepper Lists https://pepperlists.com · Refer https://topspeedserviceos.com/refer.
No products, prices, reviews, ratings, or stock invented. No `aggregateRating` (Store JSON-LD on home carries name/slogan/phone/address/hours only). "Only 1 available" badge renders only when `stockQty === 1`. Warranty copy is per-product from `warrantyDays`. Cleanout Vents and Appliance Plus Air appear nowhere (grep-verified). Designed SVG icons only, no emoji as UI icons.

## Local verification (2026-11-23 ~05:56 EST)

- `node --check app.js` — OK. Inline JS extracted from all 4 HTML pages — `node --check` OK each.
- Cart math unit check (Node, localStorage stubbed): items 2×$150.00 + 1×$49.99 → `cartSubtotalCents` = **34999** ✓; `money(34999)` = **$349.99** ✓; `catInfo('WASHER')` = Washers ✓.
- `python3 -m http.server` smoke test: **200** for `/`, `/index.html`, `/category.html?c=WASHER`, `/product.html?id=test`, `/cart.html`, `/styles.css`, `/app.js`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/assets/logo-symbol.svg`, `/assets/logo-lockup.svg`; home HTML contains "Top Speed Appliances", cart page contains "Your Cart".
- `python3 ~/workspace/scripts/check-script-spill.py .` — **clean, 0 violations** (4 files).
- Forbidden-string grep (Cleanout / Appliance Plus Air / aggregateRating) — **no hits**.
- Live API probe at build time: `GET https://top-speed-service-os.vercel.app/api/v1/sales-os/catalog` returned **404 "Route not found"** — the Sales OS API is not deployed yet, so live catalog rendering / order POST can only be fully verified in Phase D after the coordinator deploys Phase B. All fetch failures degrade to the designed empty state / call-us fallback by design.

## Stubs / risks

1. **TSA favicon pending-insert** — see the flagged section at the top. Link tags wired on all pages; `favicon.svg` file itself not yet in the repo.
2. **Logo assets interim** — `~/workspace/sales-os-work/assets/` was empty at packaging time, so clean geometric TS-mark `logo-symbol.svg` / `logo-lockup.svg` were created in-house in the specified style and copied into `assets/`. If Phase A (Figma) exports land later, drop them over these files (same names/paths — no HTML change needed). Category/trust icons are inline SVG paths defined in `app.js` (refrigerator, washer, dryer, oven, dishwasher, freezer, microwave, disposal, other, truck, shield, tag, cart, search, phone, chat, check, arrow, wrench).
3. **API not live yet** — see verification note above; catalog/order flows are coded to the fixed contract but unproven against production until Phase D.
4. **Cart price snapshot** — cart items snapshot `title`/`priceCents` at add time for display/totals; the server order (productId + qty only) is authoritative at checkout.
5. **Checkout URL field name** — read defensively (`url`/`checkoutUrl`/`paymentUrl`); confirm against the deployed Phase B response in Phase D.
