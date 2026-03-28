import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { api } from "../services/api";
import Navbar from "../components/Navbar.jsx";
import { navStyles } from "../components/navStyles";

export default function PublicTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();

  useEffect(() => {
    api.itineraries
      .listPublic()
      .then(setTrips)
      .catch((err) => setError(err.detail || "Failed to load public trips"))
      .finally(() => setLoading(false));
  }, []);

  function getPreviewImage(trip) {
    if (Array.isArray(trip.images) && trip.images.length > 0) {
      return trip.images[0];
    }
    if (typeof trip.image === "string" && trip.image) {
      return trip.image;
    }
    if (typeof trip.image_url === "string" && trip.image_url) {
      return trip.image_url;
    }
    return "";
  }

  return (
    <div style={styles.container}>
      <Navbar>
        {user ? (
          <>
            <Link to="/itineraries" style={navStyles.navLink}>
              My Trips
            </Link>
            <Link to="/explore" style={navStyles.navLink}>
              Explore
            </Link>
            <Link to="/profile" style={navStyles.navLink}>
              Profile
            </Link>
            <button onClick={logout} style={navStyles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/explore" style={navStyles.navLink}>
              Explore
            </Link>
            <Link to="/login" style={navStyles.btn}>
              Login
            </Link>
            <Link to="/register" style={navStyles.btn}>
              Register
            </Link>
          </>
        )}
      </Navbar>
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>Explore Public Trips</h1>
          <p style={styles.subtitle}>
            Discover amazing travel itineraries shared by our community
          </p>
        </div>
        {error && <p style={styles.error}>{error}</p>}
        {loading ? (
          <p style={styles.loading}>Loading...</p>
        ) : trips.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyText}>No public trips available yet.</p>
            {user && (
              <p style={styles.emptyHint}>
                <Link to="/itineraries/new" style={styles.emptyLink}>
                  Create a public trip
                </Link>{" "}
                to share your travel plans!
              </p>
            )}
          </div>
        ) : (
          <div style={styles.grid}>
            {trips.map((trip) => {
              const previewImage = getPreviewImage(trip);

              return (
                <div key={trip.id} style={styles.card}>
                  <div style={styles.publicBadge}>Public</div>
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt={`${trip.title} preview`}
                      style={styles.cardImage}
                      loading="lazy"
                    />
                  )}
                  <h3 style={styles.cardTitle}>{trip.title}</h3>
                  <p style={styles.cardDest}>{trip.destination}</p>
                  <p style={styles.cardDates}>
                    {trip.start_date} → {trip.end_date}
                  </p>
                  {trip.activities && trip.activities.length > 0 && (
                    <p style={styles.cardActivities}>
                      {trip.activities.length}{" "}
                      {trip.activities.length === 1
                        ? "activity"
                        : "activities"}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#f8fafc" },
  content: { padding: "2rem", maxWidth: 1200, margin: "0 auto" },
  header: { textAlign: "center", marginBottom: 40 },
  title: { fontSize: 32, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#64748b" },
  error: { color: "#dc2626", marginBottom: 16, textAlign: "center" },
  loading: { color: "#64748b", textAlign: "center" },
  empty: {
    padding: 48,
    background: "#fff",
    borderRadius: 12,
    textAlign: "center",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  emptyText: { color: "#64748b", marginBottom: 12, fontSize: 16 },
  emptyHint: { color: "#64748b", fontSize: 14 },
  emptyLink: { color: "#0f766e", fontWeight: 600, textDecoration: "none" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 24,
  },
  card: {
    position: "relative",
    padding: 24,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    border: "1px solid #f1f5f9",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "default",
  },
  cardImage: {
    width: "100%",
    height: 170,
    objectFit: "cover",
    borderRadius: 10,
    marginBottom: 12,
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
  },
  publicBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: "4px 12px",
    background: "#d1fae5",
    color: "#065f46",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 600,
    margin: "0 0 12px 0",
    color: "#1a1a2e",
  },
  cardDest: {
    fontSize: 15,
    color: "#64748b",
    margin: "0 0 8px 0",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  cardDates: {
    fontSize: 14,
    color: "#94a3b8",
    margin: "0 0 12px 0",
  },
  cardActivities: {
    fontSize: 13,
    color: "#0f766e",
    margin: 0,
    fontWeight: 500,
  },
};
