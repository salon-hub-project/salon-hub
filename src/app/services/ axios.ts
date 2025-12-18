import axios from 'axios';
import config from '../config';

const api = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

/* REQUEST INTERCEPTOR → attach token */
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

/* RESPONSE INTERCEPTOR → handle global errors */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';

    // Auto logout on 401
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      window.location.href = '/login';
    }

    return Promise.reject(message);
  }
);

export default api;
