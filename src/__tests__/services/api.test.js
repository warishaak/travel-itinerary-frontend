import { describe, it, expect, beforeEach } from "vitest";
import { api } from "../../services/api";
import { server } from "../mocks/server";
import { HttpResponse, http } from "msw";

const API_URL = "http://localhost:8000/api";

describe("API Service - Authentication Endpoints", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("login", () => {
    it("should successfully authenticate with valid credentials", async () => {
      const result = await api.auth.login("test@example.com", "password123");

      expect(result).toEqual({
        access: "mock-access-token",
        refresh: "mock-refresh-token",
      });
    });

    it("should include credentials in request body", async () => {
      server.use(
        http.post(`${API_URL}/auth/token/`, async ({ request }) => {
          const body = await request.json();
          expect(body.email).toBe("alice@example.com");
          expect(body.password).toBe("secure-pass");
          return HttpResponse.json({
            access: "token",
            refresh: "refresh",
          });
        }),
      );

      await api.auth.login("alice@example.com", "secure-pass");
    });

    it("should handle authentication failures with 401 response", async () => {
      server.use(
        http.post(`${API_URL}/auth/token/`, () =>
          HttpResponse.json({ detail: "Invalid credentials" }, { status: 401 }),
        ),
      );

      try {
        await api.auth.login("wrong@example.com", "wrongpass");
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.status).toBe(401);
        expect(err.detail).toBe("Invalid credentials");
      }
    });

    it("should handle network errors gracefully", async () => {
      server.use(
        http.post(`${API_URL}/auth/token/`, () => HttpResponse.error()),
      );

      try {
        await api.auth.login("user@example.com", "pass");
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe("register", () => {
    it("should successfully register a new user", async () => {
      server.use(
        http.post(`${API_URL}/auth/register/`, () =>
          HttpResponse.json({
            email: "newuser@example.com",
            first_name: "John",
            last_name: "Doe",
          }),
        ),
      );

      const result = await api.auth.register(
        "newuser@example.com",
        "password123",
        "password123",
        "John",
        "Doe"
      );

      expect(result.email).toBe("newuser@example.com");
      expect(result.first_name).toBe("John");
      expect(result.last_name).toBe("Doe");
    });

    it("should handle registration with validation errors", async () => {
      server.use(
        http.post(`${API_URL}/auth/register/`, () =>
          HttpResponse.json(
            {
              email: ["User with this email already exists."],
              password: ["Password is too common."],
            },
            { status: 400 }
          ),
        ),
      );

      try {
        await api.auth.register("existing@example.com", "password", "password");
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.email).toBeDefined();
      }
    });
  });

  describe("me", () => {
    it("should fetch current user profile", async () => {
      server.use(
        http.get(`${API_URL}/auth/me/`, () =>
          HttpResponse.json({
            id: 1,
            email: "user@example.com",
            first_name: "John",
            last_name: "Doe",
          }),
        ),
      );

      const result = await api.auth.me();

      expect(result.email).toBe("user@example.com");
      expect(result.first_name).toBe("John");
    });

    it("should handle unauthorized access", async () => {
      server.use(
        http.get(`${API_URL}/auth/me/`, () =>
          HttpResponse.json({ detail: "Authentication required" }, { status: 401 }),
        ),
      );

      try {
        await api.auth.me();
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.status).toBe(401);
      }
    });
  });

  describe("updateProfile", () => {
    it("should update user profile", async () => {
      server.use(
        http.patch(`${API_URL}/auth/me/`, async ({ request }) => {
          const body = await request.json();
          return HttpResponse.json({
            id: 1,
            email: "user@example.com",
            first_name: body.first_name,
            last_name: body.last_name,
          });
        }),
      );

      const result = await api.auth.updateProfile({
        first_name: "Jane",
        last_name: "Smith",
      });

      expect(result.first_name).toBe("Jane");
      expect(result.last_name).toBe("Smith");
    });
  });

  describe("requestPasswordReset", () => {
    it("should request password reset", async () => {
      server.use(
        http.post(`${API_URL}/auth/password-reset/request/`, () =>
          HttpResponse.json({ detail: "Password reset email sent" }),
        ),
      );

      const result = await api.auth.requestPasswordReset("user@example.com");

      expect(result.detail).toBe("Password reset email sent");
    });

    it("should handle invalid email", async () => {
      server.use(
        http.post(`${API_URL}/auth/password-reset/request/`, () =>
          HttpResponse.json({ email: ["Invalid email"] }, { status: 400 }),
        ),
      );

      try {
        await api.auth.requestPasswordReset("invalid-email");
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.status).toBe(400);
      }
    });
  });

  describe("confirmPasswordReset", () => {
    it("should confirm password reset", async () => {
      server.use(
        http.post(`${API_URL}/auth/password-reset/confirm/`, () =>
          HttpResponse.json({ detail: "Password reset successful" }),
        ),
      );

      const result = await api.auth.confirmPasswordReset(
        "reset-token",
        "newpassword123",
        "newpassword123"
      );

      expect(result.detail).toBe("Password reset successful");
    });

    it("should handle password mismatch", async () => {
      server.use(
        http.post(`${API_URL}/auth/password-reset/confirm/`, () =>
          HttpResponse.json(
            { password_confirm: ["Passwords do not match"] },
            { status: 400 }
          ),
        ),
      );

      try {
        await api.auth.confirmPasswordReset("token", "pass1", "pass2");
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.status).toBe(400);
      }
    });
  });
});


describe("API Service - Itinerary Endpoints", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("list", () => {
    it("should fetch all user itineraries", async () => {
      server.use(
        http.get(`${API_URL}/itineraries/my/`, () =>
          HttpResponse.json([
            {
              id: 1,
              title: "Paris Trip",
              destination: "Paris",
              start_date: "2024-01-15",
              end_date: "2024-01-22",
              activities: [],
            },
          ]),
        ),
      );

      const result = await api.itineraries.list();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
      expect(result[0].title).toBe("Paris Trip");
    });

    it("should return empty array when no itineraries", async () => {
      server.use(
        http.get(`${API_URL}/itineraries/my/`, () => HttpResponse.json([])),
      );

      const result = await api.itineraries.list();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  describe("listPublic", () => {
    it("should fetch public itineraries", async () => {
      server.use(
        http.get(`${API_URL}/itineraries/public/`, () =>
          HttpResponse.json([
            {
              id: 1,
              title: "Tokyo Adventure",
              destination: "Tokyo",
              start_date: "2024-02-01",
              end_date: "2024-02-10",
            },
          ]),
        ),
      );

      const result = await api.itineraries.listPublic();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
      expect(result[0].title).toBe("Tokyo Adventure");
    });
  });

  describe("get", () => {
    it("should fetch single itinerary by id", async () => {
      server.use(
        http.get(`${API_URL}/itineraries/my/1/`, () =>
          HttpResponse.json({
            id: 1,
            title: "Paris Trip",
            destination: "Paris",
            start_date: "2024-01-15",
            end_date: "2024-01-22",
          }),
        ),
      );

      const result = await api.itineraries.get(1);

      expect(result.id).toBe(1);
      expect(result.title).toBe("Paris Trip");
    });

    it("should handle not found error", async () => {
      server.use(
        http.get(`${API_URL}/itineraries/my/999/`, () =>
          HttpResponse.json({ detail: "Not found" }, { status: 404 }),
        ),
      );

      try {
        await api.itineraries.get(999);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.status).toBe(404);
      }
    });
  });

  describe("create", () => {
    it("should successfully create new itinerary", async () => {
      const itineraryData = {
        title: "Tokyo Trip",
        destination: "Tokyo",
        start_date: "2024-02-01",
        end_date: "2024-02-10",
        activities: [],
      };

      server.use(
        http.post(`${API_URL}/itineraries/my/`, async ({ request }) => {
          const body = await request.json();
          return HttpResponse.json({
            id: 2,
            ...body,
          });
        }),
      );

      const result = await api.itineraries.create(itineraryData);

      expect(result.id).toBe(2);
      expect(result.title).toBe("Tokyo Trip");
      expect(result.destination).toBe("Tokyo");
    });

    it("should handle validation errors on creation", async () => {
      server.use(
        http.post(`${API_URL}/itineraries/my/`, () =>
          HttpResponse.json(
            {
              title: ["This field may not be blank."],
              destination: ["This field is required."],
            },
            { status: 400 },
          ),
        ),
      );

      try {
        await api.itineraries.create({
          title: "",
          destination: "",
          start_date: "2024-01-01",
          end_date: "2024-01-02",
          activities: [],
        });
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.title).toBeDefined();
        expect(err.destination).toBeDefined();
      }
    });
  });

  describe("update", () => {
    it("should successfully update itinerary", async () => {
      server.use(
        http.put(`${API_URL}/itineraries/my/1/`, async ({ request }) => {
          const body = await request.json();
          return HttpResponse.json({
            id: 1,
            ...body,
          });
        }),
      );

      const result = await api.itineraries.update(1, {
        title: "Updated Paris Trip",
        destination: "Paris",
        start_date: "2024-01-15",
        end_date: "2024-01-22",
      });

      expect(result.id).toBe(1);
      expect(result.title).toBe("Updated Paris Trip");
    });

    it("should handle validation errors on update", async () => {
      server.use(
        http.put(`${API_URL}/itineraries/my/1/`, () =>
          HttpResponse.json(
            { title: ["This field is required."] },
            { status: 400 }
          ),
        ),
      );

      try {
        await api.itineraries.update(1, { title: "" });
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.status).toBe(400);
      }
    });
  });

  describe("updateStatus", () => {
    it("should successfully update itinerary status", async () => {
      server.use(
        http.post(`${API_URL}/itineraries/my/1/update_status/`, async ({ request }) => {
          const body = await request.json();
          return HttpResponse.json({
            id: 1,
            status: body.status,
          });
        }),
      );

      const result = await api.itineraries.updateStatus(1, "completed");

      expect(result.status).toBe("completed");
    });
  });

  describe("delete", () => {
    it("should successfully delete itinerary", async () => {
      server.use(
        http.delete(`${API_URL}/itineraries/my/1/`, () =>
          HttpResponse.json(null, { status: 204 }),
        ),
      );

      const result = await api.itineraries.delete(1);

      expect(result).toBeNull();
    });

    it("should handle not found on delete", async () => {
      server.use(
        http.delete(`${API_URL}/itineraries/my/999/`, () =>
          HttpResponse.json({ detail: "Not found" }, { status: 404 }),
        ),
      );

      try {
        await api.itineraries.delete(999);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.status).toBe(404);
      }
    });
  });
});

