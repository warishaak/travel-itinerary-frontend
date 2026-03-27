import React from "react";
import { Link } from "react-router-dom";

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    background: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  brand: {
    fontSize: 20,
    fontWeight: 700,
    color: "#0f766e",
    textDecoration: "none",
  },
  right: { display: "flex", alignItems: "center", gap: 20 },
  navLink: {
    color: "#64748b",
    textDecoration: "none",
    fontSize: 15,
    fontWeight: 500,
  },
  btn: {
    padding: "8px 16px",
    background: "#0f766e",
    color: "white",
    borderRadius: 8,
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 600,
  },
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
};

export default function Navbar({ children }) {
  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        Travel Itinerary
      </Link>
      <div style={styles.right}>{children}</div>
    </nav>
  );
}

export { styles as navStyles };
