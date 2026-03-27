import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider } from "../../context/AuthContext";
import { useAuth } from "../../context/useAuth";

describe("AuthContext - Core Authentication Domain Logic", () => {
  beforeEach(() => {
    // Clear localStorage before each test for isolation
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("Authentication State Initialization", () => {
    it("should initialize with logged out state when no tokens exist", () => {
      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isLoggedIn).toBe(false);
      expect(result.current.username).toBeNull();
      expect(result.current.user.email).toBeNull();
    });
  });

  describe("Login Action", () => {
    it("should set authenticated state and persist tokens to localStorage", () => {
      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.login("access-token-123", "refresh-token-456", "bob");
      });

      // State should update
      expect(result.current.isLoggedIn).toBe(true);
      expect(result.current.username).toBe("bob");

      // Tokens should be persisted
      expect(localStorage.getItem("appAuthentication.access_token")).toBe(
        JSON.stringify("access-token-123"),
      );
      expect(localStorage.getItem("appAuthentication.refresh_token")).toBe(
        JSON.stringify("refresh-token-456"),
      );
      expect(localStorage.getItem("appAuthentication.username")).toBe(
        JSON.stringify("bob"),
      );
    });

    it("should update user email based on username", () => {
      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.login("token", "refresh", "charlie");
      });

      expect(result.current.user.email).toBe("charlie@example.com");
    });
  });

  describe("Logout Action", () => {
    it("should clear authenticated state and localStorage", () => {
      // Setup: User logged in with session
      localStorage.setItem(
        "appAuthentication.access_token",
        JSON.stringify("token"),
      );
      localStorage.setItem(
        "appAuthentication.refresh_token",
        JSON.stringify("refresh"),
      );
      localStorage.setItem(
        "appAuthentication.username",
        JSON.stringify("alice"),
      );

      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Verify logged in before logout
      expect(result.current.isLoggedIn).toBe(true);

      act(() => {
        result.current.logout();
      });

      // State should clear
      expect(result.current.isLoggedIn).toBe(false);
      expect(result.current.username).toBeNull();
      expect(result.current.user.email).toBeNull();

      // Storage should be cleared
      expect(localStorage.getItem("appAuthentication.access_token")).toBeNull();
      expect(
        localStorage.getItem("appAuthentication.refresh_token"),
      ).toBeNull();
      expect(localStorage.getItem("appAuthentication.username")).toBeNull();
    });

    it("should only clear auth-related storage, not other data", () => {
      // Setup: Mixed storage with auth and non-auth data
      localStorage.setItem(
        "appAuthentication.access_token",
        JSON.stringify("token"),
      );
      localStorage.setItem("other.data", "should-remain");

      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.logout();
      });

      // Auth data should clear
      expect(localStorage.getItem("appAuthentication.access_token")).toBeNull();
      // Other data should remain
      expect(localStorage.getItem("other.data")).toBe("should-remain");
    });
  });

  describe("Token Management", () => {
    it("should retrieve access token correctly", () => {
      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.login("my-access-token", "refresh-token", "userA");
      });

      expect(result.current.getAccessToken()).toBe("my-access-token");
    });

    it("should retrieve refresh token correctly", () => {
      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.login("access-token", "my-refresh-token", "userA");
      });

      expect(result.current.getRefreshToken()).toBe("my-refresh-token");
    });

    it("should return null for tokens when not logged in", () => {
      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.getAccessToken()).toBeNull();
      expect(result.current.getRefreshToken()).toBeNull();
    });
  });

  describe("Multiple Context Consumers", () => {
    it("should maintain consistent state across multiple hook calls", () => {
      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

      const { result: result1 } = renderHook(() => useAuth(), { wrapper });
      const { result: result2 } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result1.current.login("token", "refresh", "eve");
      });

      // Both consumers should see updated state
      expect(result1.current.isLoggedIn).toBe(true);
      expect(result2.current.isLoggedIn).toBe(true);
      expect(result1.current.username).toBe("eve");
      expect(result2.current.username).toBe("eve");
    });
  });
});
