# House of Virasat — Frontend Design Specification
**For: Antigravity (AI coding agent) — visual & UX build spec**
**References studied: vamikasilver.com, finesilverjewels.com, tanishq.co.in**
**Pairs with: house-of-virasat-requirements.md (functional spec)**

---

## 0. What we're borrowing from each reference

| Reference | What to take | What to leave out |
|---|---|---|
| **Vamika Silver** | Slideshow hero with single strong campaign line + one CTA, "Shop by world" gateway pattern (two clean category doors), editorial "House Vamika" storytelling block, restrained testimonials section | Their nav is menu-heavy — don't copy the sprawl |
| **Fine Silver Jewels** | Product card pattern (image hover-swap, "ready to ship" badge, quick "Add"/"Choose"), Why Us icon strip, FAQ accordion, "As Worn By" social proof grid, Founder note block | Their celebrity-tagging mega-menu and 40+ nav items — House of Virasat brief explicitly wants a **clean**, non-crowded nav |
| **Tanishq** | Aspirational full-bleed editorial banners, confident large typography on hero, trust-badge strip (certification/purity/BIS-hallmark style), structured breadcrumb + filter sidebar on category pages, generous whitespace at scale | Tanishq's very dense mega-navigation and heavy promotional banner stacking — too "marketplace" for what the brief wants |

**Synthesis principle:** Vamika's restraint + Fine Silver Jewels' functional product-card/trust patterns + Tanishq's confident editorial scale — filtered through the brief's explicit instruction: *premium, minimal, heritage-led, not a marketplace look, no crowded banners, no constant pop-ups.*

---

## 1. Brand Visual Language (from client brief — locked, not a proposal)

| Element | Direction |
|---|---|
| Primary palette | Deep burgundy/plum (`#5C1A2E` range) + antique gold accent (`#B8935A` range) |
| Neutral base | Warm ivory/cream (`#FAF6F0` range) — never stark white, never bright/loud colours |
| Typography | Elegant serif/display for headings (e.g. Playfair Display, Cormorant) + clean modern sans for body (e.g. Inter, Manrope). Mobile legibility is non-negotiable — body text never below 15px |
| Photography | Jewellery is always the hero. High-res cut-outs + detail shots + worn/model shots + occasional editorial lifestyle imagery |
| UI chrome | Clean buttons, restrained icons, **minimal to no borders** — use spacing and subtle shadow/background tone shifts to separate sections instead of hard border lines |
| Motion | Subtle only — fade/slide-in on scroll, smooth hover transitions. No aggressive animation, no autoplay carousels that fight for attention |
| Avoid | Marketplace density, excessive gold gradients, crowded hero banners, constant popups, tiny fonts, discount-store visual language, heavy borders/dividers |

### Suggested Tailwind theme tokens
```js
// tailwind.config.js (excerpt)
colors: {
  burgundy: { DEFAULT: '#5C1A2E', dark: '#3D1120', light: '#7A2B42' },
  gold: { DEFAULT: '#B8935A', light: '#D4B884', dark: '#96773E' },
  ivory: { DEFAULT: '#FAF6F0', dark: '#F0E9DD' },
  charcoal: '#2B2320', // body text, not pure black
},
fontFamily: {
  display: ['"Cormorant Garamond"', 'serif'],   // headings
  body: ['"Inter"', 'sans-serif'],                // body/UI text
},
```

---

## 2. Homepage Structure (adapted from brief §5 + reference patterns)

Build as an **ordered array of CMS-driven content blocks** (matches admin CMS requirement in the functional spec — home page sections must be editable without code) — not hardcoded JSX sections.

