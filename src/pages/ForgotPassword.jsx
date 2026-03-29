import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { useForm } from "../hooks/useForm";
import { validateEmail } from "../utils/validation";
import { authFormStyles } from "../styles/commonStyles";

export default function ForgotPassword() {
  const [success, setSuccess] = useState(false);

  const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm(
    { email: "" },
    { email: validateEmail },
    async (formValues) => {
      await api.auth.requestPasswordReset(formValues.email);
      setSuccess(true);
    }
  );

  return (
    <div style={authFormStyles.wrapper}>
      <div style={authFormStyles.card}>
        <h1 style={authFormStyles.title}>Reset Your Password</h1>
        <p style={authFormStyles.subtitle}>
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {success ? (
          <div style={{ ...authFormStyles.success, marginTop: "24px" }}>
            <p style={{ margin: "0 0 12px 0", fontWeight: 600 }}>
              ✓ If an account exists with that email, you'll receive a password reset link shortly.
            </p>
            <p style={{ margin: 0, fontSize: "13px" }}>
              Please check your email inbox and follow the instructions.
            </p>
            <Link
              to="/login"
              style={{ ...authFormStyles.link, display: "block", marginTop: "16px" }}
            >
              ← Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate style={authFormStyles.form}>
            {errors.email && <p style={authFormStyles.error}>{errors.email}</p>}

            <input
              type="text"
              name="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Email"
              value={values.email}
              onChange={handleChange}
              style={authFormStyles.input}
            />

            <button type="submit" disabled={isSubmitting} style={authFormStyles.button}>
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>

            <Link to="/login" style={{ ...authFormStyles.link, textAlign: "center" }}>
              ← Back to Login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
