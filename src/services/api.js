import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
});

const getAccessToken = () => {
  const namespacedToken = localStorage.getItem("appAuthentication.access_token");
  if (namespacedToken) {
    try {
      return JSON.parse(namespacedToken);
    } catch {
      return namespacedToken;
    }
  }
  return localStorage.getItem("access_token");
};

// Add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const login = async (email, password) => {
  const response = await api.post("/auth/token/", { email, password });
  return response.data;
};

export const register = async (email, password, firstName = "", lastName = "") => {
  const response = await api.post("/auth/register/", {
    email,
    password,
    password_confirm: password,
    first_name: firstName,
    last_name: lastName,
  });
  return response.data;
};

export const refreshToken = async (refreshToken) => {
  const response = await api.post("/auth/token/refresh/", {
    refresh: refreshToken,
  });
  return response.data;
};

export const createItinerary = async (data) => {
  const response = await api.post("/itineraries/my/", data);
  return response.data;
};

export const getItineraries = async () => {
  const response = await api.get("/itineraries/my/");
  return response.data;
};

// API object with structured methods
export const apiClient = {
  itineraries: {
    get: async (id) => {
      const response = await api.get(`/itineraries/my/${id}/`);
      return response.data;
    },
    getAll: async () => {
      const response = await api.get("/itineraries/my/");
      return response.data;
    },
    create: async (data) => {
      const response = await api.post("/itineraries/my/", data);
      return response.data;
    },
    update: async (id, data) => {
      const response = await api.put(`/itineraries/my/${id}/`, data);
      return response.data;
    },
    delete: async (id) => {
      const response = await api.delete(`/itineraries/my/${id}/`);
      return response.data;
    },
  },
};

export default api;
