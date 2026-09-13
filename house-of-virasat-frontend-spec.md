# House of Virasat — Frontend Design & Technical Specification

**Philosophy:** Minimalist Luxury · Authentic Handcrafted Aesthetic · Zero AI-Gimmicks  
**Benchmark Blend:** Vamika Silver (Artisanal Heritage) + Fine Silver Jewels (Clean E-Commerce) + Tanishq (Trust & Purity Standards)

---

## 1. Design Principles (Anti-AI & Pure Luxury)

1. **Editorial Simplicity over Clutter:** Generous negative space, restrained color palette, no flashy AI gradients or glow effects.
2. **Authentic Jewellery Terminology:** Real Indian jewellery specs only (*Net Wt, Gross Wt, 925 Hallmark, 14K/18K/22K, Polki, Jadau, Kundan, Making Charges*). No generic AI marketing buzzwords.
3. **Typography First:** High-contrast pairing of a classic luxury serif for headlines (`Playfair Display` or `Cormorant`) with a razor-sharp modern sans (`Inter` or `Plus Jakarta Sans`) for product specs and pricing.
4. **Subtle Tactile Micro-Interactions:** Hairline 1px borders, smooth 150-200ms opacity fades, crisp image hover zoom, seamless drawer transitions. No bouncy/distracting animations.
5. **Mobile-First Utility:** Fast 1-tap WhatsApp consultation, sticky Add-to-Bag on PDP, clean drawer cart, 2-step checkout.

---

## 2. Color Palette & Visual Tokens

A restrained, natural palette inspired by raw precious metals and heritage stone textures:

```css
:root {
  /* Core Metals & Heritage Accents */
  --gold-primary: #B89768;          /* Natural muted gold */
  --gold-hover: #A07F52;
  --silver-accent: #8E959D;         /* Pure 925 silver hue */
  --heritage-maroon: #5A1E24;       /* Deep royal accent (used sparingly) */

  /* Pure Neutral Canvas */
  --bg-primary: #FFFFFF;           /* Crisp white for clear product visibility */
  --bg-warm: #F9F8F5;              /* Off-white / linen tint for section breaks */
  --bg-surface: #F3F2EE;           /* Card & input surface */
  
  /* Text & Contrast */
  --text-main: #1A1A1A;            /* Deep soft black (never pure harsh #000) */
  --text-muted: #6B7280;           /* Clean secondary text */
  --text-subtle: #9CA3AF;          /* Placeholders & disabled states */
  --border-hairline: #E5E2DA;      /* Ultra-thin elegant borders */

  /* UI Status */
  --success: #2B7A4B;
  --error: #B91C1C;
}
```

---

## 3. Real Page Breakdown & UX Structure

### 3.1 Header (Clean, Functional, Uncluttered)
- **Top Bar (Minimal):** `100% Certified 925 Silver & Hallmarked Gold · Insured Pan-India Shipping`
- **Main Bar:**
  - *Left:* Navigation Links (`Gold & Diamonds`, `925 Silver & Polki`, `Collections`, `Bespoke Atelier`)
  - *Center:* Clean Wordmark (`HOUSE OF VIRASAT` — letterspaced serif)
  - *Right:* Search Icon, Wishlist Icon, Bag Drawer Icon (with discrete item counter)
- **Mobile View:** Hamburger menu + Centered Logo + Bag Icon.

---

### 3.2 Homepage Sections (Authentic E-Commerce Flow)

1. **Hero Section:**
   - Minimalist full-width editorial visual or clean 2-column layout (Left: Headline & "Explore Catalogue" / "Custom Order" CTAs; Right: High-res hero jewellery still).
2. **Pillars of Authenticity (4 Clean Text Blocks):**
   - `BIS Hallmarked Purity` · `Authentic Jaipur Karigari` · `Transparent Pricing` · `Insured Delivery`
3. **Curated Collections Grid:**
   - 4-card minimalist grid (`Reet - Bridal`, `Rajsi - Polki Heritage`, `Nitya - Everyday Gold`, `Roop - Statement Silver`).
4. **Featured / New Arrivals Grid:**
   - 4-column responsive grid with quick "Add to Bag" and wishlist toggle.
5. **The Bespoke Atelier Featurette:**
   - Simple, human-crafted section: "Have a design in mind? Work directly with our master craftsmen to create your bespoke heirloom." → Direct button to Bespoke form or WhatsApp.
6. **Instagram & Karigar Craft Showcase:**
   - Real workshop/client images without fake badges.

---

