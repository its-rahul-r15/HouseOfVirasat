import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api/v1';

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hov_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const data = error.response?.data;
    let message = data?.message || error.message || 'Something went wrong';
    if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      const details = data.errors
        .map((e) => (typeof e === 'string' ? e : `${e.field ? `${e.field}: ` : ''}${e.message}`))
        .join('; ');
      message = `${message} — ${details}`;
    }
    const customError = new Error(message);
    customError.response = error.response;
    customError.status = error.response?.status;
    customError.errors = data?.errors;
    return Promise.reject(customError);
  }
);

export default axiosClient;
