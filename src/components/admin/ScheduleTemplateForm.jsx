import React, { useState } from 'react';

/**
 * ScheduleTemplateForm
 * 
 * Form for creating/editing schedule templates.
 * Allows admins to define reporting blocks for SIS.
 */
const ScheduleTemplateForm = ({ initialData = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    description: '',
    reportingBlocks: [
      { blockNumber: 1, name: 'Block 1', startTime: '07:30', endTime: '09:30' },
      { blockNumber: 2, name: 'Block 2', startTime: '09:30', endTime: '11:30' },
      { blockNumber: 3, name: 'Block 3', startTime: '11:30', endTime: '13:30' },
      { blockNumber: 4, name: 'Block 4', startTime: '13:30', endTime: '15:30' }
    ],
    isDefault: false
  });

  const isEditing = initialData !== null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBlockChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      reportingBlocks: prev.reportingBlocks.map((block, i) =>
        i === index ? { ...block, [field]: value } : block
      )
    }));
  };

  const addBlock = () => {
    const lastBlock = formData.reportingBlocks[formData.reportingBlocks.length - 1];
    const newBlockNumber = formData.reportingBlocks.length + 1;
    
    setFormData(prev => ({
      ...prev,
      reportingBlocks: [
        ...prev.reportingBlocks,
        {
          blockNumber: newBlockNumber,
          name: `Block ${newBlockNumber}`,
          startTime: lastBlock.endTime,
          endTime: '15:30'
        }
      ]
    }));
  };

  const removeBlock = (index) => {
    if (formData.reportingBlocks.length <= 1) {
      alert('Template must have at least one block');
      return;
    }

    setFormData(prev => ({
      ...prev,
      reportingBlocks: prev.reportingBlocks
        .filter((_, i) => i !== index)
        .map((block, i) => ({ ...block, blockNumber: i + 1, name: `Block ${i + 1}` }))
    }));
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert('Please enter a template name');
      return;
    }

    // Check for time overlaps or gaps
    for (let i = 0; i < formData.reportingBlocks.length - 1; i++) {
      const currentBlock = formData.reportingBlocks[i];
      const nextBlock = formData.reportingBlocks[i + 1];
      
      if (currentBlock.endTime !== nextBlock.startTime) {
        const shouldContinue = window.confirm(
          `Block ${currentBlock.blockNumber} ends at ${currentBlock.endTime} but Block ${nextBlock.blockNumber} starts at ${nextBlock.startTime}. This will create a gap/overlap. Continue anyway?`
        );
        if (!shouldContinue) return;
      }
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Template Information
        </h3>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Template Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Regular Day, Early Dismissal"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Brief description of when this template is used..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Reporting Blocks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex-1">
            Reporting Blocks for SIS
          </h3>
          <button
            type="button"
            onClick={addBlock}
            className="ml-4 px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Block
          </button>
        </div>

        <div className="space-y-3">
          {formData.reportingBlocks.map((block, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-4">
                {/* Block Number */}
                <div className="flex-shrink-0 w-20">
                  <div className="text-2xl font-bold text-gray-700">
                    Block {block.blockNumber}
                  </div>
                </div>

                {/* Time Inputs */}
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={block.startTime}
                      onChange={(e) => handleBlockChange(index, 'startTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={block.endTime}
                      onChange={(e) => handleBlockChange(index, 'endTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Duration Display */}
                <div className="flex-shrink-0 w-20 text-center">
                  <div className="text-xs text-gray-500">Duration</div>
                  <div className="text-sm font-semibold text-gray-700">
                    {calculateDuration(block.startTime, block.endTime)}
                  </div>
                </div>

                {/* Remove Button */}
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => removeBlock(index)}
                    disabled={formData.reportingBlocks.length <= 1}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Remove block"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex gap-2 text-sm text-blue-900">
            <svg className="w-5 h-5 flex-shrink-0 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p>
              These are the reporting blocks that will be used to report attendance in your SIS. 
              Student sections will automatically map to these blocks based on time overlap.
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Template Summary</h4>
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Total Blocks:</span>
            <span className="font-semibold">{formData.reportingBlocks.length}</span>
          </div>
          <div className="flex justify-between">
            <span>School Day:</span>
            <span className="font-semibold">
              {formData.reportingBlocks[0]?.startTime} - {formData.reportingBlocks[formData.reportingBlocks.length - 1]?.endTime}
            </span>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          {isEditing ? 'Update Template' : 'Create Template'}
        </button>
      </div>
    </form>
  );
};

export default ScheduleTemplateForm;