1. **Hero** — single strong campaign visual + one headline + one CTA (Vamika-style restraint, Tanishq-scale confidence). Max 3-slide rotation if used, no more.
2. **Shop by World** — two large clean gateway tiles: *Fine Gold & Diamonds* / *925 Silver Kundan & Polki* (Vamika pattern).
3. **New Arrivals** — horizontal scroll/grid of latest in-stock or launched pieces, using the standard Product Card (Section 4).
4. **Shop by Category** — icon/image tiles: Necklaces, Earrings, Rings, Bangles/Kadas, Bracelets, Bridal.
5. **Featured Collection** — editorial block for REET/RAJSI/NITYA/ROOP or current campaign — large image + short copy, not a grid.
6. **In Stock / Ready to Ship strip** — quick-access row for customers who want immediate purchase.
7. **Made to Order explainer** — short editorial block explaining the concept, linking to the MTO page.
8. **Bridal / Occasion edit** — visual storytelling block, higher-ticket discovery.
9. **Why House of Virasat** — icon strip (Fine Silver Jewels "Why Us" pattern): craftsmanship, certified purity, customisation, personal service — 4-6 items, icon + one line each.
10. **Our Story teaser** — short brand narrative + "Read our story" link.
11. **Founder Note teaser** — intimate, editorial tone (per brief) — portrait image + a few lines + link to full page.
12. **Client Trust** — testimonials, 3-5 rotating quotes (Vamika pattern) once available.
13. **Service Strip** — shipping / secure payment / authenticity / customisation / WhatsApp assistance — small icon row.
14. **Newsletter / WhatsApp opt-in** — single line + input, must not feel intrusive, no modal popup version.

**Design principle carried from brief:** editorial and premium, but shopping stays obvious — every section has a clear next action, luxury never adds friction.

---

## 3. Navigation

Single-level clean mega-menu, matching brief §3 exactly — do NOT replicate Fine Silver Jewels' 40+ item sprawl:

```
New Arrivals | Gold & Diamonds ▾ | 925 Silver ▾ | Collections ▾ | Bridal | Bespoke/Customise | Our Story | Journal/Guides | Contact/WhatsApp
```
- Desktop: dropdown mega-menu on hover, max 2 columns per dropdown, image thumbnail optional for collections.
- Mobile: collapsible accordion drawer, **max 2 levels deep** — brief explicitly warns against too many first-level items on mobile.
- Persistent but unobtrusive WhatsApp icon (bottom-right, not covering content, dismissible or shrinks on scroll).
- Sticky header on scroll-up, hides on scroll-down (saves vertical space on mobile).

---

## 4. Product Card (grid item — category/collection/search pages)

Pattern borrowed from Fine Silver Jewels, refined for premium feel:

```
┌─────────────────────────┐
│                          │  ← image, hover swaps to 2nd angle
│      [status badge]      │     (top-left, small pill: "In Stock" /
│                          │      "Made to Order" / no badge for
│                          │      Sold Out — greyed card instead)
├─────────────────────────┤
│ Product Name             │  ← display font, 1-2 lines max
│ Metal/purity short tag   │  ← e.g. "925 Silver · Polki"
│ ₹ Price or "Starting from"│ ← per priceMode logic
│ [Wishlist heart icon]    │  ← top-right corner overlay on image
└─────────────────────────┘
```
- No heavy card border — separate cards with whitespace/grid gap only, per brand direction (minimal borders).
- Status badge colours: In Stock = subtle gold/ivory pill; Made to Order = outlined text badge (not alarming); Sold Out = image desaturated + "Sold Out" label, card still clickable for discovery.
- Grid: 2 columns mobile, 3 tablet, 4 desktop. Generous gutter (24-32px desktop, 12-16px mobile).
- Lazy-load images below the fold; hero/above-fold images use `fetchpriority="high"`.

---

## 5. Category / Collection Page

