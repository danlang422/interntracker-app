import React from 'react';
import CheckInButton from './CheckInButton';

/**
 * ScheduleSegmentCard
 * 
 * Displays a schedule segment in the student's agenda.
 * Also used in the Block Type Builder preview to show admins what students will see.
 * 
 * Props:
 * - segment: Object with schedule segment data
 * - mode: "preview" | "live" (default: "live")
 * - onCheckIn: Function called when check-in happens (live mode only)
 * - checkInStatus: Object with check-in state (live mode only)
 */
const ScheduleSegmentCard = ({ 
  segment, 
  mode = "live",
  onCheckIn = () => {},
  checkInStatus = null
}) => {
  const { 
    name, 
    startTime, 
    endTime, 
    location, 
    blockType 
  } = segment;

  // In preview mode, use example data if not provided
  const displayName = name || "Example Activity";
  const displayLocation = location || "Location TBD";
  const displayStartTime = startTime || "08:00";
  const displayEndTime = endTime || "09:30";

  // Get styling from block type
  const iconDisplay = blockType?.icon || "📋";
  const colorStyle = blockType?.color || "#6B7280";

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 mb-4 border-l-4"
      style={{ borderLeftColor: colorStyle }}
    >
      {/* Header: Time */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">
          {displayStartTime} - {displayEndTime}
        </span>
        {mode === "preview" && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            Preview
          </span>
        )}
      </div>

      {/* Title with Icon */}
      <div className="flex items-start gap-3 mb-2">
        <span className="text-3xl" aria-label="Activity icon">
          {iconDisplay}
        </span>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {displayName}
          </h3>
          {displayLocation && (
            <p className="text-sm text-gray-600">
              {displayLocation}
            </p>
          )}
        </div>
      </div>

      {/* Block Type Badge */}
      {blockType && (
        <div className="mb-3">
          <span 
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{ 
              backgroundColor: `${colorStyle}20`,
              color: colorStyle 
            }}
          >
            {blockType.name}
          </span>
        </div>
      )}

      {/* Check-In Status (Live Mode) */}
      {mode === "live" && checkInStatus && (
        <div className="mb-3">
          {checkInStatus.checkedIn ? (
            <div className="flex items-center gap-2 text-green-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">
                Checked in at {checkInStatus.checkInTime}
              </span>
            </div>
          ) : checkInStatus.isLate ? (
            <div className="flex items-center gap-2 text-amber-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">
                Check-in window closing soon
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">
                Not checked in
              </span>
            </div>
          )}
        </div>
      )}

      {/* Check-In Button */}
      <CheckInButton
        blockType={blockType}
        segment={segment}
        mode={mode}
        onCheckIn={onCheckIn}
        checkInStatus={checkInStatus}
      />

      {/* Preview Mode Help Text */}
      {mode === "preview" && (
        <p className="text-xs text-gray-500 mt-3 italic">
          This is what students will see in their agenda. 
          {blockType?.checkInInterface === 'modal' && ' Click the button to see the check-in form.'}
        </p>
      )}
    </div>
  );
};

export default ScheduleSegmentCard;
