export const API_URL = process.env.VITE_API_URL || 'http://api.test.soss.site';

export const getApiUrl = (path: string) => {
  return `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
}; 