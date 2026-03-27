import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { api } from "../services/api";
import Navbar from "../components/Navbar.jsx";
import { navStyles } from "../components/navStyles";

export default function ItineraryForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [form, setForm] = useState({
    title: "",
    destination: "",
    start_date: "",
    end_date: "",
    is_public: false,
    activities: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      api.itineraries
        .get(id)
        .then((data) =>
          setForm({
            title: data.title,
            destination: data.destination,
            start_date: data.start_date,
            end_date: data.end_date,
            is_public: data.is_public || false,
            activities: data.activities || [],
          }),
        )
        .catch(() => setError("Failed to load itinerary"));
    }
  }, [id, isEdit]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!form.destination.trim()) {
      setError("Destination is required.");
      return;
    }
    if (!form.start_date || !form.end_date) {
      setError("Start date and end date are required.");
      return;
    }
    if (form.end_date < form.start_date) {
      setError("End date must be on or after start date.");
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        await api.itineraries.update(id, form);
      } else {
        await api.itineraries.create(form);
      }
      navigate("/itineraries", { replace: true });
    } catch (err) {
      const msg =
        err.title?.[0] ||
        err.destination?.[0] ||
        err.end_date?.[0] ||
        "Failed to save itinerary.";
      setError(msg);
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
        <h1 style={styles.title}>
          {isEdit ? "Edit Itinerary" : "New Itinerary"}
        </h1>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} noValidate style={styles.form}>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            name="destination"
            placeholder="Destination"
            value={form.destination}
            onChange={handleChange}
            style={styles.input}
          />
          <div style={styles.row}>
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              style={{ ...styles.input, flex: 1 }}
            />
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              style={{ ...styles.input, flex: 1 }}
            />
          </div>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="is_public"
              checked={form.is_public}
              onChange={handleChange}
              style={styles.checkbox}
            />
            <span>Make this trip public (visible to everyone)</span>
          </label>
          <div style={styles.actions}>
            <button type="submit" disabled={loading} style={styles.submit}>
              {loading ? "Saving..." : isEdit ? "Update" : "Create"}
            </button>
            <Link to="/itineraries" style={styles.cancel}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh" },
  content: { padding: "2rem", maxWidth: 500, margin: "0 auto" },
  title: { fontSize: 28, fontWeight: 700, color: "#1a1a2e", marginBottom: 24 },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  input: {
    padding: 14,
    fontSize: 16,
    border: "1px solid #e2e8f0",
    borderRadius: 10,
  },
  row: { display: "flex", gap: 12 },
  actions: { display: "flex", gap: 16, alignItems: "center", marginTop: 8 },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 15,
    color: "#1a1a2e",
    cursor: "pointer",
  },
  checkbox: {
    width: 18,
    height: 18,
    cursor: "pointer",
  },
  submit: {
    padding: 14,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    background: "#0f766e",
    color: "white",
    border: "none",
    borderRadius: 10,
  },
  cancel: { color: "#64748b", textDecoration: "none", fontSize: 14 },
  error: { color: "#dc2626", marginBottom: 16 },
};
