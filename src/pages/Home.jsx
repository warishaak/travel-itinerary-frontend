import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { apiClient } from "../services/api";
import Navbar from "../components/Navbar";

export default function Home() {
  const { user, username, logout } = useAuth();
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient.itineraries
      .getAll()
      .then(setItineraries)
      .catch((err) => setError("Failed to load itineraries"))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="home-container">
      <Navbar>
        <Link to="/" className="navbar-link">Home</Link>
        <Link to="/create-itinerary" className="navbar-link">Create</Link>
        <span className="navbar-email">{username || user?.email}</span>
        <button onClick={handleLogout} className="navbar-logout-btn">Logout</button>
      </Navbar>
      <div className="home-content">
        <h1 className="home-title">My Itineraries</h1>
        <p className="home-subtitle">Plan and manage your travel itineraries in one place.</p>

        {error && <p className="itinerary-error">{error}</p>}

        {loading ? (
          <p className="home-loading">Loading itineraries...</p>
        ) : itineraries.length === 0 ? (
          <div className="home-empty-state">
            <p className="home-empty-text">
              No itineraries yet. Create your first one!
            </p>
            <Link to="/create-itinerary" className="home-cta">Create New Itinerary</Link>
          </div>
        ) : (
          <div className="home-itineraries-container">
            <div className="home-itineraries-header">
              <h2 className="home-itineraries-title">Your Itineraries</h2>
              <Link to="/create-itinerary" className="home-cta home-cta-small">
                + New
              </Link>
            </div>
            <div className="home-itineraries-list">
              {itineraries.map((itinerary) => (
                <Link
                  key={itinerary.id}
                  to={`/itineraries/${itinerary.id}`}
                  className="itinerary-card"
                >
                  <h3 className="itinerary-card-title">
                    {itinerary.title}
                  </h3>
                  <p className="itinerary-card-destination">
                    📍 {itinerary.destination}
                  </p>
                  <p className="itinerary-card-dates">
                    🗓️ {itinerary.start_date} → {itinerary.end_date}
                  </p>
                  {itinerary.activities && itinerary.activities.length > 0 && (
                    <p className="itinerary-card-activities">
                      {itinerary.activities.length} {itinerary.activities.length === 1 ? "activity" : "activities"}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
