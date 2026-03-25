import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ItineraryDetails from "./pages/ItineraryDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-itinerary" element={<ItineraryDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
