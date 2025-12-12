function MentorDashboard() {
  return (
    <div className="max-w-[1000px] mx-auto p-5">
      <h2 className="mb-6">Mentor Dashboard</h2>
      <div className="bg-white rounded-lg p-6 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
        <p className="text-[#666] text-center py-10">Mentor dashboard content goes here</p>
        {/*
          MVP FEATURES:
          - List of assigned mentees with profile pictures
          - Number of pending check-ins to approve (badge/counter)
          - Recent activity feed (mentees' check-ins and logs)
          - Quick approve/flag buttons on pending items

          FUTURE FEATURES:
          - Analytics: hours completed, competencies demonstrated
          - Scheduled shifts for each mentee this week
          - Message/communication tools
          - Mentor notes/observations about students
          - Progress tracking over time
        */}
      </div>
    </div>
  );
}

export default MentorDashboard;