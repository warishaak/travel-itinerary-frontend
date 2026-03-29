import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { api } from "../services/api";
import { useAsyncData } from "../hooks/useAsyncData";
import { formatDateRange } from "../utils/itinerary";
import { parseApiError } from "../utils/apiErrors";
import { LoadingState, ErrorState, StatusBadge } from "../components";
import Navbar from "../components/Navbar.jsx";
import { navStyles } from "../components/Navbar";
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from "../constants/theme";

export default function ItineraryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const { data: itinerary, loading, error, setData, setError } = useAsyncData(
    () => api.itineraries.get(id),
    [id],
    {
      onError: (err) => {
        if (err?.status === 404) {
          navigate("/itineraries", { replace: true });
        }
      },
    }
  );

  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newItem, setNewItem] = useState({ title: "", description: "", day_number: "" });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", day_number: "" });

  async function saveActivities(activities) {
    setSaving(true);
    setError(null);
    try {
      const updated = await api.itineraries.update(id, { ...itinerary, activities });
      setData(updated);
    } catch (err) {
      setError(parseApiError(err, "Failed to save activities"));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this itinerary?")) return;
    setDeleting(true);
    try {
      await api.itineraries.delete(id);
      navigate("/itineraries", { replace: true });
    } catch (err) {
      const message = err?.detail || err?.message || "";
      if (/access to storage is not allowed from this context/i.test(message)) {
        navigate("/itineraries", { replace: true });
        return;
      }
      setError(parseApiError(err, "Failed to delete itinerary"));
    } finally {
      setDeleting(false);
    }
  }

  async function handleStatusChange(newStatus) {
    setUpdatingStatus(true);
    try {
      await api.itineraries.updateStatus(id, newStatus);
      setData({ ...itinerary, status: newStatus });
    } catch (err) {
      setError(parseApiError(err, "Failed to update status"));
    } finally {
      setUpdatingStatus(false);
    }
  }

  function handleAddItem(e) {
    e.preventDefault();
    if (!newItem.title.trim()) return;

    const activities = [...(itinerary.activities || [])];
    activities.push({
      title: newItem.title.trim(),
      description: (newItem.description || "").trim() || undefined,
      day_number: newItem.day_number ? parseInt(newItem.day_number, 10) : undefined,
    });

    setNewItem({ title: "", description: "", day_number: "" });
    saveActivities(activities);
  }

  function handleUpdateItem() {
    if (!editForm.title.trim()) return;

    const activities = [...(itinerary.activities || [])];
    activities[editingIndex] = {
      title: editForm.title.trim(),
      description: (editForm.description || "").trim() || undefined,
      day_number: editForm.day_number ? parseInt(editForm.day_number, 10) : undefined,
    };

    setEditingIndex(null);
    saveActivities(activities);
  }

  function handleDeleteItem(index) {
    if (!window.confirm("Remove this activity?")) return;
    const activities = [...(itinerary.activities || [])];
    activities.splice(index, 1);
    saveActivities(activities);
  }

  function startEdit(index) {
    const item = itinerary.activities[index];
    const activity = typeof item === "object" ? item : { title: String(item), description: "", day_number: "" };
    setEditingIndex(index);
    setEditForm({
      title: activity.title || "",
      description: activity.description || "",
      day_number: activity.day_number ? String(activity.day_number) : "",
    });
  }

  if (loading) return <LoadingState message="Loading itinerary..." />;
  if (error && !itinerary) return <ErrorState error={error} />;

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
        {error && <div style={styles.errorBanner}>{error}</div>}

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>{itinerary?.title}</h1>
            <p style={styles.destination}>{itinerary?.destination}</p>
            <p style={styles.dates}>{formatDateRange(itinerary?.start_date, itinerary?.end_date)}</p>
          </div>
          <div style={styles.headerActions}>
            <StatusBadge status={itinerary?.status} />
          </div>
        </div>

        {/* Status Selector */}
        <div style={styles.statusSection}>
          <label style={styles.statusLabel}>Status:</label>
          <select
            value={itinerary?.status || "planning"}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updatingStatus}
            style={styles.statusSelect}
          >
            <option value="planning">Planning</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Images */}
        {itinerary?.images && itinerary.images.length > 0 && (
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

          {itinerary?.activities && itinerary.activities.length > 0 ? (
            <div style={styles.activitiesList}>
              {itinerary.activities.map((item, index) => {
                const activity = typeof item === "object" ? item : { title: String(item) };

                if (editingIndex === index) {
                  return (
                    <div key={index} style={styles.activityCard}>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        style={styles.input}
                        placeholder="Activity title"
                      />
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        style={styles.textarea}
                        placeholder="Description (optional)"
                      />
                      <input
                        type="number"
                        value={editForm.day_number}
                        onChange={(e) => setEditForm({ ...editForm, day_number: e.target.value })}
                        style={styles.input}
                        placeholder="Day # (optional)"
                      />
                      <div style={styles.activityActions}>
                        <button onClick={handleUpdateItem} style={styles.saveBtn}>
                          Save
                        </button>
                        <button onClick={() => setEditingIndex(null)} style={styles.cancelBtn}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={index} style={styles.activityCard}>
                    <div style={styles.activityHeader}>
                      {activity.day_number && <span style={styles.dayBadge}>Day {activity.day_number}</span>}
                      <h3 style={styles.activityTitle}>{activity.title}</h3>
                    </div>
                    {activity.description && <p style={styles.activityDescription}>{activity.description}</p>}
                    <div style={styles.activityActions}>
                      <button onClick={() => startEdit(index)} style={styles.editBtn}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteItem(index)} style={styles.deleteBtn}>
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={styles.noActivities}>No activities yet. Add your first one below!</p>
          )}

          {/* Add New Activity Form */}
          <form onSubmit={handleAddItem} style={styles.addForm}>
            <h3 style={styles.addFormTitle}>Add New Activity</h3>
            <input
              type="text"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              style={styles.input}
              placeholder="Activity title *"
            />
            <textarea
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              style={styles.textarea}
              placeholder="Description (optional)"
            />
            <input
              type="number"
              value={newItem.day_number}
              onChange={(e) => setNewItem({ ...newItem, day_number: e.target.value })}
              style={styles.input}
              placeholder="Day # (optional)"
            />
            <button type="submit" disabled={saving} style={styles.addBtn}>
              {saving ? "Adding..." : "Add Activity"}
            </button>
          </form>
        </div>

        {/* Action Buttons */}
        <div style={styles.actions}>
          <Link to={`/itineraries/${id}/edit`} style={styles.editButton}>
            Edit Itinerary
          </Link>
          <button onClick={handleDelete} disabled={deleting} style={styles.deleteButton}>
            {deleting ? "Deleting..." : "Delete Itinerary"}
          </button>
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
    maxWidth: "900px",
    margin: "0 auto",
    padding: SPACING.lg,
  },
  errorBanner: {
    backgroundColor: COLORS.bgError,
    color: COLORS.error,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
  },
  header: {
    backgroundColor: COLORS.white,
    padding: SPACING.xxl,
    borderRadius: BORDER_RADIUS.lg,
    boxShadow: SHADOWS.base,
    marginBottom: SPACING.lg,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
  headerActions: {
    display: "flex",
    gap: SPACING.md,
  },
  statusSection: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    boxShadow: SHADOWS.base,
    marginBottom: SPACING.lg,
    display: "flex",
    alignItems: "center",
    gap: SPACING.md,
  },
  statusLabel: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
  },
  statusSelect: {
    padding: SPACING.sm,
    fontSize: FONT_SIZES.base,
    border: `1px solid ${COLORS.border}`,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.white,
    cursor: "pointer",
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
    marginBottom: SPACING.xl,
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
    margin: `${SPACING.sm} 0`,
  },
  activityActions: {
    display: "flex",
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  editBtn: {
    padding: `${SPACING.xs} ${SPACING.md}`,
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    backgroundColor: COLORS.white,
    border: `1px solid ${COLORS.primary}`,
    borderRadius: BORDER_RADIUS.md,
    cursor: "pointer",
  },
  deleteBtn: {
    padding: `${SPACING.xs} ${SPACING.md}`,
    fontSize: FONT_SIZES.sm,
    color: COLORS.error,
    backgroundColor: COLORS.white,
    border: `1px solid ${COLORS.error}`,
    borderRadius: BORDER_RADIUS.md,
    cursor: "pointer",
  },
  saveBtn: {
    padding: `${SPACING.xs} ${SPACING.md}`,
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    backgroundColor: COLORS.success,
    border: "none",
    borderRadius: BORDER_RADIUS.md,
    cursor: "pointer",
  },
  cancelBtn: {
    padding: `${SPACING.xs} ${SPACING.md}`,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    backgroundColor: COLORS.white,
    border: `1px solid ${COLORS.border}`,
    borderRadius: BORDER_RADIUS.md,
    cursor: "pointer",
  },
  noActivities: {
    textAlign: "center",
    color: COLORS.textSecondary,
    padding: SPACING.xl,
    fontSize: FONT_SIZES.base,
  },
  addForm: {
    padding: SPACING.lg,
    backgroundColor: COLORS.bgSecondary,
    borderRadius: BORDER_RADIUS.md,
    border: `2px dashed ${COLORS.border}`,
  },
  addFormTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  input: {
    width: "100%",
    padding: SPACING.md,
    fontSize: FONT_SIZES.base,
    border: `1px solid ${COLORS.border}`,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.white,
  },
  textarea: {
    width: "100%",
    padding: SPACING.md,
    fontSize: FONT_SIZES.base,
    border: `1px solid ${COLORS.border}`,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    minHeight: "80px",
    resize: "vertical",
    backgroundColor: COLORS.white,
  },
  addBtn: {
    width: "100%",
    padding: SPACING.md,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.white,
    backgroundColor: COLORS.primary,
    border: "none",
    borderRadius: BORDER_RADIUS.md,
    cursor: "pointer",
  },
  actions: {
    display: "flex",
    gap: SPACING.md,
    justifyContent: "center",
  },
  editButton: {
    padding: `${SPACING.md} ${SPACING.xl}`,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.primary,
    backgroundColor: COLORS.white,
    border: `2px solid ${COLORS.primary}`,
    borderRadius: BORDER_RADIUS.md,
    textDecoration: "none",
    cursor: "pointer",
  },
  deleteButton: {
    padding: `${SPACING.md} ${SPACING.xl}`,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.white,
    backgroundColor: COLORS.error,
    border: "none",
    borderRadius: BORDER_RADIUS.md,
    cursor: "pointer",
  },
};
