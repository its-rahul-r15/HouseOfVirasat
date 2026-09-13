import mongoose from 'mongoose';
import { MTO_STATUS, REFERENCE_PREFIXES } from '../../config/constants.js';

const mtoSchema = new mongoose.Schema({
  referenceNumber: { type: String, unique: true },

  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: String,
  productSku: String,

  customer: {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
  },

  selectedVariant: String,
  preferences: String,
  pricingMode: String,

  quotedPrice: Number,
  depositAmount: Number,
  depositPercent: Number,

  status: {
    type: String,
    enum: Object.values(MTO_STATUS),
    default: MTO_STATUS.SUBMITTED,
  },

  adminSpecNotes: [{ note: String, addedBy: String, addedAt: { type: Date, default: Date.now } }],
}, {
  timestamps: true,
});

mtoSchema.pre('save', async function (next) {
  if (this.isNew && !this.referenceNumber) {
    const now = new Date();
    const yyyymm = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const count = await mongoose.model('MtoRequest').countDocuments();
    this.referenceNumber = `${REFERENCE_PREFIXES.MTO}-${yyyymm}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

mtoSchema.index({ status: 1, createdAt: -1 });
mtoSchema.index({ 'customer.email': 1 });

const MtoRequest = mongoose.model('MtoRequest', mtoSchema);
export default MtoRequest;
