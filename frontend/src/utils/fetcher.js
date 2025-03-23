import axios from "axios";
import * as Sentry from "@sentry/react";

// Get the base URL based on environment
const getBaseUrl = () => {
  // Use environment variable or fallback to relative path in production
  const apiUrl = import.meta.env.VITE_API_URL;

  if (import.meta.env.PROD) {
    // In production, if no API URL is specified, use relative path (Nginx will handle proxying)
    return "http://68.183.58.119:8000/";
  }

  // In development, use the local backend URL if no API URL is specified
  return apiUrl || "http://localhost:8000";
};

// Create an axios instance with the base URL
const fetcher = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  // Add timeout
  timeout: 10000,
});

// Add response interceptor for error handling
fetcher.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      Sentry.captureException(error, {
        tags: {
          type: "network_error",
        },
      });
      return Promise.reject(
        new Error("Network error - please check your connection")
      );
    }

    // Handle timeout errors
    if (error.code === "ECONNABORTED") {
      Sentry.captureException(error, {
        tags: {
          type: "timeout_error",
        },
      });
      return Promise.reject(new Error("Request timed out - please try again"));
    }

    // Handle API errors
    const message =
      error.response.data?.detail || error.message || "An error occurred";

    Sentry.captureException(error, {
      tags: {
        type: "api_error",
        status: error.response.status,
      },
      extra: {
        response: error.response.data,
      },
    });

    return Promise.reject(new Error(message));
  }
);

// Export common API methods with better error handling
export const api = {
  getScreener: async () => {
    try {
      const response = await fetcher.get("/api/screener/");
      return response;
    } catch (error) {
      console.error("Failed to fetch screener:", error);
      throw error;
    }
  },

  submitScreener: async (answers) => {
    try {
      const response = await fetcher.post("/api/screener/submit", { answers });
      return response;
    } catch (error) {
      console.error("Failed to submit screener:", error);
      throw error;
    }
  },
};

export default fetcher;
