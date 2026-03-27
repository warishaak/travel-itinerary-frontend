import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link.");
    }
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Password is required.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.auth.confirmPasswordReset(token, password, passwordConfirm);
      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login", {
          state: { message: "Password reset successful! Please log in." },
        });
      }, 3000);
    } catch (err) {
      if (err.token) {
        setError(err.token[0] || "Token is invalid or has expired.");
      } else if (err.password) {
        setError(err.password[0]);
      } else if (err.password_confirm) {
        setError(err.password_confirm[0]);
      } else {
        setError("Failed to reset password. The link may have expired.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h1 style={styles.title}>Success!</h1>
          <div style={styles.successBox}>
            <p style={styles.successText}>
              ✓ Your password has been reset successfully.
            </p>
            <p style={styles.successSubtext}>
              Redirecting to login page in 3 seconds...
            </p>
            <Link to="/login" style={styles.loginLink}>
              Go to Login Now →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Set New Password</h1>
        <p style={styles.subtitle}>
          Please enter your new password below. Make sure it's at least 8
          characters long.
        </p>

        <form onSubmit={handleSubmit} noValidate style={styles.form}>
          {error && <p style={styles.error}>{error}</p>}

          <input
            type="password"
            autoComplete="new-password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Confirm New Password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            style={styles.input}
          />

          <button
            type="submit"
            disabled={loading || !token}
            style={{
              ...styles.button,
              ...((loading || !token) && styles.buttonDisabled),
            }}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <Link to="/login" style={styles.link}>
            ← Back to Login
          </Link>
        </form>
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
    textAlign: "center",
  },
  loginLink: {
    textAlign: "center",
    color: "#0f766e",
    textDecoration: "none",
    fontSize: "14px",
    marginTop: "8px",
    display: "inline-block",
    fontWeight: "600",
  },
};
