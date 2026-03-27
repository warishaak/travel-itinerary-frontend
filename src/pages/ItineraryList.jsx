import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api";
import Navbar, { navStyles } from "../components/Navbar.jsx";

export default function ItineraryList() {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { logout } = useAuth();

  useEffect(() => {
    api.itineraries
      .list()
      .then(setItineraries)
      .catch((err) => setError(err.detail || "Failed to load itineraries"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.container}>
      <Navbar>
        <Link to="/itineraries" style={navStyles.navLink}>My Trips</Link>
        <Link to="/explore" style={navStyles.navLink}>Explore</Link>
        <Link to="/itineraries/new" style={navStyles.btn}>+ New</Link>
        <Link to="/profile" style={navStyles.navLink}>Profile</Link>
        <button onClick={logout} style={navStyles.logoutBtn}>Logout</button>
      </Navbar>
      <div style={styles.content}>
        <h1 style={styles.title}>My Itineraries</h1>
        {error && <p style={styles.error}>{error}</p>}
        {loading ? (
          <p style={styles.loading}>Loading...</p>
        ) : itineraries.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyText}>No itineraries yet.</p>
            <Link to="/itineraries/new" style={styles.emptyLink}>Create your first one</Link>
          </div>
        ) : (
          <div style={styles.grid}>
            {itineraries.map((it) => (
              <Link key={it.id} to={`/itineraries/${it.id}`} style={styles.card}>
                <h3 style={styles.cardTitle}>{it.title}</h3>
                <p style={styles.cardDest}>{it.destination}</p>
                <p style={styles.cardDates}>{it.start_date} → {it.end_date}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh" },
  content: { padding: "2rem", maxWidth: 900, margin: "0 auto" },
  title: { fontSize: 28, fontWeight: 700, color: "#1a1a2e", marginBottom: 24 },
  error: { color: "#dc2626", marginBottom: 16 },
  loading: { color: "#64748b" },
  empty: {
    padding: 48,
    background: "#fff",
    borderRadius: 12,
    textAlign: "center",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  emptyText: { color: "#64748b", marginBottom: 12 },
  emptyLink: { color: "#0f766e", fontWeight: 600, textDecoration: "none" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 },
  card: {
    display: "block",
    padding: 24,
    background: "#fff",
    borderRadius: 12,
    textDecoration: "none",
    color: "#1a1a2e",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    border: "1px solid #f1f5f9",
  },
  cardTitle: { fontSize: 18, fontWeight: 600, margin: "0 0 8px 0" },
  cardDest: { fontSize: 14, color: "#64748b", margin: "0 0 4px 0" },
  cardDates: { fontSize: 13, color: "#94a3b8", margin: 0 },
};
