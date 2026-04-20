const DEFAULT_API_URL = "http://localhost:3000";
const RAW_API_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;
const API_BASE_URL = RAW_API_URL.replace(/\/+$/, "");

export const apiUrl = (path = "") => {
  if (!path) return API_BASE_URL;
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};
