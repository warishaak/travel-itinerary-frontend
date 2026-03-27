import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }
    setLoading(true);
    try {
      const data = await api.auth.login(email, password);
      login(data.access, data.refresh);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.detail || err.email?.[0] || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.subtitle}>Sign in to manage your itineraries</p>
        <form onSubmit={handleSubmit} noValidate style={styles.form}>
          {error && <p style={styles.error}>{error}</p>}
          <input
            type="text"
            inputMode="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p style={styles.footer}>
          Don&apos;t have an account? <Link to="/register" style={styles.link}>Create one</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 40,
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
  },
  title: { fontSize: 28, fontWeight: 700, color: "#1a1a2e", margin: "0 0 8px 0" },
  subtitle: { fontSize: 15, color: "#64748b", margin: "0 0 24px 0" },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  input: {
    padding: 14,
    fontSize: 16,
    border: "1px solid #e2e8f0",
    borderRadius: 10,
  },
  button: {
    padding: 14,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    background: "#0f766e",
    color: "white",
    border: "none",
    borderRadius: 10,
    marginTop: 8,
  },
  error: { color: "#dc2626", margin: 0, fontSize: 14 },
  footer: { marginTop: 24, textAlign: "center", color: "#64748b", fontSize: 14 },
  link: { color: "#0f766e", fontWeight: 600, textDecoration: "none" },
};
