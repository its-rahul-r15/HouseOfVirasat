import axiosClient from './axiosClient';

export const orderApi = {
  checkout: (data) => axiosClient.post('/orders/checkout', data),
  getOrderStatus: (ref) => axiosClient.get(`/orders/${ref}/status`),
  verifyPayment: (data) => axiosClient.post('/orders/verify-payment', data),
  markPaymentFailed: (data) => axiosClient.post('/orders/payment-failed', data),
  getMyOrders: () => axiosClient.get('/orders/my-orders'),
};
