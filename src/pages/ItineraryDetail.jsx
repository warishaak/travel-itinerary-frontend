import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { api } from "../services/api";
import Navbar from "../components/Navbar.jsx";

export default function ItineraryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    day_number: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    day_number: "",
  });

  useEffect(() => {
    api.itineraries
      .get(id)
      .then(setItinerary)
      .catch(() => setError("Failed to load itinerary"))
      .finally(() => setLoading(false));
  }, [id]);

  async function saveActivities(activities) {
    setSaving(true);
    setError("");
    try {
      const updated = await api.itineraries.update(id, {
        ...itinerary,
        activities,
      });
      setItinerary(updated);
    } catch (err) {
      setError(err.message || "Failed to save");
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
    } catch {
      setError("Failed to delete");
    } finally {
      setDeleting(false);
    }
  }

  function handleAddItem(e) {
    e.preventDefault();
    if (!newItem.title.trim()) return;
    const activities = [...(itinerary.activities || [])];
    activities.push({
      title: newItem.title.trim(),
      description: (newItem.description || "").trim() || undefined,
      day_number: newItem.day_number
        ? parseInt(newItem.day_number, 10)
        : undefined,
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
      day_number: editForm.day_number
        ? parseInt(editForm.day_number, 10)
        : undefined,
    };
    setEditingIndex(null);
    saveActivities(activities);
  }

  function handleDeleteItem(index) {
    if (!window.confirm("Remove this item?")) return;
    const activities = [...(itinerary.activities || [])];
    activities.splice(index, 1);
    saveActivities(activities);
  }

  function startEdit(index) {
    const item = itinerary.activities[index];
    const a =
      typeof item === "object"
        ? item
        : { title: String(item), description: "", day_number: "" };
    setEditingIndex(index);
    setEditForm({
      title: a.title || "",
      description: a.description || "",
      day_number: a.day_number ? String(a.day_number) : "",
    });
  }

  const activities = itinerary?.activities || [];

  if (loading)
    return (
      <div className="detail-container">
        <Navbar user={user}>
          <div />
        </Navbar>
        <div className="detail-content">
          <p className="detail-loading">Loading...</p>
        </div>
      </div>
    );
  if (error && !itinerary)
    return (
      <div className="detail-container">
        <Navbar user={user}>
          <Link to="/itineraries" className="navbar-link">
            ← Back
          </Link>
        </Navbar>
        <div className="detail-content">
          <p className="detail-error">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="detail-container">
      <Navbar user={user}>
        <Link to="/itineraries" className="navbar-link">
          ← Back
        </Link>
        <button onClick={logout} className="navbar-logout-btn">
          Logout
        </button>
      </Navbar>
      <div className="detail-content">
        <div className="detail-card">
          <h1 className="detail-title">{itinerary.title}</h1>
          <p className="detail-dest">
            <strong>Destination:</strong> {itinerary.destination}
          </p>
          <p className="detail-dates">
            <strong>Dates:</strong> {itinerary.start_date} to{" "}
            {itinerary.end_date}
          </p>

          {/* Trip Images */}
          {itinerary.images && itinerary.images.length > 0 && (
            <div className="detail-images-section">
              <h3 className="detail-section-title">Trip Photos</h3>
              <div className="detail-images-grid">
                {itinerary.images.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Trip ${index + 1}`}
                    className="detail-image"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="detail-section">
            <h3 className="detail-section-title">Things to do</h3>
            {error && <p className="detail-error">{error}</p>}
            <form onSubmit={handleAddItem} className="detail-add-form">
              <input
                placeholder="Activity name (e.g. Visit Eiffel Tower)"
                value={newItem.title}
                onChange={(e) =>
                  setNewItem((p) => ({ ...p, title: e.target.value }))
                }
                className="detail-add-input"
              />
              <input
                placeholder="Description (optional)"
                value={newItem.description}
                onChange={(e) =>
                  setNewItem((p) => ({ ...p, description: e.target.value }))
                }
                className="detail-add-input"
              />
              <div className="detail-add-row">
                <div className="detail-day-wrapper">
                  <label className="detail-label">Day (optional)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="—"
                    value={newItem.day_number}
                    onChange={(e) =>
                      setNewItem((p) => ({ ...p, day_number: e.target.value }))
                    }
                    className="detail-day-input"
                    aria-label="Day number optional"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="detail-add-btn"
                >
                  {saving ? "Adding..." : "Add activity"}
                </button>
              </div>
            </form>

            {activities.length === 0 ? (
              <p className="detail-empty-items">
                No activities yet. Add one above.
              </p>
            ) : (
              <ul className="detail-item-list">
                {activities.map((item, i) => (
                  <li key={i} className="detail-item">
                    {editingIndex === i ? (
                      <div className="detail-edit-form">
                        <input
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm((p) => ({
                              ...p,
                              title: e.target.value,
                            }))
                          }
                          className="detail-edit-input"
                          placeholder="Title"
                        />
                        <input
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm((p) => ({
                              ...p,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Description"
                          className="detail-edit-input"
                        />
                        <div className="detail-edit-actions">
                          <div className="detail-day-wrapper">
                            <label className="detail-label">
                              Day (optional)
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={editForm.day_number}
                              onChange={(e) =>
                                setEditForm((p) => ({
                                  ...p,
                                  day_number: e.target.value,
                                }))
                              }
                              placeholder="—"
                              className="detail-day-input"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleUpdateItem}
                            className="detail-save-btn"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingIndex(null)}
                            className="detail-cancel-btn"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <strong>
                            {typeof item === "object" ? item.title : item}
                          </strong>
                          {typeof item === "object" && item.day_number && (
                            <span className="detail-day-badge">
                              Day {item.day_number}
                            </span>
                          )}
                          {typeof item === "object" && item.description && (
                            <p className="detail-item-desc">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <div className="detail-item-actions">
                          <button
                            type="button"
                            onClick={() => startEdit(i)}
                            className="detail-small-btn"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(i)}
                            className="detail-small-btn-danger"
                          >
                            Remove
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="detail-actions">
            <Link to={`/itineraries/${id}/edit`} className="detail-edit-btn">
              Edit itinerary
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="detail-delete-btn"
            >
              {deleting ? "Deleting..." : "Delete itinerary"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
