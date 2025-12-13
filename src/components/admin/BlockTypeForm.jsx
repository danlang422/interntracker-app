import React, { useState } from 'react';
import ScheduleSegmentCard from '../student/ScheduleSegmentCard';

/**
 * BlockTypeForm
 * 
 * Form for creating/editing block types with live preview.
 * Shows admins exactly what students will see when they check into this block type.
 * 
 * Props:
 * - initialData: Existing block type data (for editing) or null (for creating)
 * - onSubmit: Function called with form data
 * - onCancel: Function called when form is cancelled
 */
const BlockTypeForm = ({ initialData = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    description: '',
    icon: '📋',
    color: '#3B82F6',
    requiresCheckIn: true,
    checkInInterface: 'tap',
    promptSettings: {
      askLocation: false,
      askPlan: false,
      askProgress: false,
      customPrompt: ''
    },
    requiresGeolocation: false,
    geofenceRadius: 100,
    requiresCheckOut: false,
    lateThresholdMinutes: 15
  });

  const isEditing = initialData !== null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePromptSettingChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      promptSettings: {
        ...prev.promptSettings,
        [field]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Build preview segment data
  const previewSegment = {
    name: formData.name || 'Example Activity',
    startTime: '08:00',
    endTime: '09:30',
    location: 'Example Location',
    blockType: formData
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-h-[85vh]">
      {/* Left Side: Form */}
      <div className="flex-1 overflow-y-auto pr-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Basic Information
            </h3>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., City View Class"
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
                placeholder="Brief description of this block type..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => handleChange('icon', e.target.value)}
                  placeholder="📚"
                  maxLength={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-2xl text-center"
                />
              </div>

              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    id="color"
                    value={formData.color}
                    onChange={(e) => handleChange('color', e.target.value)}
                    className="h-10 w-16 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => handleChange('color', e.target.value)}
                    placeholder="#3B82F6"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Check-In Behavior Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Check-In Behavior
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-In Interface
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="tap"
                    checked={formData.checkInInterface === 'tap'}
                    onChange={(e) => handleChange('checkInInterface', e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm">
                    <strong>Tap</strong> - Instant check-in (no questions)
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="modal"
                    checked={formData.checkInInterface === 'modal'}
                    onChange={(e) => handleChange('checkInInterface', e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm">
                    <strong>Modal</strong> - Opens form with questions
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Questions Section (only if modal) */}
          {formData.checkInInterface === 'modal' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Questions to Ask
              </h3>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.promptSettings.askLocation}
                    onChange={(e) => handlePromptSettingChange('askLocation', e.target.checked)}
                    className="mr-3 h-4 w-4 text-blue-600 rounded"
                  />
                  <div>
                    <div className="font-medium text-sm">Ask Location</div>
                    <div className="text-xs text-gray-500">
                      "Where are you working?" (for remote students)
                    </div>
                  </div>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.promptSettings.askPlan}
                    onChange={(e) => handlePromptSettingChange('askPlan', e.target.checked)}
                    className="mr-3 h-4 w-4 text-blue-600 rounded"
                  />
                  <div>
                    <div className="font-medium text-sm">Ask Plan</div>
                    <div className="text-xs text-gray-500">
                      "What will you do today?"
                    </div>
                  </div>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.promptSettings.askProgress}
                    onChange={(e) => handlePromptSettingChange('askProgress', e.target.checked)}
                    className="mr-3 h-4 w-4 text-blue-600 rounded"
                  />
                  <div>
                    <div className="font-medium text-sm">Ask Progress</div>
                    <div className="text-xs text-gray-500">
                      "What progress did you make?"
                    </div>
                  </div>
                </label>

                <div>
                  <label htmlFor="customPrompt" className="block text-sm font-medium text-gray-700 mb-1">
                    Custom Question (Optional)
                  </label>
                  <input
                    type="text"
                    id="customPrompt"
                    value={formData.promptSettings.customPrompt || ''}
                    onChange={(e) => handlePromptSettingChange('customPrompt', e.target.value)}
                    placeholder="e.g., What challenges did you face?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Geolocation Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Location Verification
            </h3>

            <label className="flex items-start">
              <input
                type="checkbox"
                checked={formData.requiresGeolocation}
                onChange={(e) => handleChange('requiresGeolocation', e.target.checked)}
                className="mr-3 mt-1 h-4 w-4 text-blue-600 rounded"
              />
              <div>
                <div className="font-medium text-sm">Require Geolocation</div>
                <div className="text-xs text-gray-500">
                  Verify student is at the correct physical location (for internships)
                </div>
              </div>
            </label>

            {formData.requiresGeolocation && (
              <div>
                <label htmlFor="geofenceRadius" className="block text-sm font-medium text-gray-700 mb-1">
                  Geofence Radius (meters)
                </label>
                <input
                  type="number"
                  id="geofenceRadius"
                  value={formData.geofenceRadius}
                  onChange={(e) => handleChange('geofenceRadius', parseInt(e.target.value))}
                  min="50"
                  max="1000"
                  step="50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Student must be within this distance to check in (100-500m recommended)
                </p>
              </div>
            )}
          </div>

          {/* Time Tracking Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Time Tracking
            </h3>

            <label className="flex items-start">
              <input
                type="checkbox"
                checked={formData.requiresCheckOut}
                onChange={(e) => handleChange('requiresCheckOut', e.target.checked)}
                className="mr-3 mt-1 h-4 w-4 text-blue-600 rounded"
              />
              <div>
                <div className="font-medium text-sm">Require Check-Out</div>
                <div className="text-xs text-gray-500">
                  Track hours worked (for internships). Button shows "Clock In/Out" instead of "Check In"
                </div>
              </div>
            </label>

            <div>
              <label htmlFor="lateThreshold" className="block text-sm font-medium text-gray-700 mb-1">
                Late Threshold (minutes)
              </label>
              <input
                type="number"
                id="lateThreshold"
                value={formData.lateThresholdMinutes}
                onChange={(e) => handleChange('lateThresholdMinutes', parseInt(e.target.value))}
                min="0"
                max="60"
                step="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Check-ins after this many minutes are flagged as late
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-white pb-4">
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
              {isEditing ? 'Update Block Type' : 'Create Block Type'}
            </button>
          </div>
        </form>
      </div>

      {/* Right Side: Live Preview */}
      <div className="flex-1 lg:sticky lg:top-0 lg:self-start">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Student Preview
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            This is what students will see in their agenda:
          </p>
          
          <ScheduleSegmentCard
            segment={previewSegment}
            mode="preview"
          />
        </div>
      </div>
    </div>
  );
};

export default BlockTypeForm;
