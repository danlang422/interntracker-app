import { createContext, useState, useContext } from 'react';

const StudentsContext = createContext();

export function StudentsProvider({ children }) {
  // Sample student data structure (schedule moved to AssignmentsContext)
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Emma Rodriguez",
      email: "erodriguez@cityview.cr.k12.ia.us",
      gradeLevel: 11,
      assignedAdvisor: "sarah.johnson@cityview.cr.k12.ia.us",
      isActive: true,
      phoneNumber: "(319) 555-1234",
      emergencyContact: "Maria Rodriguez (Mother) - (319) 555-1235",
      notes: "Interested in library science and digital media",
      createdAt: new Date('2024-09-01').toISOString()
    },
    {
      id: 2,
      name: "Marcus Chen",
      email: "mchen@cityview.cr.k12.ia.us",
      gradeLevel: 12,
      assignedAdvisor: "sarah.johnson@cityview.cr.k12.ia.us",
      isActive: true,
      phoneNumber: "(319) 555-2345",
      emergencyContact: "Linda Chen (Mother) - (319) 555-2346",
      notes: "Exploring careers in business and entrepreneurship",
      createdAt: new Date('2024-08-28').toISOString()
    },
    {
      id: 3,
      name: "Aisha Patel",
      email: "apatel@cityview.cr.k12.ia.us",
      gradeLevel: 11,
      assignedAdvisor: "dennis.becker@cityview.cr.k12.ia.us",
      isActive: true,
      phoneNumber: "(319) 555-3456",
      emergencyContact: "Raj Patel (Father) - (319) 555-3457",
      notes: "Strong interest in cultural heritage and museum work",
      createdAt: new Date('2024-09-05').toISOString()
    },
    {
      id: 4,
      name: "Jordan Williams",
      email: "jwilliams@cityview.cr.k12.ia.us",
      gradeLevel: 10,
      assignedAdvisor: "dennis.becker@cityview.cr.k12.ia.us",
      isActive: true,
      phoneNumber: "(319) 555-4567",
      emergencyContact: "Tamara Williams (Mother) - (319) 555-4568",
      notes: "Exploring various career paths, very curious learner",
      createdAt: new Date('2024-09-03').toISOString()
    }
  ]);

  // Get all students
  const getAllStudents = () => {
    return students;
  };

  // Get active students only
  const getActiveStudents = () => {
    return students.filter(student => student.isActive);
  };

  // Get a single student by ID
  const getStudentById = (id) => {
    return students.find(student => student.id === id);
  };

  // Get students by advisor
  const getStudentsByAdvisor = (advisorEmail) => {
    return students.filter(student => student.assignedAdvisor === advisorEmail);
  };

  // Get students by grade level
  const getStudentsByGrade = (gradeLevel) => {
    return students.filter(student => student.gradeLevel === gradeLevel);
  };

  // Create a new student
  const createStudent = (studentData) => {
    const newStudent = {
      id: Date.now(), // Simple ID generation
      ...studentData,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    setStudents([...students, newStudent]);
    return newStudent;
  };

  // Update an existing student
  const updateStudent = (id, updatedData) => {
    setStudents(students.map(student => 
      student.id === id 
        ? { ...student, ...updatedData }
        : student
    ));
  };

  // Deactivate a student
  const deactivateStudent = (id) => {
    setStudents(students.map(student => 
      student.id === id 
        ? { ...student, isActive: false }
        : student
    ));
  };

  // Reactivate a student
  const reactivateStudent = (id) => {
    setStudents(students.map(student => 
      student.id === id 
        ? { ...student, isActive: true }
        : student
    ));
  };

  // Permanently remove a student (use sparingly)
  const permanentlyDeleteStudent = (id) => {
    setStudents(students.filter(student => student.id !== id));
  };

  // Assign student to advisor
  const assignToAdvisor = (studentId, advisorEmail) => {
    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, assignedAdvisor: advisorEmail }
        : student
    ));
  };

  const value = {
    students,
    getAllStudents,
    getActiveStudents,
    getStudentById,
    getStudentsByAdvisor,
    getStudentsByGrade,
    createStudent,
    updateStudent,
    deactivateStudent,
    reactivateStudent,
    permanentlyDeleteStudent,
    assignToAdvisor
  };

  return (
    <StudentsContext.Provider value={value}>
      {children}
    </StudentsContext.Provider>
  );
}

// Custom hook to use the students context
export function useStudents() {
  const context = useContext(StudentsContext);
  if (!context) {
    throw new Error('useStudents must be used within a StudentsProvider');
  }
  return context;
}
