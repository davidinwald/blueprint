import axios from "axios";
import { apiConfig } from "./config";

const api = axios.create(apiConfig);

export const healthCheck = async () => {
  try {
    const response = await api.get("/api/health");
    return response.data;
  } catch (error) {
    console.error("Health check failed:", error);
    throw error;
  }
};

export default api;
