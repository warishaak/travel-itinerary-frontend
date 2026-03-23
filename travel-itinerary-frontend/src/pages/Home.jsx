import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Navbar from "../components/Navbar";

export default function Home() {
  const { user, logout } = useAuth();
  return (
    <div className="home-container home-container-bg">
      <Navbar>
        <Link to="/" className="navbar-link">Home</Link>
        <Link to="/create-itinerary" className="navbar-link">Create</Link>
        <span className="navbar-email">{user?.email}</span>
        <button onClick={logout} className="navbar-logout-btn">Logout</button>
      </Navbar>
      <div className="home-content">
        <h1 className="home-title">My Itineraries</h1>
        <p className="home-subtitle">Plan and manage your travel itineraries in one place.</p>
        <Link to="/create-itinerary" className="home-cta">Create New Itinerary</Link>
      </div>
    </div>
  );
}
