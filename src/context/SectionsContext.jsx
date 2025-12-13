import React, { createContext, useContext, useState, useEffect } from 'react';

const SectionsContext = createContext();

export const useSections = () => {
  const context = useContext(SectionsContext);
  if (!context) {
    throw new Error('useSections must be used within a SectionsProvider');
  }
  return context;
};

export const SectionsProvider = ({ children }) => {
  // Load from localStorage or start empty
  const [sections, setSections] = useState(() => {
    const stored = localStorage.getItem('sections');
    return stored ? JSON.parse(stored) : [];
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('sections', JSON.stringify(sections));
  }, [sections]);

  // Add a new section
  const addSection = (sectionData) => {
    const newSection = {
      ...sectionData,
      id: `section_${Date.now()}`,
      organizationId: 'org_cityview',
      enrolledStudents: sectionData.enrolledStudents || [],
      createdBy: 'current_user',
      createdAt: new Date().toISOString(),
      modifiedBy: 'current_user',
      modifiedAt: new Date().toISOString(),
      isActive: true
    };

    setSections(prev => [...prev, newSection]);
    return newSection;
  };

  // Update existing section
  const updateSection = (id, updates) => {
    setSections(prev => prev.map(section =>
      section.id === id
        ? {
            ...section,
            ...updates,
            modifiedBy: 'current_user',
            modifiedAt: new Date().toISOString()
          }
        : section
    ));
  };

  // Enroll students in a section
  const enrollStudents = (sectionId, studentIds) => {
    setSections(prev => prev.map(section =>
      section.id === sectionId
        ? {
            ...section,
            enrolledStudents: [...new Set([...section.enrolledStudents, ...studentIds])],
            modifiedBy: 'current_user',
            modifiedAt: new Date().toISOString()
          }
        : section
    ));
  };

  // Unenroll a student from a section
  const unenrollStudent = (sectionId, studentId) => {
    setSections(prev => prev.map(section =>
      section.id === sectionId
        ? {
            ...section,
            enrolledStudents: section.enrolledStudents.filter(id => id !== studentId),
            modifiedBy: 'current_user',
            modifiedAt: new Date().toISOString()
          }
        : section
    ));
  };

  // Toggle active status
  const toggleSectionActive = (id) => {
    setSections(prev => prev.map(section =>
      section.id === id
        ? { ...section, isActive: !section.isActive }
        : section
    ));
  };

  // Get section by ID
  const getSectionById = (id) => {
    return sections.find(section => section.id === id);
  };

  // Get all active sections
  const getActiveSections = () => {
    return sections.filter(section => section.isActive);
  };

  // Get sections by staff member
  const getSectionsByStaff = (staffId) => {
    return sections.filter(section => section.attendanceStaffId === staffId && section.isActive);
  };

  // Get sections by block type
  const getSectionsByBlockType = (blockTypeId) => {
    return sections.filter(section => section.blockTypeId === blockTypeId && section.isActive);
  };

  // Get sections a student is enrolled in
  const getSectionsByStudent = (studentId) => {
    return sections.filter(section => 
      section.enrolledStudents.includes(studentId) && section.isActive
    );
  };

  // Get sections that meet on a specific day
  const getSectionsByDay = (dayOfWeek) => {
    return sections.filter(section =>
      section.daysOfWeek.includes(dayOfWeek) && section.isActive
    );
  };

  // Reset to empty
  const clearSections = () => {
    setSections([]);
  };

  const value = {
    sections,
    activeSections: getActiveSections(),
    addSection,
    updateSection,
    enrollStudents,
    unenrollStudent,
    toggleSectionActive,
    getSectionById,
    getSectionsByStaff,
    getSectionsByBlockType,
    getSectionsByStudent,
    getSectionsByDay,
    clearSections
  };

  return (
    <SectionsContext.Provider value={value}>
      {children}
    </SectionsContext.Provider>
  );
};
