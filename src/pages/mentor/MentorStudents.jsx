function MentorStudents() {
  return (
    <div className="max-w-[1000px] mx-auto p-5">
      <h2 className="mb-6">My Students</h2>
      <div className="bg-white rounded-lg p-6 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
        <p className="text-[#666] text-center py-10">Student list and details will go here</p>
        {/*
          MVP FEATURES:
          - List/grid of all assigned mentees
          - Click to view detailed student profile
          - Student detail view includes:
            * Check-in history with approve/flag actions
            * All logs and reflections
            * Comment on logs
            * Contact information

          FUTURE FEATURES:
          - Add observations/notes about student performance
          - Track competencies student is demonstrating
          - Message students directly
          - View student's schedule
          - Export student reports
          - Set goals/objectives for student
        */}
      </div>
    </div>
  );
}

export default MentorStudents;