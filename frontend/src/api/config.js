const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
};
