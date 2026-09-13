import axiosClient from './axiosClient';

export const bespokeApi = {
  submitEnquiry: (formData) => {
    return axiosClient.post('/bespoke', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getStatus: (ref) => axiosClient.get(`/bespoke/${ref}/status`),
  getMyBespoke: () => axiosClient.get('/bespoke/my-enquiries'),
};
