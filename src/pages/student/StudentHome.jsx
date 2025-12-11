import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLogs } from '../../context/LogsContext';
import { useCheckIn } from '../../context/CheckInContext';

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
    <div className="max-w-[800px] mx-auto p-5">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h2 className="m-0">Activity Feed</h2>

        {/* Filter Toggle */}
        <div className="flex gap-0 bg-[#e0e0e0] rounded-lg p-1">
          <button
            className={`px-5 py-2 border-none rounded-md cursor-pointer text-sm font-medium transition-all ${
              filter === 'all'
                ? 'bg-white text-[#4CAF50] shadow-[0_2px_4px_rgba(0,0,0,0.1)]'
                : 'bg-transparent text-[#666] hover:text-[#333]'
            }`}
            onClick={() => setFilter('all')}
          >
            Everyone
          </button>
          <button
            className={`px-5 py-2 border-none rounded-md cursor-pointer text-sm font-medium transition-all ${
              filter === 'mine'
                ? 'bg-white text-[#4CAF50] shadow-[0_2px_4px_rgba(0,0,0,0.1)]'
                : 'bg-transparent text-[#666] hover:text-[#333]'
            }`}
            onClick={() => setFilter('mine')}
          >
            My Activity
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="bg-white rounded-lg p-5 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
        {feedItems.length === 0 ? (
          <div className="text-center py-16 px-5 text-[#666]">
            <p className="my-2.5 text-lg font-medium text-[#333]">No activity to show yet.</p>
            {filter === 'mine' && (
              <p className="my-2.5">Create some logs or check in to see your activity here!</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {feedItems.map((item) => (
              <div key={`${item.type}-${item.id}`} className="border-2 border-[#e0e0e0] rounded-lg p-4 bg-[#fafafa] transition-all hover:border-[#ccc]">
                {/* Header */}
                <div className="flex justify-between items-start mb-3 pb-2.5 border-b border-[#e0e0e0] sm:flex-col sm:gap-2.5">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-[#333] text-base">{item.studentName}</span>
                    <span className="text-[13px] text-[#888]">{formatDateTime(item.timestamp)}</span>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-xl whitespace-nowrap sm:self-start ${
                    item.type === 'log'
                      ? 'bg-[#e3f2fd] text-[#1976d2]'
                      : 'bg-[#e8f5e9] text-[#2e7d32]'
                  }`}>
                    {item.type === 'log' ? '📝 Log' : '✓ Check-in'}
                  </span>
                </div>

                {/* Content */}
                <div className="mb-3">
                  {item.type === 'log' ? (
                    <p className="m-0 leading-relaxed text-[#333] whitespace-pre-wrap">{item.content}</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {item.checkOutTime ? (
                        // Completed check-in
                        <>
                          <div className="flex items-center gap-2 text-sm text-[#555] flex-wrap sm:flex-col sm:items-start">
                            <span>🟢 {new Date(item.checkInTime).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}</span>
                            <span className="text-[#999] font-bold sm:hidden">→</span>
                            <span>🔴 {new Date(item.checkOutTime).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}</span>
                          </div>
                          <div className="text-sm text-[#666]">
                            Duration: <strong className="text-[#2e7d32] font-semibold">{item.duration}</strong>
                          </div>
                        </>
                      ) : (
                        // Active check-in (still in progress)
                        <>
                          <div className="flex items-center gap-2 text-sm text-[#2e7d32] font-medium">
                            <span>🟢 Checked in at {new Date(item.checkInTime).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}</span>
                          </div>
                          <div className="text-sm text-[#2e7d32] bg-[#e8f5e9] px-3 py-2 rounded-md mt-1">
                            <strong className="font-semibold">Currently checked in</strong>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2.5 pt-2 border-t border-[#e0e0e0]">
                  {/* Only show like button for completed check-ins or logs */}
                  {(item.type === 'log' || (item.type === 'checkin' && item.checkOutTime)) && (
                    <button
                      className={`flex items-center gap-1.5 px-3 py-1.5 border-2 rounded-full cursor-pointer text-sm font-medium transition-all ${
                        hasLiked(item)
                          ? 'border-[#ff4081] bg-[#fff0f5] text-[#ff4081] hover:scale-105'
                          : 'border-[#e0e0e0] bg-white text-[#666] hover:border-[#ff4081] hover:text-[#ff4081] hover:scale-105'
                      }`}
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
