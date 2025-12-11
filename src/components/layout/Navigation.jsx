import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Icon components
const HomeIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

const AssignmentIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
  </svg>
);

const PersonIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const DashboardIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
  </svg>
);

const PeopleIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
  </svg>
);

const ExpandMoreIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
  </svg>
);

const ExpandLessIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
  </svg>
);

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
          { path: '/home', label: 'Home', icon: <HomeIcon /> },
          { path: '/checkin', label: 'Check In', icon: <CheckCircleIcon /> },
          { path: '/logs', label: 'My Logs', icon: <AssignmentIcon /> },
          { path: '/profile', label: 'Profile', icon: <PersonIcon /> }
        ];

      case 'advisor':
        const advisorItems = [
          { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
          { path: '/students', label: 'Students', icon: <PeopleIcon /> },
          { path: '/checkins', label: 'Check-ins', icon: <CheckCircleIcon /> },
          { path: '/advisorlogs', label: 'Logs', icon: <AssignmentIcon /> },
        ];

        // Add admin submenu if user has admin role
        if (hasRole('admin')) {
          advisorItems.push({
            type: 'submenu',
            label: 'Admin',
            icon: <SettingsIcon />,
            items: [
              { path: '/admin', label: 'Dashboard' },
              { path: '/admin/students', label: 'Manage Students' },
              { path: '/admin/internships', label: 'Manage Internships' },
            ]
          });
        }

        advisorItems.push({ path: '/profile', label: 'Profile', icon: <PersonIcon /> });
        return advisorItems;

      case 'mentor':
        return [
          { path: '/mentor', label: 'Dashboard', icon: <DashboardIcon /> },
          { path: '/mentor/students', label: 'My Students', icon: <PeopleIcon /> },
          { path: '/profile', label: 'Profile', icon: <PersonIcon /> }
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
    <nav className="flex bg-white border-t border-[#dbdbdb] p-2 gap-2 md:flex-col md:border-t-0 md:border-r md:p-4 md:py-4 md:px-2 md:w-[200px]">
      {navItems.map((item, index) => {
        if (item.type === 'submenu') {
          return (
            <div key={`submenu-${index}`} className="flex-1 md:w-full">
              <button
                className="flex flex-col items-center gap-1 py-3 px-2 bg-transparent border-none cursor-pointer text-[#8e8e8e] transition-colors rounded-lg hover:text-[#262626] hover:bg-[#fafafa] md:flex-row md:justify-start md:py-3 md:px-4 md:gap-4 relative w-full"
                onClick={() => handleNavClick(item)}
              >
                <span className="flex items-center text-2xl md:text-base">{item.icon}</span>
                <span className="text-xs font-medium md:text-base">{item.label}</span>
                <span className="flex items-center ml-auto hidden md:flex">
                  {adminMenuOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </span>
              </button>

              {adminMenuOpen && (
                <div className="flex flex-col gap-1 mt-1 pl-2 md:pl-8">
                  {item.items.map((subItem) => (
                    <button
                      key={subItem.path}
                      className={`flex items-center py-2 px-4 bg-transparent border-none border-l-2 border-transparent cursor-pointer text-[#8e8e8e] transition-all text-xs text-left md:text-sm hover:text-[#262626] hover:bg-[#fafafa] hover:border-l-[#dbdbdb] ${
                        location.pathname === subItem.path
                          ? 'text-[#667eea] border-l-[#667eea] bg-[#f0f3ff]'
                          : ''
                      }`}
                      onClick={() => navigate(subItem.path)}
                    >
                      <span>{subItem.label}</span>
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
            className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 bg-transparent border-none cursor-pointer text-[#8e8e8e] transition-colors rounded-lg hover:text-[#262626] hover:bg-[#fafafa] md:flex-row md:justify-start md:py-3 md:px-4 md:gap-4 ${
              location.pathname === item.path ? 'text-[#667eea]' : ''
            }`}
            onClick={() => handleNavClick(item)}
          >
            <span className="flex items-center text-2xl md:text-base">{item.icon}</span>
            <span className="text-xs font-medium md:text-base">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default Navigation;
