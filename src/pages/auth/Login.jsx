import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

function Login() {
  const [selectedRole, setSelectedRole] = useState('student');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = () => {
    if (!name.trim()) {
      alert('Please enter a name');
      return;
    }

    // Create fake user data
    const userData = {
      name: name,
      email: `${name.toLowerCase().replace(' ', '')}@example.com`,
      role: selectedRole
    };

    login(userData);

    // Navigate based on role
    if (selectedRole === 'student') {
      navigate('/');
    } else if (selectedRole === 'admin') {
      navigate('/admin');
    } else if (selectedRole === 'mentor') {
      navigate('/mentor');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Dev Login</h2>
        <p className="dev-note">⚠️ Development only - pick a role to test</p>

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
          <label>Login as:</label>
          <div className="role-buttons">
            <button
              className={`role-button ${selectedRole === 'student' ? 'active' : ''}`}
              onClick={() => setSelectedRole('student')}
            >
              👨‍🎓 Student
            </button>
            <button
              className={`role-button ${selectedRole === 'mentor' ? 'active' : ''}`}
              onClick={() => setSelectedRole('mentor')}
            >
              👔 Mentor
            </button>
            <button
              className={`role-button ${selectedRole === 'admin' ? 'active' : ''}`}
              onClick={() => setSelectedRole('admin')}
            >
              ⚙️ Admin
            </button>
          </div>
        </div>

        <button className="login-button" onClick={handleLogin}>
          Login as {selectedRole}
        </button>
      </div>
    </div>
  );
}

export default Login;