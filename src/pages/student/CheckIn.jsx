import { useState, useEffect } from 'react';
import { useCheckIn } from '../../context/CheckInContext';
import { useAuth } from '../../context/AuthContext';
import './CheckIn.css';

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
    <div className="checkin-page">
      <h2>Check In / Out</h2>

      {/* Location Display */}
      <div className="location-section">
        <h3>📍 Current Location</h3>
        {locationLoading && <p className="loading">Getting your location...</p>}
        {locationError && <p className="error">❌ {locationError}</p>}
        {location && (
          <div className="location-display">
            <p><strong>Latitude:</strong> {location.latitude.toFixed(6)}</p>
            <p><strong>Longitude:</strong> {location.longitude.toFixed(6)}</p>
          </div>
        )}
      </div>

      {/* Current Status */}
      <div className="status-section">
        <h3>Status</h3>
        {isCheckedIn ? (
          <div className="status-card checked-in">
            <p className="status-label">✅ Checked In</p>
            <p className="status-time">Since: {formatDateTime(currentCheckIn.checkInTime)}</p>
          </div>
        ) : (
          <div className="status-card checked-out">
            <p className="status-label">⭕ Not Checked In</p>
          </div>
        )}
      </div>

      {/* Check-in/out Button */}
      <div className="action-section">
        {isCheckedIn ? (
          <button className="checkout-button" onClick={handleCheckOut}>
            Check Out
          </button>
        ) : (
          <button 
            className="checkin-button" 
            onClick={handleCheckIn}
            disabled={!location}
          >
            Check In
          </button>
        )}
        {!location && !locationLoading && (
          <p className="button-note">Enable location to check in</p>
        )}
      </div>

      {/* Check-in History */}
      {myCheckIns.length > 0 && (
        <div className="history-section">
          <h3>Recent Check-ins</h3>
          <div className="history-list">
            {myCheckIns.map((checkIn) => (
              <div key={checkIn.id} className="history-item">
                <div className="history-time">
                  <span className="check-in-time">
                    🟢 {formatDateTime(checkIn.checkInTime)}
                  </span>
                  <span className="check-out-time">
                    🔴 {formatDateTime(checkIn.checkOutTime)}
                  </span>
                </div>
                <div className="history-duration">
                  Duration: <strong>{checkIn.duration}</strong>
                </div>
                <div className="history-location">
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