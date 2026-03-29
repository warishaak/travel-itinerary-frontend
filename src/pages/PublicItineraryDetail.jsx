import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { api } from "../services/api";
import Navbar from "../components/Navbar.jsx";
import { navStyles } from "../components/navStyles";

export default function PublicItineraryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch from public API endpoint
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/itineraries/public/${id}/`)
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 404) {
            navigate("/explore", { replace: true });
            return;
          }
          throw new Error("Failed to load itinerary");
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          setItinerary(data);
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load itinerary");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const activities = itinerary?.activities || [];

  if (loading)
    return (
      <div className="detail-container">
        <Navbar user={user}>
          <Link to="/explore" style={navStyles.navLink}>
            ← Back to Explore
          </Link>
        </Navbar>
        <div className="detail-content">
          <p className="detail-loading">Loading...</p>
        </div>
      </div>
    );

  if (error || !itinerary)
    return (
      <div className="detail-container">
        <Navbar user={user}>
          <Link to="/explore" style={navStyles.navLink}>
            ← Back to Explore
          </Link>
        </Navbar>
        <div className="detail-content">
          <p className="detail-error">{error || "Itinerary not found"}</p>
        </div>
      </div>
    );

  return (
    <div className="detail-container">
      <Navbar user={user}>
        <Link to="/explore" style={navStyles.navLink}>
          ← Back to Explore
        </Link>
        {user ? (
          <>
            <Link to="/itineraries" style={navStyles.navLink}>
              My Trips
            </Link>
            <button onClick={logout} style={navStyles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={navStyles.btn}>
              Login
            </Link>
            <Link to="/register" style={navStyles.btn}>
              Register
            </Link>
          </>
        )}
      </Navbar>
      <div className="detail-content">
        <div className="detail-card">
          <div style={styles.publicBadge}>Public Trip</div>
          <h1 className="detail-title">{itinerary.title}</h1>
          <p className="detail-dest">
            <strong>Destination:</strong> {itinerary.destination}
          </p>
          <p className="detail-dates">
            <strong>Dates:</strong> {itinerary.start_date} to{" "}
            {itinerary.end_date}
          </p>

          {/* Trip Images */}
          {itinerary.images && itinerary.images.length > 0 && (
            <div className="detail-images-section">
              <h3 className="detail-section-title">Trip Photos</h3>
              <div className="detail-images-grid">
                {itinerary.images.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Trip ${index + 1}`}
                    className="detail-image"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Activities */}
          <div className="detail-section">
            <h3 className="detail-section-title">Things to do</h3>
            {activities.length === 0 ? (
              <p className="detail-empty-items">No activities listed yet.</p>
            ) : (
              <ul className="detail-item-list">
                {activities.map((item, i) => (
                  <li key={i} className="detail-item" style={styles.readOnlyItem}>
                    <div>
                      <strong>
                        {typeof item === "object" ? item.title : item}
                      </strong>
                      {typeof item === "object" && item.day_number && (
                        <span className="detail-day-badge">
                          Day {item.day_number}
                        </span>
                      )}
                      {typeof item === "object" && item.description && (
                        <p className="detail-item-desc">{item.description}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* CTA for non-authenticated users */}
          {!user && (
            <div style={styles.ctaSection}>
              <p style={styles.ctaText}>
                Want to create your own travel itinerary?
              </p>
              <div style={styles.ctaButtons}>
                <Link to="/register" style={styles.ctaButton}>
                  Sign up free
                </Link>
                <Link to="/login" style={styles.ctaButtonSecondary}>
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  publicBadge: {
    display: "inline-block",
    padding: "6px 14px",
    background: "#d1fae5",
    color: "#065f46",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 16,
  },
  readOnlyItem: {
    cursor: "default",
  },
  ctaSection: {
    marginTop: 48,
    padding: 32,
    background: "#f8fafc",
    borderRadius: 12,
    textAlign: "center",
  },
  ctaText: {
    fontSize: 18,
    fontWeight: 600,
    color: "#1a1a2e",
    marginBottom: 20,
  },
  ctaButtons: {
    display: "flex",
    gap: 16,
    justifyContent: "center",
  },
  ctaButton: {
    padding: "12px 28px",
    background: "#0f766e",
    color: "white",
    borderRadius: 10,
    textDecoration: "none",
    fontSize: 16,
    fontWeight: 600,
  },
  ctaButtonSecondary: {
    padding: "12px 28px",
    background: "white",
    color: "#0f766e",
    border: "1px solid #0f766e",
    borderRadius: 10,
    textDecoration: "none",
    fontSize: 16,
    fontWeight: 600,
  },
};
