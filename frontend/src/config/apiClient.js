import { API_BASE_URL } from './api';

async function parseResponse(response) {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');

  if (!response.ok) {
    if (isJson) {
      const errorBody = await response.json();
      throw new Error(errorBody.error || `Request failed with status ${response.status}`);
    }

    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  if (isJson) {
    return response.json();
  }

  return response.text();
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  return parseResponse(response);
}
