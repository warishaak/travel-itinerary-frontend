const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = localStorage.getItem("access_token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    // Don't redirect for login attempts—let the Login component show the error
    if (!url.includes("/api/auth/token/")) {
      window.location.href = "/login";
      return;
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw errorData;
  }

  return response.json();
}

export const api = {
  auth: {
    login: async (email, password) => {
      return request("/api/auth/token/", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
    },
    register: async (
      email,
      password,
      passwordConfirm,
      firstName = "",
      lastName = "",
    ) => {
      return request("/api/auth/register/", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          password_confirm: passwordConfirm,
          first_name: firstName,
          last_name: lastName,
        }),
      });
    },
    me: async () => {
      return request("/api/auth/me/");
    },
    updateProfile: async (data) => {
      return request("/api/auth/me/", {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
  },
  itineraries: {
    list: async () => {
      return request("/api/itineraries/my/");
    },
    listPublic: async () => {
      return request("/api/itineraries/public/");
    },
    get: async (id) => {
      return request(`/api/itineraries/my/${id}/`);
    },
    create: async (data) => {
      return request("/api/itineraries/my/", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    update: async (id, data) => {
      return request(`/api/itineraries/my/${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    delete: async (id) => {
      return request(`/api/itineraries/my/${id}/`, {
        method: "DELETE",
      });
    },
  },
};
