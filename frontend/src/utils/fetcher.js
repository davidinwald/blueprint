import axios from "axios";

// Get the base URL based on environment
const getBaseUrl = () => {
  if (import.meta.env.PROD) {
    // In production, use the window.location.origin
    return "http://68.183.58.119:8000/";
  }
  // In development, use the local backend URL
  return "http://127.0.0.1:8000";
};

// Create an axios instance with the base URL
const fetcher = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for error handling
fetcher.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      return Promise.reject(
        new Error("Network error - please check your connection")
      );
    }

    // Handle API errors
    const message =
      error.response.data?.detail || error.message || "An error occurred";
    return Promise.reject(new Error(message));
  }
);

// Export common API methods
export const api = {
  getScreener: () => fetcher.get("/api/screener/"),
  submitScreener: (answers) =>
    fetcher.post("/api/screener/submit", { answers }),
};

export default fetcher;
