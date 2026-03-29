import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { useAuth } from "./context/useAuth";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Home from "./pages/Home.jsx";
import ItineraryList from "./pages/ItineraryList.jsx";
import ItineraryForm from "./pages/ItineraryForm.jsx";
import ItineraryDetail from "./pages/ItineraryDetail.jsx";
import Profile from "./pages/Profile.jsx";
import PublicTrips from "./pages/PublicTrips.jsx";
import PublicItineraryDetail from "./pages/PublicItineraryDetail.jsx";

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#64748b",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<PublicTrips />} />
      <Route path="/explore" element={<PublicTrips />} />
      <Route path="/explore/:id" element={<PublicItineraryDetail />} />
      <Route
        path="/login"
        element={user ? <Navigate to="/my-trips" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/my-trips" replace /> : <Register />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route
        path="/my-trips"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/itineraries"
        element={
          <ProtectedRoute>
            <ItineraryList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/itineraries/new"
        element={
          <ProtectedRoute>
            <ItineraryForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/itineraries/:id/edit"
        element={
          <ProtectedRoute>
            <ItineraryForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/itineraries/:id"
        element={
          <ProtectedRoute>
            <ItineraryDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </HashRouter>
  );
}
