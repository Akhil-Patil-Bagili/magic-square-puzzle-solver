// dev/frontend/src/apiConfig.js
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  register: `${API_BASE_URL}/api/users/register`,
  login: `${API_BASE_URL}/api/users/login`,
  profile: `${API_BASE_URL}/api/users/me`,
  update: `${API_BASE_URL}/api/users/update`,
  puzzleGenerate: `${API_BASE_URL}/api/puzzle/generate`,
  check: `${API_BASE_URL}/api/magic-square/check`,
  solution: `${API_BASE_URL}/api/puzzle/solution`,
  hintsMagicSum: `${API_BASE_URL}/api/hints/magic-sum`,
  hintsPartialSolution: `${API_BASE_URL}/api/hints/partial-solution`,
  // ... add any other endpoints you need here
};
