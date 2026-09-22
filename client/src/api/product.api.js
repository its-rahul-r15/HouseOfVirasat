import axiosClient from './axiosClient';

export const productApi = {
  getProducts: (params = {}) => axiosClient.get('/products', { params }),
  getProductByHandle: (handle) => axiosClient.get(`/products/${handle}`),
  getCategories: () => axiosClient.get('/categories'),
  getCategoryBySlug: (slug) => axiosClient.get(`/categories/${slug}`),
  getCollections: () => axiosClient.get('/collections'),
  getCollectionBySlug: (slug) => axiosClient.get(`/collections/${slug}`),
  uploadImages: (formData) =>
    axiosClient.post('/products/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
