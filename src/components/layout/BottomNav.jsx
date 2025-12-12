import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  PlusSquare,
  Bell,
  User
} from 'lucide-react';

function BottomNav() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) {
    return null;
  }

  // Define nav items based on role
  const getNavItems = () => {
    const activeRole = user.activeRole;

    // All roles get the same 4-item bottom nav structure
    // The content of "Home" and profile changes based on role
    const items = [
      { 
        path: getHomePath(activeRole), 
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

    return items;
  };

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

  const navItems = getNavItems();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Icon 
                className={`w-6 h-6 ${active ? 'text-black' : ''}`}
                strokeWidth={active ? 2.5 : 2}
              />
              <span className="text-[10px] font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
