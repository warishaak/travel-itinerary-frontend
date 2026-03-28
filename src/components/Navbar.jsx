import React from "react";
import { Link } from "react-router-dom";
import { navStyles as styles } from "./navStyles";

export default function Navbar({ children, user }) {
  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        Travel Itinerary
      </Link>
      <div style={styles.right}>
        {user && user.profile_image && (
          <Link to="/profile" style={styles.profileLink}>
            <img
              src={user.profile_image}
              alt="Profile"
              style={styles.profileAvatar}
            />
          </Link>
        )}
        {children}
      </div>
    </nav>
  );
}
