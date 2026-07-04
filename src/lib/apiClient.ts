// Basic fetch wrappers for Custom Go Backend

const API_URL = 'http://localhost:8080/api'; // Adjust port if necessary

const getHeaders = () => {
  const token = localStorage.getItem('toolva_token');
  const headers = new Headers({
    'Content-Type': 'application/json',
  });
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  return headers;
};

export const api = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  },
  post: async (endpoint: string, body: any) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `API Error: ${response.statusText}`);
    }
    return response.json();
  },
  delete: async (endpoint: string) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  }
};
