export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
  },
  parking: {
    levels: '/api/parking/levels',
    spots: '/api/parking/spots',
    updateStatus: (spotId) => `/api/parking/spots/${spotId}/status`,
    assignSpot: (spotId) => `/api/parking/spots/${spotId}/assign`,
  },
};
