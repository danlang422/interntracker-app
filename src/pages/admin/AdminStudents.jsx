import { useState } from 'react';
import { useStudents } from '../../context/StudentsContext';
import { useAssignments } from '../../context/AssignmentsContext';
import { useInternships } from '../../context/InternshipsContext';

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
    <div className="p-8 max-w-[1400px] mx-auto max-md:p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4 max-md:flex-col max-md:items-start">
        <h2 className="m-0 text-[1.75rem] text-[#1a1a1a]">Manage Students</h2>
        <button className="px-5 py-2.5 border-none rounded-md text-[0.95rem] font-medium cursor-pointer transition-all bg-blue-600 text-white hover:bg-blue-700" onClick={handleCreate}>
          + New Student
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md text-[0.95rem] transition-colors focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
          />
        </div>

        <div className="flex gap-4 flex-wrap items-center max-md:w-full">
          <select value={filterGrade} onChange={(e) => setFilterGrade(e.target.value)} className="py-2.5 pr-8 pl-3 border border-gray-300 rounded-md text-[0.9rem] bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20viewBox=%220%200%2012%2012%22%3E%3Cpath%20fill=%22%23374151%22%20d=%22M6%209L1%204h10z%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_0.75rem_center] transition-colors focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] max-md:flex-1 max-md:min-w-[120px]">
            <option value="all">All Grades</option>
            <option value="9">9th Grade</option>
            <option value="10">10th Grade</option>
            <option value="11">11th Grade</option>
            <option value="12">12th Grade</option>
          </select>

          <select value={filterInternship} onChange={(e) => setFilterInternship(e.target.value)} className="py-2.5 pr-8 pl-3 border border-gray-300 rounded-md text-[0.9rem] bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20viewBox=%220%200%2012%2012%22%3E%3Cpath%20fill=%22%23374151%22%20d=%22M6%209L1%204h10z%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_0.75rem_center] transition-colors focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] max-md:flex-1 max-md:min-w-[120px]">
            <option value="all">All Internships</option>
            <option value="unassigned">Unassigned</option>
            {activeInternships.map(internship => (
              <option key={internship.id} value={internship.id}>
                {internship.organizationName}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-[0.9rem] text-[#666] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="cursor-pointer"
            />
            Show Inactive
          </label>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-gray-500 text-[0.9rem]">
        Showing {displayedStudents.length} of {allStudents.filter(s => showInactive || s.isActive).length} students
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000] p-4" onClick={handleCancel}>
          <div className="bg-white rounded-xl w-full max-w-[700px] max-h-[90vh] overflow-y-auto shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] max-md:m-4 max-md:max-h-[calc(100vh-2rem)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h3 className="m-0 text-xl text-[#1a1a1a]">{editingId ? 'Edit Student' : 'Create New Student'}</h3>
              <button className="bg-none border-none text-[2rem] text-gray-400 cursor-pointer leading-none p-0 w-8 h-8 flex items-center justify-center rounded transition-all hover:bg-gray-100 hover:text-gray-700" onClick={handleCancel}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                <div className="mb-5">
                  <label htmlFor="name" className="block mb-2 font-medium text-gray-700 text-[0.9rem]">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="First Last"
                    className="w-full p-2.5 border border-gray-300 rounded-md text-[0.95rem] font-[inherit] transition-colors focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="gradeLevel" className="block mb-2 font-medium text-gray-700 text-[0.9rem]">
                    Grade Level <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="gradeLevel"
                    name="gradeLevel"
                    value={formData.gradeLevel}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2.5 border border-gray-300 rounded-md text-[0.95rem] font-[inherit] transition-colors focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                  >
                    <option value="">Select grade</option>
                    <option value={9}>9th Grade</option>
                    <option value={10}>10th Grade</option>
                    <option value={11}>11th Grade</option>
                    <option value={12}>12th Grade</option>
                  </select>
                </div>
              </div>

              <div className="mb-5">
                <label htmlFor="email" className="block mb-2 font-medium text-gray-700 text-[0.9rem]">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="student@cityview.cr.k12.ia.us"
                  className="w-full p-2.5 border border-gray-300 rounded-md text-[0.95rem] font-[inherit] transition-colors focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                />
                <small className="block mt-1 text-[0.85rem] text-gray-500">
                  Used for Google OAuth login
                </small>
              </div>

              <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                <div className="mb-5">
                  <label htmlFor="phoneNumber" className="block mb-2 font-medium text-gray-700 text-[0.9rem]">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="(319) 555-1234"
                    className="w-full p-2.5 border border-gray-300 rounded-md text-[0.95rem] font-[inherit] transition-colors focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="assignedAdvisor" className="block mb-2 font-medium text-gray-700 text-[0.9rem]">Assigned Advisor</label>
                  <input
                    type="email"
                    id="assignedAdvisor"
                    name="assignedAdvisor"
                    value={formData.assignedAdvisor}
                    onChange={handleInputChange}
                    placeholder="advisor@cityview.cr.k12.ia.us"
                    className="w-full p-2.5 border border-gray-300 rounded-md text-[0.95rem] font-[inherit] transition-colors focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                  />
                </div>
              </div>

              <div className="mb-5">
                <label htmlFor="emergencyContact" className="block mb-2 font-medium text-gray-700 text-[0.9rem]">Emergency Contact</label>
                <input
                  type="text"
                  id="emergencyContact"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  placeholder="Name (Relationship) - Phone"
                  className="w-full p-2.5 border border-gray-300 rounded-md text-[0.95rem] font-[inherit] transition-colors focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="notes" className="block mb-2 font-medium text-gray-700 text-[0.9rem]">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Any additional information about this student..."
                  className="w-full p-2.5 border border-gray-300 rounded-md text-[0.95rem] font-[inherit] transition-colors resize-y min-h-[60px] focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button type="button" className="px-5 py-2.5 border-none rounded-md text-[0.95rem] font-medium cursor-pointer transition-all bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 border-none rounded-md text-[0.95rem] font-medium cursor-pointer transition-all bg-blue-600 text-white hover:bg-blue-700">
                  {editingId ? 'Save Changes' : 'Create Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Students List */}
      <div className="grid gap-4">
        {displayedStudents.length === 0 ? (
          <div className="text-center py-12 px-4 text-gray-500">
            <p>No students match your filters.</p>
          </div>
        ) : (
          displayedStudents.map((student) => {
            const assignment = getStudentAssignment(student.id);

            return (
              <div
                key={student.id}
                className={`bg-white border border-gray-200 rounded-lg overflow-hidden transition-shadow hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] ${!student.isActive ? 'opacity-60 bg-gray-50' : ''}`}
              >
                <div className="flex justify-between items-start p-5 bg-gray-50 border-b border-gray-200 max-md:flex-col max-md:gap-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="m-0 text-[1.15rem] text-[#1a1a1a]">{student.name}</h3>
                    <span className="inline-block px-2.5 py-1 rounded-xl text-xs font-medium bg-blue-100 text-blue-800">Grade {student.gradeLevel}</span>
                    {!student.isActive && (
                      <span className="inline-block px-2.5 py-1 rounded-xl text-xs font-medium uppercase tracking-wider bg-red-100 text-red-800">Inactive</span>
                    )}
                  </div>
                  <div className="flex gap-2 max-md:w-full max-md:justify-end">
                    {student.isActive ? (
                      <>
                        <button
                          className="bg-none border-none text-xl cursor-pointer p-1.5 rounded transition-colors hover:bg-gray-100"
                          onClick={() => handleEdit(student)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="bg-none border-none text-xl cursor-pointer p-1.5 rounded transition-colors hover:bg-red-100"
                          onClick={() => handleDeactivate(student.id)}
                          title="Deactivate"
                        >
                          🗑️
                        </button>
                      </>
                    ) : (
                      <button
                        className="px-3 py-1.5 border-none rounded-md text-[0.85rem] font-medium cursor-pointer transition-all bg-gray-100 text-gray-700 hover:bg-gray-200"
                        onClick={() => handleReactivate(student.id)}
                      >
                        Reactivate
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex gap-3 mb-3 text-[0.95rem] items-center max-md:flex-col max-md:items-start max-md:gap-1">
                    <span className="font-medium text-gray-500 min-w-[100px] max-md:min-w-0">✉️ Email:</span>
                    <span><a href={`mailto:${student.email}`} className="text-blue-600 no-underline hover:underline">{student.email}</a></span>
                  </div>

                  {student.phoneNumber && (
                    <div className="flex gap-3 mb-3 text-[0.95rem] items-center max-md:flex-col max-md:items-start max-md:gap-1">
                      <span className="font-medium text-gray-500 min-w-[100px] max-md:min-w-0">📞 Phone:</span>
                      <span><a href={`tel:${student.phoneNumber}`} className="text-blue-600 no-underline hover:underline">{student.phoneNumber}</a></span>
                    </div>
                  )}

                  {student.assignedAdvisor && (
                    <div className="flex gap-3 mb-3 text-[0.95rem] items-center max-md:flex-col max-md:items-start max-md:gap-1">
                      <span className="font-medium text-gray-500 min-w-[100px] max-md:min-w-0">👤 Advisor:</span>
                      <span>{student.assignedAdvisor}</span>
                    </div>
                  )}

                  {student.emergencyContact && (
                    <div className="flex gap-3 mb-3 text-[0.95rem] items-center max-md:flex-col max-md:items-start max-md:gap-1">
                      <span className="font-medium text-gray-500 min-w-[100px] max-md:min-w-0">🚨 Emergency:</span>
                      <span>{student.emergencyContact}</span>
                    </div>
                  )}

                  <div className="flex gap-3 mb-3 text-[0.95rem] items-center max-md:flex-col max-md:items-start max-md:gap-1">
                    <span className="font-medium text-gray-500 min-w-[100px] max-md:min-w-0">🏢 Internship:</span>
                    {student.isActive ? (
                      <select
                        value={assignment ? assignment.internshipId : 'none'}
                        onChange={(e) => handleQuickAssignInternship(student.id, e.target.value)}
                        className="py-1.5 px-2.5 border border-gray-300 rounded text-[0.9rem] cursor-pointer bg-white transition-colors focus:outline-none focus:border-blue-600 max-md:w-full"
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
                    <div className="mt-2 p-3 bg-blue-50 border-l-[3px] border-blue-500 rounded">
                      <small className="text-blue-900 leading-relaxed">
                        📝 To set schedule details, manage this student from the{' '}
                        <a href="/admin/internships" className="text-blue-600 underline font-medium hover:text-blue-700">Internships page</a>
                      </small>
                    </div>
                  )}

                  {student.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <span className="font-medium text-gray-500 block mb-2">📝 Notes:</span>
                      <p className="m-0 text-gray-600 leading-relaxed">{student.notes}</p>
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
