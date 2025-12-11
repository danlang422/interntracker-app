import { createContext, useState, useContext } from 'react';

const InternshipsContext = createContext();

export function InternshipsProvider({ children }) {
  // Sample internship data structure
  const [internships, setInternships] = useState([
    {
      id: 1,
      organizationName: "Cedar Rapids Public Library",
      address: "450 5th Ave SE, Cedar Rapids, IA 52401",
      contactName: "Sarah Johnson",
      contactEmail: "sjohnson@crlibrary.org",
      contactPhone: "(319) 555-0123",
      description: "Students assist with library programs, digital literacy classes, and community outreach.",
      isActive: true,
      assignedMentors: [],
      assignedStudents: [],
      createdAt: new Date('2024-01-15').toISOString()
    },
    {
      id: 2,
      organizationName: "NewBo City Market",
      address: "1100 3rd St SE, Cedar Rapids, IA 52401",
      contactName: "Mike Davis",
      contactEmail: "mike@newbocitymarket.com",
      contactPhone: "(319) 555-0456",
      description: "Students work with local vendors, help with events, and learn about small business operations.",
      isActive: true,
      assignedMentors: [],
      assignedStudents: [],
      createdAt: new Date('2024-02-01').toISOString()
    },
    {
      id: 3,
      organizationName: "National Czech & Slovak Museum",
      address: "1400 Inspiration Pl SW, Cedar Rapids, IA 52404",
      contactName: "Jana Novak",
      contactEmail: "jnovak@ncsml.org",
      contactPhone: "(319) 555-0789",
      description: "Students support museum operations, educational programs, and cultural events.",
      isActive: true,
      assignedMentors: [],
      assignedStudents: [],
      createdAt: new Date('2024-01-20').toISOString()
    }
  ]);

  // Get all internships
  const getAllInternships = () => {
    return internships;
  };

  // Get active internships only
  const getActiveInternships = () => {
    return internships.filter(internship => internship.isActive);
  };

  // Get a single internship by ID
  const getInternshipById = (id) => {
    return internships.find(internship => internship.id === id);
  };

  // Create a new internship
  const createInternship = (internshipData) => {
    const newInternship = {
      id: Date.now(), // Simple ID generation
      ...internshipData,
      isActive: true,
      assignedMentors: [],
      assignedStudents: [],
      createdAt: new Date().toISOString()
    };

    setInternships([...internships, newInternship]);
    return newInternship;
  };

  // Update an existing internship
  const updateInternship = (id, updatedData) => {
    setInternships(internships.map(internship => 
      internship.id === id 
        ? { ...internship, ...updatedData }
        : internship
    ));
  };

  // Delete (deactivate) an internship
  const deleteInternship = (id) => {
    setInternships(internships.map(internship => 
      internship.id === id 
        ? { ...internship, isActive: false }
        : internship
    ));
  };

  // Permanently remove an internship (use sparingly)
  const permanentlyDeleteInternship = (id) => {
    setInternships(internships.filter(internship => internship.id !== id));
  };

  // Reactivate a deactivated internship
  const reactivateInternship = (id) => {
    setInternships(internships.map(internship => 
      internship.id === id 
        ? { ...internship, isActive: true }
        : internship
    ));
  };

  // Assign a mentor to an internship
  const assignMentor = (internshipId, mentorId) => {
    setInternships(internships.map(internship => {
      if (internship.id === internshipId) {
        const mentors = internship.assignedMentors || [];
        if (!mentors.includes(mentorId)) {
          return {
            ...internship,
            assignedMentors: [...mentors, mentorId]
          };
        }
      }
      return internship;
    }));
  };

  // Remove a mentor from an internship
  const removeMentor = (internshipId, mentorId) => {
    setInternships(internships.map(internship => {
      if (internship.id === internshipId) {
        return {
          ...internship,
          assignedMentors: internship.assignedMentors.filter(id => id !== mentorId)
        };
      }
      return internship;
    }));
  };

  // Assign a student to an internship
  const assignStudent = (internshipId, studentId) => {
    setInternships(internships.map(internship => {
      if (internship.id === internshipId) {
        const students = internship.assignedStudents || [];
        if (!students.includes(studentId)) {
          return {
            ...internship,
            assignedStudents: [...students, studentId]
          };
        }
      }
      return internship;
    }));
  };

  // Remove a student from an internship
  const removeStudent = (internshipId, studentId) => {
    setInternships(internships.map(internship => {
      if (internship.id === internshipId) {
        return {
          ...internship,
          assignedStudents: internship.assignedStudents.filter(id => id !== studentId)
        };
      }
      return internship;
    }));
  };

  const value = {
    internships,
    getAllInternships,
    getActiveInternships,
    getInternshipById,
    createInternship,
    updateInternship,
    deleteInternship,
    permanentlyDeleteInternship,
    reactivateInternship,
    assignMentor,
    removeMentor,
    assignStudent,
    removeStudent
  };

  return (
    <InternshipsContext.Provider value={value}>
      {children}
    </InternshipsContext.Provider>
  );
}

// Custom hook to use the internships context
export function useInternships() {
  const context = useContext(InternshipsContext);
  if (!context) {
    throw new Error('useInternships must be used within an InternshipsProvider');
  }
  return context;
}
