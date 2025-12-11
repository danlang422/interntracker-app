import { useState, useEffect } from 'react';
import { useStudents } from '../../context/StudentsContext';
import { useAssignments } from '../../context/AssignmentsContext';
import './StudentManagementModal.css';

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content student-mgmt-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Manage Students</h3>
            <p className="internship-name">{internship.organizationName}</p>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {!showScheduleForm ? (
          // Main view: list of assigned students
          <div className="modal-body">
            <div className="assigned-students-section">
              <div className="section-header">
                <h4>Assigned Students ({assignedStudents.length})</h4>
                <button className="btn-primary btn-small" onClick={handleAddStudent}>
                  + Add Student
                </button>
              </div>

              {assignedStudents.length === 0 ? (
                <div className="empty-state">
                  <p>No students assigned to this internship yet.</p>
                  <button className="btn-primary" onClick={handleAddStudent}>
                    Add Your First Student
                  </button>
                </div>
              ) : (
                <div className="assigned-students-list">
                  {assignedStudents.map(assignment => {
                    const student = getStudentById(assignment.studentId);
                    if (!student) return null;

                    return (
                      <div key={assignment.id} className="assigned-student-card">
                        <div className="student-header">
                          <div>
                            <h5>{student.name}</h5>
                            <span className="grade-badge">Grade {student.gradeLevel}</span>
                          </div>
                          <div className="student-actions">
                            <button 
                              className="btn-icon"
                              onClick={() => handleEditAssignment(assignment)}
                              title="Edit Schedule"
                            >
                              ✏️
                            </button>
                            <button 
                              className="btn-icon danger"
                              onClick={() => handleRemoveStudent(assignment.id, student.name)}
                              title="Remove Student"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>

                        <div className="assignment-details">
                          <div className="detail-row">
                            <span className="detail-label">📅 Start Date:</span>
                            <span>{new Date(assignment.startDate).toLocaleDateString()}</span>
                          </div>
                          {assignment.endDate && (
                            <div className="detail-row">
                              <span className="detail-label">🏁 End Date:</span>
                              <span>{new Date(assignment.endDate).toLocaleDateString()}</span>
                            </div>
                          )}

                          {assignment.schedule && assignment.schedule.length > 0 ? (
                            <div className="schedule-display">
                              <span className="detail-label">🕐 Schedule:</span>
                              <div className="schedule-days">
                                {assignment.schedule.map((daySchedule, idx) => (
                                  <div key={idx} className="schedule-day-item">
                                    <strong>{daySchedule.day}:</strong>{' '}
                                    {formatTime(daySchedule.startTime)} - {formatTime(daySchedule.endTime)}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="detail-row">
                              <span className="detail-label">🕐 Schedule:</span>
                              <span className="no-schedule">No schedule set</span>
                            </div>
                          )}

                          {assignment.notes && (
                            <div className="detail-row notes">
                              <span className="detail-label">📝 Notes:</span>
                              <p>{assignment.notes}</p>
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
          <div className="modal-body">
            <form onSubmit={handleScheduleSubmit} className="schedule-form">
              {!editingAssignmentId && (
                <div className="form-group">
                  <label htmlFor="studentSelect">
                    Select Student <span className="required">*</span>
                  </label>
                  <select
                    id="studentSelect"
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    required
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
                <div className="editing-student-info">
                  <strong>Editing schedule for:</strong> {getStudentById(scheduleFormData.studentId)?.name}
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startDate">
                    Start Date <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={scheduleFormData.startDate}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate">
                    End Date <span className="optional">(optional)</span>
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={scheduleFormData.endDate}
                    onChange={handleFormChange}
                    min={scheduleFormData.startDate}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Weekly Schedule</label>
                <div className="schedule-builder">
                  {Object.entries(daySchedules).map(([day, data]) => (
                    <div key={day} className="schedule-day-row">
                      <label className="day-checkbox">
                        <input
                          type="checkbox"
                          checked={data.enabled}
                          onChange={() => handleDayToggle(day)}
                        />
                        <span className="day-name">{day}</span>
                      </label>

                      {data.enabled && (
                        <div className="time-inputs">
                          <input
                            type="time"
                            value={data.startTime}
                            onChange={(e) => handleTimeChange(day, 'startTime', e.target.value)}
                          />
                          <span className="time-separator">to</span>
                          <input
                            type="time"
                            value={data.endTime}
                            onChange={(e) => handleTimeChange(day, 'endTime', e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={scheduleFormData.notes}
                  onChange={handleFormChange}
                  rows="3"
                  placeholder="Any additional notes about this assignment..."
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={handleCancelSchedule}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
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
