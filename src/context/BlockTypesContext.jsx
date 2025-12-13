import React, { createContext, useContext, useState, useEffect } from 'react';

const BlockTypesContext = createContext();

export const useBlockTypes = () => {
  const context = useContext(BlockTypesContext);
  if (!context) {
    throw new Error('useBlockTypes must be used within a BlockTypesProvider');
  }
  return context;
};

export const BlockTypesProvider = ({ children }) => {
  // Initialize with default block types
  const defaultBlockTypes = [
    {
      id: 'bt_cityview_class',
      organizationId: 'org_cityview',
      name: 'City View Class',
      description: 'In-person class at City View',
      icon: '📚',
      color: '#3B82F6',
      requiresCheckIn: true,
      checkInInterface: 'tap',
      promptSettings: {
        askLocation: false,
        askPlan: false,
        askProgress: false,
        customPrompt: null
      },
      requiresGeolocation: false,
      geofenceRadius: null,
      requiresCheckOut: false,
      lateThresholdMinutes: 15,
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      modifiedBy: 'system',
      modifiedAt: new Date().toISOString(),
      isActive: true
    },
    {
      id: 'bt_kirkwood_class',
      organizationId: 'org_cityview',
      name: 'Kirkwood Class',
      description: 'Community college dual enrollment class',
      icon: '🎓',
      color: '#8B5CF6',
      requiresCheckIn: true,
      checkInInterface: 'modal',
      promptSettings: {
        askLocation: false,
        askPlan: false,
        askProgress: false,
        customPrompt: null
      },
      requiresGeolocation: false,
      geofenceRadius: null,
      requiresCheckOut: false,
      lateThresholdMinutes: 10,
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      modifiedBy: 'system',
      modifiedAt: new Date().toISOString(),
      isActive: true
    },
    {
      id: 'bt_remote_morning',
      organizationId: 'org_cityview',
      name: 'Remote Work (Morning)',
      description: 'Remote learning - first check-in with plan',
      icon: '💻',
      color: '#10B981',
      requiresCheckIn: true,
      checkInInterface: 'modal',
      promptSettings: {
        askLocation: true,
        askPlan: true,
        askProgress: false,
        customPrompt: null
      },
      requiresGeolocation: false,
      geofenceRadius: null,
      requiresCheckOut: false,
      lateThresholdMinutes: 30,
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      modifiedBy: 'system',
      modifiedAt: new Date().toISOString(),
      isActive: true
    },
    {
      id: 'bt_remote_progress',
      organizationId: 'org_cityview',
      name: 'Remote Work (Progress)',
      description: 'Remote learning - progress check-in',
      icon: '✍️',
      color: '#14B8A6',
      requiresCheckIn: true,
      checkInInterface: 'modal',
      promptSettings: {
        askLocation: false,
        askPlan: false,
        askProgress: true,
        customPrompt: null
      },
      requiresGeolocation: false,
      geofenceRadius: null,
      requiresCheckOut: false,
      lateThresholdMinutes: 30,
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      modifiedBy: 'system',
      modifiedAt: new Date().toISOString(),
      isActive: true
    },
    {
      id: 'bt_internship',
      organizationId: 'org_cityview',
      name: 'Internship',
      description: 'Off-site internship with geolocation and time tracking',
      icon: '🏢',
      color: '#F59E0B',
      requiresCheckIn: true,
      checkInInterface: 'modal',
      promptSettings: {
        askLocation: false,
        askPlan: true,
        askProgress: false,
        customPrompt: null
      },
      requiresGeolocation: true,
      geofenceRadius: 100,
      requiresCheckOut: true,
      lateThresholdMinutes: 10,
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      modifiedBy: 'system',
      modifiedAt: new Date().toISOString(),
      isActive: true
    },
    {
      id: 'bt_monitor',
      organizationId: 'org_cityview',
      name: 'Monitor Group',
      description: 'Study hall / supervised independent work',
      icon: '📖',
      color: '#6B7280',
      requiresCheckIn: true,
      checkInInterface: 'tap',
      promptSettings: {
        askLocation: false,
        askPlan: false,
        askProgress: false,
        customPrompt: null
      },
      requiresGeolocation: false,
      geofenceRadius: null,
      requiresCheckOut: false,
      lateThresholdMinutes: 15,
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      modifiedBy: 'system',
      modifiedAt: new Date().toISOString(),
      isActive: true
    }
  ];

  // Load from localStorage or use defaults
  const [blockTypes, setBlockTypes] = useState(() => {
    const stored = localStorage.getItem('blockTypes');
    return stored ? JSON.parse(stored) : defaultBlockTypes;
  });

  // Persist to localStorage whenever blockTypes changes
  useEffect(() => {
    localStorage.setItem('blockTypes', JSON.stringify(blockTypes));
  }, [blockTypes]);

  // Add a new block type
  const addBlockType = (blockTypeData) => {
    const newBlockType = {
      ...blockTypeData,
      id: `bt_${Date.now()}`,
      organizationId: 'org_cityview',
      createdBy: 'current_user', // TODO: Get from auth context
      createdAt: new Date().toISOString(),
      modifiedBy: 'current_user',
      modifiedAt: new Date().toISOString(),
      isActive: true
    };

    setBlockTypes(prev => [...prev, newBlockType]);
    return newBlockType;
  };

  // Update an existing block type
  const updateBlockType = (id, updates) => {
    setBlockTypes(prev => prev.map(bt => 
      bt.id === id 
        ? {
            ...bt,
            ...updates,
            modifiedBy: 'current_user', // TODO: Get from auth context
            modifiedAt: new Date().toISOString()
          }
        : bt
    ));
  };

  // Toggle active status
  const toggleBlockTypeActive = (id) => {
    setBlockTypes(prev => prev.map(bt =>
      bt.id === id
        ? { ...bt, isActive: !bt.isActive }
        : bt
    ));
  };

  // Delete a block type (soft delete - just deactivate)
  const deleteBlockType = (id) => {
    toggleBlockTypeActive(id);
  };

  // Get a single block type by ID
  const getBlockTypeById = (id) => {
    return blockTypes.find(bt => bt.id === id);
  };

  // Get all active block types
  const getActiveBlockTypes = () => {
    return blockTypes.filter(bt => bt.isActive);
  };

  // Reset to defaults (useful for testing)
  const resetToDefaults = () => {
    setBlockTypes(defaultBlockTypes);
  };

  const value = {
    blockTypes,
    activeBlockTypes: getActiveBlockTypes(),
    addBlockType,
    updateBlockType,
    deleteBlockType,
    toggleBlockTypeActive,
    getBlockTypeById,
    resetToDefaults
  };

  return (
    <BlockTypesContext.Provider value={value}>
      {children}
    </BlockTypesContext.Provider>
  );
};
