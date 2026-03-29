import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useAsyncData } from "../hooks/useAsyncData";
import { formatDateRange } from "../utils/itinerary";
import { LoadingState, ErrorState } from "../components";
import Navbar from "../components/Navbar.jsx";
import { navStyles } from "../components/Navbar";
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from "../constants/theme";

export default function PublicItineraryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const { data: itinerary, loading, error } = useAsyncData(
    async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/itineraries/public/${id}/`
      );
      if (!response.ok) {
        if (response.status === 404) {
          navigate("/explore", { replace: true });
          return null;
        }
        throw new Error("Failed to load itinerary");
      }
      return response.json();
    },
    [id]
  );

  const activities = itinerary?.activities || [];

  if (loading) {
    return (
      <div style={styles.container}>
        <Navbar>
          <Link to="/explore" style={navStyles.navLink}>
            ← Back to Explore
          </Link>
        </Navbar>
        <LoadingState message="Loading public itinerary..." />
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div style={styles.container}>
        <Navbar>
          <Link to="/explore" style={navStyles.navLink}>
            ← Back to Explore
          </Link>
        </Navbar>
        <ErrorState error={error || "Itinerary not found"} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navbar>
        <Link to="/explore" style={navStyles.navLink}>
          ← Back to Explore
        </Link>
        {user ? (
          <>
            <Link to="/itineraries" style={navStyles.navLink}>
              My Trips
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
          <div>
            <div style={styles.publicBadge}>Public Trip</div>
            <h1 style={styles.title}>{itinerary.title}</h1>
            <p style={styles.destination}>{itinerary.destination}</p>
            <p style={styles.dates}>{formatDateRange(itinerary.start_date, itinerary.end_date)}</p>
            {itinerary.user && (
              <p style={styles.author}>
                Created by: {itinerary.user.first_name || itinerary.user.email}
              </p>
            )}
          </div>
        </div>

        {/* Images */}
        {itinerary.images && itinerary.images.length > 0 && (
          <div style={styles.imagesSection}>
            <h2 style={styles.sectionTitle}>Photos</h2>
            <div style={styles.imagesGrid}>
              {itinerary.images.map((img, idx) => (
                <img key={idx} src={img} alt={`Photo ${idx + 1}`} style={styles.image} />
              ))}
            </div>
          </div>
        )}

        {/* Activities */}
        <div style={styles.activitiesSection}>
          <h2 style={styles.sectionTitle}>Activities</h2>
          {activities.length > 0 ? (
            <div style={styles.activitiesList}>
              {activities.map((item, index) => {
                const activity = typeof item === "object" ? item : { title: String(item) };
                return (
                  <div key={index} style={styles.activityCard}>
                    <div style={styles.activityHeader}>
                      {activity.day_number && (
                        <span style={styles.dayBadge}>Day {activity.day_number}</span>
                      )}
                      <h3 style={styles.activityTitle}>{activity.title}</h3>
                    </div>
                    {activity.description && (
                      <p style={styles.activityDescription}>{activity.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={styles.noActivities}>No activities listed for this trip.</p>
          )}
        </div>

        {!user && (
          <div style={styles.ctaSection}>
            <p style={styles.ctaText}>Want to create your own travel itinerary?</p>
            <div style={styles.ctaButtons}>
              <Link to="/register" style={styles.ctaButton}>
                Sign Up Free
              </Link>
              <Link to="/login" style={styles.ctaButtonSecondary}>
                Login
              </Link>
            </div>
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
    maxWidth: "900px",
    margin: "0 auto",
    padding: SPACING.lg,
  },
  header: {
    backgroundColor: COLORS.white,
    padding: SPACING.xxl,
    borderRadius: BORDER_RADIUS.lg,
    boxShadow: SHADOWS.base,
    marginBottom: SPACING.lg,
  },
  publicBadge: {
    display: "inline-block",
    padding: `${SPACING.xs} ${SPACING.md}`,
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    borderRadius: BORDER_RADIUS.full,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    margin: 0,
  },
  destination: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  dates: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  author: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontStyle: "italic",
    marginTop: SPACING.md,
  },
  imagesSection: {
    backgroundColor: COLORS.white,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    boxShadow: SHADOWS.base,
    marginBottom: SPACING.lg,
  },
  imagesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: BORDER_RADIUS.md,
  },
  activitiesSection: {
    backgroundColor: COLORS.white,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    boxShadow: SHADOWS.base,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  activitiesList: {
    display: "flex",
    flexDirection: "column",
    gap: SPACING.md,
  },
  activityCard: {
    padding: SPACING.lg,
    border: `1px solid ${COLORS.border}`,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.bgSecondary,
  },
  activityHeader: {
    display: "flex",
    alignItems: "center",
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  dayBadge: {
    padding: `${SPACING.xs} ${SPACING.sm}`,
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    borderRadius: BORDER_RADIUS.full,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  activityTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
    margin: 0,
  },
  activityDescription: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textSecondary,
    margin: 0,
  },
  noActivities: {
    textAlign: "center",
    color: COLORS.textSecondary,
    padding: SPACING.xl,
    fontSize: FONT_SIZES.base,
  },
  ctaSection: {
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    padding: SPACING.xxl,
    borderRadius: BORDER_RADIUS.lg,
    textAlign: "center",
  },
  ctaText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.semibold,
    marginBottom: SPACING.lg,
  },
  ctaButtons: {
    display: "flex",
    gap: SPACING.md,
    justifyContent: "center",
  },
  ctaButton: {
    padding: `${SPACING.md} ${SPACING.xl}`,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.primary,
    backgroundColor: COLORS.white,
    border: "none",
    borderRadius: BORDER_RADIUS.md,
    textDecoration: "none",
    cursor: "pointer",
  },
  ctaButtonSecondary: {
    padding: `${SPACING.md} ${SPACING.xl}`,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.white,
    backgroundColor: "transparent",
    border: `2px solid ${COLORS.white}`,
    borderRadius: BORDER_RADIUS.md,
    textDecoration: "none",
    cursor: "pointer",
  },
};
