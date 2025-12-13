import React, { useState } from 'react';
import { useSections } from '../../context/SectionsContext';
import { useBlockTypes } from '../../context/BlockTypesContext';
import { useScheduleTemplates } from '../../context/ScheduleTemplatesContext';
import { useStudents } from '../../context/StudentsContext';
import SectionForm from '../../components/admin/SectionForm';

/**
 * AdminSections
 * 
 * Admin page for managing sections (classes/groups).
 */
const AdminSections = () => {
  const {
    sections,
    addSection,
    updateSection,
    enrollStudents,
    unenrollStudent,
    toggleSectionActive
  } = useSections();

  const { getBlockTypeById } = useBlockTypes();
  const { getReportingBlocksForSection } = useScheduleTemplates();
  const { getAllStudents } = useStudents();

  const [showModal, setShowModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [filterBlockType, setFilterBlockType] = useState('all');
  const [filterDay, setFilterDay] = useState('all');

  const handleCreate = () => {
    setEditingSection(null);
    setShowModal(true);
  };

  const handleEdit = (section) => {
    setEditingSection(section);
    setShowModal(true);
  };

  const handleSubmit = (formData) => {
    if (editingSection) {
      updateSection(editingSection.id, formData);
    } else {
      addSection(formData);
    }
    setShowModal(false);
    setEditingSection(null);
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingSection(null);
  };

  const handleToggleActive = (id) => {
    toggleSectionActive(id);
  };

  const getStudentName = (studentId) => {
    const student = getAllStudents().find(s => s.id === studentId);
    return student ? student.name : 'Unknown';
  };

  // Filter sections
  const filteredSections = sections.filter(section => {
    if (filterBlockType !== 'all' && section.blockTypeId !== filterBlockType) return false;
    if (filterDay !== 'all' && !section.daysOfWeek.includes(filterDay)) return false;
    return true;
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sections</h1>
          <p className="text-gray-600 mt-1">
            Manage classes, groups, and activities
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Section
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">What are Sections?</p>
            <p>
              Sections are classes, groups, or activities that students are enrolled in.
              Each section uses a block type (defines check-in behavior) and automatically maps to reporting blocks based on time overlap.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Block Type
          </label>
          <select
            value={filterBlockType}
            onChange={(e) => setFilterBlockType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            {/* TODO: Load actual block types */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Day
          </label>
          <select
            value={filterDay}
            onChange={(e) => setFilterDay(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Days</option>
            {days.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        {filteredSections.map(section => {
          const blockType = getBlockTypeById(section.blockTypeId);
          const reportingBlocks = getReportingBlocksForSection(section);

          return (
            <div
              key={section.id}
              className={`
                bg-white rounded-lg shadow-md border-l-4 p-6
                ${!section.isActive && 'opacity-50'}
              `}
              style={{ borderLeftColor: blockType?.color || '#6B7280' }}
            >
              {/* Section Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{blockType?.icon || '📋'}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {section.name}
                      </h3>
                      {!section.isActive && (
                        <span className="text-xs text-gray-500">(Inactive)</span>
                      )}
                    </div>
                  </div>

                  {section.description && (
                    <p className="text-gray-600 mb-2">{section.description}</p>
                  )}

                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {section.location || 'No location'}
                      {section.isOffsite && <span className="text-amber-600">(Off-site)</span>}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {section.startTime} - {section.endTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {section.daysOfWeek.map(d => d.slice(0, 3)).join(', ')}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      {section.enrolledStudents.length} student{section.enrolledStudents.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Reporting Blocks */}
                  {reportingBlocks.length > 0 && (
                    <div className="mt-3">
                      <span className="text-xs font-semibold text-gray-500">MAPS TO: </span>
                      {reportingBlocks.map(block => (
                        <span
                          key={block.blockNumber}
                          className="inline-block mr-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                        >
                          Block {block.blockNumber}
                          {block.isPartial && ' (partial)'}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(section)}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleActive(section.id)}
                    className={`
                      px-3 py-2 text-sm rounded-lg transition-colors font-medium
                      ${section.isActive 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }
                    `}
                  >
                    {section.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>

              {/* Enrolled Students Preview */}
              {section.enrolledStudents.length > 0 && (
                <div className="border-t pt-3 mt-3">
                  <p className="text-xs font-semibold text-gray-500 mb-2">ENROLLED STUDENTS:</p>
                  <div className="flex flex-wrap gap-2">
                    {section.enrolledStudents.slice(0, 10).map(studentId => (
                      <span
                        key={studentId}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {getStudentName(studentId)}
                      </span>
                    ))}
                    {section.enrolledStudents.length > 10 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded italic">
                        +{section.enrolledStudents.length - 10} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredSections.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sections yet</h3>
          <p className="text-gray-600 mb-4">
            Create your first section to get started
          </p>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Create Section
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
                {editingSection ? 'Edit Section' : 'Create New Section'}
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
              <SectionForm
                initialData={editingSection}
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

export default AdminSections;
