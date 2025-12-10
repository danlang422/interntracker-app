import { createContext, useState, useContext } from 'react';

// Create the context - this is like creating a "channel" that components can tune into
const CheckInContext = createContext();

// Provider component - this wraps our app and makes check-in data available everywhere
export function CheckInProvider({ children }) {
  // Store active check-ins by user ID (key = userId, value = check-in object)
  const [activeCheckIns, setActiveCheckIns] = useState({});
  
  // State for the history of all check-ins
  const [checkInHistory, setCheckInHistory] = useState([]);

  // Helper: Check if a specific user is checked in
  const isUserCheckedIn = (userId) => {
    return !!activeCheckIns[userId];
  };

  // Helper: Get current check-in for a specific user
  const getCurrentCheckIn = (userId) => {
    return activeCheckIns[userId] || null;
  };

  // Function to handle checking in
  const checkIn = (studentId, studentName, location) => {
    const newCheckIn = {
      id: Date.now(), // Simple ID using timestamp
      studentId: studentId,
      studentName: studentName,
      checkInTime: new Date().toISOString(),
      checkOutTime: null,
      location: location,
      duration: null,
      likes: [] // Array of user IDs who liked this
    };

    // Add to active check-ins for this user
    setActiveCheckIns({
      ...activeCheckIns,
      [studentId]: newCheckIn
    });
  };

  // Function to handle checking out
  const checkOut = (studentId) => {
    const currentCheckIn = activeCheckIns[studentId];
    
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

    // Add to history (newest first)
    setCheckInHistory([completedCheckIn, ...checkInHistory]);
    
    // Remove from active check-ins
    const newActiveCheckIns = { ...activeCheckIns };
    delete newActiveCheckIns[studentId];
    setActiveCheckIns(newActiveCheckIns);
  };

  // Function to toggle like on a check-in
  const toggleLikeCheckIn = (checkInId, userId) => {
    setCheckInHistory(checkInHistory.map(checkIn => {
      if (checkIn.id === checkInId) {
        const likes = checkIn.likes || [];
        const hasLiked = likes.includes(userId);
        
        return {
          ...checkIn,
          likes: hasLiked 
            ? likes.filter(id => id !== userId) // Remove like
            : [...likes, userId] // Add like
        };
      }
      return checkIn;
    }));
  };

  // Helper: Get all completed check-ins (for the feed)
  const getCompletedCheckIns = () => {
    return checkInHistory.filter(checkIn => checkIn.checkOutTime !== null);
  };

  // Helper: Get all check-ins for feed (both active and completed)
  const getAllCheckInsForFeed = () => {
    // Get active check-ins (convert object to array)
    const active = Object.values(activeCheckIns);
    // Combine with completed check-ins from history
    return [...active, ...checkInHistory];
  };

  // The "value" prop defines what data/functions are available to consuming components
  return (
    <CheckInContext.Provider value={{ 
      isUserCheckedIn,
      getCurrentCheckIn,
      checkInHistory,
      checkIn,
      checkOut,
      toggleLikeCheckIn,
      getCompletedCheckIns,
      getAllCheckInsForFeed
    }}>
      {children}
    </CheckInContext.Provider>
  );
}

// Custom hook to use check-in context
// This is a convenience function so components can easily access the context
export function useCheckIn() {
  const context = useContext(CheckInContext);
  if (!context) {
    throw new Error('useCheckIn must be used within CheckInProvider');
  }
  return context;
}
