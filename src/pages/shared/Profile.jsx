import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Award, 
  Settings, 
  Bell, 
  Lock, 
  FileText,
  Shield,
  BarChart3,
  ChevronRight
} from 'lucide-react';

function Profile() {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();

  // Mock stats - will be real data later
  const getStats = () => {
    const activeRole = user.activeRole;
    
    if (activeRole === 'student') {
      return [
        { label: 'Hours Logged', value: '47.5', icon: Award },
        { label: 'Check-ins This Week', value: '3', icon: FileText },
        { label: 'Total Reflections', value: '12', icon: FileText }
      ];
    }
    
    if (activeRole === 'advisor' || activeRole === 'mentor') {
      return [
        { label: 'Students', value: '8', icon: User },
        { label: 'Pending Approvals', value: '2', icon: Bell },
        { label: 'Reviews This Week', value: '5', icon: FileText }
      ];
    }
    
    if (activeRole === 'admin') {
      return [
        { label: 'Total Students', value: '52', icon: User },
        { label: 'Active Internships', value: '18', icon: Award },
        { label: 'System Users', value: '73', icon: Shield }
      ];
    }
    
    return [];
  };

  const stats = getStats();

  // Settings/More menu items
  const getMenuItems = () => {
    const items = [
      {
        label: 'Account Settings',
        description: 'Manage your account information',
        icon: User,
        onClick: () => console.log('Navigate to account settings')
      },
      {
        label: 'Notifications',
        description: 'Configure notification preferences',
        icon: Bell,
        onClick: () => console.log('Navigate to notifications settings')
      },
      {
        label: 'Privacy',
        description: 'Control your privacy settings',
        icon: Lock,
        onClick: () => console.log('Navigate to privacy settings')
      },
      {
        label: 'Reports',
        description: 'View and export your data',
        icon: BarChart3,
        onClick: () => console.log('Navigate to reports')
      }
    ];

    // Add admin panel for users with admin role
    if (hasRole('admin')) {
      items.push({
        label: 'Admin Panel',
        description: 'System management and administration',
        icon: Shield,
        onClick: () => navigate('/admin'),
        highlight: true
      });
    }

    return items;
  };

  const menuItems = getMenuItems();

  return (
    <div className="max-w-4xl mx-auto">
      {/* User Info Card */}
      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-6">
        <div className="flex items-start gap-6">
          {/* Profile Picture Placeholder */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{user?.name}</h1>
            <p className="text-gray-600 flex items-center gap-2 mb-4">
              <Mail className="w-4 h-4" />
              {user?.email || 'No email provided'}
            </p>
            
            {/* Role Badges */}
            <div className="flex flex-wrap gap-2">
              {user?.roles?.map(role => (
                <span 
                  key={role}
                  className={`
                    px-3 py-1 rounded-full text-sm font-medium
                    ${role === user.activeRole 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                  {role === user.activeRole && ' (Active)'}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-gray-600 text-sm font-medium">{stat.label}</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* More/Settings Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">More</h2>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.onClick}
                className={`
                  w-full flex items-center gap-4 p-5 text-left
                  transition-colors hover:bg-gray-50
                  ${item.highlight ? 'bg-blue-50 hover:bg-blue-100' : ''}
                `}
              >
                <div className={`
                  p-2 rounded-lg flex-shrink-0
                  ${item.highlight 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700'
                  }
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`
                    font-semibold mb-1
                    ${item.highlight ? 'text-blue-900' : 'text-gray-900'}
                  `}>
                    {item.label}
                  </h3>
                  <p className={`
                    text-sm
                    ${item.highlight ? 'text-blue-700' : 'text-gray-600'}
                  `}>
                    {item.description}
                  </p>
                </div>
                <ChevronRight className={`
                  w-5 h-5 flex-shrink-0
                  ${item.highlight ? 'text-blue-500' : 'text-gray-400'}
                `} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Profile;
