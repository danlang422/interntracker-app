import React, { useState } from 'react';

/**
 * CheckInModal
 * 
 * Modal form for check-ins that require additional information.
 * Questions shown are based on block type promptSettings.
 * 
 * Props:
 * - blockType: Block type object with promptSettings
 * - segment: Schedule segment data
 * - mode: "preview" | "live"
 * - isCheckOut: boolean - is this a check-out (vs check-in)?
 * - onSubmit: Function called with form data
 * - onClose: Function to close modal
 */
const CheckInModal = ({ 
  blockType, 
  segment,
  mode = "live",
  isCheckOut = false,
  onSubmit, 
  onClose 
}) => {
  const [formData, setFormData] = useState({
    location: '',
    plan: '',
    progress: '',
    custom: ''
  });

  const promptSettings = blockType?.promptSettings || {};
  const { askLocation, askPlan, askProgress, customPrompt } = promptSettings;

  // For check-out, typically only show progress (how did it go?)
  const showLocation = !isCheckOut && askLocation;
  const showPlan = !isCheckOut && askPlan;
  const showProgress = isCheckOut || askProgress;
  const showCustom = !isCheckOut && customPrompt;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In preview mode, just show what would be submitted
    if (mode === "preview") {
      alert(`Preview Mode - Form Data:\n${JSON.stringify(formData, null, 2)}`);
      onClose();
      return;
    }

    // Filter out empty responses
    const responses = {};
    if (showLocation && formData.location) responses.location = formData.location;
    if (showPlan && formData.plan) responses.plan = formData.plan;
    if (showProgress && formData.progress) responses.progress = formData.progress;
    if (showCustom && formData.custom) responses.custom = formData.custom;

    onSubmit({ responses });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {isCheckOut ? 'Clock Out' : 'Check In'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Segment info */}
          <p className="text-sm text-gray-600 mt-2">
            {segment?.name || 'Activity'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Location Question */}
          {showLocation && (
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Where are you working?
              </label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g., Coffee shop, Library, Home"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          )}

          {/* Plan Question */}
          {showPlan && (
            <div>
              <label htmlFor="plan" className="block text-sm font-medium text-gray-700 mb-1">
                What will you do today?
              </label>
              <textarea
                id="plan"
                value={formData.plan}
                onChange={(e) => handleChange('plan', e.target.value)}
                placeholder="Describe your plan for this block..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          )}

          {/* Progress Question */}
          {showProgress && (
            <div>
              <label htmlFor="progress" className="block text-sm font-medium text-gray-700 mb-1">
                {isCheckOut ? "How did it go?" : "What progress did you make?"}
              </label>
              <textarea
                id="progress"
                value={formData.progress}
                onChange={(e) => handleChange('progress', e.target.value)}
                placeholder={isCheckOut ? "Reflect on your work..." : "Describe your progress..."}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          )}

          {/* Custom Question */}
          {showCustom && (
            <div>
              <label htmlFor="custom" className="block text-sm font-medium text-gray-700 mb-1">
                {customPrompt}
              </label>
              <textarea
                id="custom"
                value={formData.custom}
                onChange={(e) => handleChange('custom', e.target.value)}
                placeholder="Your response..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {isCheckOut ? 'Clock Out' : 'Check In'}
            </button>
          </div>
        </form>

        {/* Preview Mode Indicator */}
        {mode === "preview" && (
          <div className="bg-blue-50 border-t border-blue-200 px-6 py-3">
            <p className="text-xs text-blue-800">
              <strong>Preview Mode:</strong> In live mode, this form would record the check-in/out with the student's responses.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckInModal;
