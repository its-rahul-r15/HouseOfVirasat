import mongoose from 'mongoose';
import { BESPOKE_STATUS, REFERENCE_PREFIXES } from '../../config/constants.js';

const bespokeSchema = new mongoose.Schema({
  referenceNumber: { type: String, unique: true },

  contact: {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    city: String,
  },

  jewelleryType: String,
  metalPreference: String,
  karatPreference: [{ type: String, enum: ['9K', '14K', '18K', '22K'] }],
  stonePreference: String,
  budgetRange: String,
  occasion: String,
  timeline: String,
  designBrief: String,
  referenceImages: [String],

  preferredContactMethod: { type: String, enum: ['PHONE', 'EMAIL', 'WHATSAPP'] },
  appointmentRequested: { type: Boolean, default: false },

  status: {
    type: String,
    enum: Object.values(BESPOKE_STATUS),
    default: BESPOKE_STATUS.NEW,
  },

  crmHandoffNotes: [{ note: String, addedBy: String, addedAt: { type: Date, default: Date.now } }],
}, {
  timestamps: true,
});

bespokeSchema.pre('save', async function () {
  if (this.isNew && !this.referenceNumber) {
    const now = new Date();
    const yyyymm = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const count = await mongoose.model('BespokeEnquiry').countDocuments();
    this.referenceNumber = `${REFERENCE_PREFIXES.BESPOKE}-${yyyymm}-${String(count + 1).padStart(4, '0')}`;
  }
});

bespokeSchema.index({ status: 1, createdAt: -1 });

const BespokeEnquiry = mongoose.model('BespokeEnquiry', bespokeSchema);
export default BespokeEnquiry;
