import React, { useState } from 'react';
import { useScheduleTemplates } from '../../context/ScheduleTemplatesContext';
import ScheduleTemplateForm from '../../components/admin/ScheduleTemplateForm';

/**
 * AdminScheduleTemplates
 * 
 * Admin page for managing schedule templates (reporting blocks for SIS).
 */
const AdminScheduleTemplates = () => {
  const {
    templates,
    addTemplate,
    updateTemplate,
    setDefaultTemplate,
    toggleTemplateActive
  } = useScheduleTemplates();

  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const handleCreate = () => {
    setEditingTemplate(null);
    setShowModal(true);
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setShowModal(true);
  };

  const handleSubmit = (formData) => {
    if (editingTemplate) {
      updateTemplate(editingTemplate.id, formData);
    } else {
      addTemplate(formData);
    }
    setShowModal(false);
    setEditingTemplate(null);
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingTemplate(null);
  };

  const handleSetDefault = (id) => {
    setDefaultTemplate(id);
  };

  const handleToggleActive = (id) => {
    toggleTemplateActive(id);
  };

  const calculateDuration = (startTime, endTime) => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    
    const durationMinutes = endTotalMinutes - startTotalMinutes;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule Templates</h1>
          <p className="text-gray-600 mt-1">
            Define reporting blocks for your Student Information System
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Template
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">What are Schedule Templates?</p>
            <p>
              Templates define the blocks (periods) for reporting attendance in your SIS.
              Student sections automatically map to these blocks based on time overlap.
              Create different templates for regular days, early dismissal, late start, etc.
            </p>
          </div>
        </div>
      </div>

      {/* Templates List */}
      <div className="space-y-4">
        {templates.map(template => (
          <div
            key={template.id}
            className={`
              bg-white rounded-lg shadow-md border-2 transition-all
              ${template.isDefault ? 'border-blue-500' : 'border-gray-200'}
              ${!template.isActive && 'opacity-50'}
            `}
          >
            {/* Template Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {template.name}
                    </h3>
                    {template.isDefault && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                        DEFAULT
                      </span>
                    )}
                    {!template.isActive && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded">
                        INACTIVE
                      </span>
                    )}
                  </div>
                  {template.description && (
                    <p className="text-gray-600 mt-1">{template.description}</p>
                  )}
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    <span>{template.reportingBlocks.length} blocks</span>
                    <span>•</span>
                    <span>
                      {template.reportingBlocks[0]?.startTime} - {template.reportingBlocks[template.reportingBlocks.length - 1]?.endTime}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(template)}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Edit
                  </button>
                  {!template.isDefault && (
                    <button
                      onClick={() => handleSetDefault(template.id)}
                      className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                    >
                      Set as Default
                    </button>
                  )}
                  <button
                    onClick={() => handleToggleActive(template.id)}
                    className={`
                      px-3 py-2 text-sm rounded-lg transition-colors font-medium
                      ${template.isActive 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }
                    `}
                  >
                    {template.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>

            {/* Blocks Display */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {template.reportingBlocks.map((block) => (
                  <div
                    key={block.blockNumber}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                  >
                    <div className="text-lg font-bold text-gray-900 mb-1">
                      {block.name}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{block.startTime} - {block.endTime}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Duration: {calculateDuration(block.startTime, block.endTime)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {templates.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No schedule templates yet</h3>
          <p className="text-gray-600 mb-4">
            Create your first template to define reporting blocks for attendance
          </p>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Create Template
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingTemplate ? 'Edit Schedule Template' : 'Create New Schedule Template'}
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
              <ScheduleTemplateForm
                initialData={editingTemplate}
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

export default AdminScheduleTemplates;
