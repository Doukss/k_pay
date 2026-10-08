import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('keurguipay-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !/\/auth\/(login|register)/.test(error.config?.url || '')) {
      localStorage.removeItem('keurguipay-token');
      window.dispatchEvent(new Event('keurguipay:unauthorized'));
    }
    const responseData = error.response?.data;
    const validationDetails = Array.isArray(responseData?.details)
      ? responseData.details
          .map((detail: { field?: string; message?: string }) =>
            [detail.field, detail.message].filter(Boolean).join(' : '),
          )
          .filter(Boolean)
          .join(', ')
      : '';
    const message = [responseData?.message, validationDetails]
      .filter(Boolean)
      .join(' — ');
    return Promise.reject(new Error(message || error.message || 'Erreur serveur'));
  },
);
