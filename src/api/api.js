import axios from 'axios';

// Ensure axios sends cookies with requests (for cookie-based auth)
axios.defaults.withCredentials = true;

// Custom params serializer to handle arrays as repeated query parameters
const paramsSerializer = (params) => {
  const parts = [];
  
  Object.keys(params).forEach((key) => {
    const value = params[key];
    
    if (Array.isArray(value)) {
      // For arrays, repeat the key for each value: key=value1&key=value2
      value.forEach((item) => {
        if (item !== null && item !== undefined && item !== '') {
          parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(item)}`);
        }
      });
    } else if (value !== null && value !== undefined && value !== '') {
      // Single value
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  });
  
  return parts.join('&');
};

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  timeout: 50000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: paramsSerializer,
});

// Helper function to clean and format filter parameters
const cleanParams = (params) => {
  if (!params || typeof params !== 'object') return {};
  
  const cleaned = {};
  Object.keys(params).forEach((key) => {
    const value = params[key];
    
    // Skip null, undefined, and empty strings
    if (value === null || value === undefined || value === '') {
      return;
    }
    
    // Handle arrays
    if (Array.isArray(value)) {
      // Filter out empty values from array
      const filtered = value.filter(v => v !== null && v !== undefined && v !== '');
      if (filtered.length > 0) {
        cleaned[key] = filtered;
      }
    } else {
      // Single value
      cleaned[key] = value;
    }
  });
  
  return cleaned;
};

// Attach Authorization header with token from localStorage and clean params
api.interceptors.request.use(
  (config) => {
    // Only attach token on client-side (SSR-safe)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Clean params to remove empty values and handle arrays
    if (config.params) {
      config.params = cleanParams(config.params);
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
