import { API_ENDPOINTS } from '../config/api';
import { apiRequest } from '../config/apiClient';

export async function getParkingLevels() {
  return apiRequest(API_ENDPOINTS.parking.levels);
}

export async function getParkingSpots() {
  return apiRequest(API_ENDPOINTS.parking.spots);
}

export async function updateSpotStatus(spotId, status) {
  return apiRequest(API_ENDPOINTS.parking.updateStatus(spotId), {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

export async function assignSpot(spotId, assignedTo) {
  return apiRequest(API_ENDPOINTS.parking.assignSpot(spotId), {
    method: 'PUT',
    body: JSON.stringify({ assignedTo }),
  });
}
