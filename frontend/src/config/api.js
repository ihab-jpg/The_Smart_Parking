export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    profile: '/api/auth/profile',
  },
  parking: {
    levels: '/api/parking/levels',
    spots: '/api/parking/spots',
    updateStatus: (spotId) => `/api/parking/spots/${spotId}/status`,
    assignSpot: (spotId) => `/api/parking/spots/${spotId}/assign`,
    bulkStatus: '/api/parking/spots/bulk-status',
  },
  operations: {
    summary: '/api/operations/summary',
    admins: '/api/operations/admins',
    lots: '/api/operations/lots',
    registeredSpots: '/api/operations/registered-spots',
    reservations: '/api/operations/reservations',
    myReservations: '/api/operations/me/reservations',
    disabilityVerifications: '/api/operations/disability-verifications',
    myDisabilityVerification: '/api/operations/me/disability-verification',
  },
};
