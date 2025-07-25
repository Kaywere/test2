
export const API_URL = import.meta.env.SECRET_API_URL;


export const getApiUrl = (path: string) => {
  return `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
}; 