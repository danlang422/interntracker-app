import React, { useState } from 'react';
import CheckInModal from './CheckInModal';

/**
 * CheckInButton
 * 
 * Smart button that adapts based on block type settings.
 * Handles both "tap" (instant) and "modal" (form) check-ins.
 * Shows "Check In" for regular blocks, "Clock In/Out" for internships.
 * 
 * Props:
 * - blockType: Block type object with settings
 * - segment: Schedule segment data
 * - mode: "preview" | "live"
 * - onCheckIn: Function to call when check-in completes (live mode)
 * - checkInStatus: Current check-in status (live mode)
 */
const CheckInButton = ({ 
  blockType, 
  segment,
  mode = "live",
  onCheckIn = () => {},
  checkInStatus = null
}) => {
  const [showModal, setShowModal] = useState(false);

  // Determine if this is a check-out button
  const isCheckedIn = checkInStatus?.checkedIn || false;
  const requiresCheckOut = blockType?.requiresCheckOut || false;
  const needsCheckOut = requiresCheckOut && isCheckedIn && !checkInStatus?.checkedOut;

  // Button text logic
  const getButtonText = () => {
    if (requiresCheckOut) {
      if (!isCheckedIn) return "Clock In";
      if (needsCheckOut) return "Clock Out";
      return "Clocked Out";
    }
    return isCheckedIn ? "Checked In" : "Check In";
  };

  // Button color logic
  const getButtonStyle = () => {
    if (isCheckedIn && !needsCheckOut) {
      // Already checked in/clocked out - success state
      return "bg-green-600 hover:bg-green-700 cursor-default";
    }
    if (needsCheckOut) {
      // Needs to clock out - warning state
      return "bg-amber-600 hover:bg-amber-700";
    }
    // Normal check-in state
    return "bg-blue-600 hover:bg-blue-700";
  };

  // Handle button click
  const handleClick = () => {
    // In preview mode, always show modal if it's a modal interface
    if (mode === "preview") {
      if (blockType?.checkInInterface === "modal") {
        setShowModal(true);
      } else {
        // For tap interface in preview, do nothing (it's just a preview)
        alert("In live mode, this would instantly check the student in!");
      }
      return;
    }

    // Live mode logic
    if (isCheckedIn && !needsCheckOut) {
      // Already completed - do nothing
      return;
    }

    if (blockType?.checkInInterface === "tap") {
      // Instant check-in
      onCheckIn({
        type: needsCheckOut ? 'checkOut' : 'checkIn',
        timestamp: new Date().toISOString()
      });
    } else {
      // Show modal for questions
      setShowModal(true);
    }
  };

  const handleModalSubmit = (formData) => {
    onCheckIn({
      type: needsCheckOut ? 'checkOut' : 'checkIn',
      timestamp: new Date().toISOString(),
      ...formData
    });
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isCheckedIn && !needsCheckOut && mode === "live"}
        className={`
          w-full py-3 px-4 rounded-lg font-semibold text-white
          transition-colors duration-200
          ${getButtonStyle()}
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2
        `}
      >
        {/* Icon based on state */}
        {isCheckedIn && !needsCheckOut ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        ) : needsCheckOut ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        )}
        
        <span>{getButtonText()}</span>
      </button>

      {/* Check-In Modal */}
      {showModal && (
        <CheckInModal
          blockType={blockType}
          segment={segment}
          mode={mode}
          isCheckOut={needsCheckOut}
          onSubmit={handleModalSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default CheckInButton;
