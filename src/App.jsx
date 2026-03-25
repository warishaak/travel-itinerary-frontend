import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from './pages/Login';
import Register from './pages/Register';
import Home from "./pages/Home";
import ItineraryForm from "./pages/ItineraryForm";

import ItineraryDetails from "./pages/ItineraryDetails";

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  return isLoggedIn ? children : null;
};
function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
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
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-itinerary"
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
            <ItineraryDetails />
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
      <Route path="*" element={<h2>404 Not Found</h2>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
