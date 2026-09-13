# House of Virasat — Technical Requirements Specification
**For: Antigravity (AI coding agent) build handoff**
**Prepared by: Rahul (Lead Developer)**
**Source: Client Website Development Brief (Aug 2026)**

---

## 0. How to use this document

This is the *engineering translation* of the client's business brief into a buildable spec. Every section maps to a real brief requirement — build against this file, not assumptions. Where the brief says "to be finalised," this doc defines a safe default so development isn't blocked, but flags it as `[CONFIG - CONFIRM LATER]`.

Non-negotiables baked into every decision below: **admin controls everything without code changes**, **no hardcoded business rules**, **security by default**, **performance on mobile data**.

---

## 1. Project Summary

Premium jewellery e-commerce platform for House of Virasat — Fine Gold & Diamonds + 925 Silver Kundan & Polki, under one coherent brand. Supports **in-stock instant checkout** AND **made-to-order / bespoke** flows in the same catalogue, India-first with an architecture that doesn't block international expansion later.

---

## 2. Tech Stack & Infrastructure

| Layer | Choice | Notes |
|---|---|---|
| Frontend | React (Vite) | SSR/SEO handled via prerendering or Next.js if SEO needs grow — evaluate at discovery |
| Backend | Node.js + Express | REST API, modular route/controller/service layering |
| Database | MongoDB Atlas (M0/M2 shared tier to start) | **Not on the app VPS** — keeps VPS RAM free for the app, gives managed backups |
| File/Image Storage | VPS disk (origin) + Cloudflare CDN in front | Images never served directly from origin under load |
| Hosting | Hostinger VPS — KVM 1 (1 vCPU / 4GB RAM / 50GB NVMe) to start, upgrade path to KVM 2 defined | Ubuntu 24.04 LTS |
| Deployment | Coolify (self-hosted, free, Docker-based) | Git push → auto deploy, auto SSL via Let's Encrypt |
| Process management | Docker containers via Coolify (Node app), Nginx reverse proxy | No cPanel/Plesk — too heavy for 4GB RAM |
| CDN / Image optimization | Cloudflare (free tier) | WebP/AVIF conversion, lazy loading, image compression pipeline pre-upload |
| Domain/DNS | Registered directly under House of Virasat's account (Namecheap/GoDaddy) | Brief mandates business ownership, not developer's personal account |
| Payment gateway | `[CONFIG - CONFIRM LATER]` — Razorpay recommended default (UPI/cards/netbanking/COD toggle, strong India support) | Must not be hardcoded — abstract behind a payment service interface |
| Shipping partner | `[CONFIG - CONFIRM LATER]` — Shiprocket recommended default (multi-courier aggregator, pincode + tracking API) | Abstract behind a shipping service interface |
| WhatsApp | wa.me deep links at launch; WhatsApp Business API only if budget approved later | Number editable from admin, no hardcoding |
| Email | Transactional service (Resend / Brevo / SES) | Never send order emails via raw SMTP from app server |
| Analytics | GA4 + Google Search Console (mandatory); Meta Pixel only if paid social starts | Event tracking spec in Section 9 |

---

## 3. Architecture Principles

1. **Config over code.** Pricing modes, stock-status fallback rules, shipping thresholds, lead times, WhatsApp number, coupon rules — all live in DB/admin settings, never in source code.
2. **Service abstraction for third parties.** Payment gateway, shipping partner, WhatsApp, email are each behind an internal service interface (`PaymentService`, `ShippingService`, etc.) so swapping providers later doesn't touch business logic.
3. **Product model is polymorphic by field group, not by hardcoded category logic.** A silver product and an 18K gold product share the same schema but only render the fields relevant to them (empty fields never shown to customer).
4. **Stock and price logic are category-agnostic at the code level** — gold/diamond and silver must NOT share one locked checkout logic; price display mode is a per-product enum, not a global setting.
5. **International-ready, not international-live.** Currency/tax/shipping fields exist in schema as extensible but default to India-only in phase 1.

---

## 4. Core Data Models

### 4.1 Product
```
Product {
  _id, sku (unique), designCode (optional, customer-facing),
  name, shortDescription, fullDescription,
  category, subcategory, collection: [REET, RAJSI, NITYA, ROOP, ...], tags: [],

  // Commercial
  priceMode: enum [FIXED, STARTING_FROM, ESTIMATED, ON_REQUEST],
  mrp, sellingPrice, compareAtPrice,
  taxSetting, stockQuantity, availabilityStatus: enum [IN_STOCK, MADE_TO_ORDER, SOLD_OUT, ARCHIVED],
  madeToOrderAllowed: boolean,   // auto-fallback trigger when stock hits 0
  leadTimeDays: number,          // editable per product

  // Metal
  metalType: enum [GOLD, SILVER],
  purity: enum [925, 9K, 14K, 18K, 22K],
  netWeight, grossWeight, finish,

  // Stones/Diamonds
  stones: [{ type: [DIAMOND_NATURAL, DIAMOND_LAB, POLKI, KUNDAN, CZ, SEMI_PRECIOUS, PEARL],
             weight, count, colour, clarity, cut, certification }],

  // Sizing
  variants: [{ ringSize|bangleSize|necklaceLength, dimensions, stockQty, sku }],

  // Media
  heroImage, gallery: [{ url, altText }], video, wornImage,

  // Fulfilment
  dispatchTimeInStock, shippingRestrictions: [],

  // Customisation
  customisable: boolean, allowedCustomisations: [], customisationNotes,

  // SEO
  seoTitle, metaDescription, urlHandle (unique, canonical-safe), structuredDataOverride,

  // Internal (admin-only, never exposed via public API)
  supplierRef, batchRef, costPrice,

  createdAt, updatedAt, createdBy, archivedAt
}
```
**Rule:** public product API response is built via a serializer that strips `internal` field group and any field with a null/empty value — never send raw DB doc to frontend.

### 4.2 Order
```
Order {
  _id, referenceNumber (unique, human-readable e.g. HOV-2026-00123),
  customer: { name, mobile, email, guestCheckout: boolean },
  shippingAddress, billingAddress,
  items: [{ productId, variantId, sku, qty, priceAtPurchase, priceMode }],
  paymentStatus: enum [PENDING, PAID, FAILED, REFUNDED, PARTIAL_DEPOSIT],
  fulfilmentStatus: enum [CONFIRMED, IN_PRODUCTION, QUALITY_CHECK, READY_TO_DISPATCH, SHIPPED, DELIVERED],
  paymentGatewayRef, invoiceNumber (GST-compliant),
  couponCode, discountApplied,
  shippingCharge, trackingLink, courierPartner,
  notes (internal), adminNotes: [],
  createdAt, updatedAt
}
```
**Rule:** inventory must only decrement on **confirmed successful payment**, never on cart-add or payment-initiated. Failed payments release any soft-hold within a defined TTL (e.g. 15 min) — no permanently blocked stock.

### 4.3 Made-to-Order Request
```
MtoRequest {
  _id, referenceNumber, productId, customer: {...},
  selectedVariant/preferences, pricingMode, quotedPrice (nullable until admin confirms),
  depositAmount (if applicable), status: enum [SUBMITTED, CONFIRMED, IN_PRODUCTION, QC, READY, SHIPPED, DELIVERED, CANCELLED],
  adminSpecNotes, createdAt, updatedAt
}
```

### 4.4 Bespoke Enquiry
```
BespokeEnquiry {
  _id, referenceNumber,
  contact: { name, mobile, email, city },
  jewelleryType, metalPreference, karatPreference: [9K,14K,18K,22K],
  stonePreference, budgetRange, occasion, timeline,
  designBrief (text), referenceImages: [] (size-limited, validated file type),
  preferredContactMethod, appointmentRequested: boolean,
  status: enum [NEW, IN_CONSULTATION, QUOTED, CONFIRMED, CLOSED],
  crmHandoffNotes,
  createdAt
}
```

### 4.5 Supporting collections
`Category`, `Collection`, `AdminUser` (with role: `SUPER_ADMIN | STAFF`, least-privilege permission flags), `Coupon` (code, type, value, validFrom/To, usageLimit, minOrderValue), `ShippingRule` (zone, charge, freeThreshold — editable, not hardcoded), `ContentBlock` (home banners, featured category, About/Founder/policy page bodies — CMS-editable), `NotificationTemplate` (order confirmation, MTO ack, etc. — editable placeholders, not hardcoded strings in code).

---

## 5. Admin Panel — Full Control Requirements

**Design principle: the developer should never be needed for routine catalogue work.** Every item below must be a UI action, not a code deploy.

| Area | Must be admin-controllable |
|---|---|
| Products | Create/edit/duplicate/archive; all fields in 4.1 including images (upload/reorder/delete), alt text, description, price, stock, status, lead time, variants, SEO fields |
| Inventory | Manual quantity adjustment, toggle made-to-order fallback, force sold-out, low-stock alerts |
| Orders | View/filter/search, payment + fulfilment status, internal notes, CSV export |
| Made-to-Order | View requests, confirm final price, update production status, record spec notes |
| Bespoke | View brief + uploaded images, update status, add consultation notes |
| Content | Home page blocks (banner, featured collection, sections per brief §5), About/Founder/policy page bodies, FAQ, journal posts — via a block-based CMS, not hardcoded JSX |
| Promotions | Create/edit coupons, start/end dates, usage limits, min order value |
| Shipping | Charges, free-shipping threshold, zones, courier selection — all editable |
| Notifications | Edit order confirmation / MTO ack / shipping templates (subject + body, placeholder tokens) |
| Customers | Search, view order history — read access only, PII-restricted per role |
| Reports | Sales, orders, AOV, product performance, inventory status, conversion funnel basics |
| Users | Admin/staff account creation with role-based permission toggles (least privilege) |
| Settings | WhatsApp number, payment gateway toggle (test/live), COD on/off (global + per-product/order-value), price display mode defaults |

