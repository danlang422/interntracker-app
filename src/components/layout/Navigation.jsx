import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  CheckCircle, 
  Assignment, 
  Person, 
  Dashboard, 
  People,
  Settings,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import './Navigation.css';

function Navigation() {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  if (!user) {
    return null; // Don't show nav if not logged in
  }

  // Get navigation items based on active role
  const getNavItems = () => {
    const activeRole = user.activeRole;

    switch(activeRole) {
      case 'student':
        return [
          { path: '/home', label: 'Home', icon: <Home /> },
          { path: '/checkin', label: 'Check In', icon: <CheckCircle /> },
          { path: '/logs', label: 'My Logs', icon: <Assignment /> },
          { path: '/profile', label: 'Profile', icon: <Person /> }
        ];
      
      case 'advisor':
        const advisorItems = [
          { path: '/dashboard', label: 'Dashboard', icon: <Dashboard /> },
          { path: '/students', label: 'Students', icon: <People /> },
          { path: '/checkins', label: 'Check-ins', icon: <CheckCircle /> },
          { path: '/advisorlogs', label: 'Logs', icon: <Assignment /> },
        ];

        // Add admin submenu if user has admin role
        if (hasRole('admin')) {
          advisorItems.push({
            type: 'submenu',
            label: 'Admin',
            icon: <Settings />,
            items: [
              { path: '/admin', label: 'Dashboard' },
              { path: '/admin/students', label: 'Manage Students' },
              { path: '/admin/internships', label: 'Manage Internships' },
            ]
          });
        }

        advisorItems.push({ path: '/profile', label: 'Profile', icon: <Person /> });
        return advisorItems;
      
      case 'mentor':
        return [
          { path: '/mentor', label: 'Dashboard', icon: <Dashboard /> },
          { path: '/mentor/students', label: 'My Students', icon: <People /> },
          { path: '/profile', label: 'Profile', icon: <Person /> }
        ];
      
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const handleNavClick = (item) => {
    if (item.type === 'submenu') {
      setAdminMenuOpen(!adminMenuOpen);
    } else {
      navigate(item.path);
    }
  };

  return (
    <nav className="main-nav">
      {navItems.map((item, index) => {
        if (item.type === 'submenu') {
          return (
            <div key={`submenu-${index}`} className="nav-submenu">
              <button
                className="nav-item nav-submenu-trigger"
                onClick={() => handleNavClick(item)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                <span className="nav-expand-icon">
                  {adminMenuOpen ? <ExpandLess /> : <ExpandMore />}
                </span>
              </button>
              
              {adminMenuOpen && (
                <div className="nav-submenu-items">
                  {item.items.map((subItem) => (
                    <button
                      key={subItem.path}
                      className={`nav-subitem ${location.pathname === subItem.path ? 'active' : ''}`}
                      onClick={() => navigate(subItem.path)}
                    >
                      <span className="nav-label">{subItem.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        }

        return (
          <button
            key={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => handleNavClick(item)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default Navigation;
