// Use proxy endpoint for API URL
export const API_URL = '/api/proxy';

export const getApiUrl = (path: string) => {
  return `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
}; 