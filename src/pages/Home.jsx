import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Navbar from "../components/Navbar.jsx";
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from "../constants/theme";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div style={styles.container}>
      <Navbar>
        <Link to="/explore" style={styles.navLink}>
          Explore
        </Link>
        <Link to="/profile" style={styles.email}>
          {user?.email}
        </Link>
        <button onClick={logout} style={styles.logoutBtn}>
          Logout
        </button>
      </Navbar>

      <div style={styles.content}>
        <h1 style={styles.title}>My Itineraries</h1>
        <p style={styles.subtitle}>
          Plan and manage your travel itineraries in one place.
        </p>
        <Link to="/itineraries" style={styles.cta}>
          View Itineraries
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: COLORS.bgSecondary,
  },
  navLink: {
    color: COLORS.primary,
    textDecoration: "none",
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  email: {
    color: COLORS.textSecondary,
    textDecoration: "none",
    fontSize: FONT_SIZES.sm,
  },
  logoutBtn: {
    padding: `${SPACING.sm} ${SPACING.md}`,
    cursor: "pointer",
    background: "transparent",
    color: COLORS.textSecondary,
    border: `1px solid ${COLORS.border}`,
    borderRadius: BORDER_RADIUS.md,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  content: {
    padding: `${SPACING.xxl} ${SPACING.lg}`,
    maxWidth: "560px",
    margin: "0 auto",
    textAlign: "center",
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xxl,
  },
  cta: {
    display: "inline-block",
    padding: `${SPACING.md} ${SPACING.xl}`,
    background: COLORS.primary,
    color: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    textDecoration: "none",
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semibold,
  },
};
