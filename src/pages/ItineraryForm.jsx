import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { createItinerary } from "../services/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export default function ItineraryForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    destination: "",
    start_date: "",
    end_date: "",
    activities: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    fetch(`${API_URL}/itineraries/${id}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load itinerary");
        }
        return response.json();
      })
      .then((data) =>
        setForm({
          title: data.title || "",
          destination: data.destination || "",
          start_date: data.start_date || "",
          end_date: data.end_date || "",
          activities: data.activities || [],
        }),
      )
      .catch(() => setError("Failed to load itinerary"));
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
        const response = await fetch(`${API_URL}/itineraries/${id}/`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (!response.ok) {
          throw new Error("Failed to save itinerary.");
        }
      } else {
        await createItinerary(form);
      }

      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to save itinerary.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="itinerary-container">
      <Navbar>
        <Link to="/" className="navbar-link">
          Home
        </Link>
        <Link to="/create-itinerary" className="navbar-link">
          Create
        </Link>
      </Navbar>
      <div className="itinerary-content">
        <h1 className="itinerary-title">
          {isEdit ? "Edit Itinerary" : "New Itinerary"}
        </h1>
        {error && <p className="itinerary-error">{error}</p>}
        <form onSubmit={handleSubmit} noValidate className="itinerary-form">
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="itinerary-input"
          />
          <input
            name="destination"
            placeholder="Destination"
            value={form.destination}
            onChange={handleChange}
            className="itinerary-input"
          />
          <div className="itinerary-row">
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              className="itinerary-input itinerary-date-input"
            />
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              className="itinerary-input itinerary-date-input"
            />
          </div>
          <div className="itinerary-actions">
            <button
              type="submit"
              disabled={loading}
              className="itinerary-submit"
            >
              {loading ? "Saving..." : isEdit ? "Update" : "Create"}
            </button>
            <Link to="/" className="itinerary-cancel">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
