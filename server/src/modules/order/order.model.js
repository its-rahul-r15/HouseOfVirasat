import mongoose from 'mongoose';
import { ORDER_STATUS, FULFILMENT_STATUS, REFERENCE_PREFIXES } from '../../config/constants.js';

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  line1: { type: String, required: true },
  line2: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, default: 'India' },
  phone: String,
}, { _id: false });

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variantId: mongoose.Schema.Types.ObjectId,
  sku: { type: String, required: true },
  name: String,
  qty: { type: Number, required: true, min: 1 },
  priceAtPurchase: { type: Number, required: true },
  priceMode: String,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  referenceNumber: { type: String, unique: true },

  customer: {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    guestCheckout: { type: Boolean, default: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },

  shippingAddress: { type: addressSchema, required: true },
  billingAddress: addressSchema,

  items: { type: [orderItemSchema], required: true },

  paymentStatus: {
    type: String,
    enum: Object.values(ORDER_STATUS),
    default: ORDER_STATUS.PENDING,
  },
  fulfilmentStatus: {
    type: String,
    enum: Object.values(FULFILMENT_STATUS),
    default: FULFILMENT_STATUS.CONFIRMED,
  },

  paymentGatewayRef: String,
  razorpayOrderId: String,
  invoiceNumber: String,

  couponCode: String,
  discountApplied: { type: Number, default: 0 },
  shippingCharge: { type: Number, default: 0 },
  subtotal: { type: Number, required: true },
  total: { type: Number, required: true },

  trackingLink: String,
  courierPartner: String,
  shiprocketOrderId: String,

  // Soft-hold expiry — auto-released by cron if payment never confirmed
  reservedUntil: Date,

  notes: String,
  adminNotes: [{ note: String, addedBy: String, addedAt: { type: Date, default: Date.now } }],
}, {
  timestamps: true,
});

orderSchema.pre('save', async function () {
  if (this.isNew && !this.referenceNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Order').countDocuments();
    this.referenceNumber = `${REFERENCE_PREFIXES.ORDER}-${year}-${String(count + 1).padStart(5, '0')}`;
  }
});

orderSchema.index({ 'customer.email': 1 });
orderSchema.index({ paymentStatus: 1, createdAt: -1 });
orderSchema.index({ fulfilmentStatus: 1 });
orderSchema.index({ reservedUntil: 1 }, { sparse: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
