import mongoose from 'mongoose';
import {
  PRODUCT_STATUS,
  PRICE_MODE,
  METAL_TYPE,
  PURITY,
  STONE_TYPE,
} from '../../config/constants.js';

const stoneSchema = new mongoose.Schema({
  type: { type: String, enum: Object.values(STONE_TYPE) },
  weight: Number,
  count: Number,
  colour: String,
  clarity: String,
  cut: String,
  certification: String,
}, { _id: false });

const variantSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  ringSize: String,
  bangleSize: String,
  necklaceLength: String,
  dimensions: String,
  stockQty: { type: Number, default: 0, min: 0 },
});

const galleryImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  altText: String,
}, { _id: false });

const productSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true, trim: true },
  designCode: { type: String, trim: true },
  name: { type: String, required: true, trim: true },
  shortDescription: String,
  fullDescription: String,

  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: String,
  collection: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }],
  tags: [String],

  priceMode: {
    type: String,
    enum: Object.values(PRICE_MODE),
    required: true,
    default: PRICE_MODE.FIXED,
  },
  mrp: { type: Number, min: 0 },
  sellingPrice: { type: Number, min: 0 },
  compareAtPrice: { type: Number, min: 0 },
  taxSetting: { type: Number, default: 3 },
  stockQuantity: { type: Number, default: 0, min: 0 },
  availabilityStatus: {
    type: String,
    enum: Object.values(PRODUCT_STATUS),
    default: PRODUCT_STATUS.IN_STOCK,
  },
  madeToOrderAllowed: { type: Boolean, default: false },
  leadTimeDays: { type: Number, default: 21 },

  metalType: { type: String, enum: Object.values(METAL_TYPE) },
  purity: { type: String, enum: Object.values(PURITY) },
  netWeight: Number,
  grossWeight: Number,
  finish: String,

  stones: [stoneSchema],
  variants: [variantSchema],

  heroImage: String,
  gallery: [galleryImageSchema],
  video: String,
  wornImage: String,

  dispatchTimeInStock: String,
  shippingRestrictions: [String],

  customisable: { type: Boolean, default: false },
  allowedCustomisations: [String],
  customisationNotes: String,

  returnEligible: { type: Boolean, default: false },
  exchangeEligible: { type: Boolean, default: false },

  seoTitle: String,
  metaDescription: String,
  urlHandle: { type: String, required: true, unique: true, lowercase: true, trim: true },
  structuredDataOverride: mongoose.Schema.Types.Mixed,

  // Internal — never exposed via public API
  supplierRef: String,
  batchRef: String,
  costPrice: Number,

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  archivedAt: Date,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
});

// Auto-transition status when stock changes
productSchema.pre('save', function () {
  if (!this.isModified('stockQuantity')) return;

  if (this.stockQuantity > 0) {
    this.availabilityStatus = PRODUCT_STATUS.IN_STOCK;
  } else if (this.madeToOrderAllowed) {
    this.availabilityStatus = PRODUCT_STATUS.MADE_TO_ORDER;
  } else {
    this.availabilityStatus = PRODUCT_STATUS.SOLD_OUT;
  }
});

productSchema.index({ category: 1, availabilityStatus: 1 });
productSchema.index({ collection: 1 });
productSchema.index({ metalType: 1, priceMode: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ createdAt: -1 });

// Strip internal fields for public consumption
productSchema.methods.toPublicJSON = function () {
  const obj = this.toObject({ virtuals: true });

  delete obj.costPrice;
  delete obj.supplierRef;
  delete obj.batchRef;

  // Remove null/empty values from top level
  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    if (val === null || val === undefined || val === '') delete obj[key];
    if (Array.isArray(val) && val.length === 0) delete obj[key];
  });

  return obj;
};

const Product = mongoose.model('Product', productSchema);
export default Product;