### 3.3 Shop / Category Page (PLP)
- **Breadcrumbs:** `Home / Silver Jewellery / Polki Necklaces`
- **Faceted Filter (Clean Sidebar on Desktop / Bottom Sheet on Mobile):**
  - **Metal:** `925 Silver`, `14K Gold`, `18K Gold`, `22K Gold`
  - **Stone:** `Polki`, `Kundan`, `Natural Diamond`, `Pearls`, `Semi-Precious`
  - **Price:** Quick buckets (`Under ₹10,000`, `₹10,000 - ₹25,000`, `₹25,000 - ₹50,000`, `Above ₹50,000`) + Custom Slider
  - **Status:** `In Stock (Ready to Ship)`, `Made to Order`
- **Product Card UI:**
  - Clean aspect ratio `4:5` product photo.
  - Hover: Flips to model/lifestyle angle smoothly.
  - Discreet badges only when relevant (`Single Piece`, `Made to Order`).
  - Title, Metal Purity subtitle, and Price.

---

### 3.4 Product Detail Page (PDP — Real Jewellery Standard)
- **Left Column (Gallery):**
  - Sticky vertical thumbnail list + Main high-resolution zoom view.
  - Video tab if Karigar / 360° video exists.
- **Right Column (Product & Commerce Engine):**
  - Title, SKU, and Collection badge.
  - **Price Box:** Displays based on product `priceMode`:
    - `FIXED`: Clear price with "Inclusive of all taxes".
    - `STARTING_FROM`: "Starting from ₹XX,XXX" with variant selector.
    - `ESTIMATED` / `ON_REQUEST`: "Price upon inquiry" with direct WhatsApp/Consultation CTA.
  - **Price Transparency Accordion (Tanishq Style):**
    - Click to expand: *Metal Weight & Rate + Gemstone Cost + Making Charges + 3% GST*.
  - **Size / Variant Selector:** Ring sizes (`10` to `20`) or Bangle sizes (`2.4`, `2.6`, `2.8`) with a simple 1-click Size Chart modal.
  - **Pincode Delivery Checker:** Instant validation with estimated delivery date.
  - **Actions:** Primary Button (`ADD TO BAG`) + Secondary Button (`CUSTOMISE THIS DESIGN / WHATSAPP`).
  - **Specifications Table:**
    - Metal: `925 Sterling Silver / 18K Yellow Gold`
    - Gross Weight: `24.50 g` | Net Weight: `18.20 g`
    - Stone Details: `Natural Emerald & Uncut Polki`
    - Hallmarking: `BIS Hallmarked / Certified`

---

### 3.5 Bespoke & Made-to-Order Page
- A step-by-step form (not a robot chatbot):
  - **Step 1:** Select Type (Ring, Necklace, Earring, Bridal Set, Custom).
  - **Step 2:** Preferred Metal (`925 Silver` vs `14K/18K/22K Gold`) & Stones.
  - **Step 3:** Upload Reference Sketches or Photos (drag-and-drop / phone camera).
  - **Step 4:** Budget Range & Contact Details (Name, Phone, City, Preferred contact time).
- Submitting generates a tracking ID (`HOV-BSP-XXXX`) and gives a 1-tap WhatsApp link to continue discussing with the jewellery designer.

---

### 3.6 Slide-Over Cart & Fast Checkout
- **Mini-Cart Drawer:**
  - Slide-in from right without page reload.
  - Line items with metal/size details, qty increment/decrement.
  - Free shipping progress bar (`₹X more for free insured shipping`).
  - Coupon code input with live deduction.
  - Total with transparent tax breakup.
- **Checkout:**
  - Clean 1-page accordion: Contact → Delivery Address → Payment (Razorpay / UPI / COD).
  - No unnecessary login walls; guest checkout by default.

---

## 4. Frontend Technology Stack & Architecture

```
client/
├── index.html
├── src/
│   ├── components/
│   │   ├── layout/       # Navbar, MegaMenu, Footer, MobileNav
│   │   ├── ui/           # Button, Modal, Drawer, Input, Accordion, Badge
│   │   ├── product/      # ProductCard, PriceBreakup, SizeGuide, PincodeChecker
│   │   ├── cart/         # CartDrawer, CartItem, OrderSummary
│   │   └── bespoke/      # BespokeForm, ImageUpload
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Shop.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Bespoke.jsx
│   │   ├── Checkout.jsx
│   │   └── OrderSuccess.jsx
│   ├── context/          # CartContext, WishlistContext
│   ├── services/         # api.js (Axios client connected to backend)
│   ├── utils/            # formatPrice, calculateBreakup, validation
│   ├── styles/           # index.css (Vanilla CSS tokens + Clean utilities)
│   ├── App.jsx
│   └── main.jsx
```

---

## 5. Performance & Quality Guarantees

- **No Bloated Libraries:** Zero heavy 3D widgets or AI wrappers. Pure, clean React + CSS.
- **Fast Load Times:** Compressed WebP images, lazy loading on PLP grids.
- **100% Responsive:** Tested across mobile (375px+), tablet, and desktop (up to 4K).
- **Backend Sync:** 100% compatible with the Node.js/Express API already built.
