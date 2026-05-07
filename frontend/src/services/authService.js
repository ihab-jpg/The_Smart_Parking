import { API_ENDPOINTS } from '../config/api';
import { apiRequest } from '../config/apiClient';

export async function login(credentials) {
  const response = await apiRequest(API_ENDPOINTS.auth.login, {
    method: 'POST',
    body: JSON.stringify({
      usernameOrEmail: credentials.email,
      password: credentials.password,
    }),
  });

  return {
    token: response.token,
    user: {
      id: response.userId,
      username: response.username,
      fullName: response.fullName || response.username,
      role: credentials.role || 'USER',
    },
    message: response.message,
  };
}

export async function register(details) {
  const response = await apiRequest(API_ENDPOINTS.auth.register, {
    method: 'POST',
    body: JSON.stringify({
      username: details.username,
      email: details.email,
      password: details.password,
      fullName: details.fullName,
      phoneNumber: details.phoneNumber || null,
      licensePlate: details.licensePlate,
      preferences: {
        role: 'USER',
        nearEntrance: details.nearEntrance,
        accessibleParking: details.accessibleParking,
      },
    }),
  });

  return {
    token: response.token,
    user: {
      id: response.userId,
      username: response.username,
      fullName: response.fullName || details.fullName,
      role: 'USER',
    },
    message: response.message,
  };
}

export async function logout() {
  return true;
}
