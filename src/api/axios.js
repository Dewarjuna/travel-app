import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://travel-journal-api-bootcamp.do.dibimbing.id';
const API_KEY = import.meta.env.VITE_API_KEY;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json', apiKey: API_KEY,
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      try {
        localStorage.removeItem('token');
        if (typeof window !== 'undefined') {
          // Emit an event so the React app can handle SPA navigation to login
          window.dispatchEvent(new CustomEvent('app:unauthorized'));
        }
      } catch (e) {
        // fallback to full reload if event dispatching fails
        if (location.pathname !== '/login') location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;