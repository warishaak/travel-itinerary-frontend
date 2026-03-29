import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { api } from "../services/api";
import { useAsyncData } from "../hooks/useAsyncData";
import { getPreviewImage, formatDateRange } from "../utils/itinerary";
import { LoadingState, ErrorState, StatusBadge } from "../components";
import Navbar, { navStyles } from "../components/Navbar.jsx";
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from "../constants/theme";

export default function ItineraryList() {
  const { logout } = useAuth();
  const { data: itineraries, loading, error, refetch } = useAsyncData(
    () => api.itineraries.list(),
    []
  );

  return (
    <div style={styles.container}>
      <Navbar>
        <Link to="/itineraries" style={navStyles.navLink}>
          My Trips
        </Link>
        <Link to="/explore" style={navStyles.navLink}>
          Explore
        </Link>
        <Link to="/itineraries/new" style={navStyles.btn}>
          + New
        </Link>
        <Link to="/profile" style={navStyles.navLink}>
          Profile
        </Link>
        <button onClick={logout} style={navStyles.logoutBtn}>
          Logout
        </button>
      </Navbar>

      <div style={styles.content}>
        <h1 style={styles.title}>My Itineraries</h1>

        {loading ? (
          <LoadingState message="Loading your itineraries..." />
        ) : error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : !itineraries || itineraries.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyText}>No itineraries yet.</p>
            <Link to="/itineraries/new" style={styles.emptyLink}>
              Create your first one
            </Link>
          </div>
        ) : (
          <div style={styles.grid}>
            {itineraries.map((it) => {
              const previewImage = getPreviewImage(it);
              const dateRange = formatDateRange(it.start_date, it.end_date);

              return (
                <Link
                  key={it.id}
                  to={`/itineraries/${it.id}`}
                  style={styles.card}
                >
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt={it.title}
                      style={styles.cardImage}
                    />
                  )}
                  <div style={styles.cardContent}>
                    <div style={styles.cardHeader}>
                      <h2 style={styles.cardTitle}>{it.title}</h2>
                      <StatusBadge status={it.status} />
                    </div>
                    <p style={styles.cardDestination}>{it.destination}</p>
                    <p style={styles.cardDates}>{dateRange}</p>
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
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xl,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    boxShadow: SHADOWS.base,
    overflow: "hidden",
    textDecoration: "none",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
  },
  cardImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  },
  cardContent: {
    padding: SPACING.lg,
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  cardTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
    margin: 0,
    flex: 1,
  },
  cardDestination: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textSecondary,
    margin: `${SPACING.xs} 0`,
  },
  cardDates: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    margin: 0,
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
  emptyLink: {
    display: "inline-block",
    padding: `${SPACING.md} ${SPACING.xl}`,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.white,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    textDecoration: "none",
  },
};
