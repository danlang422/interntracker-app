import React, { createContext, useContext, useState, useEffect } from 'react';

const ScheduleTemplatesContext = createContext();

export const useScheduleTemplates = () => {
  const context = useContext(ScheduleTemplatesContext);
  if (!context) {
    throw new Error('useScheduleTemplates must be used within a ScheduleTemplatesProvider');
  }
  return context;
};

export const ScheduleTemplatesProvider = ({ children }) => {
  // Default templates
  const defaultTemplates = [
    {
      id: 'template_regular',
      organizationId: 'org_cityview',
      name: 'Regular Day',
      description: 'Standard 4-block schedule',
      reportingBlocks: [
        { blockNumber: 1, name: 'Block 1', startTime: '07:30', endTime: '09:30' },
        { blockNumber: 2, name: 'Block 2', startTime: '09:30', endTime: '11:30' },
        { blockNumber: 3, name: 'Block 3', startTime: '11:30', endTime: '13:30' },
        { blockNumber: 4, name: 'Block 4', startTime: '13:30', endTime: '15:30' }
      ],
      isDefault: true,
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      isActive: true
    },
    {
      id: 'template_early_dismissal',
      organizationId: 'org_cityview',
      name: 'Early Dismissal',
      description: 'Shortened 3-block schedule',
      reportingBlocks: [
        { blockNumber: 1, name: 'Block 1', startTime: '07:30', endTime: '09:00' },
        { blockNumber: 2, name: 'Block 2', startTime: '09:00', endTime: '10:30' },
        { blockNumber: 3, name: 'Block 3', startTime: '10:30', endTime: '12:00' }
      ],
      isDefault: false,
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      isActive: true
    },
    {
      id: 'template_late_start',
      organizationId: 'org_cityview',
      name: 'Late Start',
      description: 'Delayed start, 4 blocks',
      reportingBlocks: [
        { blockNumber: 1, name: 'Block 1', startTime: '09:00', endTime: '10:30' },
        { blockNumber: 2, name: 'Block 2', startTime: '10:30', endTime: '12:00' },
        { blockNumber: 3, name: 'Block 3', startTime: '12:00', endTime: '13:30' },
        { blockNumber: 4, name: 'Block 4', startTime: '13:30', endTime: '15:00' }
      ],
      isDefault: false,
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      isActive: true
    }
  ];

  // Load from localStorage or use defaults
  const [templates, setTemplates] = useState(() => {
    const stored = localStorage.getItem('scheduleTemplates');
    return stored ? JSON.parse(stored) : defaultTemplates;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('scheduleTemplates', JSON.stringify(templates));
  }, [templates]);

  // Helper: Convert time string to minutes since midnight
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Helper: Check if two time ranges overlap
  const timesOverlap = (start1, end1, start2, end2) => {
    const start1Min = timeToMinutes(start1);
    const end1Min = timeToMinutes(end1);
    const start2Min = timeToMinutes(start2);
    const end2Min = timeToMinutes(end2);

    return start1Min < end2Min && end1Min > start2Min;
  };

  // Get which reporting blocks a section overlaps with
  const getReportingBlocksForSection = (section, templateId = null) => {
    // Get the template (use default if not specified)
    const template = templateId 
      ? templates.find(t => t.id === templateId)
      : templates.find(t => t.isDefault);

    if (!template) return [];

    const overlappingBlocks = [];

    template.reportingBlocks.forEach(block => {
      if (timesOverlap(
        section.startTime, section.endTime,
        block.startTime, block.endTime
      )) {
        const sectionStartMin = timeToMinutes(section.startTime);
        const sectionEndMin = timeToMinutes(section.endTime);
        const blockStartMin = timeToMinutes(block.startTime);
        const blockEndMin = timeToMinutes(block.endTime);

        const overlapStartMin = Math.max(sectionStartMin, blockStartMin);
        const overlapEndMin = Math.min(sectionEndMin, blockEndMin);

        // Convert back to time strings
        const overlapStart = `${Math.floor(overlapStartMin / 60).toString().padStart(2, '0')}:${(overlapStartMin % 60).toString().padStart(2, '0')}`;
        const overlapEnd = `${Math.floor(overlapEndMin / 60).toString().padStart(2, '0')}:${(overlapEndMin % 60).toString().padStart(2, '0')}`;

        overlappingBlocks.push({
          blockNumber: block.blockNumber,
          blockName: block.name,
          overlapStart,
          overlapEnd,
          isPartial: sectionStartMin < blockStartMin || sectionEndMin > blockEndMin,
          overlapMinutes: overlapEndMin - overlapStartMin
        });
      }
    });

    return overlappingBlocks;
  };

  // Add a new template
  const addTemplate = (templateData) => {
    const newTemplate = {
      ...templateData,
      id: `template_${Date.now()}`,
      organizationId: 'org_cityview',
      createdBy: 'current_user',
      createdAt: new Date().toISOString(),
      modifiedBy: 'current_user',
      modifiedAt: new Date().toISOString(),
      isActive: true
    };

    setTemplates(prev => [...prev, newTemplate]);
    return newTemplate;
  };

  // Update existing template
  const updateTemplate = (id, updates) => {
    setTemplates(prev => prev.map(t =>
      t.id === id
        ? {
            ...t,
            ...updates,
            modifiedBy: 'current_user',
            modifiedAt: new Date().toISOString()
          }
        : t
    ));
  };

  // Set as default template
  const setDefaultTemplate = (id) => {
    setTemplates(prev => prev.map(t => ({
      ...t,
      isDefault: t.id === id
    })));
  };

  // Toggle active status
  const toggleTemplateActive = (id) => {
    setTemplates(prev => prev.map(t =>
      t.id === id ? { ...t, isActive: !t.isActive } : t
    ));
  };

  // Get template by ID
  const getTemplateById = (id) => {
    return templates.find(t => t.id === id);
  };

  // Get default template
  const getDefaultTemplate = () => {
    return templates.find(t => t.isDefault) || templates[0];
  };

  // Get all active templates
  const getActiveTemplates = () => {
    return templates.filter(t => t.isActive);
  };

  // Reset to defaults
  const resetToDefaults = () => {
    setTemplates(defaultTemplates);
  };

  const value = {
    templates,
    activeTemplates: getActiveTemplates(),
    defaultTemplate: getDefaultTemplate(),
    addTemplate,
    updateTemplate,
    setDefaultTemplate,
    toggleTemplateActive,
    getTemplateById,
    getReportingBlocksForSection,
    resetToDefaults
  };

  return (
    <ScheduleTemplatesContext.Provider value={value}>
      {children}
    </ScheduleTemplatesContext.Provider>
  );
};
