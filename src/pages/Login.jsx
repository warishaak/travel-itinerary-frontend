import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { api } from "../services/api";
import { useForm } from "../hooks/useForm";
import { validateEmail, validateRequired } from "../utils/validation";
import { parseApiError } from "../utils/apiErrors";
import { authFormStyles } from "../styles/commonStyles";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if there's a success message from password reset
  const successMessage = location.state?.message;

  // Use custom form hook - replaces manual state management
  const { values, errors, handleChange, handleSubmit, isSubmitting, setError } = useForm(
    { email: "", password: "" },
    {
      email: validateEmail,
      password: (value) => validateRequired(value, "Password"),
    },
    async (formValues) => {
      try {
        const data = await api.auth.login(formValues.email, formValues.password);
        login(data.access, data.refresh);
        navigate("/", { replace: true });
      } catch (err) {
        const errorMessage = parseApiError(err, "Login failed. Check your credentials.");
        setError("email", errorMessage);
      }
    }
  );

  return (
    <div style={authFormStyles.wrapper}>
      <div style={authFormStyles.card}>
        <h1 style={authFormStyles.title}>Welcome back</h1>
        <p style={authFormStyles.subtitle}>Sign in to manage your itineraries</p>

        <form onSubmit={handleSubmit} noValidate style={authFormStyles.form}>
          {successMessage && <p style={authFormStyles.success}>{successMessage}</p>}
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

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={values.password}
            onChange={handleChange}
            autoComplete="current-password"
            style={authFormStyles.input}
          />

          <Link
            to="/forgot-password"
            style={{ ...authFormStyles.link, textAlign: "right", marginTop: "-8px" }}
          >
            Forgot password?
          </Link>

          <button type="submit" disabled={isSubmitting} style={authFormStyles.button}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p style={{ marginTop: "24px", textAlign: "center", color: "#64748b", fontSize: "14px" }}>
          Don&apos;t have an account?{" "}
          <Link to="/register" style={authFormStyles.link}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
