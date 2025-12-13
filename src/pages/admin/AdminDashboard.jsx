import { useStudents } from '../../context/StudentsContext';
import { useInternships } from '../../context/InternshipsContext';
import { useAssignments } from '../../context/AssignmentsContext';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const { getAllStudents, getActiveStudents } = useStudents();
  const { getAllInternships, getActiveInternships } = useInternships();
  const { getActiveAssignments, getAllAssignments } = useAssignments();

  const allStudents = getAllStudents();
  const activeStudents = getActiveStudents();
  const allInternships = getAllInternships();
  const activeInternships = getActiveInternships();
  const activeAssignments = getActiveAssignments();
  const allAssignments = getAllAssignments();

  // Calculate stats
  const unassignedStudents = activeStudents.filter(student => {
    return !activeAssignments.some(assignment => assignment.studentId === student.id);
  });

  const internshipsWithNoStudents = activeInternships.filter(internship => {
    return !activeAssignments.some(assignment => assignment.internshipId === internship.id);
  });

  // Get recent activity (last 5 assignments)
  const recentAssignments = [...allAssignments]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const getStudentName = (studentId) => {
    const student = allStudents.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  const getInternshipName = (internshipId) => {
    const internship = allInternships.find(i => i.id === internshipId);
    return internship ? internship.organizationName : 'Unknown Internship';
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto md:p-4">
      {/* Header */}
      <div className="mb-8">
        <div>
          <h2 className="my-0 mb-1 text-[1.75rem] text-[#1a1a1a]">Admin Dashboard</h2>
          <p className="m-0 text-[#6b7280] text-[0.95rem]">Overview of InternTracker system</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5 mb-8 md:grid-cols-1">
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 flex items-center gap-5 transition-all hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] md:p-5">
          <div className="text-[2.5rem] leading-none">👥</div>
          <div className="flex-1">
            <div className="text-[2rem] font-bold text-[#1a1a1a] leading-none mb-1">{activeStudents.length}</div>
            <div className="text-[0.9rem] text-[#6b7280] font-medium">Active Students</div>
            {allStudents.length > activeStudents.length && (
              <div className="text-[0.85rem] text-[#9ca3af] mt-1">
                {allStudents.length - activeStudents.length} inactive
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 flex items-center gap-5 transition-all hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] md:p-5">
          <div className="text-[2.5rem] leading-none">🏢</div>
          <div className="flex-1">
            <div className="text-[2rem] font-bold text-[#1a1a1a] leading-none mb-1">{activeInternships.length}</div>
            <div className="text-[0.9rem] text-[#6b7280] font-medium">Active Internships</div>
            {allInternships.length > activeInternships.length && (
              <div className="text-[0.85rem] text-[#9ca3af] mt-1">
                {allInternships.length - activeInternships.length} inactive
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 flex items-center gap-5 transition-all hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] md:p-5">
          <div className="text-[2.5rem] leading-none">🔗</div>
          <div className="flex-1">
            <div className="text-[2rem] font-bold text-[#1a1a1a] leading-none mb-1">{activeAssignments.length}</div>
            <div className="text-[0.9rem] text-[#6b7280] font-medium">Active Assignments</div>
            {allAssignments.length > activeAssignments.length && (
              <div className="text-[0.85rem] text-[#9ca3af] mt-1">
                {allAssignments.length - activeAssignments.length} completed
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#fffbeb] border border-[#fbbf24] rounded-xl p-6 flex items-center gap-5 transition-all hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] md:p-5">
          <div className="text-[2.5rem] leading-none">⚠️</div>
          <div className="flex-1">
            <div className="text-[2rem] font-bold text-[#1a1a1a] leading-none mb-1">{unassignedStudents.length}</div>
            <div className="text-[0.9rem] text-[#6b7280] font-medium">Unassigned Students</div>
            {unassignedStudents.length > 0 && (
              <button
                className="mt-3 py-[0.4rem] px-[0.8rem] bg-[#2563eb] text-white border-none rounded-md text-[0.85rem] font-medium cursor-pointer transition-colors hover:bg-[#1d4ed8]"
                onClick={() => navigate('/admin/students')}
              >
                View Students
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Attention Needed Section */}
      {(unassignedStudents.length > 0 || internshipsWithNoStudents.length > 0) && (
        <div className="mb-8">
          <h3 className="my-0 mb-4 text-[1.25rem] text-[#1a1a1a]">⚠️ Needs Attention</h3>

          {unassignedStudents.length > 0 && (
            <div className="bg-white border border-[#fbbf24] border-l-4 rounded-lg p-6 mb-4">
              <div className="flex justify-between items-center mb-4 md:flex-col md:items-start md:gap-3">
                <h4 className="m-0 text-[1.05rem] text-[#1a1a1a]">Unassigned Students ({unassignedStudents.length})</h4>
                <button
                  className="py-[0.4rem] px-[0.8rem] border-none rounded-md text-[0.85rem] font-medium cursor-pointer transition-all bg-[#f3f4f6] text-[#374151] hover:bg-[#e5e7eb]"
                  onClick={() => navigate('/admin/students')}
                >
                  Manage Students
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {unassignedStudents.slice(0, 5).map(student => (
                  <div key={student.id} className="flex justify-between items-center p-3 bg-[#f9fafb] rounded-md text-[0.9rem]">
                    <span className="font-medium text-[#374151]">{student.name}</span>
                    <span className="text-[#6b7280] text-[0.85rem]">Grade {student.gradeLevel}</span>
                  </div>
                ))}
                {unassignedStudents.length > 5 && (
                  <div className="flex justify-center items-center p-3 bg-[#f9fafb] rounded-md text-[0.9rem] text-[#6b7280] italic">
                    +{unassignedStudents.length - 5} more
                  </div>
                )}
              </div>
            </div>
          )}

          {internshipsWithNoStudents.length > 0 && (
            <div className="bg-white border border-[#fbbf24] border-l-4 rounded-lg p-6 mb-4">
              <div className="flex justify-between items-center mb-4 md:flex-col md:items-start md:gap-3">
                <h4 className="m-0 text-[1.05rem] text-[#1a1a1a]">Internships Without Students ({internshipsWithNoStudents.length})</h4>
                <button
                  className="py-[0.4rem] px-[0.8rem] border-none rounded-md text-[0.85rem] font-medium cursor-pointer transition-all bg-[#f3f4f6] text-[#374151] hover:bg-[#e5e7eb]"
                  onClick={() => navigate('/admin/internships')}
                >
                  Manage Internships
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {internshipsWithNoStudents.slice(0, 5).map(internship => (
                  <div key={internship.id} className="flex justify-between items-center p-3 bg-[#f9fafb] rounded-md text-[0.9rem]">
                    <span className="font-medium text-[#374151]">{internship.organizationName}</span>
                  </div>
                ))}
                {internshipsWithNoStudents.length > 5 && (
                  <div className="flex justify-center items-center p-3 bg-[#f9fafb] rounded-md text-[0.9rem] text-[#6b7280] italic">
                    +{internshipsWithNoStudents.length - 5} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Activity */}
      <div className="mb-8">
        <h3 className="my-0 mb-4 text-[1.25rem] text-[#1a1a1a]">📋 Recent Activity</h3>

        {recentAssignments.length === 0 ? (
          <div className="bg-white border border-[#e5e7eb] rounded-lg p-12 py-12 px-8 text-center text-[#6b7280]">
            <p className="my-2">No recent activity yet.</p>
            <p className="my-2">Start by creating students and internships, then assign them together.</p>
          </div>
        ) : (
          <div className="bg-white border border-[#e5e7eb] rounded-lg overflow-hidden">
            {recentAssignments.map(assignment => (
              <div key={assignment.id} className="flex gap-4 p-5 border-b border-[#e5e7eb] transition-colors hover:bg-[#f9fafb] last:border-b-0 md:flex-col md:items-start md:gap-3">
                <div className="text-[1.5rem] leading-none">
                  {assignment.isActive ? '✅' : '🔴'}
                </div>
                <div className="flex-1">
                  <div className="text-[#374151] text-[0.95rem] leading-relaxed">
                    <strong className="text-[#1a1a1a] font-semibold">{getStudentName(assignment.studentId)}</strong>
                    {assignment.isActive ? ' assigned to ' : ' removed from '}
                    <strong className="text-[#1a1a1a] font-semibold">{getInternshipName(assignment.internshipId)}</strong>
                  </div>
                  <div className="mt-1 text-[0.85rem] text-[#9ca3af]">
                    {new Date(assignment.createdAt).toLocaleDateString()} at{' '}
                    {new Date(assignment.createdAt).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                    {assignment.schedule && assignment.schedule.length > 0 && (
                      <span className="text-[#6b7280]">
                        {' '}• Schedule: {assignment.schedule.map(s => s.day.slice(0, 3)).join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="my-0 mb-4 text-[1.25rem] text-[#1a1a1a]">⚡ Quick Actions</h3>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 md:grid-cols-1">
          <button
            className="bg-white border border-[#e5e7eb] rounded-lg p-6 text-center cursor-pointer transition-all flex flex-col items-center gap-2 hover:border-[#2563eb] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] hover:-translate-y-0.5"
            onClick={() => navigate('/admin/students')}
          >
            <div className="text-[2.5rem] leading-none">👥</div>
            <div className="text-base font-semibold text-[#1a1a1a] mt-1">Manage Students</div>
            <div className="text-[0.85rem] text-[#6b7280]">Add, edit, or assign students</div>
          </button>

          <button
            className="bg-white border border-[#e5e7eb] rounded-lg p-6 text-center cursor-pointer transition-all flex flex-col items-center gap-2 hover:border-[#2563eb] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] hover:-translate-y-0.5"
            onClick={() => navigate('/admin/internships')}
          >
            <div className="text-[2.5rem] leading-none">🏢</div>
            <div className="text-base font-semibold text-[#1a1a1a] mt-1">Manage Internships</div>
            <div className="text-[0.85rem] text-[#6b7280]">Add sites and assign students</div>
          </button>

          <button
            className="bg-white border border-[#e5e7eb] rounded-lg p-6 text-center cursor-pointer transition-all flex flex-col items-center gap-2 hover:border-[#2563eb] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] hover:-translate-y-0.5"
            onClick={() => navigate('/admin/block-types')}
          >
            <div className="text-[2.5rem] leading-none">📋</div>
            <div className="text-base font-semibold text-[#1a1a1a] mt-1">Block Types</div>
            <div className="text-[0.85rem] text-[#6b7280]">Define schedule blocks</div>
          </button>

          <button
            className="bg-white border border-[#e5e7eb] rounded-lg p-6 text-center cursor-pointer transition-all flex flex-col items-center gap-2 hover:border-[#2563eb] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] hover:-translate-y-0.5"
            onClick={() => navigate('/admin/schedule-templates')}
          >
            <div className="text-[2.5rem] leading-none">📅</div>
            <div className="text-base font-semibold text-[#1a1a1a] mt-1">Schedule Templates</div>
            <div className="text-[0.85rem] text-[#6b7280]">SIS reporting blocks</div>
          </button>

          <button
            className="bg-white border border-[#e5e7eb] rounded-lg p-6 text-center cursor-pointer transition-all flex flex-col items-center gap-2 hover:border-[#2563eb] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] hover:-translate-y-0.5"
            onClick={() => navigate('/admin/sections')}
          >
            <div className="text-[2.5rem] leading-none">📚</div>
            <div className="text-base font-semibold text-[#1a1a1a] mt-1">Sections</div>
            <div className="text-[0.85rem] text-[#6b7280]">Define Schedule Sections</div>
          </button>

          <button
            className="bg-white border border-[#e5e7eb] rounded-lg p-6 text-center cursor-pointer transition-all flex flex-col items-center gap-2 hover:border-[#2563eb] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] hover:-translate-y-0.5"
            onClick={() => navigate('/admin/competencies')}
          >
            <div className="text-[2.5rem] leading-none">🎓</div>
            <div className="text-base font-semibold text-[#1a1a1a] mt-1">XQ Competencies</div>
            <div className="text-[0.85rem] text-[#6b7280]">View learning outcomes</div>
          </button>

          <button
            className="bg-white border border-[#e5e7eb] rounded-lg p-6 text-center cursor-pointer transition-all flex flex-col items-center gap-2 hover:border-[#2563eb] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] hover:-translate-y-0.5"
            onClick={() => navigate('/profile')}
          >
            <div className="text-[2.5rem] leading-none">⚙️</div>
            <div className="text-base font-semibold text-[#1a1a1a] mt-1">Settings</div>
            <div className="text-[0.85rem] text-[#6b7280]">Update your profile</div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;