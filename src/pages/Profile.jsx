import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { api } from "../services/api";
import Navbar from "../components/Navbar.jsx";
import { navStyles } from "../components/navStyles";

export default function Profile() {
  const { user, logout, loadUser } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
    }
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await api.auth.updateProfile({
        first_name: firstName,
        last_name: lastName,
      });
      loadUser();
      setSuccess("Profile updated.");
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <Navbar>
        <Link to="/itineraries" style={navStyles.navLink}>
          ← Back
        </Link>
        <button onClick={logout} style={navStyles.logoutBtn}>
          Logout
        </button>
      </Navbar>
      <div style={styles.content}>
        <div style={styles.card}>
          <h1 style={styles.title}>Profile</h1>
          <p style={styles.email}>Email: {user?.email}</p>
          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={styles.input}
            />
            <input
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={styles.input}
            />
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? "Saving..." : "Save"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh" },
  content: { padding: "2rem", maxWidth: 440, margin: "0 auto" },
  card: {
    padding: 32,
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    border: "1px solid #f1f5f9",
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: "#1a1a2e",
    margin: "0 0 8px 0",
  },
  email: { fontSize: 14, color: "#64748b", margin: "0 0 24px 0" },
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
  },
  error: { color: "#dc2626", margin: 0 },
  success: { color: "#16a34a", margin: 0 },
};
