import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  CheckCircle,
  FileText,
  User,
  LayoutDashboard,
  Users,
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

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
          { path: '/home', label: 'Home', icon: <Home className="w-6 h-6" /> },
          { path: '/checkin', label: 'Check In', icon: <CheckCircle className="w-6 h-6" /> },
          { path: '/logs', label: 'My Logs', icon: <FileText className="w-6 h-6" /> },
          { path: '/profile', label: 'Profile', icon: <User className="w-6 h-6" /> }
        ];

      case 'advisor':
        const advisorItems = [
          { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-6 h-6" /> },
          { path: '/students', label: 'Students', icon: <Users className="w-6 h-6" /> },
          { path: '/checkins', label: 'Check-ins', icon: <CheckCircle className="w-6 h-6" /> },
          { path: '/advisorlogs', label: 'Logs', icon: <FileText className="w-6 h-6" /> },
        ];

        // Add admin submenu if user has admin role
        if (hasRole('admin')) {
          advisorItems.push({
            type: 'submenu',
            label: 'Admin',
            icon: <Settings className="w-6 h-6" />,
            items: [
              { path: '/admin', label: 'Dashboard' },
              { path: '/admin/students', label: 'Manage Students' },
              { path: '/admin/internships', label: 'Manage Internships' },
            ]
          });
        }

        advisorItems.push({ path: '/profile', label: 'Profile', icon: <User className="w-6 h-6" /> });
        return advisorItems;

      case 'mentor':
        return [
          { path: '/mentor', label: 'Dashboard', icon: <LayoutDashboard className="w-6 h-6" /> },
          { path: '/mentor/students', label: 'My Students', icon: <Users className="w-6 h-6" /> },
          { path: '/profile', label: 'Profile', icon: <User className="w-6 h-6" /> }
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
                  {adminMenuOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
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
