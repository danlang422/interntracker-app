import React, { useState } from 'react';
import { useBlockTypes } from '../../context/BlockTypesContext';
import { useScheduleTemplates } from '../../context/ScheduleTemplatesContext';
import { useStudents } from '../../context/StudentsContext';
import ScheduleSegmentCard from '../student/ScheduleSegmentCard';

/**
 * SectionForm
 * 
 * Form for creating/editing sections (classes/groups).
 * Shows live preview of what students will see.
 */
const SectionForm = ({ initialData = null, onSubmit, onCancel }) => {
  const { activeBlockTypes } = useBlockTypes();
  const { getReportingBlocksForSection } = useScheduleTemplates();
  const { getActiveStudents } = useStudents();
  
  const [formData, setFormData] = useState(initialData || {
    name: '',
    description: '',
    blockTypeId: '',
    attendanceStaffId: 'secretary_blenda', // Default to office
    location: '',
    isOffsite: false,
    
    // Schedule
    daysOfWeek: [],
    startTime: '09:30',
    endTime: '11:00',
    
    // Dates
    startDate: '',
    endDate: '',
    
    // Students
    enrolledStudents: [],
    
    // Tags
    tags: [],
    notes: ''
  });

  const [showStudentPicker, setShowStudentPicker] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');

  const isEditing = initialData !== null;
  const allStudents = getActiveStudents();

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleDay = (day) => {
    setFormData(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...prev.daysOfWeek, day]
    }));
  };

  const handleStudentToggle = (studentId) => {
    setFormData(prev => ({
      ...prev,
      enrolledStudents: prev.enrolledStudents.includes(studentId)
        ? prev.enrolledStudents.filter(id => id !== studentId)
        : [...prev.enrolledStudents, studentId]
    }));
  };

  const handleSelectAllStudents = () => {
    setFormData(prev => ({
      ...prev,
      enrolledStudents: allStudents.map(s => s.id)
    }));
  };

  const handleClearStudents = () => {
    setFormData(prev => ({ ...prev, enrolledStudents: [] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert('Please enter a section name');
      return;
    }
    if (!formData.blockTypeId) {
      alert('Please select a block type');
      return;
    }
    if (formData.daysOfWeek.length === 0) {
      alert('Please select at least one day of the week');
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      alert('Please set start and end dates');
      return;
    }

    onSubmit(formData);
  };

  // Get selected block type for preview
  const selectedBlockType = activeBlockTypes.find(bt => bt.id === formData.blockTypeId);

  // Build preview segment
  const previewSegment = selectedBlockType ? {
    name: formData.name || 'Section Name',
    startTime: formData.startTime,
    endTime: formData.endTime,
    location: formData.location || 'Location TBD',
    blockType: selectedBlockType
  } : null;

  // Calculate which reporting blocks this maps to
  const reportingBlocks = previewSegment 
    ? getReportingBlocksForSection(previewSegment)
    : [];

  // Filter students for search
  const filteredStudents = allStudents.filter(student =>
    student.name.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-h-[85vh]">
      {/* Left Side: Form */}
      <div className="flex-1 overflow-y-auto pr-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Section Information
            </h3>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Section Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Chemistry - Ms. Garcia, Monitor Group A"
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
                placeholder="Brief description..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="blockType" className="block text-sm font-medium text-gray-700 mb-1">
                Block Type * <span className="text-xs text-gray-500">(defines check-in behavior)</span>
              </label>
              <select
                id="blockType"
                value={formData.blockTypeId}
                onChange={(e) => handleChange('blockTypeId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a block type...</option>
                {activeBlockTypes.map(bt => (
                  <option key={bt.id} value={bt.id}>
                    {bt.icon} {bt.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Location
            </h3>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g., Room 204, Lab 101, KHEC Building B"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isOffsite}
                onChange={(e) => handleChange('isOffsite', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                This section meets off-site
              </span>
            </label>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Schedule
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Days of Week *
              </label>
              <div className="flex flex-wrap gap-2">
                {days.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`
                      px-4 py-2 rounded-lg font-medium text-sm transition-colors
                      ${formData.daysOfWeek.includes(day)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time *
                </label>
                <input
                  type="time"
                  id="startTime"
                  value={formData.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                  End Time *
                </label>
                <input
                  type="time"
                  id="endTime"
                  value={formData.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Show which reporting blocks this maps to */}
            {reportingBlocks.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex gap-2 text-sm text-green-900">
                  <svg className="w-5 h-5 flex-shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium">Maps to Reporting Block{reportingBlocks.length > 1 ? 's' : ''}:</p>
                    <p className="mt-1">
                      {reportingBlocks.map(block => (
                        <span key={block.blockNumber} className="inline-block mr-2">
                          Block {block.blockNumber}
                          {block.isPartial && <span className="text-amber-700"> (partial)</span>}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Attendance Staff */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Attendance
            </h3>

            <div>
              <label htmlFor="attendanceStaff" className="block text-sm font-medium text-gray-700 mb-1">
                Who reviews attendance for this section? *
              </label>
              <select
                id="attendanceStaff"
                value={formData.attendanceStaffId}
                onChange={(e) => handleChange('attendanceStaffId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="secretary_blenda">Office (Blenda)</option>
                <option value="teacher_johnson">Mr. Johnson</option>
                <option value="teacher_garcia">Ms. Garcia</option>
                <option value="teacher_smith">Mr. Smith</option>
                {/* TODO: Load from staff list */}
              </select>
            </div>
          </div>

          {/* Students */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex-1">
                Enrolled Students ({formData.enrolledStudents.length})
              </h3>
              <button
                type="button"
                onClick={() => setShowStudentPicker(!showStudentPicker)}
                className="ml-4 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                {showStudentPicker ? 'Close' : 'Select Students'}
              </button>
            </div>

            {showStudentPicker && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="flex-1 mr-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleSelectAllStudents}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 mr-2"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={handleClearStudents}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                  >
                    Clear
                  </button>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2">
                  {filteredStudents.map(student => (
                    <label
                      key={student.id}
                      className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.enrolledStudents.includes(student.id)}
                        onChange={() => handleStudentToggle(student.id)}
                        className="mr-3 h-4 w-4 text-blue-600 rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{student.name}</div>
                        <div className="text-xs text-gray-500">Grade {student.gradeLevel}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {formData.enrolledStudents.length > 0 && !showStudentPicker && (
              <div className="text-sm text-gray-600">
                {formData.enrolledStudents.length} student{formData.enrolledStudents.length !== 1 ? 's' : ''} enrolled
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Additional notes about this section..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
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
              {isEditing ? 'Update Section' : 'Create Section'}
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
          
          {previewSegment ? (
            <ScheduleSegmentCard
              segment={previewSegment}
              mode="preview"
            />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              <p>Select a block type to see preview</p>
            </div>
          )}

          {reportingBlocks.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              <p className="font-medium mb-2">Attendance Reporting:</p>
              <ul className="space-y-1">
                {reportingBlocks.map(block => (
                  <li key={block.blockNumber}>
                    • Block {block.blockNumber}: {block.overlapStart} - {block.overlapEnd}
                    {block.isPartial && <span className="text-amber-600"> (partial)</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionForm;
