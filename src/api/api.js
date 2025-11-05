import axios from 'axios';
import DEV_URL from '../config/config.js';

// Ensure axios sends cookies with requests (for cookie-based auth)
axios.defaults.withCredentials = true;

// Create axios instance with base configuration
const api = axios.create({
  baseURL: DEV_URL,
  timeout: 50000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header with token from localStorage
api.interceptors.request.use(
  (config) => {
    // Only attach token on client-side (SSR-safe)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Do not globally redirect on 401 to avoid kicking users out during non-auth data fetches.
    // Let callers handle errors and show UI messages instead.
    return Promise.reject(error);
  }
);

export default api;
