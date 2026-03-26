import { describe, it, expect } from "vitest";
import { login, createItinerary, getItineraries } from "../../services/api";
import { server } from "../mocks/server";
import { HttpResponse, http } from "msw";

const API_URL = "http://localhost:8000/api";

describe("API Service - Authentication Endpoints", () => {
  describe("login", () => {
    it("should successfully authenticate with valid credentials", async () => {
      const result = await login("test@example.com", "password123");

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

      await login("alice@example.com", "secure-pass");
    });

    it("should handle authentication failures with 401 response", async () => {
      server.use(
        http.post(`${API_URL}/auth/token/`, () =>
          HttpResponse.json({ detail: "Invalid credentials" }, { status: 401 }),
        ),
      );

      try {
        await login("wrong@example.com", "wrongpass");
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.response.status).toBe(401);
        expect(err.response.data.detail).toBe("Invalid credentials");
      }
    });

    it("should handle network errors gracefully", async () => {
      server.use(http.post(`${API_URL}/auth/token/`, () => HttpResponse.error()));

      try {
        await login("user@example.com", "pass");
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });
});

describe("API Service - Itinerary Endpoints", () => {
  describe("getItineraries", () => {
    it("should fetch all itineraries", async () => {
      const result = await getItineraries();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
      expect(result[0]).toEqual({
        id: 1,
        title: "Paris Trip",
        destination: "Paris",
        start_date: "2024-01-15",
        end_date: "2024-01-22",
        activities: [],
      });
    });
  });

  describe("createItinerary", () => {
    it("should successfully create new itinerary", async () => {
      const itineraryData = {
        title: "Tokyo Trip",
        destination: "Tokyo",
        start_date: "2024-02-01",
        end_date: "2024-02-10",
        activities: [],
      };

      const result = await createItinerary(itineraryData);

      expect(result).toEqual({
        id: 2,
        title: "Tokyo Trip",
        destination: "Tokyo",
        start_date: "2024-02-01",
        end_date: "2024-02-10",
        activities: [],
      });
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
        await createItinerary({
          title: "",
          destination: "",
          start_date: "2024-01-01",
          end_date: "2024-01-02",
          activities: [],
        });
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.response.status).toBe(400);
      }
    });
  });
});

describe("API Service - Request Interceptors", () => {
  it("should include authorization header with valid token", async () => {
    // Setup: Store a token in localStorage
    localStorage.setItem("access_token", "test-bearer-token");

    server.use(
      http.get(`${API_URL}/itineraries/my/`, ({ request }) => {
        const authHeader = request.headers.get("Authorization");
        expect(authHeader).toBe("Bearer test-bearer-token");
        return HttpResponse.json([]);
      }),
    );

    await getItineraries();
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

    await getItineraries();
  });
});
