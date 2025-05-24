// Use environment variables for API URL
export const API_URL = import.meta.env.VITE_API_URL || 'https://api.test.soss.site';

export const getApiUrl = (path: string) => {
  return `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
}; 