**Implementation note:** build a generic `AdminField` renderer driven by a field-config schema per model, so adding a new manageable field later is a config change, not a new form component.

---

## 6. Product Status & Pricing Logic (core business rule — build this carefully)

### Status state machine
```
IN_STOCK --(qty hits 0 AND madeToOrderAllowed=true)--> MADE_TO_ORDER
IN_STOCK --(qty hits 0 AND madeToOrderAllowed=false)--> SOLD_OUT
Any status --(admin action)--> ARCHIVED (hidden from shop, retained for SEO/records, optional redirect)
```
This transition must be an **automatic backend hook** on stock decrement — not a manual admin step, per brief §9's "Required automation."

### Price display modes (per-product enum, never global)
- `FIXED` → normal price + Add to Cart
- `STARTING_FROM` → "Starting from ₹X" + variant selection required before cart
- `ESTIMATED` → optional estimated price shown with a "subject to confirmation" note, no direct online payment — routes to enquiry/deposit flow
- `ON_REQUEST` → no public price, WhatsApp/Enquire CTA only

---

## 7. Made-to-Order & Bespoke Flows

Both flows generate a record with a **unique human-readable reference number** (not just a Mongo ObjectId) and trigger an acknowledgement (email + WhatsApp handoff where applicable). Reference number format: `HOV-MTO-YYYYMM-####` / `HOV-BSP-YYYYMM-####`.

MTO order status pipeline: `Confirmed → In Production → Quality Check → Ready to Dispatch → Shipped → Delivered` — same pipeline object reused for both regular and MTO orders so reporting stays unified.

---

## 8. Checkout, Payments & Shipping

- Guest checkout allowed; account optional.
- Mobile-first checkout — single-column, minimal steps.
- GST-compliant invoice generation (invoice number sequence, tax breakup) — configurable per business settings.
- Coupon codes supported but never surfaced as primary brand messaging (per brief — brand is not discount-led).
- **Payment failure handling:** any stock "hold" during checkout must have a TTL and auto-release — never a permanent block. Reflect this at the DB level (a `reservedUntil` timestamp on order-in-progress, not a hard decrement).
- Shipping charges/free-shipping threshold from `ShippingRule` config, never hardcoded in checkout logic.
- Tracking link pushed to customer post-dispatch (via courier API webhook → order update → email/WhatsApp notify).

---

## 9. SEO & Analytics

- Unique title/meta description per category, collection, and product (from `seoTitle`/`metaDescription` fields).
- Product structured data (schema.org Product) rendered server-side/prerendered.
- Breadcrumbs on category and product pages.
- Canonical tag strategy to prevent duplicate URLs from filters/variant query params.
- 301 redirect map for archived products / URL changes (admin-manageable or at minimum a maintained redirects config).
- XML sitemap auto-generated on product/category changes, submitted to Search Console.
- Event tracking (GA4): `product_view`, `add_to_cart`, `checkout_start`, `purchase`, `mto_submit`, `bespoke_submit`, `whatsapp_click`.

---

## 10. Security Requirements

**Non-negotiable — build these in from day one, not "later":**

