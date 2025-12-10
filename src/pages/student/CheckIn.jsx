import { useState, useEffect } from 'react';
import './CheckIn.css';

function CheckIn() {
  // State for current location
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);

  // State for check-in status
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentCheckIn, setCurrentCheckIn] = useState(null);

  // State for check-in history
  const [checkInHistory, setCheckInHistory] = useState([]);

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

  // Handle check-in
  const handleCheckIn = () => {
    const checkIn = {
      id: Date.now(), // Simple ID using timestamp
      checkInTime: new Date().toISOString(),
      checkOutTime: null,
      location: location,
      duration: null
    };

    setCurrentCheckIn(checkIn);
    setIsCheckedIn(true);
  };

  // Handle check-out
  const handleCheckOut = () => {
    if (!currentCheckIn) return;

    const checkOutTime = new Date();
    const checkInTime = new Date(currentCheckIn.checkInTime);
    const durationMs = checkOutTime - checkInTime;
    
    // Calculate hours and minutes
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    const completedCheckIn = {
      ...currentCheckIn,
      checkOutTime: checkOutTime.toISOString(),
      duration: `${hours}h ${minutes}m`
    };

    // Add to history
    setCheckInHistory([completedCheckIn, ...checkInHistory]);
    
    // Reset current check-in
    setCurrentCheckIn(null);
    setIsCheckedIn(false);
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
      {checkInHistory.length > 0 && (
        <div className="history-section">
          <h3>Recent Check-ins</h3>
          <div className="history-list">
            {checkInHistory.map((checkIn) => (
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