import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight } from 'lucide-react';

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
      className="flex items-center gap-2 py-2 px-4 bg-[rgba(103,126,234,0.15)] border border-[rgba(103,126,234,0.3)] rounded text-[#667eea] text-[0.875rem] font-medium cursor-pointer transition-all ease-in-out duration-200 hover:bg-[rgba(103,126,234,0.25)] hover:border-[rgba(103,126,234,0.5)] active:scale-[0.98]"
      onClick={handleSwitchRole}
      title={`Switch to ${otherRole} view`}
    >
      <ArrowLeftRight size={18} />
      <span>Switch to {otherRole}</span>
    </button>
  );
}

export default RoleSwitcher;
