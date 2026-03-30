import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { api } from "../services/api";
import { parseApiError } from "../utils/apiErrors";
import Navbar from "../components/Navbar.jsx";
import { navStyles } from "../components/Navbar";
import ProfileImageUpload from "../components/ProfileImageUpload.jsx";
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from "../constants/theme";

export default function Profile() {
  const { user, logout, loadUser } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setProfileImage(user.profile_image || null);
    }
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.auth.updateProfile({
        first_name: firstName,
        last_name: lastName,
        profile_image: profileImage,
      });
      await loadUser();
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(parseApiError(err, "Failed to update profile."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <Navbar>
        <Link to="/itineraries" style={navStyles.navLink}>
          ← Back
        </Link>
        <button onClick={logout} style={navStyles.logoutBtn}>
          Logout
        </button>
      </Navbar>

      <div style={styles.content}>
        <div style={styles.card}>
          <h1 style={styles.title}>Profile</h1>
          <p style={styles.email}>Email: {user?.email}</p>

          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <ProfileImageUpload imageUrl={profileImage} onChange={setProfileImage} />

            <div style={styles.formGroup}>
              <label style={styles.label}>First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={styles.input}
              />
            </div>

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
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
    maxWidth: "600px",
    margin: "0 auto",
    padding: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    boxShadow: SHADOWS.base,
    padding: SPACING.xxl,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  email: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: SPACING.lg,
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textPrimary,
  },
  input: {
    padding: SPACING.md,
    fontSize: FONT_SIZES.base,
    border: `1px solid ${COLORS.border}`,
    borderRadius: BORDER_RADIUS.md,
  },
  button: {
    padding: SPACING.md,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.white,
    backgroundColor: COLORS.primary,
    border: "none",
    borderRadius: BORDER_RADIUS.md,
    cursor: "pointer",
    marginTop: SPACING.md,
  },
  error: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.md,
  },
  success: {
    backgroundColor: COLORS.bgSuccess,
    color: COLORS.success,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    fontSize: FONT_SIZES.sm,
  },
};
