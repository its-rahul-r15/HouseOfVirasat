import axiosClient from './axiosClient';

export const newsletterApi = {
  // Public — subscribe with email
  subscribe: (data) => axiosClient.post('/newsletter/subscribe', data),

  // Admin — get all subscribers (paginated)
  getSubscribers: (params = {}) => axiosClient.get('/newsletter', { params }),

  // Admin — unsubscribe/remove a subscriber
  unsubscribe: (id) => axiosClient.delete(`/newsletter/${id}`),
};
