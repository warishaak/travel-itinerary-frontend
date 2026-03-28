import { useState } from "react";
import { uploadToCloudinary } from "../utils/cloudinary";

export default function ProfileImageUpload({ imageUrl, onChange }) {
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
      onChange(url);
    } catch (err) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset input
    }
  }

  function handleRemove() {
    onChange(null);
  }

  return (
    <div style={styles.container}>
      <label style={styles.label}>Profile Picture</label>

      <div style={styles.profileSection}>
        {/* Profile Image Display */}
        <div style={styles.avatarWrapper}>
          {imageUrl ? (
            <img src={imageUrl} alt="Profile" style={styles.avatar} />
          ) : (
            <div style={styles.avatarPlaceholder}>
              <span style={styles.avatarIcon}>👤</span>
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div style={styles.controls}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            style={styles.fileInput}
            id="profile-image-upload"
          />
          <label
            htmlFor="profile-image-upload"
            style={{
              ...styles.uploadBtn,
              ...(uploading ? styles.uploadBtnDisabled : {}),
            }}
          >
            {uploading ? "Uploading..." : imageUrl ? "Change Photo" : "Upload Photo"}
          </label>

          {imageUrl && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              style={styles.removeBtn}
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {error && <p style={styles.error}>{error}</p>}
      <p style={styles.hint}>PNG, JPG up to 5MB</p>
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
  profileSection: {
    display: "flex",
    alignItems: "center",
    gap: 20,
  },
  avatarWrapper: {
    flexShrink: 0,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #e2e8f0",
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: "50%",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "3px solid #e2e8f0",
  },
  avatarIcon: {
    fontSize: 48,
    opacity: 0.5,
  },
  controls: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  fileInput: {
    position: "absolute",
    width: 0,
    height: 0,
    opacity: 0,
  },
  uploadBtn: {
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    background: "#0f766e",
    color: "white",
    border: "none",
    borderRadius: 8,
    textAlign: "center",
    transition: "background 0.2s",
  },
  uploadBtnDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  removeBtn: {
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    background: "white",
    color: "#dc2626",
    border: "1px solid #fecaca",
    borderRadius: 8,
    transition: "background 0.2s",
  },
  error: {
    color: "#dc2626",
    fontSize: 14,
    margin: 0,
  },
  hint: {
    fontSize: 12,
    color: "#94a3b8",
    margin: 0,
  },
};