1. **Transport:** HTTPS/SSL everywhere (auto-managed via Coolify/Let's Encrypt), HSTS enabled.
2. **Auth:** Admin login with hashed passwords (bcrypt/argon2), JWT or session with short expiry + refresh, rate-limited login attempts, optional 2FA for `SUPER_ADMIN`.
3. **RBAC:** Every admin route checks role/permission server-side, not just hidden in UI.
4. **Input validation:** Schema validation (e.g. Zod/Joi) on every API endpoint — reject unexpected fields, sanitize strings, validate file uploads (type + size limits, especially bespoke reference-image uploads and product image uploads).
5. **Injection protection:** Parameterized queries/ODM usage only (Mongoose) — no raw string-built queries. Sanitize all user input rendered anywhere (XSS protection, especially on descriptions/journal content editable by admin).
6. **File uploads:** Store outside web-executable paths, validate MIME type server-side (not just extension), generate randomized filenames, virus-scan if feasible, strict size caps.
7. **Rate limiting:** On auth endpoints, checkout endpoint, enquiry/bespoke submission endpoints (prevent spam/abuse), and on public product API.
8. **Secrets management:** All API keys (payment gateway, email, WhatsApp, CDN) in environment variables via Coolify's secret manager — never committed to repo.
9. **Payment security:** Never store card data — gateway handles PCI scope entirely (Razorpay/similar hosted checkout or tokenized flow only). Webhook signature verification mandatory for payment confirmation — never trust client-side "payment success" alone.
10. **PII handling:** Customer data (address, phone, email) access-restricted by admin role; no internal cost/supplier data ever exposed via public API (explicitly excluded in product serializer per §4.1).
11. **Backups:** Automated daily DB backups (MongoDB Atlas handles this natively), VPS-level snapshot via Hostinger, documented restore process.
12. **Dependency hygiene:** Regular `npm audit` / Dependabot, pin versions, no unmaintained packages for payment/auth-critical paths.
13. **CORS:** Locked to known frontend origin(s) only, not wildcard.
14. **Logging:** Structured error/audit logs (admin actions on orders/pricing) without logging sensitive data (no card numbers, no plaintext passwords, ever).

---

## 11. Performance & Optimization

1. **Images:** Compress on upload (server-side pipeline, WebP/AVIF conversion), serve via Cloudflare CDN — never serve raw uploads directly from origin under production load. Lazy-load below-the-fold images.
2. **Database:** Index `sku`, `urlHandle`, `category`, `availabilityStatus`, `collection` fields used in filters/sort — unindexed filter queries are the most likely early bottleneck per our capacity analysis.
3. **API:** Paginate all list endpoints (category/shop pages), never return full catalogue in one call.
4. **Caching:** Cache category/collection page data (Redis optional at scale, or in-memory + CDN edge caching initially) since these are read-heavy, low-change pages.
5. **Frontend:** Code-splitting per route, prefetch on hover for product links, compress JS/CSS bundle, avoid heavy animation libraries (brief explicitly wants restrained motion, which also helps performance).
6. **Server resource separation:** MongoDB on Atlas (not VPS) keeps the 4GB VPS RAM dedicated to the Node app + Nginx + Coolify — this was a deliberate capacity decision, not a defer-and-forget item.
7. **Monitoring:** Basic uptime + resource monitoring (Coolify has built-in metrics; add UptimeRobot or similar free tier for external checks) so RAM/CPU pressure is caught before customers notice slowness.

---

## 12. Non-Functional Requirements (from brief, restated as build criteria)

- Responsive: current iPhone/Android, tablet, desktop breakpoints tested.
- Accessibility: contrast ratios, logical heading hierarchy, alt text on all images, keyboard navigability, labelled form fields.
- Staging environment before production (Coolify supports separate staging deployment from same repo).
- All domain/DNS/hosting/gateway/analytics accounts created under House of Virasat's ownership — developer has managed access, not sole ownership.
- Full credential + asset handover checklist at project completion (see brief §34 go-live checklist — reuse as final QA gate).

---

## 13. Explicit Non-Assumptions (hard constraints — do not hardcode any of these)

- Not every product is instantly buyable online.
- Out-of-stock ≠ unavailable forever.
- Made-to-order items do not all have a fixed price.
- Return/exchange/buyback eligibility varies by category — must be a per-product/category field, not a global rule.
- Gold/diamond products vary in karat, diamond type, certification — schema must support this variance, not assume uniformity.
- International shipping is NOT live in phase 1 — schema should allow it later without a rebuild (see §2 architecture principle).
- Discounts/coupons are promotional, not a permanent brand behavior — never bake discount logic into base pricing.

---

## 14. Build Sequence

1. **Discovery & schema lock** — finalize platform decisions still marked `[CONFIG - CONFIRM LATER]` above (payment gateway, shipping partner).
2. **Core data models + admin CRUD** (Section 4 + 5) — get product/order/MTO/bespoke models and admin panel working end-to-end before storefront polish.
3. **Storefront** — category/PDP/cart/checkout using the status + pricing logic in Section 6.
4. **Integrations** — payment, shipping, WhatsApp, email, analytics.
5. **Catalogue data load** — real products on staging.
6. **QA against brief §27–30 customer journeys** (in-stock silver, in-stock gold/diamond, MTO fallback, bespoke) — these four scenarios are the acceptance test suite.
7. **Go-live checklist** (brief §34) as final gate.

---

## 15. Open Items Requiring Client Confirmation Before Lock

- Final payment gateway selection.
- Final shipping partner/aggregator.
- Exact MTO payment model (full pay / deposit % / quote-only) — likely per-product via `priceMode`, but deposit % needs a business decision.
- WhatsApp automation level (manual number vs Business API).
- Final legal/policy copy (returns, exchange, buyback, privacy, terms) — implement verbatim, no paraphrasing.
- COD availability rules (global toggle vs order-value threshold).
