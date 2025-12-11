import { createContext, useState, useContext } from 'react';

const AssignmentsContext = createContext();

export function AssignmentsProvider({ children }) {
  // Assignment structure: links student to internship with schedule details
  const [assignments, setAssignments] = useState([
    // Sample assignment - commented out for now
    // {
    //   id: 1,
    //   studentId: 1, // Emma Rodriguez
    //   internshipId: 1, // Cedar Rapids Public Library
    //   startDate: '2024-09-15',
    //   endDate: null, // Optional - ongoing
    //   schedule: [
    //     { day: 'Monday', startTime: '13:00', endTime: '14:30' },
    //     { day: 'Wednesday', startTime: '13:00', endTime: '14:30' },
    //     { day: 'Friday', startTime: '13:00', endTime: '14:30' }
    //   ],
    //   notes: '',
    //   isActive: true,
    //   createdAt: new Date('2024-09-15').toISOString()
    // }
  ]);

  // Get all assignments
  const getAllAssignments = () => {
    return assignments;
  };

  // Get active assignments only
  const getActiveAssignments = () => {
    return assignments.filter(assignment => assignment.isActive);
  };

  // Get assignment by ID
  const getAssignmentById = (id) => {
    return assignments.find(assignment => assignment.id === id);
  };

  // Get all assignments for a student
  const getAssignmentsByStudent = (studentId) => {
    return assignments.filter(assignment => assignment.studentId === studentId);
  };

  // Get active assignment for a student (should only be one)
  const getActiveAssignmentForStudent = (studentId) => {
    return assignments.find(assignment => 
      assignment.studentId === studentId && assignment.isActive
    );
  };

  // Get all assignments for an internship
  const getAssignmentsByInternship = (internshipId) => {
    return assignments.filter(assignment => assignment.internshipId === internshipId);
  };

  // Get active assignments for an internship
  const getActiveAssignmentsByInternship = (internshipId) => {
    return assignments.filter(assignment => 
      assignment.internshipId === internshipId && assignment.isActive
    );
  };

  // Create a new assignment
  const createAssignment = (assignmentData) => {
    // Check if student already has an active assignment
    const existingActive = getActiveAssignmentForStudent(assignmentData.studentId);
    if (existingActive) {
      console.warn('Student already has an active assignment. Deactivating previous assignment.');
      deactivateAssignment(existingActive.id);
    }

    const newAssignment = {
      id: Date.now(),
      ...assignmentData,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    setAssignments([...assignments, newAssignment]);
    return newAssignment;
  };

  // Update an existing assignment
  const updateAssignment = (id, updatedData) => {
    setAssignments(assignments.map(assignment => 
      assignment.id === id 
        ? { ...assignment, ...updatedData }
        : assignment
    ));
  };

  // Deactivate an assignment (student finishes internship)
  const deactivateAssignment = (id) => {
    setAssignments(assignments.map(assignment => 
      assignment.id === id 
        ? { ...assignment, isActive: false }
        : assignment
    ));
  };

  // Reactivate an assignment
  const reactivateAssignment = (id) => {
    const assignment = getAssignmentById(id);
    if (assignment) {
      // Deactivate any other active assignments for this student
      const existingActive = getActiveAssignmentForStudent(assignment.studentId);
      if (existingActive && existingActive.id !== id) {
        deactivateAssignment(existingActive.id);
      }
    }

    setAssignments(assignments.map(a => 
      a.id === id 
        ? { ...a, isActive: true }
        : a
    ));
  };

  // Delete assignment permanently
  const deleteAssignment = (id) => {
    setAssignments(assignments.filter(assignment => assignment.id !== id));
  };

  // Quick assign student to internship (creates basic assignment without schedule)
  const quickAssignStudent = (studentId, internshipId) => {
    return createAssignment({
      studentId,
      internshipId,
      startDate: new Date().toISOString().split('T')[0], // Today's date
      endDate: null,
      schedule: [],
      notes: ''
    });
  };

  // Remove student from internship (deactivates assignment)
  const removeStudentFromInternship = (studentId) => {
    const activeAssignment = getActiveAssignmentForStudent(studentId);
    if (activeAssignment) {
      deactivateAssignment(activeAssignment.id);
    }
  };

  const value = {
    assignments,
    getAllAssignments,
    getActiveAssignments,
    getAssignmentById,
    getAssignmentsByStudent,
    getActiveAssignmentForStudent,
    getAssignmentsByInternship,
    getActiveAssignmentsByInternship,
    createAssignment,
    updateAssignment,
    deactivateAssignment,
    reactivateAssignment,
    deleteAssignment,
    quickAssignStudent,
    removeStudentFromInternship
  };

  return (
    <AssignmentsContext.Provider value={value}>
      {children}
    </AssignmentsContext.Provider>
  );
}

// Custom hook to use the assignments context
export function useAssignments() {
  const context = useContext(AssignmentsContext);
  if (!context) {
    throw new Error('useAssignments must be used within an AssignmentsProvider');
  }
  return context;
}
