import React from "react";
import { Link } from "react-router-dom";
import { navStyles as styles } from "./navStyles";

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
