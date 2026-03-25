import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const API_URL = "http://localhost:8000/api";

// Define request handlers for different scenarios
export const handlers = [
  // Authentication endpoints
  http.post(`${API_URL}/token/`, async () => {
    return HttpResponse.json({
      access: "mock-access-token",
      refresh: "mock-refresh-token",
    });
  }),

  http.post(`${API_URL}/token/refresh/`, async () => {
    return HttpResponse.json({
      access: "mock-new-access-token",
    });
  }),

  http.post(`${API_URL}/register/`, async () => {
    return HttpResponse.json({
      id: 1,
      username: "testuser",
      email: "test@example.com",
    });
  }),

  // Itinerary endpoints
  http.get(`${API_URL}/itineraries/`, async () => {
    return HttpResponse.json([
      {
        id: 1,
        title: "Paris Trip",
        destination: "Paris",
        start_date: "2024-01-15",
        end_date: "2024-01-22",
        activities: [],
      },
    ]);
  }),

  http.get(`${API_URL}/itineraries/:id/`, async ({ params }) => {
    if (params.id === "1") {
      return HttpResponse.json({
        id: 1,
        title: "Paris Trip",
        destination: "Paris",
        start_date: "2024-01-15",
        end_date: "2024-01-22",
        activities: [],
      });
    }
    return HttpResponse.json({ detail: "Not found" }, { status: 404 });
  }),

  http.post(`${API_URL}/itineraries/`, async () => {
    return HttpResponse.json(
      {
        id: 2,
        title: "Tokyo Trip",
        destination: "Tokyo",
        start_date: "2024-02-01",
        end_date: "2024-02-10",
        activities: [],
      },
      { status: 201 },
    );
  }),

  http.put(`${API_URL}/itineraries/:id/`, async () => {
    return HttpResponse.json({
      id: 1,
      title: "Updated Paris Trip",
      destination: "Paris",
      start_date: "2024-01-15",
      end_date: "2024-01-22",
      activities: [],
    });
  }),

  http.delete(`${API_URL}/itineraries/:id/`, async () => {
    return HttpResponse.json(null, { status: 204 });
  }),
];

// Create the mock server
export const server = setupServer(...handlers);
