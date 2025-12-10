import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLogs } from '../../context/LogsContext';
import { useCheckIn } from '../../context/CheckInContext';
import './StudentHome.css';

function StudentHome() {
  const { user } = useAuth();
  const { getPublicLogs, toggleLikeLog } = useLogs();
  const { getAllCheckInsForFeed, toggleLikeCheckIn } = useCheckIn();
  
  // Filter state: "all" or "mine"
  const [filter, setFilter] = useState('all');

  // Get public logs and all check-ins (active + completed)
  const publicLogs = getPublicLogs();
  const allCheckIns = getAllCheckInsForFeed();

  // Combine and sort by timestamp
  const feedItems = useMemo(() => {
    // Transform logs into feed items
    const logItems = publicLogs.map(log => ({
      ...log,
      type: 'log',
      timestamp: log.timestamp
    }));

    // Transform check-ins into feed items
    const checkInItems = allCheckIns.map(checkIn => ({
      ...checkIn,
      type: 'checkin',
      // Use checkOutTime if completed, otherwise use checkInTime for active check-ins
      timestamp: checkIn.checkOutTime || checkIn.checkInTime
    }));

    // Combine and sort by timestamp (newest first)
    const combined = [...logItems, ...checkInItems].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );

    // Apply filter
    if (filter === 'mine') {
      return combined.filter(item => item.studentId === user.id);
    }
    return combined;
  }, [publicLogs, allCheckIns, filter, user.id]);

  // Handle liking a feed item
  const handleLike = (item) => {
    if (item.type === 'log') {
      toggleLikeLog(item.id, user.id);
    } else {
      toggleLikeCheckIn(item.id, user.id);
    }
  };

  // Check if current user has liked an item
  const hasLiked = (item) => {
    const likes = item.likes || [];
    return likes.includes(user.id);
  };

  // Format date/time for display
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // Show relative time for recent items
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    // Otherwise show full date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className="student-home-page">
      <div className="feed-header">
        <h2>Activity Feed</h2>
        
        {/* Filter Toggle */}
        <div className="filter-toggle">
          <button 
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Everyone
          </button>
          <button 
            className={`filter-button ${filter === 'mine' ? 'active' : ''}`}
            onClick={() => setFilter('mine')}
          >
            My Activity
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="feed-container">
        {feedItems.length === 0 ? (
          <div className="empty-feed">
            <p>No activity to show yet.</p>
            {filter === 'mine' && (
              <p>Create some logs or check in to see your activity here!</p>
            )}
          </div>
        ) : (
          <div className="feed-list">
            {feedItems.map((item) => (
              <div key={`${item.type}-${item.id}`} className="feed-item">
                {/* Header */}
                <div className="feed-item-header">
                  <div className="student-info">
                    <span className="student-name">{item.studentName}</span>
                    <span className="timestamp">{formatDateTime(item.timestamp)}</span>
                  </div>
                  <span className={`item-type-badge ${item.type}`}>
                    {item.type === 'log' ? '📝 Log' : '✓ Check-in'}
                  </span>
                </div>

                {/* Content */}
                <div className="feed-item-content">
                  {item.type === 'log' ? (
                    <p className="log-text">{item.content}</p>
                  ) : (
                    <div className="checkin-summary">
                      {item.checkOutTime ? (
                        // Completed check-in
                        <>
                          <div className="checkin-time">
                            <span>🟢 {new Date(item.checkInTime).toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit',
                              hour12: true 
                            })}</span>
                            <span className="duration-arrow">→</span>
                            <span>🔴 {new Date(item.checkOutTime).toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit',
                              hour12: true 
                            })}</span>
                          </div>
                          <div className="checkin-duration">
                            Duration: <strong>{item.duration}</strong>
                          </div>
                        </>
                      ) : (
                        // Active check-in (still in progress)
                        <>
                          <div className="checkin-time active">
                            <span>🟢 Checked in at {new Date(item.checkInTime).toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit',
                              hour12: true 
                            })}</span>
                          </div>
                          <div className="checkin-status-active">
                            <strong>Currently checked in</strong>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="feed-item-actions">
                  {/* Only show like button for completed check-ins or logs */}
                  {(item.type === 'log' || (item.type === 'checkin' && item.checkOutTime)) && (
                    <button 
                      className={`like-button ${hasLiked(item) ? 'liked' : ''}`}
                      onClick={() => handleLike(item)}
                    >
                      {hasLiked(item) ? '❤️' : '🤍'} {(item.likes || []).length}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentHome;
