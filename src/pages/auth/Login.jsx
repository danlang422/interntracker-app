import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

function Login() {
  const [selectedRoles, setSelectedRoles] = useState(['student']);
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const toggleRole = (role) => {
    if (selectedRoles.includes(role)) {
      // Don't allow removing the last role
      if (selectedRoles.length === 1) return;
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleLogin = () => {
    if (!name.trim()) {
      alert('Please enter a name');
      return;
    }

    if (selectedRoles.length === 0) {
      alert('Please select at least one role');
      return;
    }

    // Create fake user data
    const email = `${name.toLowerCase().replace(/\s/g, '')}@example.com`;
    const userData = {
      id: email, // Use email as unique ID
      name: name,
      email: email,
      roles: selectedRoles
    };

    login(userData);

    // Navigate based on primary role
    // Priority: student > advisor > mentor
    if (selectedRoles.includes('student')) {
      navigate('/home');
    } else if (selectedRoles.includes('advisor')) {
      navigate('/dashboard');
    } else if (selectedRoles.includes('mentor')) {
      navigate('/mentor');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Dev Login</h2>
        <p className="dev-note">⚠️ Development only - select role(s) to test</p>

        <div className="form-group">
          <label>Your Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Login as (select one or more):</label>
          <div className="role-buttons">
            <button
              className={`role-button ${selectedRoles.includes('student') ? 'active' : ''}`}
              onClick={() => toggleRole('student')}
            >
              👨‍🎓 Student
            </button>
            <button
              className={`role-button ${selectedRoles.includes('advisor') ? 'active' : ''}`}
              onClick={() => toggleRole('advisor')}
            >
              👨‍🏫 Advisor
            </button>
            <button
              className={`role-button ${selectedRoles.includes('mentor') ? 'active' : ''}`}
              onClick={() => toggleRole('mentor')}
            >
              👔 Mentor
            </button>
            <button
              className={`role-button ${selectedRoles.includes('admin') ? 'active' : ''}`}
              onClick={() => toggleRole('admin')}
            >
              ⚙️ Admin
            </button>
          </div>
          <p className="role-hint">
            Selected: {selectedRoles.join(' + ')}
          </p>
        </div>

        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
