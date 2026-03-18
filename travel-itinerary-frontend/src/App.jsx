import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateItineraryPage from './pages/CreateItineraryPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-itinerary" element={<CreateItineraryPage />} />
      </Routes>
    </Router>
  );
}

export default App;