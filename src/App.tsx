import { useState, useEffect, useRef } from 'react';
import { Heart, MapPin } from 'lucide-react';
import { Geolocation } from '@capacitor/geolocation';
import { supabase } from './lib/supabase';


const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const mapStyleId = '12faf718a36ce4b050d9c71d'; 

function App() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [locationError, setLocationError] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      getCurrentPosition();
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (latitude !== null && longitude !== null && mapRef.current && window.google) {
      initializeMap();
    }
  }, [latitude, longitude]);

  const initializeMap = () => {
    if (!mapRef.current || latitude === null || longitude === null) return;

    const position = { lat: latitude, lng: longitude };

    if (!googleMapRef.current) {
      googleMapRef.current = new google.maps.Map(mapRef.current, {
        center: position,
        mapId: mapStyleId,
        zoom: 15,
        disableDefaultUI: true,
        gestureHandling: "greedy",
      });
    } else {
      googleMapRef.current.setCenter(position);
    }

    // Update or create marker
    if (markerRef.current) {
      markerRef.current.setPosition(position);
    } else {
      markerRef.current = new google.maps.Marker({
        position: position,
        map: googleMapRef.current,
      });
    }
  };

  const getCurrentPosition = async () => {
    try {
      setLocationError('');
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
      setLatitude(coordinates.coords.latitude);
      setLongitude(coordinates.coords.longitude);
    } catch (error) {
      setLocationError(`Error getting location: ${error.message}`);
      console.error('Error getting location:', error);
    }
  };

  const handleUpdate = async () => {
    if (latitude === null || longitude === null) {
      setMessage('Location not available. Please enable location permissions.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('coordinates')
        .insert([{ latitude, longitude }]);

      if (error) throw error;

      setMessage('Coordinates updated successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <header className="border-b border-black py-6 px-8 shrink-0">
        <div className="flex items-center gap-3 w-full justify-center">
          <Heart className="w-8 h-8 text-black fill-black" />
          <h1 className="text-3xl font-bold text-black">Muure - Positioner</h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-4 sm:p-8 min-h-0">
        <div className="w-full max-w-4xl mx-auto flex flex-col h-full gap-4 sm:gap-6">
          {/* Current Location Display */}
          <div className="bg-gray-50 border-2 border-neutral-500 rounded-2xl overflow-hidde p-4 shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-black" />
              <h2 className="text-lg font-semibold text-black">Current Location</h2>
            </div>
            {latitude !== null && longitude !== null ? (
              <div className="text-sm text-black">
                <p>Latitude: {latitude.toFixed(6)}</p>
                <p>Longitude: {longitude.toFixed(6)}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Loading location...</p>
            )}
            {locationError && (
              <p className="text-sm text-gray-600 mt-2">{locationError}</p>
            )}
            <button
              onClick={getCurrentPosition}
              className="mt-3 rounded-2xl px-4 py-2 border-2 border-black bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              Refresh Location
            </button>
          </div>

          {/* Map Container */}
          <div ref={mapRef} className="border-2 border-neutral-500 rounded-2xl overflow-hidde flex-1 w-full min-h-0" />

          {/* Update Button */}
          <button
            onClick={handleUpdate}
            disabled={loading || latitude === null || longitude === null}
            className="w-full rounded-2xl bg-black text-white py-3 px-6 font-semibold hover:bg-gray-800 disabled:bg-gray-400 transition-colors shrink-0"
          >
            {loading ? 'Updating...' : 'Update Location'}
          </button>

          {message && (
            <p className={`text-sm text-center ${message.includes('Error') ? 'text-gray-600' : 'text-black'}`}>
              {message}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
