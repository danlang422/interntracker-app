import { useState, useEffect } from 'react';
import { useStudents } from '../../context/StudentsContext';
import { useAssignments } from '../../context/AssignmentsContext';

function StudentManagementModal({ internship, onClose }) {
  const { getAllStudents, getStudentById } = useStudents();
  const {
    getActiveAssignmentsByInternship,
    createAssignment,
    updateAssignment,
    deactivateAssignment
  } = useAssignments();

  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [editingAssignmentId, setEditingAssignmentId] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  
  const [scheduleFormData, setScheduleFormData] = useState({
    studentId: null,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: '',
    schedule: []
  });

  const [daySchedules, setDaySchedules] = useState({
    Monday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    Tuesday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    Wednesday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    Thursday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    Friday: { enabled: false, startTime: '09:00', endTime: '17:00' }
  });

  const allStudents = getAllStudents().filter(s => s.isActive);
  const assignedStudents = getActiveAssignmentsByInternship(internship.id);

  // Get unassigned students (students without any active assignment)
  const unassignedStudents = allStudents.filter(student => {
    return !assignedStudents.some(assignment => assignment.studentId === student.id);
  });

  // Handle day checkbox toggle
  const handleDayToggle = (day) => {
    setDaySchedules(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled
      }
    }));
  };

  // Handle time change for a specific day
  const handleTimeChange = (day, field, value) => {
    setDaySchedules(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setScheduleFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open form to add new student
  const handleAddStudent = () => {
    if (unassignedStudents.length === 0) {
      alert('No unassigned students available. All active students are already assigned to internships.');
      return;
    }

    setSelectedStudentId('');
    setEditingAssignmentId(null);
    setScheduleFormData({
      studentId: null,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      notes: '',
      schedule: []
    });
    setDaySchedules({
      Monday: { enabled: false, startTime: '09:00', endTime: '17:00' },
      Tuesday: { enabled: false, startTime: '09:00', endTime: '17:00' },
      Wednesday: { enabled: false, startTime: '09:00', endTime: '17:00' },
      Thursday: { enabled: false, startTime: '09:00', endTime: '17:00' },
      Friday: { enabled: false, startTime: '09:00', endTime: '17:00' }
    });
    setShowScheduleForm(true);
  };

  // Open form to edit existing assignment
  const handleEditAssignment = (assignment) => {
    const student = getStudentById(assignment.studentId);
    setSelectedStudentId(assignment.studentId);
    setEditingAssignmentId(assignment.id);
    setScheduleFormData({
      studentId: assignment.studentId,
      startDate: assignment.startDate || new Date().toISOString().split('T')[0],
      endDate: assignment.endDate || '',
      notes: assignment.notes || '',
      schedule: assignment.schedule || []
    });

    // Populate day schedules from assignment
    const newDaySchedules = {
      Monday: { enabled: false, startTime: '09:00', endTime: '17:00' },
      Tuesday: { enabled: false, startTime: '09:00', endTime: '17:00' },
      Wednesday: { enabled: false, startTime: '09:00', endTime: '17:00' },
      Thursday: { enabled: false, startTime: '09:00', endTime: '17:00' },
      Friday: { enabled: false, startTime: '09:00', endTime: '17:00' }
    };

    (assignment.schedule || []).forEach(daySchedule => {
      if (newDaySchedules[daySchedule.day]) {
        newDaySchedules[daySchedule.day] = {
          enabled: true,
          startTime: daySchedule.startTime,
          endTime: daySchedule.endTime
        };
      }
    });

    setDaySchedules(newDaySchedules);
    setShowScheduleForm(true);
  };

  // Submit schedule form
  const handleScheduleSubmit = (e) => {
    e.preventDefault();

    // Build schedule array from daySchedules
    const schedule = Object.entries(daySchedules)
      .filter(([day, data]) => data.enabled)
      .map(([day, data]) => ({
        day,
        startTime: data.startTime,
        endTime: data.endTime
      }));

    const assignmentData = {
      studentId: editingAssignmentId ? scheduleFormData.studentId : parseInt(selectedStudentId),
      internshipId: internship.id,
      startDate: scheduleFormData.startDate,
      endDate: scheduleFormData.endDate || null,
      schedule,
      notes: scheduleFormData.notes
    };

    if (editingAssignmentId) {
      // Update existing assignment
      updateAssignment(editingAssignmentId, assignmentData);
    } else {
      // Create new assignment
      createAssignment(assignmentData);
    }

    // Reset form and close
    setShowScheduleForm(false);
    setEditingAssignmentId(null);
    setSelectedStudentId('');
  };

  // Cancel schedule form
  const handleCancelSchedule = () => {
    setShowScheduleForm(false);
    setEditingAssignmentId(null);
    setSelectedStudentId('');
  };

  // Remove student from internship
  const handleRemoveStudent = (assignmentId, studentName) => {
    if (window.confirm(`Are you sure you want to remove ${studentName} from this internship?`)) {
      deactivateAssignment(assignmentId);
    }
  };

  // Format time for display (convert 24hr to 12hr with AM/PM)
  const formatTime = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000] p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-[800px] max-h-[90vh] overflow-y-auto shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] max-md:m-4 max-md:max-h-[calc(100vh-2rem)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div>
            <h3 className="m-0">Manage Students</h3>
            <p className="mt-1 mb-0 text-gray-500 text-[0.9rem]">{internship.organizationName}</p>
          </div>
          <button className="bg-none border-none text-[2rem] text-gray-400 cursor-pointer leading-none p-0 w-8 h-8 flex items-center justify-center rounded transition-all hover:bg-gray-100 hover:text-gray-700" onClick={onClose}>×</button>
        </div>

        {!showScheduleForm ? (
          // Main view: list of assigned students
          <div className="p-6">
            <div>
              <div className="flex justify-between items-center mb-6 max-md:flex-col max-md:items-start max-md:gap-4">
                <h4 className="m-0 text-[1.1rem] text-[#1a1a1a]">Assigned Students ({assignedStudents.length})</h4>
                <button className="px-3 py-1.5 border-none rounded-md text-[0.85rem] font-medium cursor-pointer transition-all bg-blue-600 text-white hover:bg-blue-700" onClick={handleAddStudent}>
                  + Add Student
                </button>
              </div>

              {assignedStudents.length === 0 ? (
                <div className="text-center py-12 px-4 text-gray-500">
                  <p className="mb-4 text-base">No students assigned to this internship yet.</p>
                  <button className="px-5 py-2.5 border-none rounded-md text-[0.95rem] font-medium cursor-pointer transition-all bg-blue-600 text-white hover:bg-blue-700" onClick={handleAddStudent}>
                    Add Your First Student
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {assignedStudents.map(assignment => {
                    const student = getStudentById(assignment.studentId);
                    if (!student) return null;

                    return (
                      <div key={assignment.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 transition-shadow hover:shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                        <div className="flex justify-between items-start mb-4 pb-3 border-b border-gray-200 max-md:flex-col max-md:gap-4">
                          <div>
                            <h5 className="m-0 mb-1 text-[1.05rem] text-[#1a1a1a]">{student.name}</h5>
                            <span className="inline-block px-2 py-1 rounded-[10px] text-[0.7rem] font-medium bg-blue-100 text-blue-800">Grade {student.gradeLevel}</span>
                          </div>
                          <div className="flex gap-2 max-md:w-full max-md:justify-end">
                            <button
                              className="bg-none border-none text-xl cursor-pointer p-1.5 rounded transition-colors hover:bg-gray-100"
                              onClick={() => handleEditAssignment(assignment)}
                              title="Edit Schedule"
                            >
                              ✏️
                            </button>
                            <button
                              className="bg-none border-none text-xl cursor-pointer p-1.5 rounded transition-colors hover:bg-red-100"
                              onClick={() => handleRemoveStudent(assignment.id, student.name)}
                              title="Remove Student"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          <div className="flex items-start gap-2 text-[0.9rem]">
                            <span className="font-medium text-gray-500 min-w-[100px]">📅 Start Date:</span>
                            <span>{new Date(assignment.startDate).toLocaleDateString()}</span>
                          </div>
                          {assignment.endDate && (
                            <div className="flex items-start gap-2 text-[0.9rem]">
                              <span className="font-medium text-gray-500 min-w-[100px]">🏁 End Date:</span>
                              <span>{new Date(assignment.endDate).toLocaleDateString()}</span>
                            </div>
                          )}

                          {assignment.schedule && assignment.schedule.length > 0 ? (
                            <div className="flex flex-col gap-2">
                              <span className="font-medium text-gray-500">🕐 Schedule:</span>
                              <div className="flex flex-col gap-1.5 mt-1">
                                {assignment.schedule.map((daySchedule, idx) => (
                                  <div key={idx} className="py-1.5 px-2.5 bg-white border border-gray-200 rounded text-[0.85rem]">
                                    <strong className="text-gray-700 min-w-[90px] inline-block">{daySchedule.day}:</strong>{' '}
                                    {formatTime(daySchedule.startTime)} - {formatTime(daySchedule.endTime)}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start gap-2 text-[0.9rem]">
                              <span className="font-medium text-gray-500 min-w-[100px]">🕐 Schedule:</span>
                              <span className="text-gray-400 italic">No schedule set</span>
                            </div>
                          )}

                          {assignment.notes && (
                            <div className="flex flex-col gap-1 text-[0.9rem]">
                              <span className="font-medium text-gray-500">📝 Notes:</span>
                              <p className="m-0 text-gray-600 leading-relaxed pl-0">{assignment.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Schedule form view
          <div>
            <form onSubmit={handleScheduleSubmit} className="p-6">
              {!editingAssignmentId && (
                <div className="mb-5">
                  <label htmlFor="studentSelect" className="block mb-2 font-medium text-gray-700 text-[0.9rem]">
                    Select Student <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="studentSelect"
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    required
                    className="w-full p-2.5 border border-gray-300 rounded-md text-[0.95rem] font-[inherit] transition-colors focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                  >
                    <option value="">Choose a student...</option>
                    {unassignedStudents.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.name} - Grade {student.gradeLevel}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {editingAssignmentId && (
                <div className="p-4 bg-blue-50 border-l-[3px] border-blue-500 rounded mb-6 text-blue-900">
                  <strong>Editing schedule for:</strong> {getStudentById(scheduleFormData.studentId)?.name}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                <div className="mb-5">
                  <label htmlFor="startDate" className="block mb-2 font-medium text-gray-700 text-[0.9rem]">
                    Start Date <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={scheduleFormData.startDate}
                    onChange={handleFormChange}
                    required
                    className="w-full p-2.5 border border-gray-300 rounded-md text-[0.95rem] font-[inherit] transition-colors focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="endDate" className="block mb-2 font-medium text-gray-700 text-[0.9rem]">
                    End Date <span className="text-gray-400 font-normal text-[0.85rem]">(optional)</span>
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={scheduleFormData.endDate}
                    onChange={handleFormChange}
                    min={scheduleFormData.startDate}
                    className="w-full p-2.5 border border-gray-300 rounded-md text-[0.95rem] font-[inherit] transition-colors focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="block mb-2 font-medium text-gray-700 text-[0.9rem]">Weekly Schedule</label>
                <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-md">
                  {Object.entries(daySchedules).map(([day, data]) => (
                    <div key={day} className={`flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-md transition-all max-md:flex-col max-md:items-start max-md:gap-3 ${data.enabled ? 'border-blue-500 shadow-[0_0_0_3px_rgba(37,99,235,0.1)]' : ''}`}>
                      <label className="flex items-center gap-2 min-w-[120px] cursor-pointer select-none m-0 font-normal max-md:w-full">
                        <input
                          type="checkbox"
                          checked={data.enabled}
                          onChange={() => handleDayToggle(day)}
                          className="cursor-pointer w-auto"
                        />
                        <span className="font-medium text-gray-700">{day}</span>
                      </label>

                      {data.enabled && (
                        <div className="flex items-center gap-3 flex-1 max-md:w-full">
                          <input
                            type="time"
                            value={data.startTime}
                            onChange={(e) => handleTimeChange(day, 'startTime', e.target.value)}
                            className="p-2 border border-gray-300 rounded text-[0.9rem] w-[120px] focus:outline-none focus:border-blue-600 max-md:flex-1"
                          />
                          <span className="text-gray-500 text-[0.9rem]">to</span>
                          <input
                            type="time"
                            value={data.endTime}
                            onChange={(e) => handleTimeChange(day, 'endTime', e.target.value)}
                            className="p-2 border border-gray-300 rounded text-[0.9rem] w-[120px] focus:outline-none focus:border-blue-600 max-md:flex-1"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label htmlFor="notes" className="block mb-2 font-medium text-gray-700 text-[0.9rem]">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={scheduleFormData.notes}
                  onChange={handleFormChange}
                  rows="3"
                  placeholder="Any additional notes about this assignment..."
                  className="w-full p-2.5 border border-gray-300 rounded-md text-[0.95rem] font-[inherit] transition-colors resize-y min-h-[60px] focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button type="button" className="px-5 py-2.5 border-none rounded-md text-[0.95rem] font-medium cursor-pointer transition-all bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={handleCancelSchedule}>
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 border-none rounded-md text-[0.95rem] font-medium cursor-pointer transition-all bg-blue-600 text-white hover:bg-blue-700">
                  {editingAssignmentId ? 'Update Assignment' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentManagementModal;
