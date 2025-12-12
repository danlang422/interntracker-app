import { useAuth } from '../../context/AuthContext';

function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-[1000px] mx-auto p-5">
      <h2 className="mb-6">Profile</h2>
      <div className="bg-white rounded-lg p-6 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
        <p className="text-[#666] mb-4">Logged in as: <strong>{user?.name}</strong> ({user?.role})</p>
        <p className="text-[#666] text-center py-10">Profile editing will go here</p>
        {/*
          MVP FEATURES (All roles):
          - Display user information (name, email, role)
          - Edit profile fields (name, contact info)
          - Change password (for mentor accounts only)
          - Basic app preferences

          STUDENT-SPECIFIC FUTURE FEATURES:
          - Profile picture upload
          - Portfolio view showing all earned competency badges
          - Export portfolio as PDF
          - Link to external portfolio/LinkedIn

          MENTOR-SPECIFIC FUTURE FEATURES:
          - Professional information
          - Areas of expertise tags
          - Availability calendar

          ADMIN-SPECIFIC FUTURE FEATURES:
          - System notification preferences
          - Delegate admin permissions to other users
        */}
      </div>
    </div>
  );
}

export default Profile;