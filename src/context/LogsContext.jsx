import { createContext, useState, useContext } from 'react';

const LogsContext = createContext();

export function LogsProvider({ children }) {
  // Store all logs from all users
  const [allLogs, setAllLogs] = useState([]);

  // Function to create a new log
  // Note: studentId and studentName must be passed in from the component
  const createLog = (studentId, studentName, content, isPublic = false) => {
    const newLog = {
      id: Date.now(),
      studentId: studentId,
      studentName: studentName,
      content: content,
      isPublic: isPublic,
      timestamp: new Date().toISOString(),
      likes: [], // Array of user IDs who liked this
      comments: [] // For future mentor/advisor comments
    };

    setAllLogs([newLog, ...allLogs]); // Add to beginning (newest first)
  };

  // Function to update/edit a log
  const updateLog = (logId, updates) => {
    setAllLogs(allLogs.map(log => 
      log.id === logId ? { ...log, ...updates } : log
    ));
  };

  // Function to delete a log
  const deleteLog = (logId) => {
    setAllLogs(allLogs.filter(log => log.id !== logId));
  };

  // Helper: Get logs for a specific student
  const getLogsForStudent = (studentId) => {
    return allLogs.filter(log => log.studentId === studentId);
  };

  // Helper: Get all public logs (for the feed)
  const getPublicLogs = () => {
    return allLogs.filter(log => log.isPublic);
  };

  // Function to toggle like on a log
  const toggleLikeLog = (logId, userId) => {
    setAllLogs(allLogs.map(log => {
      if (log.id === logId) {
        const likes = log.likes || [];
        const hasLiked = likes.includes(userId);
        
        return {
          ...log,
          likes: hasLiked 
            ? likes.filter(id => id !== userId) // Remove like
            : [...likes, userId] // Add like
        };
      }
      return log;
    }));
  };

  return (
    <LogsContext.Provider value={{
      allLogs,
      createLog,
      updateLog,
      deleteLog,
      getLogsForStudent,
      getPublicLogs,
      toggleLikeLog
    }}>
      {children}
    </LogsContext.Provider>
  );
}

// Custom hook
export function useLogs() {
  const context = useContext(LogsContext);
  if (!context) {
    throw new Error('useLogs must be used within LogsProvider');
  }
  return context;
}
