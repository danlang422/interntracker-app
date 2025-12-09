import { useAuth } from '../../context/AuthContext';

function Profile() {
  const { user } = useAuth();

  return (
    <div>
      <h2>Profile</h2>
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
      <p>Logged in as: {user?.name} ({user?.role})</p>
      <p>Profile editing will go here</p>
    </div>
  );
}

export default Profile;