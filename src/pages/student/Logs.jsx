import { useState } from 'react';
import { useLogs } from '../../context/LogsContext';
import { useAuth } from '../../context/AuthContext';

function Logs() {
  const { allLogs, createLog, updateLog, deleteLog, getLogsForStudent } = useLogs();
  const { user } = useAuth();
  
  // Form state
  const [logContent, setLogContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  
  // Edit state
  const [editingLogId, setEditingLogId] = useState(null);
  const [editContent, setEditContent] = useState('');

  // Get only this student's logs
  const myLogs = getLogsForStudent(user.id);

  // Handle creating a new log
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!logContent.trim()) {
      alert('Please enter some content for your log');
      return;
    }

    createLog(user.id, user.name, logContent, isPublic);
    
    // Reset form
    setLogContent('');
    setIsPublic(false);
  };

  // Handle starting to edit a log
  const handleStartEdit = (log) => {
    setEditingLogId(log.id);
    setEditContent(log.content);
  };

  // Handle saving an edit
  const handleSaveEdit = (logId) => {
    if (!editContent.trim()) {
      alert('Log content cannot be empty');
      return;
    }

    updateLog(logId, { content: editContent });
    setEditingLogId(null);
    setEditContent('');
  };

  // Handle canceling an edit
  const handleCancelEdit = () => {
    setEditingLogId(null);
    setEditContent('');
  };

  // Handle deleting a log
  const handleDelete = (logId) => {
    if (window.confirm('Are you sure you want to delete this log?')) {
      deleteLog(logId);
    }
  };

  // Handle toggling public/private
  const handleTogglePublic = (log) => {
    updateLog(log.id, { isPublic: !log.isPublic });
  };

  // Format date/time for display
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="max-w-[800px] mx-auto p-5">
      <h2 className="mb-8">My Logs</h2>

      {/* Create New Log Form */}
      <div className="bg-white rounded-lg p-5 mb-8 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
        <h3 className="mt-0 mb-4 text-[#333]">Create New Log</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={logContent}
            onChange={(e) => setLogContent(e.target.value)}
            placeholder="Write about what you learned today, challenges you faced, or skills you practiced..."
            rows={6}
            className="w-full p-3 border-2 border-[#ddd] rounded-md font-[inherit] text-sm resize-y transition-colors focus:outline-none focus:border-[#4CAF50]"
          />

          <div className="flex justify-between items-center gap-4 sm:flex-col sm:items-stretch">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="cursor-pointer w-[18px] h-[18px]"
              />
              <span>Make this log public (visible to other students)</span>
            </label>

            <button type="submit" className="bg-[#4CAF50] text-white border-none px-6 py-3 rounded-md text-base font-medium cursor-pointer transition-colors hover:bg-[#45a049] sm:w-full">
              Create Log
            </button>
          </div>
        </form>
      </div>

      {/* Logs History */}
      <div className="bg-white rounded-lg p-5 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
        <h3 className="mt-0 mb-5 text-[#333]">My Log History ({myLogs.length})</h3>

        {myLogs.length === 0 ? (
          <p className="text-center text-[#666] py-10 px-5 italic">
            You haven't created any logs yet. Start reflecting on your internship experience above!
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {myLogs.map((log) => (
              <div key={log.id} className="border-2 border-[#e0e0e0] rounded-lg p-4 bg-[#fafafa] transition-colors hover:border-[#ccc]">
                <div className="flex justify-between items-center mb-3 pb-2.5 border-b border-[#e0e0e0]">
                  <span className="text-sm text-[#666] font-medium">{formatDateTime(log.timestamp)}</span>
                  <span className={`text-[13px] font-semibold px-2.5 py-1 rounded-xl ${
                    log.isPublic
                      ? 'bg-[#e8f5e9] text-[#2e7d32]'
                      : 'bg-[#fff3e0] text-[#e65100]'
                  }`}>
                    {log.isPublic ? '🌐 Public' : '🔒 Private'}
                  </span>
                </div>

                {editingLogId === log.id ? (
                  // Edit mode
                  <div className="flex flex-col gap-2.5">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={6}
                      className="w-full p-3 border-2 border-[#ddd] rounded-md font-[inherit] text-sm resize-y transition-colors focus:outline-none focus:border-[#4CAF50]"
                    />
                    <div className="flex gap-2.5">
                      <button
                        className="bg-[#4CAF50] text-white border-none px-5 py-2.5 rounded-md cursor-pointer font-medium hover:bg-[#45a049]"
                        onClick={() => handleSaveEdit(log.id)}
                      >
                        Save
                      </button>
                      <button
                        className="bg-[#757575] text-white border-none px-5 py-2.5 rounded-md cursor-pointer font-medium hover:bg-[#616161]"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <>
                    <p className="m-0 mb-4 leading-relaxed text-[#333] whitespace-pre-wrap">{log.content}</p>

                    <div className="flex gap-2.5 flex-wrap sm:flex-col">
                      <button
                        className="px-4 py-2 border-none rounded-md text-sm cursor-pointer transition-opacity bg-[#2196F3] text-white hover:opacity-80 sm:w-full"
                        onClick={() => handleStartEdit(log)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="px-4 py-2 border-none rounded-md text-sm cursor-pointer transition-opacity bg-[#FF9800] text-white hover:opacity-80 sm:w-full"
                        onClick={() => handleTogglePublic(log)}
                      >
                        {log.isPublic ? '🔒 Make Private' : '🌐 Make Public'}
                      </button>
                      <button
                        className="px-4 py-2 border-none rounded-md text-sm cursor-pointer transition-opacity bg-[#f44336] text-white hover:opacity-80 sm:w-full"
                        onClick={() => handleDelete(log.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Logs;
