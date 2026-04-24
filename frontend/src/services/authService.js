import { API_ENDPOINTS } from '../config/api';
import { mockUsers } from '../data/mockParkingData';

const simulateDelay = (value) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(value), 350);
  });

export async function login(credentials) {
  const role =
    credentials.email?.toLowerCase().includes('admin') ||
    credentials.role === 'ADMIN'
      ? 'admin'
      : 'user';

  return simulateDelay({
    token: 'mock-jwt-token',
    user: mockUsers[role],
    route: API_ENDPOINTS.auth.login,
  });
}

export async function logout() {
  return simulateDelay(true);
}
