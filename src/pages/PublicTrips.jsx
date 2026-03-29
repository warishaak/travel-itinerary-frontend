import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { api } from "../services/api";
import { useAsyncData } from "../hooks/useAsyncData";
import { getPreviewImage, formatDateRange } from "../utils/itinerary";
import { LoadingState, ErrorState } from "../components";
import Navbar from "../components/Navbar.jsx";
import { navStyles } from "../components/Navbar";
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from "../constants/theme";

export default function PublicTrips() {
  const { user, logout } = useAuth();
  const { data: trips, loading, error, refetch } = useAsyncData(
    () => api.itineraries.listPublic(),
    []
  );

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

        {loading ? (
          <LoadingState message="Loading public trips..." />
        ) : error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : !trips || trips.length === 0 ? (
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
              const dateRange = formatDateRange(trip.start_date, trip.end_date);

              return (
                <Link key={trip.id} to={`/explore/${trip.id}`} style={styles.card}>
                  <div style={styles.publicBadge}>Public</div>
                  {previewImage && (
                    <img src={previewImage} alt={trip.title} style={styles.cardImage} />
                  )}
                  <div style={styles.cardContent}>
                    <h2 style={styles.cardTitle}>{trip.title}</h2>
                    <p style={styles.cardDestination}>{trip.destination}</p>
                    <p style={styles.cardDates}>{dateRange}</p>
                    {trip.user && (
                      <p style={styles.cardAuthor}>
                        By: {trip.user.first_name || trip.user.email}
                      </p>
                    )}
                  </div>
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
  container: {
    minHeight: "100vh",
    backgroundColor: COLORS.bgSecondary,
    paddingBottom: SPACING.xxl,
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: SPACING.lg,
  },
  header: {
    textAlign: "center",
    marginBottom: SPACING.xxl,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: SPACING.lg,
  },
  card: {
    position: "relative",
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    boxShadow: SHADOWS.base,
    overflow: "hidden",
    textDecoration: "none",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
  },
  publicBadge: {
    position: "absolute",
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    padding: `${SPACING.xs} ${SPACING.md}`,
    borderRadius: BORDER_RADIUS.full,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
    zIndex: 10,
  },
  cardImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  },
  cardContent: {
    padding: SPACING.lg,
  },
  cardTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
    margin: `0 0 ${SPACING.sm} 0`,
  },
  cardDestination: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textSecondary,
    margin: `${SPACING.xs} 0`,
  },
  cardDates: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    margin: `${SPACING.xs} 0`,
  },
  cardAuthor: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontStyle: "italic",
    margin: `${SPACING.sm} 0 0 0`,
  },
  empty: {
    textAlign: "center",
    padding: SPACING.xxl,
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  emptyHint: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textSecondary,
  },
  emptyLink: {
    color: COLORS.primary,
    textDecoration: "none",
    fontWeight: FONT_WEIGHTS.semibold,
  },
};
