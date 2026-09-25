import { z } from 'zod';
import { PRICE_MODE, METAL_TYPE, PURITY, STONE_TYPE, PRODUCT_STATUS } from '../../config/constants.js';

const toOptionalNumber = z.preprocess((val) => {
  if (val === '' || val === null || val === undefined) return undefined;
  if (typeof val === 'string') {
    const cleaned = val.replace(/[^0-9.-]/g, '');
    if (!cleaned) return undefined;
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? undefined : parsed;
  }
  return Number(val);
}, z.number().optional());

const toOptionalInt = z.preprocess((val) => {
  if (val === '' || val === null || val === undefined) return undefined;
  if (typeof val === 'string') {
    const cleaned = val.replace(/[^0-9-]/g, '');
    if (!cleaned) return undefined;
    const parsed = parseInt(cleaned, 10);
    return isNaN(parsed) ? undefined : parsed;
  }
  return Math.round(Number(val));
}, z.number().int().optional());

const toOptionalEnum = (enumValues) => z.preprocess((val) => {
  if (val === '' || val === null || val === undefined) return undefined;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return undefined;
    if (enumValues.includes(trimmed)) return trimmed;
    const matched = enumValues.find((v) => v.toLowerCase() === trimmed.toLowerCase());
    if (matched) return matched;
  }
  return val;
}, z.enum(enumValues).optional());

const toOptionalBool = (def = false) => z.preprocess((val) => {
  if (val === 'true' || val === true || val === 1 || val === '1') return true;
  if (val === 'false' || val === false || val === 0 || val === '0') return false;
  if (val === '' || val === null || val === undefined) return def;
  return Boolean(val);
}, z.boolean()).default(def);

const stoneSchema = z.object({
  type: toOptionalEnum(Object.values(STONE_TYPE)),
  weight: toOptionalNumber,
  count: toOptionalInt,
  colour: z.preprocess((val) => (val === null || val === undefined ? '' : String(val)), z.string().optional()),
  clarity: z.preprocess((val) => (val === null || val === undefined ? '' : String(val)), z.string().optional()),
  cut: z.preprocess((val) => (val === null || val === undefined ? '' : String(val)), z.string().optional()),
  certification: z.preprocess((val) => (val === null || val === undefined ? '' : String(val)), z.string().optional()),
});

const variantSchema = z.object({
  sku: z.string().min(1),
  ringSize: z.string().optional(),
  bangleSize: z.string().optional(),
  necklaceLength: z.string().optional(),
  dimensions: z.string().optional(),
  stockQty: toOptionalInt.default(0),
});

const galleryImageSchema = z.preprocess((val) => {
  if (typeof val === 'string') return { url: val.trim() };
  if (typeof val === 'object' && val !== null && val.url) {
    return { url: String(val.url).trim(), altText: val.altText ? String(val.altText).trim() : '' };
  }
  return val;
}, z.object({
  url: z.string().min(1),
  altText: z.string().optional(),
}));

