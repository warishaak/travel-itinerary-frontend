import { useState } from "react";
import { uploadToCloudinary } from "../utils/cloudinary";

export default function ImageUpload({ images = [], onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const url = await uploadToCloudinary(file);
      onChange([...images, url]);
    } catch (err) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset input
    }
  }

  function handleRemove(index) {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  }

  return (
    <div style={styles.container}>
      <label style={styles.label}>Trip Images (optional)</label>

      {/* Upload Area */}
      <div style={styles.uploadBox}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          style={styles.fileInput}
          id="image-upload"
        />
        <label htmlFor="image-upload" style={styles.uploadLabel}>
          {uploading ? (
            <span>Uploading...</span>
          ) : (
            <>
              <span style={styles.uploadIcon}>📸</span>
              <span>Click to upload an image</span>
              <span style={styles.uploadHint}>PNG, JPG up to 5MB</span>
            </>
          )}
        </label>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {/* Image Grid */}
      {images.length > 0 && (
        <div style={styles.imageGrid}>
          {images.map((url, index) => (
            <div key={index} style={styles.imageCard}>
              <img src={url} alt={`Trip ${index + 1}`} style={styles.image} />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                style={styles.removeBtn}
                aria-label="Remove image"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: 600,
    color: "#1a1a2e",
  },
  uploadBox: {
    position: "relative",
    border: "2px dashed #cbd5e1",
    borderRadius: 10,
    padding: 32,
    textAlign: "center",
    background: "#f8fafc",
    transition: "all 0.2s",
  },
  fileInput: {
    position: "absolute",
    width: 0,
    height: 0,
    opacity: 0,
  },
  uploadLabel: {
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    alignItems: "center",
    color: "#64748b",
    fontSize: 14,
  },
  uploadIcon: {
    fontSize: 32,
  },
  uploadHint: {
    fontSize: 12,
    color: "#94a3b8",
  },
  error: {
    color: "#dc2626",
    fontSize: 14,
    margin: 0,
  },
  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: 12,
    marginTop: 8,
  },
  imageCard: {
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
    aspectRatio: "1",
    border: "1px solid #e2e8f0",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  removeBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    background: "rgba(0, 0, 0, 0.7)",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: 24,
    height: 24,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 700,
    transition: "background 0.2s",
  },
};
