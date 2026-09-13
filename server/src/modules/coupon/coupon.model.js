import mongoose from 'mongoose';
import { COUPON_TYPE } from '../../config/constants.js';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  type: { type: String, enum: Object.values(COUPON_TYPE), required: true },
  value: { type: Number, required: true, min: 0 },
  minOrderValue: { type: Number, default: 0 },
  maxDiscountAmount: Number,
  usageLimit: { type: Number, default: 1 },
  usedCount: { type: Number, default: 0 },
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },
  applicableCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

couponSchema.methods.isValid = function (orderValue) {
  const now = new Date();
  if (!this.isActive) return { valid: false, reason: 'Coupon is not active' };
  if (now < this.validFrom) return { valid: false, reason: 'Coupon is not yet valid' };
  if (now > this.validTo) return { valid: false, reason: 'Coupon has expired' };
  if (this.usedCount >= this.usageLimit) return { valid: false, reason: 'Coupon usage limit reached' };
  if (orderValue < this.minOrderValue) {
    return { valid: false, reason: `Minimum order value of ₹${this.minOrderValue} required` };
  }
  return { valid: true };
};

couponSchema.methods.calculateDiscount = function (orderValue) {
  if (this.type === COUPON_TYPE.PERCENT) {
    const discount = (orderValue * this.value) / 100;
    return this.maxDiscountAmount ? Math.min(discount, this.maxDiscountAmount) : discount;
  }
  return Math.min(this.value, orderValue);
};

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
