const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

let storageUnavailable = false;

function safeGetItem(key) {
  if (storageUnavailable || typeof window === "undefined") {
    return null;
  }
  try {
    return window.localStorage.getItem(key);
  } catch {
    storageUnavailable = true;
    return null;
  }
}

function safeRemoveItem(key) {
  if (storageUnavailable || typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(key);
  } catch {
    storageUnavailable = true;
    // Ignore storage errors in restricted browser contexts.
  }
}

async function parseResponseBody(response) {
  // 204/205 responses have no response body by definition.
  if (response.status === 204 || response.status === 205) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  const text = await response.text();
  return text ? { detail: text } : null;
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = safeGetItem("access_token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    safeRemoveItem("access_token");
    safeRemoveItem("refresh_token");
    // Don't redirect for login attempts—let the Login component show the error
    if (!url.includes("/api/auth/token/")) {
      window.location.href = "/login";
      return;
    }
  }

  if (!response.ok) {
    const errorData = (await parseResponseBody(response)) || {};
    if (errorData && typeof errorData === "object") {
      throw { status: response.status, ...errorData };
    }
    throw {
      status: response.status,
      detail: String(errorData || "Request failed"),
    };
  }

  return parseResponseBody(response);
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
    requestPasswordReset: async (email) => {
      return request("/api/auth/password-reset/request/", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    },
    confirmPasswordReset: async (token, password, passwordConfirm) => {
      return request("/api/auth/password-reset/confirm/", {
        method: "POST",
        body: JSON.stringify({
          token,
          password,
          password_confirm: passwordConfirm,
        }),
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
    updateStatus: async (id, status) => {
      return request(`/api/itineraries/my/${id}/update_status/`, {
        method: "POST",
        body: JSON.stringify({ status }),
      });
    },
    delete: async (id) => {
      return request(`/api/itineraries/my/${id}/`, {
        method: "DELETE",
      });
    },
  },
};
