import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  Bell,
  PlusSquare,
  User
} from 'lucide-react';

function Sidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) {
    return null;
  }

  // Helper to determine home path based on role
  const getHomePath = (role) => {
    switch(role) {
      case 'student':
        return '/home';
      case 'advisor':
        return '/dashboard';
      case 'mentor':
        return '/mentor';
      case 'admin':
        return '/admin';
      default:
        return '/home';
    }
  };

  // All roles get the same 4-item navigation structure
  const navItems = [
    { 
      path: getHomePath(user.activeRole), 
      label: 'Home', 
      icon: Home 
    },
    { 
      path: '/create', 
      label: 'Create', 
      icon: PlusSquare 
    },
    { 
      path: '/notifications', 
      label: 'Notifications', 
      icon: Bell 
    },
    { 
      path: '/profile', 
      label: 'Profile', 
      icon: User 
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 border-r border-gray-200 bg-white h-screen sticky top-0">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold">InternTracker</h1>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                w-full flex items-center gap-4 px-3 py-3 rounded-lg
                transition-all duration-200
                ${active 
                  ? 'bg-gray-100 text-black font-semibold' 
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <Icon 
                className="w-6 h-6"
                strokeWidth={active ? 2.5 : 2}
              />
              <span className="text-base">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
