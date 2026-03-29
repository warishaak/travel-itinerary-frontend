import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { api } from "../services/api";
import Navbar from "../components/Navbar.jsx";
import { navStyles } from "../components/navStyles";

export default function ItineraryList() {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { logout, user } = useAuth();

  useEffect(() => {
    api.itineraries
      .list()
      .then(setItineraries)
      .catch((err) => setError(err.detail || "Failed to load itineraries"))
      .finally(() => setLoading(false));
  }, []);

  function getPreviewImage(itinerary) {
    if (Array.isArray(itinerary.images) && itinerary.images.length > 0) {
      return itinerary.images[0];
    }
    if (typeof itinerary.image === "string" && itinerary.image) {
      return itinerary.image;
    }
    if (typeof itinerary.image_url === "string" && itinerary.image_url) {
      return itinerary.image_url;
    }
    return "";
  }

  function getStatusColor(status) {
    const colors = {
      planning: "#3b82f6", 
      ongoing: "#10b981", 
      completed: "#6b7280", 
    };
    return colors[status] || colors.planning;
  }

  function getStatusLabel(status) {
    const labels = {
      planning: "Planning",
      ongoing: "Ongoing",
      completed: "Completed",
    };
    return labels[status] || status;
  }

  return (
    <div style={styles.container}>
      <Navbar user={user}>
        <Link to="/itineraries" style={navStyles.navLink}>
          My Trips
        </Link>
        <Link to="/explore" style={navStyles.navLink}>
          Explore
        </Link>
        <Link to="/itineraries/new" style={navStyles.btn}>
          + New
        </Link>
        <Link to="/profile" style={navStyles.navLink}>
          Profile
        </Link>
        <button onClick={logout} style={navStyles.logoutBtn}>
          Logout
        </button>
      </Navbar>
      <div style={styles.content}>
        <h1 style={styles.title}>My Itineraries</h1>
        {error && <p style={styles.error}>{error}</p>}
        {loading ? (
          <p style={styles.loading}>Loading...</p>
        ) : itineraries.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyText}>No itineraries yet.</p>
            <Link to="/itineraries/new" style={styles.emptyLink}>
              Create your first one
            </Link>
          </div>
        ) : (
          <div style={styles.grid}>
            {itineraries.map((it) => {
              const previewImage = getPreviewImage(it);

              return (
                <Link
                  key={it.id}
                  to={`/itineraries/${it.id}`}
                  style={styles.card}
                >
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt={`${it.title} preview`}
                      style={styles.cardImage}
                      loading="lazy"
                    />
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <h3 style={styles.cardTitle}>{it.title}</h3>
                    {it.status && (
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: "4px",
                          backgroundColor: getStatusColor(it.status),
                          color: "white",
                          fontSize: "11px",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {getStatusLabel(it.status)}
                      </span>
                    )}
                  </div>
                  <p style={styles.cardDest}>{it.destination}</p>
                  <p style={styles.cardDates}>
                    {it.start_date} → {it.end_date}
                  </p>
                </Link>
              );
            })}
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 20,
  },
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
  cardImage: {
    width: "100%",
    height: 160,
    objectFit: "cover",
    borderRadius: 10,
    marginBottom: 12,
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
  },
  cardTitle: { fontSize: 18, fontWeight: 600, margin: "0 0 8px 0" },
  cardDest: { fontSize: 14, color: "#64748b", margin: "0 0 4px 0" },
  cardDates: { fontSize: 13, color: "#94a3b8", margin: 0 },
};
