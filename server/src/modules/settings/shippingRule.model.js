import mongoose from 'mongoose';

const shippingRuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  zone: { type: String, required: true },
  charge: { type: Number, required: true, min: 0 },
  freeThreshold: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, {
  timestamps: true,
});

const ShippingRule = mongoose.model('ShippingRule', shippingRuleSchema);
export default ShippingRule;
