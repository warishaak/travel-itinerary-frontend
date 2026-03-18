import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Home() {
  const { user, logout } = useAuth();
  return (
    <div style={styles.container}>
      <Navbar>
        <Link to="/" style={styles.navLink}>Home</Link>
        <Link to="/create-itinerary" style={styles.navLink}>Create</Link>
        <span style={styles.email}>{user?.email}</span>
        <button onClick={logout} style={styles.logoutBtn}>Logout</button>
      </Navbar>
      <div style={styles.content}>
        <h1 style={styles.title}>My Itineraries</h1>
        <p style={styles.subtitle}>Plan and manage your travel itineraries in one place.</p>
        <Link to="/create-itinerary" style={styles.cta}>Create New Itinerary</Link>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#f8fafc" },
  navLink: {
    color: "#0f766e",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 600,
  },
  email: { color: "#64748b", textDecoration: "none", fontSize: 14 },
  logoutBtn: {
    padding: "8px 16px",
    cursor: "pointer",
    background: "transparent",
    color: "#64748b",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
  },
  content: {
    padding: "4rem 2rem",
    maxWidth: 560,
    margin: "0 auto",
    textAlign: "center",
  },
  title: { fontSize: 32, fontWeight: 700, color: "#1a1a2e", marginBottom: 12 },
  subtitle: { fontSize: 18, color: "#64748b", marginBottom: 32 },
  cta: {
    display: "inline-block",
    padding: "14px 28px",
    background: "#0f766e",
    color: "white",
    borderRadius: 10,
    textDecoration: "none",
    fontSize: 16,
    fontWeight: 600,
  },
};
