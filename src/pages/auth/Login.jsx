import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="bg-white p-8 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] max-w-[400px] w-full">
        <h2 className="m-0 mb-2 text-center">Dev Login</h2>
        <p className="text-center text-amber-500 text-[0.9rem] mb-6">⚠️ Development only - select role(s) to test</p>

        <div className="mb-6">
          <label className="block font-semibold mb-2 text-[#262626]">Your Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-[#dbdbdb] rounded-lg text-base focus:outline-none focus:border-[#667eea]"
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2 text-[#262626]">Login as (select one or more):</label>
          <div className="flex gap-2 flex-wrap">
            <button
              className={`flex-1 min-w-[calc(50%-0.25rem)] px-2 py-4 border-2 rounded-lg cursor-pointer text-[0.9rem] transition-all ${
                selectedRoles.includes('student')
                  ? 'bg-[#667eea] text-white border-[#667eea]'
                  : 'bg-white border-[#dbdbdb] hover:border-[#667eea]'
              }`}
              onClick={() => toggleRole('student')}
            >
              👨‍🎓 Student
            </button>
            <button
              className={`flex-1 min-w-[calc(50%-0.25rem)] px-2 py-4 border-2 rounded-lg cursor-pointer text-[0.9rem] transition-all ${
                selectedRoles.includes('advisor')
                  ? 'bg-[#667eea] text-white border-[#667eea]'
                  : 'bg-white border-[#dbdbdb] hover:border-[#667eea]'
              }`}
              onClick={() => toggleRole('advisor')}
            >
              👨‍🏫 Advisor
            </button>
            <button
              className={`flex-1 min-w-[calc(50%-0.25rem)] px-2 py-4 border-2 rounded-lg cursor-pointer text-[0.9rem] transition-all ${
                selectedRoles.includes('mentor')
                  ? 'bg-[#667eea] text-white border-[#667eea]'
                  : 'bg-white border-[#dbdbdb] hover:border-[#667eea]'
              }`}
              onClick={() => toggleRole('mentor')}
            >
              👔 Mentor
            </button>
            <button
              className={`flex-1 min-w-[calc(50%-0.25rem)] px-2 py-4 border-2 rounded-lg cursor-pointer text-[0.9rem] transition-all ${
                selectedRoles.includes('admin')
                  ? 'bg-[#667eea] text-white border-[#667eea]'
                  : 'bg-white border-[#dbdbdb] hover:border-[#667eea]'
              }`}
              onClick={() => toggleRole('admin')}
            >
              ⚙️ Admin
            </button>
          </div>
          <p className="mt-2 text-[0.85rem] text-[#667eea] text-center font-medium">
            Selected: {selectedRoles.join(' + ')}
          </p>
        </div>

        <button className="w-full p-4 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-transform hover:-translate-y-0.5" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
