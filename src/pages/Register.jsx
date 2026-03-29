import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { api } from "../services/api";
import { useForm } from "../hooks/useForm";
import { validateEmail, validatePassword, validatePasswordMatch } from "../utils/validation";
import { parseApiError } from "../utils/apiErrors";
import { authFormStyles } from "../styles/commonStyles";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Use custom form hook with validation
  const { values, errors, handleChange, handleSubmit, isSubmitting, setError } = useForm(
    {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      passwordConfirm: "",
    },
    {
      email: validateEmail,
      password: validatePassword,
      passwordConfirm: (value, allValues) => validatePasswordMatch(allValues.password, value),
    },
    async (formValues) => {
      try {
        await api.auth.register(
          formValues.email,
          formValues.password,
          formValues.passwordConfirm,
          formValues.firstName,
          formValues.lastName
        );
        const data = await api.auth.login(formValues.email, formValues.password);
        login(data.access, data.refresh);
        navigate("/", { replace: true });
      } catch (err) {
        const errorMessage = parseApiError(err, "Registration failed.");
        setError("email", errorMessage);
      }
    }
  );

  return (
    <div style={authFormStyles.wrapper}>
      <div style={authFormStyles.card}>
        <h1 style={authFormStyles.title}>Create account</h1>
        <p style={authFormStyles.subtitle}>Start planning your next adventure</p>

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

          <input
            type="text"
            name="firstName"
            placeholder="First name (optional)"
            value={values.firstName}
            onChange={handleChange}
            style={authFormStyles.input}
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last name (optional)"
            value={values.lastName}
            onChange={handleChange}
            style={authFormStyles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={values.password}
            onChange={handleChange}
            autoComplete="new-password"
            style={authFormStyles.input}
          />
          {errors.password && <p style={authFormStyles.error}>{errors.password}</p>}

          <input
            type="password"
            name="passwordConfirm"
            placeholder="Confirm password"
            value={values.passwordConfirm}
            onChange={handleChange}
            autoComplete="new-password"
            style={authFormStyles.input}
          />
          {errors.passwordConfirm && <p style={authFormStyles.error}>{errors.passwordConfirm}</p>}

          <button type="submit" disabled={isSubmitting} style={authFormStyles.button}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p style={{ marginTop: "24px", textAlign: "center", color: "#64748b", fontSize: "14px" }}>
          Already have an account?{" "}
          <Link to="/login" style={authFormStyles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
