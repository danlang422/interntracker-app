function AdvisorDashboard() {
  return (
    <div className="max-w-[1000px] mx-auto p-5">
      <h2 className="mb-6">Advisor Dashboard</h2>
      {/*
        MVP FEATURES:
        - All students or assigned advisees feed of logs and check in/outs (filterable)
        - "Nudge" feature on incomplete check-ins (no check-out) to send reminder (maybe on checkins page instead? both?)

        FUTURE FEATURES:
        - Media in feed as well, also filterable
      */}
      <div className="bg-white rounded-lg p-6 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
        <p className="text-[#666] text-center py-10">Advisor overview will go here</p>
      </div>
    </div>
  );
}

export default AdvisorDashboard;