- Breadcrumb top (SEO requirement too — brief §26).
- Filter sidebar (desktop) / bottom sheet (mobile) — filters per brief §6 table: Jewellery World, Category, Occasion, Collection, Availability, Price, Metal/Purity, Stone Type, Colour, Finish, Size — **only show filter options actually used by products in that category** (don't render empty filters).
- Sort dropdown: Featured / Newest / Price Low-High / Price High-Low / In Stock First (default for general shop pages, per brief).
- Product grid as Section 4.
- Pagination or infinite scroll with a visible "Load more" (avoid silent infinite scroll — helps perceived performance and lets users reach the footer).

---

## 6. Product Detail Page (PDP)

Layout: two-column desktop (image gallery left/sticky, details right), single-column stacked mobile with sticky bottom CTA bar.

1. **Media** — main image + thumbnail strip, pinch-zoom on mobile, optional video, worn/model image toggle.
2. **Identity** — product name (display font), SKU/collection tag, status badge (prominent, per brief "highly visible badge").
3. **Price** — per price-display-mode logic from functional spec (Fixed / Starting From / Estimated / On Request).
4. **Primary CTA** — Add to Cart / Buy Now (in-stock) or Made-to-Order Request/Enquire (per product config) — sticky on mobile scroll.
5. **Metal & stone details** — expandable/accordion sections (purity, weight, finish, stone type/weight/certification) — keeps page scannable, matches "premium not cluttered" direction.
6. **Dimensions & sizing** — with size guide link.
7. **Customisation note** — clear yes/no + allowed types if applicable.
8. **Delivery estimate** — dispatch/production lead time.
9. **Care summary** — short + link to full care guide.
10. **WhatsApp CTA** — "Ask about this piece" with SKU/name prefilled (per functional spec — never expose internal pricing in the prefilled text).
11. **Related products** — "You may also like" / "Complete the look" carousel.
12. **Policy links** — concise, relevant to this product's category (shipping/returns/exchange).

---

## 7. Made-to-Order & Bespoke Pages

- **MTO product flow**: inherits PDP layout, adds a visible timeline strip (e.g. "Confirmed → In Production → Ready to Dispatch") and a variant/preference selector before the CTA.
- **Bespoke/Customise landing**: dedicated editorial page (not a bare form) — intro copy on the craft, then a clean multi-step form (contact → requirement/design brief → reference image upload → preferences → consultation method). Use a **stepper**, not one long form, to keep it feeling premium and not like a support ticket.

---

## 8. Trust & Editorial Pages

- **Our Story / Founder Note**: full-bleed portrait/lifestyle imagery + serif display pull-quotes, generous line-height, editorial magazine feel — not corporate "About Us" boilerplate.
- **Materials & Craftsmanship / Care / Size Guide**: mix of short copy blocks + simple diagrams/icons, accordion for FAQs (Fine Silver Jewels pattern works well here).
- **Trust strip** (reusable component, appears on home + PDP + checkout): Certified Purity · Handcrafted · Secure Payment · Easy Exchange · WhatsApp Support — icon + one line, no borders, just icon-over-text.

---

## 9. Cart, Checkout, Confirmation

- Guest checkout front and center, account creation optional/secondary.
- Single-column, mobile-first checkout: Contact → Shipping → Payment, with an order summary that's collapsible on mobile (don't push payment step below the fold).
- Trust micro-copy near payment button (SSL/secure payment badge) — small, not alarming.
- Confirmation page: reference number prominent, "what happens next" steps, no dead end — link to order tracking/account.

---

## 10. Component Library to Build (maps to `components/ui/`)

| Component | Notes |
|---|---|
| `Button` | Primary (burgundy fill), Secondary (outline, thin gold border only — the one deliberate border use), Text/link variant |
| `StatusPill` | In Stock / Made to Order / Sold Out states |
| `ProductCard` | Section 4 spec |
| `Accordion` | Metal/stone details, FAQ |
| `Stepper` | Bespoke form |
| `Badge/TrustIcon` | Trust strip items |
| `Modal` | Size guide, quick view — used sparingly, never for promo popups |
| `PriceDisplay` | Renders correct format per priceMode enum |
| `WhatsAppButton` | Floating + inline "Ask about this piece" variants, both reading number from admin settings |

Use **Radix UI / Headless UI primitives** underneath (Accordion, Modal/Dialog, Dropdown) for accessibility, styled entirely with Tailwind — no Material UI, per our earlier stack decision.

---

## 11. Performance-Driven Design Rules

(Ties back to the "fast loading" requirement — design choices that protect performance, not just visuals)

- No autoplaying background video hero on first load — use a static hero image with an optional lazy-loaded video that starts on user interaction/visibility (Fine Silver Jewels autoplays multiple videos on homepage load — **avoid this**, it's a mobile-data and CPU cost).
- All product/category images through the Cloudflare CDN pipeline defined in the requirements doc — WebP/AVIF, responsive `srcset`.
- Fonts: self-host or use `font-display: swap`, limit to 2 font families / max 4 weights total.
- Icons: SVG sprite or icon component library (lucide-react), never icon-font.
- Skeleton loaders for product grids/PDP while data fetches — perceived performance, fits premium feel better than a spinner.

---

## 12. Responsive Priorities (mobile-first, per brief)

- Design and build mobile layouts first, then scale up — not the reverse.
- Sticky Add-to-Cart/Enquire bar on PDP mobile.
- Filters as bottom sheet, not sidebar, under tablet breakpoint.
- Touch-friendly tap targets (min 44px) throughout, especially wishlist/cart icons on product cards.
- Test on actual mobile data conditions (throttled 3G/4G), not just device width — brief explicitly calls out "fast load times on mobile data."
