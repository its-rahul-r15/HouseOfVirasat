import AppSettings, { getSettings } from './appSettings.model.js';
import ShippingRule from './shippingRule.model.js';
import { ApiError } from '../../lib/ApiError.js';

// App Settings
export async function getPublicSettings() {
  const settings = await getSettings();
  return {
    whatsappNumber: settings.whatsappNumber,
    announcementText: settings.announcementText || 'Free insured shipping on all orders above ₹5,000 · BIS Hallmarked 925 Silver & 18K Gold',
    codEnabled: settings.codEnabled,
    codMinOrderValue: settings.codMinOrderValue,
    codMaxOrderValue: settings.codMaxOrderValue,
    guestCheckoutEnabled: settings.guestCheckoutEnabled,
    freeShippingThreshold: settings.freeShippingThreshold,
    socialLinks: settings.socialLinks,
    gstRate: settings.gstRate,
  };
}

export async function getAllSettings() {
  return getSettings();
}

export async function updateSettings(data) {
  let settings = await AppSettings.findOne({ _singleton: 'settings' });
  if (!settings) {
    settings = new AppSettings({ _singleton: 'settings' });
  }

  Object.assign(settings, data);
  await settings.save();
  return settings;
}

// Shipping Rules
export async function listShippingRules(admin = false) {
  const filter = admin ? {} : { isActive: true };
  return ShippingRule.find(filter).sort({ sortOrder: 1, charge: 1 });
}

export async function createShippingRule(data) {
  return ShippingRule.create(data);
}

export async function updateShippingRule(id, data) {
  const rule = await ShippingRule.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!rule) {
    throw ApiError.notFound('Shipping rule not found');
  }
  return rule;
}

export async function deleteShippingRule(id) {
  const rule = await ShippingRule.findByIdAndDelete(id);
  if (!rule) {
    throw ApiError.notFound('Shipping rule not found');
  }
  return { id };
}
