import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { api } from "../services/api";
import { useForm } from "../hooks/useForm";
import { validateRequired, validateDateRange } from "../utils/validation";
import { parseApiError } from "../utils/apiErrors";
import Navbar from "../components/Navbar.jsx";
import { navStyles } from "../components/Navbar";
import ImageUpload from "../components/ImageUpload.jsx";
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from "../constants/theme";

export default function ItineraryForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [initialValues, setInitialValues] = useState({
    title: "",
    destination: "",
    start_date: "",
    end_date: "",
    is_public: false,
    activities: [],
    images: [],
  });

  // Load existing itinerary if editing
  useEffect(() => {
    if (isEdit) {
      api.itineraries
        .get(id)
        .then((data) =>
          setInitialValues({
            title: data.title,
            destination: data.destination,
            start_date: data.start_date,
            end_date: data.end_date,
            is_public: data.is_public || false,
            activities: data.activities || [],
            images: data.images || [],
          })
        )
        .catch(() => setError("title", "Failed to load itinerary"));
    }
  }, [id, isEdit]);

  const { values, errors, handleChange, handleSubmit, isSubmitting, setError, setValue } = useForm(
    initialValues,
    {
      title: (value) => validateRequired(value, "Title"),
      destination: (value) => validateRequired(value, "Destination"),
      start_date: (value) => validateRequired(value, "Start date"),
      end_date: (value, allValues) => {
        const requiredCheck = validateRequired(value, "End date");
        if (!requiredCheck.valid) return requiredCheck;
        return validateDateRange(allValues.start_date, value);
      },
    },
    async (formValues) => {
      try {
        if (isEdit) {
          await api.itineraries.update(id, formValues);
        } else {
          await api.itineraries.create(formValues);
        }
        navigate("/itineraries", { replace: true });
      } catch (err) {
        const errorMessage = parseApiError(
          err,
          isEdit ? "Failed to update itinerary." : "Failed to create itinerary."
        );
        setError("title", errorMessage);
      }
    }
  );

  // Update form values when initial values change (after loading)
  useEffect(() => {
    if (isEdit && initialValues.title) {
      Object.keys(initialValues).forEach(key => {
        setValue(key, initialValues[key]);
      });
    }
  }, [initialValues, isEdit, setValue]);

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
          <h1 style={styles.title}>{isEdit ? "Edit Itinerary" : "Create New Itinerary"}</h1>

          {errors.title && <p style={styles.error}>{errors.title}</p>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Title *</label>
              <input
                type="text"
                name="title"
                value={values.title}
                onChange={handleChange}
                style={styles.input}
                placeholder="My Amazing Trip"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Destination *</label>
              <input
                type="text"
                name="destination"
                value={values.destination}
                onChange={handleChange}
                style={styles.input}
                placeholder="Paris, France"
              />
            </div>

            <div style={styles.dateRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Start Date *</label>
                <input
                  type="date"
                  name="start_date"
                  value={values.start_date}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>End Date *</label>
                <input
                  type="date"
                  name="end_date"
                  value={values.end_date}
                  onChange={handleChange}
                  style={styles.input}
                />
                {errors.end_date && <p style={styles.fieldError}>{errors.end_date}</p>}
              </div>
            </div>

            <div style={styles.checkboxGroup}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="is_public"
                  checked={values.is_public}
                  onChange={handleChange}
                  style={styles.checkbox}
                />
                Make this itinerary public (others can view it)
              </label>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Images</label>
              <ImageUpload
                value={values.images}
                onChange={(images) => setValue("images", images)}
              />
            </div>

            <div style={styles.buttonGroup}>
              <button
                type="button"
                onClick={() => navigate("/itineraries")}
                style={styles.cancelButton}
              >
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} style={styles.submitButton}>
                {isSubmitting ? "Saving..." : isEdit ? "Update" : "Create"}
              </button>
            </div>
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
    maxWidth: "800px",
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
  dateRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: SPACING.md,
  },
  checkboxGroup: {
    padding: SPACING.md,
    backgroundColor: COLORS.bgSecondary,
    borderRadius: BORDER_RADIUS.md,
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: SPACING.sm,
    fontSize: FONT_SIZES.base,
    color: COLORS.textPrimary,
    cursor: "pointer",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
  },
  buttonGroup: {
    display: "flex",
    gap: SPACING.md,
    justifyContent: "flex-end",
    marginTop: SPACING.md,
  },
  cancelButton: {
    padding: `${SPACING.md} ${SPACING.xl}`,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textSecondary,
    backgroundColor: COLORS.white,
    border: `2px solid ${COLORS.border}`,
    borderRadius: BORDER_RADIUS.md,
    cursor: "pointer",
  },
  submitButton: {
    padding: `${SPACING.md} ${SPACING.xl}`,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.white,
    backgroundColor: COLORS.primary,
    border: "none",
    borderRadius: BORDER_RADIUS.md,
    cursor: "pointer",
  },
  error: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.bgError,
    borderRadius: BORDER_RADIUS.md,
  },
  fieldError: {
    color: COLORS.error,
    fontSize: FONT_SIZES.xs,
    marginTop: SPACING.xs,
  },
};
