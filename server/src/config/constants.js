export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
  PARTIAL_DEPOSIT: 'PARTIAL_DEPOSIT',
};

export const FULFILMENT_STATUS = {
  CONFIRMED: 'CONFIRMED',
  IN_PRODUCTION: 'IN_PRODUCTION',
  QUALITY_CHECK: 'QUALITY_CHECK',
  READY_TO_DISPATCH: 'READY_TO_DISPATCH',
  DISPATCHED: 'DISPATCHED',   // BUG FIX: was missing — webhook.controller.js references this
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  RTO: 'RTO',                 // BUG FIX: was missing — webhook.controller.js references this
};

export const PRODUCT_STATUS = {
  IN_STOCK: 'IN_STOCK',
  MADE_TO_ORDER: 'MADE_TO_ORDER',
  SOLD_OUT: 'SOLD_OUT',
  ARCHIVED: 'ARCHIVED',
};

export const PRICE_MODE = {
  FIXED: 'FIXED',
  STARTING_FROM: 'STARTING_FROM',
  ESTIMATED: 'ESTIMATED',
  ON_REQUEST: 'ON_REQUEST',
};

export const METAL_TYPE = {
  GOLD: 'GOLD',
  SILVER: 'SILVER',
};

export const PURITY = {
  '925': '925',
  '9K': '9K',
  '14K': '14K',
  '18K': '18K',
  '22K': '22K',
};

export const STONE_TYPE = {
  DIAMOND_NATURAL: 'DIAMOND_NATURAL',
  DIAMOND_LAB: 'DIAMOND_LAB',
  POLKI: 'POLKI',
  KUNDAN: 'KUNDAN',
  CZ: 'CZ',
  SEMI_PRECIOUS: 'SEMI_PRECIOUS',
  PEARL: 'PEARL',
  GEMSTONE: 'GEMSTONE',   // legacy value — present in existing DB records
};

export const MTO_STATUS = {
  SUBMITTED: 'SUBMITTED',
  CONFIRMED: 'CONFIRMED',
  IN_PRODUCTION: 'IN_PRODUCTION',
  QC: 'QC',
  READY: 'READY',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

export const BESPOKE_STATUS = {
  NEW: 'NEW',
  IN_CONSULTATION: 'IN_CONSULTATION',
  QUOTED: 'QUOTED',
  CONFIRMED: 'CONFIRMED',
  CLOSED: 'CLOSED',
};

export const PAYMENT_STATUS = ORDER_STATUS;

export const ADMIN_ROLE = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  STAFF: 'STAFF',
};
export const ROLES = ADMIN_ROLE;

export const COUPON_TYPE = {
  PERCENT: 'PERCENT',
  FIXED: 'FIXED',
};

// Soft-hold TTL for pending payments (15 minutes)
export const STOCK_HOLD_TTL_MS = 15 * 60 * 1000;

export const REFERENCE_PREFIXES = {
  ORDER: 'HOV',
  MTO: 'HOV-MTO',
  BESPOKE: 'HOV-BSP',
};
