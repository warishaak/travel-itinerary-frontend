import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { Register, Login } from './components/Authentication';
import Home from './pages/Home';
import ItineraryDetails from './pages/ItineraryDetails';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
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
        path="/create-itinerary"
        element={
          <ProtectedRoute>
            <ItineraryDetails />
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