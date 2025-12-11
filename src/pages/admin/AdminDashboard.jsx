import { useStudents } from '../../context/StudentsContext';
import { useInternships } from '../../context/InternshipsContext';
import { useAssignments } from '../../context/AssignmentsContext';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const { getAllStudents, getActiveStudents } = useStudents();
  const { getAllInternships, getActiveInternships } = useInternships();
  const { getActiveAssignments, getAllAssignments } = useAssignments();

  const allStudents = getAllStudents();
  const activeStudents = getActiveStudents();
  const allInternships = getAllInternships();
  const activeInternships = getActiveInternships();
  const activeAssignments = getActiveAssignments();
  const allAssignments = getAllAssignments();

  // Calculate stats
  const unassignedStudents = activeStudents.filter(student => {
    return !activeAssignments.some(assignment => assignment.studentId === student.id);
  });

  const internshipsWithNoStudents = activeInternships.filter(internship => {
    return !activeAssignments.some(assignment => assignment.internshipId === internship.id);
  });

  // Get recent activity (last 5 assignments)
  const recentAssignments = [...allAssignments]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const getStudentName = (studentId) => {
    const student = allStudents.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  const getInternshipName = (internshipId) => {
    const internship = allInternships.find(i => i.id === internshipId);
    return internship ? internship.organizationName : 'Unknown Internship';
  };

  return (
    <div className="admin-dashboard-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2>Admin Dashboard</h2>
          <p className="subtitle">Overview of InternTracker system</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{activeStudents.length}</div>
            <div className="stat-label">Active Students</div>
            {allStudents.length > activeStudents.length && (
              <div className="stat-detail">
                {allStudents.length - activeStudents.length} inactive
              </div>
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-content">
            <div className="stat-value">{activeInternships.length}</div>
            <div className="stat-label">Active Internships</div>
            {allInternships.length > activeInternships.length && (
              <div className="stat-detail">
                {allInternships.length - activeInternships.length} inactive
              </div>
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔗</div>
          <div className="stat-content">
            <div className="stat-value">{activeAssignments.length}</div>
            <div className="stat-label">Active Assignments</div>
            {allAssignments.length > activeAssignments.length && (
              <div className="stat-detail">
                {allAssignments.length - activeAssignments.length} completed
              </div>
            )}
          </div>
        </div>

        <div className="stat-card highlight">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <div className="stat-value">{unassignedStudents.length}</div>
            <div className="stat-label">Unassigned Students</div>
            {unassignedStudents.length > 0 && (
              <button 
                className="stat-action"
                onClick={() => navigate('/admin/students')}
              >
                View Students
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Attention Needed Section */}
      {(unassignedStudents.length > 0 || internshipsWithNoStudents.length > 0) && (
        <div className="attention-section">
          <h3>⚠️ Needs Attention</h3>
          
          {unassignedStudents.length > 0 && (
            <div className="attention-card">
              <div className="attention-header">
                <h4>Unassigned Students ({unassignedStudents.length})</h4>
                <button 
                  className="btn-secondary btn-small"
                  onClick={() => navigate('/admin/students')}
                >
                  Manage Students
                </button>
              </div>
              <div className="attention-list">
                {unassignedStudents.slice(0, 5).map(student => (
                  <div key={student.id} className="attention-item">
                    <span className="item-name">{student.name}</span>
                    <span className="item-detail">Grade {student.gradeLevel}</span>
                  </div>
                ))}
                {unassignedStudents.length > 5 && (
                  <div className="attention-item more">
                    +{unassignedStudents.length - 5} more
                  </div>
                )}
              </div>
            </div>
          )}

          {internshipsWithNoStudents.length > 0 && (
            <div className="attention-card">
              <div className="attention-header">
                <h4>Internships Without Students ({internshipsWithNoStudents.length})</h4>
                <button 
                  className="btn-secondary btn-small"
                  onClick={() => navigate('/admin/internships')}
                >
                  Manage Internships
                </button>
              </div>
              <div className="attention-list">
                {internshipsWithNoStudents.slice(0, 5).map(internship => (
                  <div key={internship.id} className="attention-item">
                    <span className="item-name">{internship.organizationName}</span>
                  </div>
                ))}
                {internshipsWithNoStudents.length > 5 && (
                  <div className="attention-item more">
                    +{internshipsWithNoStudents.length - 5} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Activity */}
      <div className="recent-activity-section">
        <h3>📋 Recent Activity</h3>
        
        {recentAssignments.length === 0 ? (
          <div className="empty-activity">
            <p>No recent activity yet.</p>
            <p>Start by creating students and internships, then assign them together.</p>
          </div>
        ) : (
          <div className="activity-list">
            {recentAssignments.map(assignment => (
              <div key={assignment.id} className="activity-item">
                <div className="activity-icon">
                  {assignment.isActive ? '✅' : '🔴'}
                </div>
                <div className="activity-content">
                  <div className="activity-text">
                    <strong>{getStudentName(assignment.studentId)}</strong>
                    {assignment.isActive ? ' assigned to ' : ' removed from '}
                    <strong>{getInternshipName(assignment.internshipId)}</strong>
                  </div>
                  <div className="activity-meta">
                    {new Date(assignment.createdAt).toLocaleDateString()} at{' '}
                    {new Date(assignment.createdAt).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                    {assignment.schedule && assignment.schedule.length > 0 && (
                      <span className="schedule-note">
                        {' '}• Schedule: {assignment.schedule.map(s => s.day.slice(0, 3)).join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h3>⚡ Quick Actions</h3>
        <div className="quick-actions-grid">
          <button 
            className="quick-action-card"
            onClick={() => navigate('/admin/students')}
          >
            <div className="action-icon">👥</div>
            <div className="action-label">Manage Students</div>
            <div className="action-detail">Add, edit, or assign students</div>
          </button>

          <button 
            className="quick-action-card"
            onClick={() => navigate('/admin/internships')}
          >
            <div className="action-icon">🏢</div>
            <div className="action-label">Manage Internships</div>
            <div className="action-detail">Add sites and assign students</div>
          </button>

          <button 
            className="quick-action-card"
            onClick={() => navigate('/profile')}
          >
            <div className="action-icon">⚙️</div>
            <div className="action-label">Settings</div>
            <div className="action-detail">Update your profile</div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
