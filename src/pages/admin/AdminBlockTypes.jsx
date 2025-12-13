import React, { useState } from 'react';
import { useBlockTypes } from '../../context/BlockTypesContext';
import BlockTypeForm from '../../components/admin/BlockTypeForm';

/**
 * AdminBlockTypes
 * 
 * Admin page for managing block types.
 * Shows grid of all block types, allows create/edit/deactivate.
 */
const AdminBlockTypes = () => {
  const {
    blockTypes,
    addBlockType,
    updateBlockType,
    toggleBlockTypeActive
  } = useBlockTypes();

  const [showModal, setShowModal] = useState(false);
  const [editingBlockType, setEditingBlockType] = useState(null);

  const handleCreate = () => {
    setEditingBlockType(null);
    setShowModal(true);
  };

  const handleEdit = (blockType) => {
    setEditingBlockType(blockType);
    setShowModal(true);
  };

  const handleSubmit = (formData) => {
    if (editingBlockType) {
      // Update existing
      updateBlockType(editingBlockType.id, formData);
    } else {
      // Create new
      addBlockType(formData);
    }
    setShowModal(false);
    setEditingBlockType(null);
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingBlockType(null);
  };

  const handleToggleActive = (id) => {
    toggleBlockTypeActive(id);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Block Types</h1>
          <p className="text-gray-600 mt-1">
            Define different types of schedule blocks and their check-in requirements
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Block Type
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">What are Block Types?</p>
            <p>
              Block types define how different activities work in student schedules. 
              Each type specifies check-in requirements (tap vs modal), questions to ask, 
              and whether location verification or time tracking is needed.
            </p>
          </div>
        </div>
      </div>

      {/* Block Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blockTypes.map(blockType => (
          <div
            key={blockType.id}
            className={`
              bg-white rounded-lg shadow-md p-5 border-l-4 transition-all
              ${blockType.isActive ? 'opacity-100' : 'opacity-50'}
            `}
            style={{ borderLeftColor: blockType.color }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl" aria-label="Block type icon">
                  {blockType.icon}
                </span>
                <div>
                  <h3 className="font-bold text-gray-900">{blockType.name}</h3>
                  {!blockType.isActive && (
                    <span className="text-xs text-gray-500">(Inactive)</span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {blockType.description && (
              <p className="text-sm text-gray-600 mb-4">
                {blockType.description}
              </p>
            )}

            {/* Features */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">
                  {blockType.checkInInterface === 'tap' ? 'Tap check-in' : 'Modal check-in'}
                </span>
              </div>

              {blockType.requiresGeolocation && (
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">
                    Geolocation ({blockType.geofenceRadius}m)
                  </span>
                </div>
              )}

              {blockType.requiresCheckOut && (
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">
                    Time tracking (check-out required)
                  </span>
                </div>
              )}

              {blockType.checkInInterface === 'modal' && (
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                  <span className="text-gray-700">
                    {[
                      blockType.promptSettings.askLocation && 'Location',
                      blockType.promptSettings.askPlan && 'Plan',
                      blockType.promptSettings.askProgress && 'Progress'
                    ].filter(Boolean).join(', ') || 'No questions'}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t">
              <button
                onClick={() => handleEdit(blockType)}
                className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleToggleActive(blockType.id)}
                className={`
                  flex-1 px-3 py-2 text-sm rounded-lg transition-colors font-medium
                  ${blockType.isActive 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }
                `}
              >
                {blockType.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {blockTypes.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No block types yet</h3>
          <p className="text-gray-600 mb-4">
            Create your first block type to get started
          </p>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Create Block Type
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingBlockType ? 'Edit Block Type' : 'Create New Block Type'}
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
              <BlockTypeForm
                initialData={editingBlockType}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlockTypes;
