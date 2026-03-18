import { useState } from 'react';
import CreateItinerary from './components/CreateItinerary';

function App() {
  const [message, setMessage] = useState('');

  const handleSuccess = () => {
    setMessage('Itinerary created successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Travel Itinerary</h1>
      
      {message && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '10px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          {message}
        </div>
      )}
      
      <CreateItinerary onSuccess={handleSuccess} />
    </div>
  );
}

export default App;