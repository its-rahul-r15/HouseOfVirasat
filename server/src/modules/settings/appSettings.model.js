import mongoose from 'mongoose';

const appSettingsSchema = new mongoose.Schema({
  _singleton: { type: String, default: 'settings', unique: true },

  whatsappNumber: { type: String, default: '' },
  announcementText: { type: String, default: 'Free insured shipping on all orders above ₹5,000 · BIS Hallmarked 925 Silver & 18K Gold' },

  codEnabled: { type: Boolean, default: false },
  codMinOrderValue: { type: Number, default: 0 },
  codMaxOrderValue: { type: Number, default: 50000 },

  guestCheckoutEnabled: { type: Boolean, default: true },

  paymentGatewayMode: { type: String, enum: ['test', 'live'], default: 'test' },

  gstNumber: { type: String, default: '' },
  gstRate: { type: Number, default: 3 },
  invoicePrefix: { type: String, default: 'HOV-INV' },
  invoiceCounter: { type: Number, default: 1 },

  freeShippingThreshold: { type: Number, default: 5000 },

  socialLinks: {
    instagram: String,
    facebook: String,
    pinterest: String,
    youtube: String,
  },

  metaPixelId: String,
  ga4MeasurementId: String,
}, {
  timestamps: true,
});

const AppSettings = mongoose.model('AppSettings', appSettingsSchema);

export async function getSettings() {
  let settings = await AppSettings.findOne({ _singleton: 'settings' });
  if (!settings) {
    settings = await AppSettings.create({});
  }
  return settings;
}

export default AppSettings;
