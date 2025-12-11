import { useState } from 'react';
import { useInternships } from '../../context/InternshipsContext';
import { useAssignments } from '../../context/AssignmentsContext';
import StudentManagementModal from '../../components/admin/StudentManagementModal';
import './AdminInternships.css';

function AdminInternships() {
  const {
    getAllInternships,
    createInternship,
    updateInternship,
    deleteInternship,
    reactivateInternship
  } = useInternships();

  const { getActiveAssignmentsByInternship } = useAssignments();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showInactive, setShowInactive] = useState(false);
  const [managingStudentsFor, setManagingStudentsFor] = useState(null);
  
  const [formData, setFormData] = useState({
    organizationName: '',
    address: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    description: ''
  });

  const allInternships = getAllInternships();
  const displayedInternships = showInactive 
    ? allInternships 
    : allInternships.filter(i => i.isActive);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open form for creating new internship
  const handleCreate = () => {
    setFormData({
      organizationName: '',
      address: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      description: ''
    });
    setEditingId(null);
    setShowForm(true);
  };

  // Open form for editing existing internship
  const handleEdit = (internship) => {
    setFormData({
      organizationName: internship.organizationName,
      address: internship.address,
      contactName: internship.contactName,
      contactEmail: internship.contactEmail,
      contactPhone: internship.contactPhone,
      description: internship.description
    });
    setEditingId(internship.id);
    setShowForm(true);
  };

  // Submit form (create or update)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing internship
      updateInternship(editingId, formData);
    } else {
      // Create new internship
      createInternship(formData);
    }

    // Reset form
    setShowForm(false);
    setEditingId(null);
    setFormData({
      organizationName: '',
      address: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      description: ''
    });
  };

  // Cancel form
  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      organizationName: '',
      address: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      description: ''
    });
  };

  // Deactivate an internship
  const handleDeactivate = (id) => {
    if (window.confirm('Are you sure you want to deactivate this internship?')) {
      deleteInternship(id);
    }
  };

  // Reactivate an internship
  const handleReactivate = (id) => {
    reactivateInternship(id);
  };

  // Open student management modal
  const handleManageStudents = (internship) => {
    setManagingStudentsFor(internship);
  };

  // Close student management modal
  const handleCloseStudentManagement = () => {
    setManagingStudentsFor(null);
  };

  // Get student count for internship
  const getStudentCount = (internshipId) => {
    return getActiveAssignmentsByInternship(internshipId).length;
  };

  return (
    <div className="admin-internships-page">
      {/* Header */}
      <div className="page-header">
        <h2>Manage Internships</h2>
        <div className="header-actions">
          <label className="toggle-inactive">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
            />
            Show Inactive
          </label>
          <button className="btn-primary" onClick={handleCreate}>
            + New Internship
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Edit Internship' : 'Create New Internship'}</h3>
              <button className="close-button" onClick={handleCancel}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="internship-form">
              <div className="form-group">
                <label htmlFor="organizationName">
                  Organization Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="organizationName"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Cedar Rapids Public Library"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">
                  Address <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Street address, City, State ZIP"
                />
                <small className="form-hint">
                  Used for geolocation verification when students check in
                </small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contactName">Contact Name</label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    placeholder="Primary contact person"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contactPhone">Contact Phone</label>
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="(319) 555-0123"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contactEmail">Contact Email</label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="contact@organization.org"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Describe what students will do at this internship..."
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingId ? 'Save Changes' : 'Create Internship'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Management Modal */}
      {managingStudentsFor && (
        <StudentManagementModal
          internship={managingStudentsFor}
          onClose={handleCloseStudentManagement}
        />
      )}

      {/* Internships List */}
      <div className="internships-list">
        {displayedInternships.length === 0 ? (
          <div className="empty-state">
            <p>No internships to display.</p>
            {!showInactive && (
              <button className="btn-primary" onClick={handleCreate}>
                Create Your First Internship
              </button>
            )}
          </div>
        ) : (
          displayedInternships.map((internship) => {
            const studentCount = getStudentCount(internship.id);

            return (
              <div 
                key={internship.id} 
                className={`internship-card ${!internship.isActive ? 'inactive' : ''}`}
              >
                <div className="card-header">
                  <div>
                    <h3>{internship.organizationName}</h3>
                    {!internship.isActive && (
                      <span className="status-badge inactive">Inactive</span>
                    )}
                  </div>
                  <div className="card-actions">
                    {internship.isActive ? (
                      <>
                        <button 
                          className="btn-secondary btn-small" 
                          onClick={() => handleManageStudents(internship)}
                          title="Manage Students"
                        >
                          👥 Manage Students ({studentCount})
                        </button>
                        <button 
                          className="btn-icon" 
                          onClick={() => handleEdit(internship)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn-icon danger" 
                          onClick={() => handleDeactivate(internship.id)}
                          title="Deactivate"
                        >
                          🗑️
                        </button>
                      </>
                    ) : (
                      <button 
                        className="btn-secondary btn-small" 
                        onClick={() => handleReactivate(internship.id)}
                      >
                        Reactivate
                      </button>
                    )}
                  </div>
                </div>

                <div className="card-body">
                  <div className="info-row">
                    <span className="label">📍 Address:</span>
                    <span>{internship.address}</span>
                  </div>

                  {internship.contactName && (
                    <div className="info-row">
                      <span className="label">👤 Contact:</span>
                      <span>{internship.contactName}</span>
                    </div>
                  )}

                  {internship.contactEmail && (
                    <div className="info-row">
                      <span className="label">✉️ Email:</span>
                      <span>
                        <a href={`mailto:${internship.contactEmail}`}>
                          {internship.contactEmail}
                        </a>
                      </span>
                    </div>
                  )}

                  {internship.contactPhone && (
                    <div className="info-row">
                      <span className="label">📞 Phone:</span>
                      <span>
                        <a href={`tel:${internship.contactPhone}`}>
                          {internship.contactPhone}
                        </a>
                      </span>
                    </div>
                  )}

                  {internship.description && (
                    <div className="description">
                      <p>{internship.description}</p>
                    </div>
                  )}

                  <div className="card-footer">
                    <div className="stats">
                      <span className="stat-item highlighted">
                        👥 {studentCount} student{studentCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="created-date">
                      Created {new Date(internship.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default AdminInternships;
