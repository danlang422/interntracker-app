import { useState, useEffect } from 'react';
import { useCheckIn } from '../../context/CheckInContext';
import { useAuth } from '../../context/AuthContext';

function CheckIn() {
  // State for current location
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const { user } = useAuth();

  // Get check-in state and functions from context
  const { isUserCheckedIn, getCurrentCheckIn, checkInHistory, checkIn, checkOut } = useCheckIn();

  // Get this user's current check-in status
  const isCheckedIn = isUserCheckedIn(user.id);
  const currentCheckIn = getCurrentCheckIn(user.id);

  // Filter check-in history for this student
  const myCheckIns = checkInHistory.filter(c => c.studentId === user.id);

  // Get user's location when component loads
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationLoading(false);
        },
        (error) => {
          setLocationError(error.message);
          setLocationLoading(false);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser');
      setLocationLoading(false);
    }
  }, []);

  // Handle check-in using context function
  const handleCheckIn = () => {
    checkIn(user.id, user.name, location);
  };

  // Handle check-out using context function
  const handleCheckOut = () => {
    checkOut(user.id);
  };

  // Format date/time for display
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="max-w-[600px] mx-auto p-4">
      <h2 className="mb-6 text-[#262626]">Check In / Out</h2>

      {/* Location Display */}
      <div className="bg-white p-6 rounded-xl mb-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        <h3 className="text-lg mb-3 text-[#262626]">📍 Current Location</h3>
        {locationLoading && <p className="text-[#667eea] italic">Getting your location...</p>}
        {locationError && <p className="text-[#e74c3c] font-medium">❌ {locationError}</p>}
        {location && (
          <div>
            <p className="my-2 text-[#666]"><strong>Latitude:</strong> {location.latitude.toFixed(6)}</p>
            <p className="my-2 text-[#666]"><strong>Longitude:</strong> {location.longitude.toFixed(6)}</p>
          </div>
        )}
      </div>

      {/* Current Status */}
      <div className="bg-white p-6 rounded-xl mb-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        <h3 className="text-lg mb-3 text-[#262626]">Status</h3>
        {isCheckedIn ? (
          <div className="p-6 rounded-lg text-center bg-gradient-to-br from-[#d4f1f4] to-[#c3e8ee] border-2 border-[#5dade2]">
            <p className="text-2xl font-semibold m-0 mb-2">✅ Checked In</p>
            <p className="m-0 text-[#666] text-sm">Since: {formatDateTime(currentCheckIn.checkInTime)}</p>
          </div>
        ) : (
          <div className="p-6 rounded-lg text-center bg-[#f5f5f5] border-2 border-[#ddd]">
            <p className="text-2xl font-semibold m-0">⭕ Not Checked In</p>
          </div>
        )}
      </div>

      {/* Check-in/out Button */}
      <div className="text-center mb-6">
        {isCheckedIn ? (
          <button
            className="w-full max-w-[400px] p-6 text-2xl font-semibold border-none rounded-xl cursor-pointer transition-all shadow-[0_4px_12px_rgba(0,0,0,0.15)] bg-gradient-to-br from-[#f093fb] to-[#f5576c] text-white hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)]"
            onClick={handleCheckOut}
          >
            Check Out
          </button>
        ) : (
          <button
            className="w-full max-w-[400px] p-6 text-2xl font-semibold border-none rounded-xl cursor-pointer transition-all shadow-[0_4px_12px_rgba(0,0,0,0.15)] bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] disabled:bg-[#ccc] disabled:cursor-not-allowed disabled:shadow-none md:text-xl md:p-5"
            onClick={handleCheckIn}
            disabled={!location}
          >
            Check In
          </button>
        )}
        {!location && !locationLoading && (
          <p className="mt-3 text-[#999] text-sm">Enable location to check in</p>
        )}
      </div>

      {/* Check-in History */}
      {myCheckIns.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] md:p-4">
          <h3 className="text-lg mb-3 text-[#262626]">Recent Check-ins</h3>
          <div className="flex flex-col gap-4">
            {myCheckIns.map((checkIn) => (
              <div key={checkIn.id} className="p-4 bg-[#fafafa] rounded-lg border-l-4 border-[#667eea]">
                <div className="flex flex-col gap-1 mb-2 text-sm">
                  <span className="text-[#666]">
                    🟢 {formatDateTime(checkIn.checkInTime)}
                  </span>
                  <span className="text-[#666]">
                    🔴 {formatDateTime(checkIn.checkOutTime)}
                  </span>
                </div>
                <div className="mb-2 text-[#333]">
                  Duration: <strong>{checkIn.duration}</strong>
                </div>
                <div className="text-[13px] text-[#999]">
                  📍 {checkIn.location.latitude.toFixed(4)}, {checkIn.location.longitude.toFixed(4)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckIn;