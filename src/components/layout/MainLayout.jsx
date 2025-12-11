import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import Navigation from './Navigation';
import RoleSwitcher from './RoleSwitcher';

function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [user, navigate, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col max-w-[1200px] mx-auto md:shadow-[0_0_20px_rgba(0,0,0,0.1)]">
      <header className="p-4 bg-white border-b border-[#dbdbdb] flex justify-between items-center">
        <h1 className="text-2xl md:text-xl font-semibold">InternTracker</h1>

        {user && (
          <div className="flex items-center gap-3 md:gap-2">
            <span className="font-semibold text-[#262626] text-sm md:text-base">{user.name}</span>
            <span className="text-[#8e8e8e] text-[0.9rem] hidden md:inline">({user.activeRole})</span>
            <RoleSwitcher />
            <button
              className="px-4 py-2 bg-[#f0f0f0] rounded-md cursor-pointer text-[0.9rem] font-medium transition-colors hover:bg-[#e0e0e0]"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        <Navigation />

        <main className="flex-1 p-4 bg-[#fafafa] overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
