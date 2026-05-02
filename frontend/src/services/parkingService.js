import { API_ENDPOINTS } from '../config/api';
import { parkingLevels, parkingSpots } from '../data/mockParkingData';

const clone = (value) => JSON.parse(JSON.stringify(value));

let mockSpots = clone(parkingSpots);

const simulateDelay = (value) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(clone(value)), 250);
  });

export async function getParkingLevels() {
  // Replace with apiRequest(API_ENDPOINTS.parking.levels) when Spring Boot is ready.
  return simulateDelay({
    endpoint: API_ENDPOINTS.parking.levels,
    levels: parkingLevels,
  });
}

export async function getParkingSpots() {
  // Replace with apiRequest(API_ENDPOINTS.parking.spots) when Spring Boot is ready.
  return simulateDelay({
    endpoint: API_ENDPOINTS.parking.spots,
    spots: mockSpots,
  });
}

export async function updateSpotStatus(spotId, status) {
  mockSpots = mockSpots.map((spot) =>
    spot.id === spotId ? { ...spot, status } : spot,
  );

  return simulateDelay({
    endpoint: API_ENDPOINTS.parking.updateStatus(spotId),
    success: true,
    spot: mockSpots.find((spot) => spot.id === spotId),
  });
}

export async function assignSpot(spotId, assignedTo) {
  mockSpots = mockSpots.map((spot) =>
    spot.id === spotId
      ? { ...spot, assignedTo, status: assignedTo ? 'reserved' : 'available' }
      : spot,
  );

  return simulateDelay({
    endpoint: API_ENDPOINTS.parking.assignSpot(spotId),
    success: true,
    spot: mockSpots.find((spot) => spot.id === spotId),
  });
}
