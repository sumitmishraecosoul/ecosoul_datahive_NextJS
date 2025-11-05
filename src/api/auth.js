import api from './api';

// Login user and return backend payload
export const login = async ({ email, password }) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

// Logout user (if backend supports invalidation)
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (err) {
    // Ignore logout errors to avoid blocking client cleanup
  }
};

export default { login, logout };


