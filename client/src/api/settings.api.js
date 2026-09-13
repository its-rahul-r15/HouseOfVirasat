import axiosClient from './axiosClient';

export const settingsApi = {
  getPublicSettings: () => axiosClient.get('/settings/public'),
  getShippingRules: () => axiosClient.get('/settings/shipping-rules/active'),
};
