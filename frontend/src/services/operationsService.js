import { API_ENDPOINTS } from '../config/api';
import { apiRequest } from '../config/apiClient';

function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getSummary() {
  return apiRequest(API_ENDPOINTS.operations.summary);
}

export async function getAdmins() {
  return apiRequest(API_ENDPOINTS.operations.admins);
}

export async function getLots() {
  return apiRequest(API_ENDPOINTS.operations.lots);
}

export async function getRegisteredSpots() {
  return apiRequest(API_ENDPOINTS.operations.registeredSpots);
}

export async function getReservations() {
  return apiRequest(API_ENDPOINTS.operations.reservations);
}

export async function getMyReservations(token) {
  return apiRequest(API_ENDPOINTS.operations.myReservations, {
    headers: authHeaders(token),
  });
}

export async function getDisabilityVerifications() {
  return apiRequest(API_ENDPOINTS.operations.disabilityVerifications);
}

export async function getMyDisabilityVerification(token) {
  return apiRequest(API_ENDPOINTS.operations.myDisabilityVerification, {
    headers: authHeaders(token),
  });
}

export async function submitDisabilityVerification(token, documentUrl) {
  return apiRequest(API_ENDPOINTS.operations.myDisabilityVerification, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ documentUrl }),
  });
}
