import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navigation from './Navigation';
import './MainLayout.css';

function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="main-layout">
      <header className="app-header">
        <h1>InternTracker</h1>
        
        {user && (
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-role">({user.role})</span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </header>
      
      <div className="main-content-wrapper">
        <Navigation />
        
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;