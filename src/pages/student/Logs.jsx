import { useState } from 'react';
import { useLogs } from '../../context/LogsContext';
import { useAuth } from '../../context/AuthContext';
import './Logs.css';

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
    <div className="logs-page">
      <h2>My Logs</h2>

      {/* Create New Log Form */}
      <div className="log-form-section">
        <h3>Create New Log</h3>
        <form onSubmit={handleSubmit} className="log-form">
          <textarea
            value={logContent}
            onChange={(e) => setLogContent(e.target.value)}
            placeholder="Write about what you learned today, challenges you faced, or skills you practiced..."
            rows={6}
            className="log-textarea"
          />
          
          <div className="log-form-footer">
            <label className="public-toggle">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <span>Make this log public (visible to other students)</span>
            </label>
            
            <button type="submit" className="submit-log-button">
              Create Log
            </button>
          </div>
        </form>
      </div>

      {/* Logs History */}
      <div className="logs-history-section">
        <h3>My Log History ({myLogs.length})</h3>
        
        {myLogs.length === 0 ? (
          <p className="no-logs-message">
            You haven't created any logs yet. Start reflecting on your internship experience above!
          </p>
        ) : (
          <div className="logs-list">
            {myLogs.map((log) => (
              <div key={log.id} className="log-item">
                <div className="log-header">
                  <span className="log-date">{formatDateTime(log.timestamp)}</span>
                  <span className={`log-visibility ${log.isPublic ? 'public' : 'private'}`}>
                    {log.isPublic ? '🌐 Public' : '🔒 Private'}
                  </span>
                </div>

                {editingLogId === log.id ? (
                  // Edit mode
                  <div className="log-edit-mode">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={6}
                      className="log-textarea"
                    />
                    <div className="log-edit-actions">
                      <button 
                        className="save-button"
                        onClick={() => handleSaveEdit(log.id)}
                      >
                        Save
                      </button>
                      <button 
                        className="cancel-button"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <>
                    <p className="log-content">{log.content}</p>
                    
                    <div className="log-actions">
                      <button 
                        className="edit-button"
                        onClick={() => handleStartEdit(log)}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className="toggle-visibility-button"
                        onClick={() => handleTogglePublic(log)}
                      >
                        {log.isPublic ? '🔒 Make Private' : '🌐 Make Public'}
                      </button>
                      <button 
                        className="delete-button"
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
