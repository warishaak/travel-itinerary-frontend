import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await api.auth.requestPasswordReset(email);
      setSuccess(true);
      setEmail("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Reset Your Password</h1>
        <p style={styles.subtitle}>
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        {success ? (
          <div style={styles.successBox}>
            <p style={styles.successText}>
              ✓ If an account exists with that email, you'll receive a password
              reset link shortly.
            </p>
            <p style={styles.successSubtext}>
              Please check your email inbox and follow the instructions.
            </p>
            <Link to="/login" style={styles.backLink}>
              ← Back to Login
            </Link>
          </div>
        ) : (
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
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                ...(loading && styles.buttonDisabled),
              }}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            <Link to="/login" style={styles.link}>
              ← Back to Login
            </Link>
          </form>
        )}
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
    backgroundColor: "#f8fafc",
    padding: "20px",
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "420px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "8px",
    marginTop: 0,
  },
  subtitle: {
    color: "#64748b",
    marginBottom: "24px",
    lineHeight: "1.6",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  input: {
    padding: "12px 16px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  button: {
    padding: "12px",
    backgroundColor: "#0f766e",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  buttonDisabled: {
    backgroundColor: "#94a3b8",
    cursor: "not-allowed",
  },
  link: {
    textAlign: "center",
    color: "#0f766e",
    textDecoration: "none",
    fontSize: "14px",
    marginTop: "8px",
  },
  error: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    padding: "12px",
    borderRadius: "6px",
    margin: 0,
    fontSize: "14px",
  },
  successBox: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  successText: {
    backgroundColor: "#d1fae5",
    color: "#065f46",
    padding: "16px",
    borderRadius: "6px",
    margin: 0,
    fontSize: "15px",
    lineHeight: "1.6",
  },
  successSubtext: {
    color: "#64748b",
    fontSize: "14px",
    margin: 0,
  },
  backLink: {
    textAlign: "center",
    color: "#0f766e",
    textDecoration: "none",
    fontSize: "14px",
    marginTop: "8px",
    display: "inline-block",
  },
};
