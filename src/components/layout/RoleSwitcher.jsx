import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SwapHoriz } from '@mui/icons-material';
import './RoleSwitcher.css';

function RoleSwitcher() {
  const { user, switchRole, needsRoleSwitcher } = useAuth();
  const navigate = useNavigate();

  // Only show if user has both advisor and mentor roles
  if (!needsRoleSwitcher()) {
    return null;
  }

  const handleSwitchRole = () => {
    // Toggle between advisor and mentor
    const newRole = user.activeRole === 'advisor' ? 'mentor' : 'advisor';
    switchRole(newRole);

    // Navigate to appropriate landing page for the new role
    if (newRole === 'advisor') {
      navigate('/dashboard');
    } else if (newRole === 'mentor') {
      navigate('/mentor');
    }
  };

  const otherRole = user.activeRole === 'advisor' ? 'mentor' : 'advisor';

  return (
    <button 
      className="role-switcher" 
      onClick={handleSwitchRole}
      title={`Switch to ${otherRole} view`}
    >
      <SwapHoriz fontSize="small" />
      <span>Switch to {otherRole}</span>
    </button>
  );
}

export default RoleSwitcher;
