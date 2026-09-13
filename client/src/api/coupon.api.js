import axiosClient from './axiosClient';

export const couponApi = {
  validateCoupon: (data) => axiosClient.post('/coupons/validate', data),
};
