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
      role: credentials.role?.toLowerCase() || 'user',
    },
    message: response.message,
  };
}

export async function logout() {
  return true;
}
