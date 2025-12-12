import { useState } from 'react';
import { useInternships } from '../../context/InternshipsContext';
import { useAssignments } from '../../context/AssignmentsContext';
import StudentManagementModal from '../../components/admin/StudentManagementModal';

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
    <div className="p-8 max-w-[1200px] mx-auto max-md:p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4 max-md:flex-col max-md:items-start">
        <h2 className="m-0 text-[1.75rem] text-[#1a1a1a]">Manage Internships</h2>
        <div className="flex items-center gap-4 max-md:w-full max-md:justify-between">
          <label className="flex items-center gap-2 text-[0.9rem] text-[#666] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="cursor-pointer"
            />
            Show Inactive
          </label>
          <button className="px-5 py-2.5 border-none rounded-md text-[0.95rem] font-medium cursor-pointer transition-all bg-blue-600 text-white hover:bg-blue-700" onClick={handleCreate}>
            + New Internship
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000] p-4" onClick={handleCancel}>
          <div className="bg-white rounded-xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] max-md:m-4 max-md:max-h-[calc(100vh-2rem)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="m-0 text-xl text-[#1a1a1a]">{editingId ? 'Edit Internship' : 'Create New Internship'}</h3>
              <button className="bg-none border-none text-[2rem] text-gray-400 cursor-pointer leading-none p-0 w-8 h-8 flex items-center justify-center rounded transition-all hover:bg-gray-100 hover:text-gray-700" onClick={handleCancel}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-5">
                <label htmlFor="organizationName" className="block mb-2 font-medium text-gray-700 text-[0.9rem]">
                  Organization Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="organizationName"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Cedar Rapids Public Library"
                  className="w-full p-2.5 border border-gray-300 rounded-md text-[0.95rem] font-[inherit] transition-colors focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="address" className="block mb-2 font-medium text-gray-700 text-[0.9rem]">
                  Address <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Street address, City, State ZIP"
                  className="w-full p-2.5 border border-gray-300 rounded-md text-[0.95rem] font-[inherit] transition-colors focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                />
                <small className="block mt-1 text-[0.85rem] text-gray-500">
                  Used for geolocation verification when students check in
                </small>
              </div>

              <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                <div className="mb-5">
                  <label htmlFor="contactName" className="block mb-2 font-medium text-gray-700 text-[0.9rem]">Contact Name</label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    placeholder="Primary contact person"
                    className="w-full p-2.5 border border-gray-300 rounded-md text-[0.95rem] font-[inherit] transition-colors focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="contactPhone" className="block mb-2 font-medium text-gray-700 text-[0.9rem]">Contact Phone</label>
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="(319) 555-0123"
                    className="w-full p-2.5 border border-gray-300 rounded-md text-[0.95rem] font-[inherit] transition-colors focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                  />
                </div>
              </div>

              <div className="mb-5">
                <label htmlFor="contactEmail" className="block mb-2 font-medium text-gray-700 text-[0.9rem]">Contact Email</label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="contact@organization.org"
                  className="w-full p-2.5 border border-gray-300 rounded-md text-[0.95rem] font-[inherit] transition-colors focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="description" className="block mb-2 font-medium text-gray-700 text-[0.9rem]">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Describe what students will do at this internship..."
                  className="w-full p-2.5 border border-gray-300 rounded-md text-[0.95rem] font-[inherit] transition-colors resize-y min-h-[80px] focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button type="button" className="px-5 py-2.5 border-none rounded-md text-[0.95rem] font-medium cursor-pointer transition-all bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 border-none rounded-md text-[0.95rem] font-medium cursor-pointer transition-all bg-blue-600 text-white hover:bg-blue-700">
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
      <div className="grid gap-5">
        {displayedInternships.length === 0 ? (
          <div className="text-center py-12 px-4 text-gray-500">
            <p className="mb-4 text-[1.1rem]">No internships to display.</p>
            {!showInactive && (
              <button className="px-5 py-2.5 border-none rounded-md text-[0.95rem] font-medium cursor-pointer transition-all bg-blue-600 text-white hover:bg-blue-700" onClick={handleCreate}>
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
                className={`bg-white border border-gray-200 rounded-lg overflow-hidden transition-shadow hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] ${!internship.isActive ? 'opacity-60 bg-gray-50' : ''}`}
              >
                <div className="flex justify-between items-start p-5 bg-gray-50 border-b border-gray-200 max-md:flex-col max-md:gap-4">
                  <div>
                    <h3 className="m-0 text-[1.2rem] text-[#1a1a1a] flex items-center gap-2">{internship.organizationName}</h3>
                    {!internship.isActive && (
                      <span className="inline-block px-2.5 py-1 rounded-xl text-xs font-medium uppercase tracking-wider bg-red-100 text-red-800">Inactive</span>
                    )}
                  </div>
                  <div className="flex gap-2 max-md:w-full max-md:justify-end">
                    {internship.isActive ? (
                      <>
                        <button
                          className="px-3 py-1.5 border-none rounded-md text-[0.85rem] font-medium cursor-pointer transition-all bg-gray-100 text-gray-700 hover:bg-gray-200"
                          onClick={() => handleManageStudents(internship)}
                          title="Manage Students"
                        >
                          👥 Manage Students ({studentCount})
                        </button>
                        <button
                          className="bg-none border-none text-xl cursor-pointer p-1.5 rounded transition-colors hover:bg-gray-100"
                          onClick={() => handleEdit(internship)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="bg-none border-none text-xl cursor-pointer p-1.5 rounded transition-colors hover:bg-red-100"
                          onClick={() => handleDeactivate(internship.id)}
                          title="Deactivate"
                        >
                          🗑️
                        </button>
                      </>
                    ) : (
                      <button
                        className="px-3 py-1.5 border-none rounded-md text-[0.85rem] font-medium cursor-pointer transition-all bg-gray-100 text-gray-700 hover:bg-gray-200"
                        onClick={() => handleReactivate(internship.id)}
                      >
                        Reactivate
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex gap-2 mb-3 text-[0.95rem]">
                    <span className="font-medium text-gray-500 min-w-[80px]">📍 Address:</span>
                    <span>{internship.address}</span>
                  </div>

                  {internship.contactName && (
                    <div className="flex gap-2 mb-3 text-[0.95rem]">
                      <span className="font-medium text-gray-500 min-w-[80px]">👤 Contact:</span>
                      <span>{internship.contactName}</span>
                    </div>
                  )}

                  {internship.contactEmail && (
                    <div className="flex gap-2 mb-3 text-[0.95rem]">
                      <span className="font-medium text-gray-500 min-w-[80px]">✉️ Email:</span>
                      <span>
                        <a href={`mailto:${internship.contactEmail}`} className="text-blue-600 no-underline hover:underline">
                          {internship.contactEmail}
                        </a>
                      </span>
                    </div>
                  )}

                  {internship.contactPhone && (
                    <div className="flex gap-2 mb-3 text-[0.95rem]">
                      <span className="font-medium text-gray-500 min-w-[80px]">📞 Phone:</span>
                      <span>
                        <a href={`tel:${internship.contactPhone}`} className="text-blue-600 no-underline hover:underline">
                          {internship.contactPhone}
                        </a>
                      </span>
                    </div>
                  )}

                  {internship.description && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="m-0 text-gray-600 leading-relaxed">{internship.description}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 text-[0.85rem] text-gray-500 max-md:flex-col max-md:items-start max-md:gap-2">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1 font-medium text-blue-600">
                        👥 {studentCount} student{studentCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div>
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
