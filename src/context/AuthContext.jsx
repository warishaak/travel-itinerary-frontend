import React, { createContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export { AuthContext };

function safeGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage write failures (e.g., blocked storage context).
  }
}

function safeRemoveItem(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore storage cleanup failures in restricted contexts.
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = safeGetItem("access_token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const data = await api.auth.me();
      setUser(data);
    } catch {
      setUser(null);
      safeRemoveItem("access_token");
      safeRemoveItem("refresh_token");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = (accessToken, refreshToken) => {
    safeSetItem("access_token", accessToken);
    safeSetItem("refresh_token", refreshToken || "");
    loadUser();
  };

  const logout = () => {
    safeRemoveItem("access_token");
    safeRemoveItem("refresh_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}