export const createProductSchema = z.object({
  body: z.object({
    sku: z.string().min(1).max(100),
    designCode: z.string().optional(),
    name: z.string().min(1).max(300),
    shortDescription: z.string().optional(),
    fullDescription: z.string().optional(),
    category: z.string().min(1),
    subcategory: z.string().optional(),
    collection: z.preprocess((val) => {
      if (Array.isArray(val)) return val.map(String).filter(Boolean);
      if (typeof val === 'string' && val.trim()) return [val.trim()];
      return [];
    }, z.array(z.string())).default([]),
    tags: z.preprocess((val) => {
      if (Array.isArray(val)) return val.map(String).filter(Boolean);
      if (typeof val === 'string') return val.split(',').map(t => t.trim()).filter(Boolean);
      return [];
    }, z.array(z.string())).default([]),
    priceMode: z.preprocess((val) => {
      if (val === '' || val === null || val === undefined) return PRICE_MODE.FIXED;
      if (typeof val === 'string') {
        const matched = Object.values(PRICE_MODE).find(v => v.toLowerCase() === val.toLowerCase());
        if (matched) return matched;
      }
      return val;
    }, z.enum(Object.values(PRICE_MODE))).default(PRICE_MODE.FIXED),
    mrp: toOptionalNumber,
    sellingPrice: toOptionalNumber,
    compareAtPrice: toOptionalNumber,
    taxSetting: toOptionalNumber.default(3),
    stockQuantity: toOptionalInt.default(0),
    availabilityStatus: toOptionalEnum(Object.values(PRODUCT_STATUS)),
    madeToOrderAllowed: toOptionalBool(false),
    leadTimeDays: toOptionalInt.default(21),
    isFeatured: toOptionalBool(false),
    featuredOrder: toOptionalNumber.default(0),
    metalType: toOptionalEnum(Object.values(METAL_TYPE)),
    purity: toOptionalEnum(Object.values(PURITY)),
    netWeight: toOptionalNumber,
    grossWeight: toOptionalNumber,
    finish: z.string().optional(),
    stones: z.array(stoneSchema).default([]),
    variants: z.array(variantSchema).default([]),
    heroImage: z.preprocess((val) => {
      if (typeof val === 'object' && val !== null && 'url' in val) return val.url ? String(val.url).trim() : undefined;
      if (typeof val === 'string' && val.trim()) return val.trim();
      return undefined;
    }, z.string().optional()),
    gallery: z.preprocess((val) => {
      if (typeof val === 'string') {
        return val.split('\n').map(u => u.trim()).filter(Boolean).map(u => ({ url: u }));
      }
      if (Array.isArray(val)) {
        return val.filter(item => item && (typeof item === 'string' ? item.trim() : item.url));
      }
      return [];
    }, z.array(galleryImageSchema)).default([]),
    video: z.string().optional(),
    wornImage: z.string().optional(),
    dispatchTimeInStock: z.string().optional(),
    shippingRestrictions: z.array(z.string()).default([]),
    customisable: toOptionalBool(false),
    allowedCustomisations: z.array(z.string()).default([]),
    customisationNotes: z.string().optional(),
    returnEligible: toOptionalBool(false),
    exchangeEligible: toOptionalBool(false),
    seoTitle: z.string().optional(),
    metaDescription: z.string().max(160).optional(),
    urlHandle: z.preprocess((val) => {
      if (typeof val === 'string' && val.trim()) {
        return val.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-').replace(/(^-|-$)/g, '');
      }
      return undefined;
    }, z.string().optional()),
    supplierRef: z.string().optional(),
    batchRef: z.string().optional(),
    costPrice: toOptionalNumber,
    priceBreakup: z.object({
      isCustom: toOptionalBool(false),
      purityLabel: z.string().optional(),
      metalRatePerGram: toOptionalNumber,
      estimatedMetalCost: toOptionalNumber,
      estimatedStoneCost: toOptionalNumber,
      makingCharges: toOptionalNumber,
      makingChargesLabel: z.string().optional(),
      preTaxTotal: toOptionalNumber,
      gstRate: toOptionalNumber,
      gstAmount: toOptionalNumber,
      finalPrice: toOptionalNumber,
      customNote: z.string().optional(),
    }).optional(),
  }),
});

export const updateProductSchema = z.object({
  body: createProductSchema.shape.body.partial(),
  params: z.object({ id: z.string().min(1) }),
});

export const listProductsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(24),
    category: z.string().optional(),
    collection: z.string().optional(),
    metalType: z.string().optional(),
    priceMode: z.string().optional(),
    priceMin: z.coerce.number().optional(),
    priceMax: z.coerce.number().optional(),
    availabilityStatus: z.string().optional(),
    sort: z.enum(['newest', 'price_asc', 'price_desc', 'name_asc']).default('newest'),
    search: z.string().optional(),
    isFeatured: z.preprocess((val) => val === 'true' || val === true ? true : val === 'false' || val === false ? false : undefined, z.boolean().optional()),
    featured: z.preprocess((val) => val === 'true' || val === true ? true : val === 'false' || val === false ? false : undefined, z.boolean().optional()),
  }),
});
