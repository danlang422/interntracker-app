import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, CheckCircle, Assignment, Person, Dashboard, People } from '@mui/icons-material';
import './Navigation.css';

function Navigation() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  console.log('Navigation - user: ', user);

  if (!user) {
    console.log('Navigation - no user, returning null');
    return null; // Don't show nav if not logged in
  }

  // Define navigation items based on role
  const getNavItems = () => {
    switch(user.role) {
      case 'student':
        return [
          { path: '/', label: 'Home', icon: <Home /> },
          { path: '/checkin', label: 'Check In', icon: <CheckCircle /> },
          { path: '/logs', label: 'My Logs', icon: <Assignment /> },
          { path: '/profile', label: 'Profile', icon: <Person /> }
        ];
      
      case 'mentor':
        return [
          { path: '/mentor', label: 'Dashboard', icon: <Dashboard /> },
          { path: '/mentor/students', label: 'My Students', icon: <People /> },
          { path: '/profile', label: 'Profile', icon: <Person /> }
        ];
      
      case 'admin':
        return [
          { path: '/admin', label: 'Dashboard', icon: <Dashboard /> },
          { path: '/admin/students', label: 'Students', icon: <People /> },
          { path: '/admin/internships', label: 'Internships', icon: <Assignment /> },
          { path: '/profile', label: 'Profile', icon: <Person /> }
        ];
      
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="main-nav">
      {navItems.map((item) => (
        <button
          key={item.path}
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default Navigation;