import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../test-utils";
import ItineraryForm from "../../pages/ItineraryForm";
import { server } from "../mocks/server";
import { HttpResponse, http } from "msw";
import * as router from "react-router-dom";

const API_URL = "http://localhost:8000/api";

// Mock useParams for testing both create and edit modes
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
  };
});

describe("ItineraryForm - Core Domain Logic & Validation", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("access_token", "test-token");
    vi.clearAllMocks();
    router.useParams.mockReturnValue({});
    router.useNavigate.mockReturnValue(vi.fn());
  });

  describe("Required Field Validation", () => {
    it("should require title field", async () => {
      const user = userEvent.setup();
      router.useParams.mockReturnValue({});

      renderWithProviders(<ItineraryForm />);

      const destinationInput = screen.getByPlaceholderText(/destination/i);
      const submitButton = screen.getByRole("button", { name: /save|create/i });

      await user.type(destinationInput, "Paris");

      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Title is required.")).toBeInTheDocument();
      });
    });

    it("should require destination field", async () => {
      const user = userEvent.setup();
      router.useParams.mockReturnValue({});

      renderWithProviders(<ItineraryForm />);

      const titleInput = screen.getByPlaceholderText(/title/i);
      const submitButton = screen.getByRole("button", { name: /save|create/i });

      await user.type(titleInput, "Summer Trip");
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Destination is required."),
        ).toBeInTheDocument();
      });
    });

    it("should require start date and end date", async () => {
      const user = userEvent.setup();
      router.useParams.mockReturnValue({});

      renderWithProviders(<ItineraryForm />);

      const titleInput = screen.getByPlaceholderText(/title/i);
      const destinationInput = screen.getByPlaceholderText(/destination/i);
      const submitButton = screen.getByRole("button", { name: /save|create/i });

      await user.type(titleInput, "Summer Trip");
      await user.type(destinationInput, "Paris");
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Start date and end date are required."),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Date Range Validation - Core Business Logic", () => {
    it("should require end date to be on or after start date", async () => {
      const user = userEvent.setup();
      router.useParams.mockReturnValue({});

      renderWithProviders(<ItineraryForm />);

      const titleInput = screen.getByPlaceholderText(/title/i);
      const destinationInput = screen.getByPlaceholderText(/destination/i);
      const startDateInputs = screen
        .getAllByType("input")
        .filter((input) => input.type === "date");
      const startDateInput = startDateInputs[0];
      const endDateInput = startDateInputs[1];
      const submitButton = screen.getByRole("button", { name: /save|create/i });

      await user.type(titleInput, "Trip");
      await user.type(destinationInput, "Paris");

      // Set dates where end < start
      await user.type(startDateInput, "2024-12-31");
      await user.type(endDateInput, "2024-01-01");

      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("End date must be on or after start date."),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Form Submission - Create Mode", () => {
    it("should successfully create itinerary with valid data", async () => {
      const user = userEvent.setup();
      const mockNavigate = vi.fn();
      router.useParams.mockReturnValue({});
      router.useNavigate.mockReturnValue(mockNavigate);

      renderWithProviders(<ItineraryForm />);

      const titleInput = screen.getByPlaceholderText(/title/i);
      const destinationInput = screen.getByPlaceholderText(/destination/i);
      const dateInputs = screen
        .getAllByType("input")
        .filter((input) => input.type === "date");
      const startDateInput = dateInputs[0];
      const endDateInput = dateInputs[1];
      const submitButton = screen.getByRole("button", { name: /save|create/i });

      await user.type(titleInput, "Tokyo Adventure");
      await user.type(destinationInput, "Tokyo");
      await user.type(startDateInput, "2024-02-01");
      await user.type(endDateInput, "2024-02-10");

      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
      });
    });
  });

  describe("Form Submission - Edit Mode", () => {
    it("should successfully update itinerary in edit mode", async () => {
      const user = userEvent.setup();
      const mockNavigate = vi.fn();

      router.useParams.mockReturnValue({ id: "1" });
      router.useNavigate.mockReturnValue(mockNavigate);

      renderWithProviders(<ItineraryForm />);

      await waitFor(() => {
        expect(screen.getByDisplayValue("Paris Trip")).toBeInTheDocument();
      });

      const titleInput = screen.getByDisplayValue("Paris Trip");
      const submitButton = screen.getByRole("button", { name: /save|update/i });

      await user.clear(titleInput);
      await user.type(titleInput, "Updated Paris Trip");

      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
      });
    });
  });

  describe("Error Handling", () => {
    it("should display error message on API failure", async () => {
      const user = userEvent.setup();
      const mockNavigate = vi.fn();

      router.useParams.mockReturnValue({});
      router.useNavigate.mockReturnValue(mockNavigate);

      server.use(
        http.post(`${API_URL}/itineraries/my/`, () =>
          HttpResponse.json(
            { detail: "Failed to save itinerary" },
            { status: 400 },
          ),
        ),
      );

      renderWithProviders(<ItineraryForm />);

      const titleInput = screen.getByPlaceholderText(/title/i);
      const destinationInput = screen.getByPlaceholderText(/destination/i);
      const dateInputs = screen
        .getAllByType("input")
        .filter((input) => input.type === "date");
      const startDateInput = dateInputs[0];
      const endDateInput = dateInputs[1];
      const submitButton = screen.getByRole("button");

      await user.type(titleInput, "Trip");
      await user.type(destinationInput, "Location");
      await user.type(startDateInput, "2024-01-01");
      await user.type(endDateInput, "2024-01-05");

      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Failed to save itinerary/i),
        ).toBeInTheDocument();
      });
    });

    it("should show generic error on network failure", async () => {
      const user = userEvent.setup();
      const mockNavigate = vi.fn();

      router.useParams.mockReturnValue({});
      router.useNavigate.mockReturnValue(mockNavigate);

      server.use(
        http.post(`${API_URL}/itineraries/my/`, () => HttpResponse.error()),
      );

      renderWithProviders(<ItineraryForm />);

      const titleInput = screen.getByPlaceholderText(/title/i);
      const destinationInput = screen.getByPlaceholderText(/destination/i);
      const dateInputs = screen
        .getAllByType("input")
        .filter((input) => input.type === "date");
      const submitButton = screen.getByRole("button");

      await user.type(titleInput, "Trip");
      await user.type(destinationInput, "Location");
      await user.type(dateInputs[0], "2024-01-01");
      await user.type(dateInputs[1], "2024-01-05");

      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Failed to save itinerary/i),
        ).toBeInTheDocument();
      });
    });
  });
});
