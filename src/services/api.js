import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const login = async (username, password) => {
  const response = await api.post("/token/", { username, password });
  return response.data;
};

export const register = async (username, email, password) => {
  const response = await api.post("/register/", {
    username,
    email,
    password,
  });
  return response.data;
};

export const refreshToken = async (refreshToken) => {
  const response = await api.post("/token/refresh/", {
    refresh: refreshToken,
  });
  return response.data;
};

export const createItinerary = async (data) => {
  const response = await api.post("/itineraries/", data);
  return response.data;
};

export const getItineraries = async () => {
  const response = await api.get("/itineraries/");
  return response.data;
};

// API object with structured methods
export const apiClient = {
  itineraries: {
    get: async (id) => {
      const response = await api.get(`/itineraries/${id}/`);
      return response.data;
    },
    getAll: async () => {
      const response = await api.get("/itineraries/");
      return response.data;
    },
    create: async (data) => {
      const response = await api.post("/itineraries/", data);
      return response.data;
    },
    update: async (id, data) => {
      const response = await api.put(`/itineraries/${id}/`, data);
      return response.data;
    },
    delete: async (id) => {
      const response = await api.delete(`/itineraries/${id}/`);
      return response.data;
    },
  },
};

export default api;
