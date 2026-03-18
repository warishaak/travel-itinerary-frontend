const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const createItinerary = async (data) => {
  const response = await fetch(`${API_URL}/itineraries/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create itinerary');
  }
  
  return response.json();
};

export const getItineraries = async () => {
  const response = await fetch(`${API_URL}/itineraries/`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch itineraries');
  }
  
  return response.json();
};