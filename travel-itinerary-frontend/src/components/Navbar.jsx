import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ children }) {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Travel Itinerary
      </Link>
      <div className="navbar-right">{children}</div>
    </nav>
  );
}
