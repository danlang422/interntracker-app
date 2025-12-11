import { useState } from 'react';
import { useStudents } from '../../context/StudentsContext';
import { useAssignments } from '../../context/AssignmentsContext';
import { useInternships } from '../../context/InternshipsContext';
import './AdminStudents.css';

function AdminStudents() {
  const {
    getAllStudents,
    createStudent,
    updateStudent,
    deactivateStudent,
    reactivateStudent
  } = useStudents();

  const {
    quickAssignStudent,
    removeStudentFromInternship,
    getActiveAssignmentForStudent
  } = useAssignments();

  const { getActiveInternships, getInternshipById } = useInternships();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showInactive, setShowInactive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');
  const [filterInternship, setFilterInternship] = useState('all');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gradeLevel: '',
    phoneNumber: '',
    emergencyContact: '',
    assignedAdvisor: '',
    notes: ''
  });

  const allStudents = getAllStudents();
  const activeInternships = getActiveInternships();

  // Filter students based on their assignments
  const displayedStudents = allStudents
    .filter(student => showInactive || student.isActive)
    .filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGrade = filterGrade === 'all' || student.gradeLevel === parseInt(filterGrade);
      
      // Check assignment status
      const assignment = getActiveAssignmentForStudent(student.id);
      const matchesInternship = filterInternship === 'all' || 
                                (filterInternship === 'unassigned' 
                                  ? !assignment
                                  : assignment && assignment.internshipId === parseInt(filterInternship));
      
      return matchesSearch && matchesGrade && matchesInternship;
    });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseInt(value)) : value
    }));
  };

  // Open form for creating new student
  const handleCreate = () => {
    setFormData({
      name: '',
      email: '',
      gradeLevel: '',
      phoneNumber: '',
      emergencyContact: '',
      assignedAdvisor: '',
      notes: ''
    });
    setEditingId(null);
    setShowForm(true);
  };

  // Open form for editing existing student
  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      email: student.email,
      gradeLevel: student.gradeLevel,
      phoneNumber: student.phoneNumber || '',
      emergencyContact: student.emergencyContact || '',
      assignedAdvisor: student.assignedAdvisor || '',
      notes: student.notes || ''
    });
    setEditingId(student.id);
    setShowForm(true);
  };

  // Submit form (create or update)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Ensure email ends with school domain
    const emailData = {
      ...formData,
      email: formData.email.includes('@') 
        ? formData.email 
        : `${formData.email}@cityview.cr.k12.ia.us`,
      gradeLevel: formData.gradeLevel === '' ? 9 : formData.gradeLevel // Default to 9 if empty
    };

    if (editingId) {
      updateStudent(editingId, emailData);
    } else {
      createStudent(emailData);
    }

    handleCancel();
  };

  // Cancel form
  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
  };

  // Deactivate a student
  const handleDeactivate = (id) => {
    if (window.confirm('Are you sure you want to deactivate this student account?')) {
      // Also remove from internship
      removeStudentFromInternship(id);
      deactivateStudent(id);
    }
  };

  // Reactivate a student
  const handleReactivate = (id) => {
    reactivateStudent(id);
  };

  // Quick assign to internship from card
  const handleQuickAssignInternship = (studentId, internshipId) => {
    if (internshipId === 'none') {
      removeStudentFromInternship(studentId);
    } else {
      quickAssignStudent(studentId, parseInt(internshipId));
    }
  };

  // Get internship name for a student
  const getStudentInternshipName = (studentId) => {
    const assignment = getActiveAssignmentForStudent(studentId);
    if (!assignment) return 'Not assigned';
    const internship = getInternshipById(assignment.internshipId);
    return internship ? internship.organizationName : 'Unknown';
  };

  // Get assignment for a student
  const getStudentAssignment = (studentId) => {
    return getActiveAssignmentForStudent(studentId);
  };

  return (
    <div className="admin-students-page">
      {/* Header */}
      <div className="page-header">
        <h2>Manage Students</h2>
        <button className="btn-primary" onClick={handleCreate}>
          + New Student
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select value={filterGrade} onChange={(e) => setFilterGrade(e.target.value)}>
            <option value="all">All Grades</option>
            <option value="9">9th Grade</option>
            <option value="10">10th Grade</option>
            <option value="11">11th Grade</option>
            <option value="12">12th Grade</option>
          </select>

          <select value={filterInternship} onChange={(e) => setFilterInternship(e.target.value)}>
            <option value="all">All Internships</option>
            <option value="unassigned">Unassigned</option>
            {activeInternships.map(internship => (
              <option key={internship.id} value={internship.id}>
                {internship.organizationName}
              </option>
            ))}
          </select>

          <label className="toggle-inactive">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
            />
            Show Inactive
          </label>
        </div>
      </div>

      {/* Results count */}
      <div className="results-summary">
        Showing {displayedStudents.length} of {allStudents.filter(s => showInactive || s.isActive).length} students
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Edit Student' : 'Create New Student'}</h3>
              <button className="close-button" onClick={handleCancel}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="student-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="First Last"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="gradeLevel">
                    Grade Level <span className="required">*</span>
                  </label>
                  <select
                    id="gradeLevel"
                    name="gradeLevel"
                    value={formData.gradeLevel}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select grade</option>
                    <option value={9}>9th Grade</option>
                    <option value={10}>10th Grade</option>
                    <option value={11}>11th Grade</option>
                    <option value={12}>12th Grade</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="student@cityview.cr.k12.ia.us"
                />
                <small className="form-hint">
                  Used for Google OAuth login
                </small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="(319) 555-1234"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="assignedAdvisor">Assigned Advisor</label>
                  <input
                    type="email"
                    id="assignedAdvisor"
                    name="assignedAdvisor"
                    value={formData.assignedAdvisor}
                    onChange={handleInputChange}
                    placeholder="advisor@cityview.cr.k12.ia.us"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="emergencyContact">Emergency Contact</label>
                <input
                  type="text"
                  id="emergencyContact"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  placeholder="Name (Relationship) - Phone"
                />
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Any additional information about this student..."
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingId ? 'Save Changes' : 'Create Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Students List */}
      <div className="students-list">
        {displayedStudents.length === 0 ? (
          <div className="empty-state">
            <p>No students match your filters.</p>
          </div>
        ) : (
          displayedStudents.map((student) => {
            const assignment = getStudentAssignment(student.id);
            
            return (
              <div 
                key={student.id} 
                className={`student-card ${!student.isActive ? 'inactive' : ''}`}
              >
                <div className="card-header">
                  <div className="student-info-header">
                    <h3>{student.name}</h3>
                    <span className="grade-badge">Grade {student.gradeLevel}</span>
                    {!student.isActive && (
                      <span className="status-badge inactive">Inactive</span>
                    )}
                  </div>
                  <div className="card-actions">
                    {student.isActive ? (
                      <>
                        <button 
                          className="btn-icon" 
                          onClick={() => handleEdit(student)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn-icon danger" 
                          onClick={() => handleDeactivate(student.id)}
                          title="Deactivate"
                        >
                          🗑️
                        </button>
                      </>
                    ) : (
                      <button 
                        className="btn-secondary btn-small" 
                        onClick={() => handleReactivate(student.id)}
                      >
                        Reactivate
                      </button>
                    )}
                  </div>
                </div>

                <div className="card-body">
                  <div className="info-row">
                    <span className="label">✉️ Email:</span>
                    <span><a href={`mailto:${student.email}`}>{student.email}</a></span>
                  </div>

                  {student.phoneNumber && (
                    <div className="info-row">
                      <span className="label">📞 Phone:</span>
                      <span><a href={`tel:${student.phoneNumber}`}>{student.phoneNumber}</a></span>
                    </div>
                  )}

                  {student.assignedAdvisor && (
                    <div className="info-row">
                      <span className="label">👤 Advisor:</span>
                      <span>{student.assignedAdvisor}</span>
                    </div>
                  )}

                  {student.emergencyContact && (
                    <div className="info-row">
                      <span className="label">🚨 Emergency:</span>
                      <span>{student.emergencyContact}</span>
                    </div>
                  )}

                  <div className="info-row">
                    <span className="label">🏢 Internship:</span>
                    {student.isActive ? (
                      <select
                        value={assignment ? assignment.internshipId : 'none'}
                        onChange={(e) => handleQuickAssignInternship(student.id, e.target.value)}
                        className="quick-assign-select"
                      >
                        <option value="none">Not assigned</option>
                        {activeInternships.map(internship => (
                          <option key={internship.id} value={internship.id}>
                            {internship.organizationName}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span>{getStudentInternshipName(student.id)}</span>
                    )}
                  </div>

                  {assignment && (
                    <div className="assignment-note">
                      <small>
                        📝 To set schedule details, manage this student from the{' '}
                        <a href="/admin/internships">Internships page</a>
                      </small>
                    </div>
                  )}

                  {student.notes && (
                    <div className="notes-section">
                      <span className="label">📝 Notes:</span>
                      <p>{student.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default AdminStudents;
