import { useState } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from './lib/supabase';

function App() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdate = async () => {
    if (!latitude || !longitude) {
      setMessage('Please enter both latitude and longitude');
      return;
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      setMessage('Please enter valid numbers');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('coordinates')
        .insert([{ latitude: lat, longitude: lon }]);

      if (error) throw error;

      setMessage('Coordinates updated successfully!');
      setLatitude('');
      setLongitude('');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-black py-6 px-8">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-black fill-black" />
          <h1 className="text-3xl font-bold text-black">Muure</h1>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="space-y-6">
            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-black mb-2">
                Latitude
              </label>
              <input
                id="latitude"
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Enter latitude"
                className="w-full px-4 py-3 border-2 border-black bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-black mb-2">
                Longitude
              </label>
              <input
                id="longitude"
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Enter longitude"
                className="w-full px-4 py-3 border-2 border-black bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <button
              onClick={handleUpdate}
              disabled={loading}
              className="w-full bg-black text-white py-3 px-6 font-semibold hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Updating...' : 'Update'}
            </button>

            {message && (
              <p className={`text-sm text-center ${message.includes('Error') ? 'text-gray-600' : 'text-black'}`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
