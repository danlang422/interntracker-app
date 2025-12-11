import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    // userData will have: { name, email, roles: [] }
    // roles is an array like ['advisor', 'admin'] or ['mentor'] or ['student']
    
    // Determine initial active role based on priority
    // Priority: student > advisor > mentor (mentor needs explicit switch)
    let initialActiveRole;
    if (userData.roles.includes('student')) {
      initialActiveRole = 'student';
    } else if (userData.roles.includes('advisor')) {
      initialActiveRole = 'advisor';
    } else if (userData.roles.includes('mentor')) {
      initialActiveRole = 'mentor';
    } else {
      initialActiveRole = userData.roles[0]; // Fallback to first role
    }

    setUser({
      ...userData,
      activeRole: initialActiveRole
    });
  };

  const logout = () => {
    setUser(null);
  };

  // Function to switch between roles (for advisor+mentor users)
  const switchRole = (newRole) => {
    if (!user || !user.roles.includes(newRole)) {
      console.error('Cannot switch to role:', newRole);
      return;
    }
    setUser({
      ...user,
      activeRole: newRole
    });
  };

  // Helper: Check if user has a specific role
  const hasRole = (role) => {
    return user?.roles?.includes(role) || false;
  };

  // Helper: Check if user needs role switcher (has both advisor and mentor)
  const needsRoleSwitcher = () => {
    if (!user) return false;
    return user.roles.includes('advisor') && user.roles.includes('mentor');
  };

  // Helper: Get available roles for switching (for users with multiple non-student roles)
  const getAvailableRoles = () => {
    if (!user) return [];
    // Return roles that can be switched to (exclude student, as student is always primary)
    return user.roles.filter(role => role !== 'student');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      switchRole,
      hasRole,
      needsRoleSwitcher,
      getAvailableRoles
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
