// dev/frontend/src/apiConfig.js
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  register: `${API_BASE_URL}/api/users/register`,
  login: `${API_BASE_URL}/api/users/login`,
  profile: `${API_BASE_URL}/api/users/me`,
  update: `${API_BASE_URL}/api/users/update`,
  puzzle: `${API_BASE_URL}/api/puzzle`,
  check: `${API_BASE_URL}/api/magic-square/check`
};
