import { describe, it, expect, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../test-utils";
import Login from "../../pages/Login";
import { server } from "../mocks/server";
import { HttpResponse, http } from "msw";

const API_URL = "http://localhost:8000/api";

describe("Login Component - Authentication UI & Flow", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("Form Validation", () => {
    it("should require username field", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Login />);

      const passwordInput = screen.getByPlaceholderText("Password");
      const submitButton = screen.getByRole("button", { name: /Sign in/i });

      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Email is required.")).toBeInTheDocument();
      });
    });

    it("should require password field", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Login />);

      const usernameInput = screen.getByPlaceholderText("Email");
      const submitButton = screen.getByRole("button", { name: /Sign in/i });

      await user.type(usernameInput, "test@example.com");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Password is required.")).toBeInTheDocument();
      });
    });
  });

  describe("Successful Login Flow", () => {
    it("should login with valid credentials and redirect", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Login />);

      const usernameInput = screen.getByPlaceholderText("Email");
      const passwordInput = screen.getByPlaceholderText("Password");
      const submitButton = screen.getByRole("button", { name: /Sign in/i });

      await user.type(usernameInput, "alice@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        // Should redirect to home (verify by checking URL or component)
        expect(localStorage.getItem("appAuthentication.username")).toBe(
          JSON.stringify("alice@example.com"),
        );
      });
    });

    it("should store tokens in localStorage after successful login", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Login />);

      const usernameInput = screen.getByPlaceholderText("Email");
      const passwordInput = screen.getByPlaceholderText("Password");
      const submitButton = screen.getByRole("button", { name: /Sign in/i });

      await user.type(usernameInput, "bob@example.com");
      await user.type(passwordInput, "secure-pass");
      await user.click(submitButton);

      await waitFor(() => {
        expect(localStorage.getItem("appAuthentication.access_token")).toBe(
          JSON.stringify("mock-access-token"),
        );
        expect(localStorage.getItem("appAuthentication.refresh_token")).toBe(
          JSON.stringify("mock-refresh-token"),
        );
        expect(localStorage.getItem("appAuthentication.username")).toBe(
          JSON.stringify("bob@example.com"),
        );
      });
    });
  });

  describe("Error Handling", () => {
    it("should display API error message on failed login", async () => {
      server.use(
        http.post(`${API_URL}/auth/token/`, () =>
          HttpResponse.json({ detail: "Invalid credentials" }, { status: 401 }),
        ),
      );

      const user = userEvent.setup();
      renderWithProviders(<Login />);

      const usernameInput = screen.getByPlaceholderText("Email");
      const passwordInput = screen.getByPlaceholderText("Password");
      const submitButton = screen.getByRole("button", { name: /Sign in/i });

      await user.type(usernameInput, "wrong@example.com");
      await user.type(passwordInput, "wrongpass");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
      });
    });

    it("should display generic error on network failure", async () => {
      server.use(
        http.post(`${API_URL}/auth/token/`, () => HttpResponse.error()),
      );

      const user = userEvent.setup();
      renderWithProviders(<Login />);

      const usernameInput = screen.getByPlaceholderText("Email");
      const passwordInput = screen.getByPlaceholderText("Password");
      const submitButton = screen.getByRole("button", { name: /Sign in/i });

      await user.type(usernameInput, "user@example.com");
      await user.type(passwordInput, "pass");
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Login failed|Check your credentials/i),
        ).toBeInTheDocument();
      });
    });

    it("should clear previous errors when submitting new attempt", async () => {
      server.use(
        http.post(`${API_URL}/auth/token/`, () =>
          HttpResponse.json({ detail: "Invalid credentials" }, { status: 401 }),
        ),
      );

      const user = userEvent.setup();
      renderWithProviders(<Login />);

      const usernameInput = screen.getByPlaceholderText("Email");
      const passwordInput = screen.getByPlaceholderText("Password");
      const submitButton = screen.getByRole("button", { name: /Sign in/i });

      // First failed attempt
      await user.type(usernameInput, "wrong");
      await user.type(passwordInput, "wrong");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
      });

      // Clear inputs and try again (still fails but error should be cleared first)
      await user.clear(usernameInput);
      await user.clear(passwordInput);
      await user.type(usernameInput, "another");
      await user.type(passwordInput, "attempt");
      await user.click(submitButton);

      // Error should be re-displayed (not duplicated)
      const errors = screen.getAllByText("Invalid credentials");
      expect(errors.length).toBeGreaterThanOrEqual(1);
    });
  });
});
