import axiosClient from './axiosClient';

export const mtoApi = {
  createMtoRequest: (data) => axiosClient.post('/mto', data),
  getMtoStatus: (ref) => axiosClient.get(`/mto/${ref}/status`),
};
