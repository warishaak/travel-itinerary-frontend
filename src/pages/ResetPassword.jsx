import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import { useForm } from "../hooks/useForm";
import { validatePassword, validatePasswordMatch } from "../utils/validation";
import { parseApiError } from "../utils/apiErrors";
import { authFormStyles } from "../styles/commonStyles";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [tokenError, setTokenError] = useState("");

  useEffect(() => {
    if (!token) {
      setTokenError("Invalid reset link.");
    }
  }, [token]);

  const { values, errors, handleChange, handleSubmit, isSubmitting, setError } = useForm(
    { password: "", passwordConfirm: "" },
    {
      password: validatePassword,
      passwordConfirm: (value, allValues) => validatePasswordMatch(allValues.password, value),
    },
    async (formValues) => {
      try {
        await api.auth.confirmPasswordReset(token, formValues.password, formValues.passwordConfirm);
        setSuccess(true);

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login", {
            state: { message: "Password reset successful! Please log in." },
          });
        }, 3000);
      } catch (err) {
        const errorMessage = parseApiError(
          err,
          "Failed to reset password. The link may have expired."
        );
        setError("password", errorMessage);
      }
    }
  );

  if (success) {
    return (
      <div style={authFormStyles.wrapper}>
        <div style={authFormStyles.card}>
          <h1 style={authFormStyles.title}>Success!</h1>
          <div style={{ ...authFormStyles.success, marginTop: "24px" }}>
            <p style={{ margin: "0 0 12px 0", fontWeight: 600 }}>
              ✓ Your password has been reset successfully.
            </p>
            <p style={{ margin: "0 0 16px 0", fontSize: "13px" }}>
              Redirecting to login page in 3 seconds...
            </p>
            <Link to="/login" style={{ ...authFormStyles.link, display: "block" }}>
              Go to Login Now →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={authFormStyles.wrapper}>
      <div style={authFormStyles.card}>
        <h1 style={authFormStyles.title}>Set New Password</h1>
        <p style={authFormStyles.subtitle}>Enter your new password below.</p>

        {tokenError && <p style={authFormStyles.error}>{tokenError}</p>}

        <form onSubmit={handleSubmit} noValidate style={authFormStyles.form}>
          {errors.password && <p style={authFormStyles.error}>{errors.password}</p>}

          <input
            type="password"
            name="password"
            placeholder="New Password"
            value={values.password}
            onChange={handleChange}
            autoComplete="new-password"
            style={authFormStyles.input}
            disabled={!!tokenError}
          />

          <input
            type="password"
            name="passwordConfirm"
            placeholder="Confirm New Password"
            value={values.passwordConfirm}
            onChange={handleChange}
            autoComplete="new-password"
            style={authFormStyles.input}
            disabled={!!tokenError}
          />
          {errors.passwordConfirm && <p style={authFormStyles.error}>{errors.passwordConfirm}</p>}

          <button
            type="submit"
            disabled={isSubmitting || !!tokenError}
            style={authFormStyles.button}
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>

          <Link to="/login" style={{ ...authFormStyles.link, textAlign: "center" }}>
            ← Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
}