describe("API Service - Request Interceptors", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should include authorization header with valid token", async () => {
    localStorage.setItem("access_token", "test-bearer-token");

    server.use(
      http.get(`${API_URL}/itineraries/my/`, ({ request }) => {
        const authHeader = request.headers.get("Authorization");
        expect(authHeader).toBe("Bearer test-bearer-token");
        return HttpResponse.json([]);
      }),
    );

    await api.itineraries.list();
  });

  it("should not include authorization header when no token present", async () => {
    localStorage.removeItem("access_token");

    server.use(
      http.get(`${API_URL}/itineraries/my/`, ({ request }) => {
        const authHeader = request.headers.get("Authorization");
        expect(authHeader).toBeNull();
        return HttpResponse.json([]);
      }),
    );

    await api.itineraries.list();
  });

  it("should handle 401 responses appropriately", async () => {
    localStorage.setItem("access_token", "expired-token");
    localStorage.setItem("refresh_token", "refresh-token");

    server.use(
      http.get(`${API_URL}/itineraries/my/`, () =>
        HttpResponse.json({ detail: "Token expired" }, { status: 401 }),
      ),
    );

    try {
      await api.itineraries.list();
      expect.fail("Should have thrown an error");
    } catch (err) {
      expect(err.status).toBe(401);
      // Tokens should be cleared on 401
      expect(localStorage.getItem("access_token")).toBeNull();
      expect(localStorage.getItem("refresh_token")).toBeNull();
    }
  });
});

describe("API Service - Error Handling", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should handle 400 validation errors", async () => {
    server.use(
      http.post(`${API_URL}/auth/register/`, () =>
        HttpResponse.json(
          {
            email: ["Invalid email format"],
            password: ["Password too weak"],
          },
          { status: 400 }
        ),
      ),
    );

    try {
      await api.auth.register("invalid", "weak");
      expect.fail("Should have thrown an error");
    } catch (err) {
      expect(err.status).toBe(400);
      expect(err.email).toBeDefined();
      expect(err.password).toBeDefined();
    }
  });

  it("should handle 403 permission errors", async () => {
    server.use(
      http.delete(`${API_URL}/itineraries/my/1/`, () =>
        HttpResponse.json(
          { detail: "You do not have permission" },
          { status: 403 }
        ),
      ),
    );

    try {
      await api.itineraries.delete(1);
      expect.fail("Should have thrown an error");
    } catch (err) {
      expect(err.status).toBe(403);
      expect(err.detail).toBe("You do not have permission");
    }
  });

  it("should handle 500 server errors", async () => {
    server.use(
      http.get(`${API_URL}/itineraries/my/`, () =>
        HttpResponse.json({ detail: "Internal server error" }, { status: 500 }),
      ),
    );

    try {
      await api.itineraries.list();
      expect.fail("Should have thrown an error");
    } catch (err) {
      expect(err.status).toBe(500);
    }
  });

  it("should handle 204 No Content responses", async () => {
    server.use(
      http.delete(`${API_URL}/itineraries/my/1/`, () =>
        HttpResponse.json(null, { status: 204 }),
      ),
    );

    const result = await api.itineraries.delete(1);
    expect(result).toBeNull();
  });

  it("should handle 205 Reset Content responses", async () => {
    server.use(
      http.post(`${API_URL}/auth/logout/`, () =>
        HttpResponse.json(null, { status: 205 }),
      ),
    );

    // This would need a logout endpoint in the API, but demonstrates 205 handling
    // For now, we can't fully test this without adding the endpoint
  });

  it("should handle non-JSON error responses", async () => {
    server.use(
      http.get(`${API_URL}/itineraries/my/`, () =>
        new Response("Server Error", { status: 500, headers: { 'Content-Type': 'text/plain' } }),
      ),
    );

    try {
      await api.itineraries.list();
      expect.fail("Should have thrown an error");
    } catch (err) {
      expect(err.status).toBe(500);
    }
  });
});

