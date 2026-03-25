import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Navbar from "../components/Navbar";

export default function Home() {
  const { user, username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="home-container home-container-bg">
      <Navbar>
        <Link to="/" className="navbar-link">
          Home
        </Link>
        <Link to="/create-itinerary" className="navbar-link">
          Create
        </Link>
        <span className="navbar-email">{username || user?.email}</span>
        <button onClick={handleLogout} className="navbar-logout-btn">
          Logout
        </button>
      </Navbar>
      <div className="home-content">
        <h1 className="home-title">My Itineraries</h1>
        <p className="home-subtitle">
          Plan and manage your travel itineraries in one place.
        </p>
        <Link to="/create-itinerary" className="home-cta">
          Create New Itinerary
        </Link>
      </div>
    </div>
  );
}
