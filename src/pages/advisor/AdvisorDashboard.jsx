import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  CheckCircle, 
  FileText, 
  Clock,
  AlertCircle,
  TrendingUp,
  ChevronRight
} from 'lucide-react';

function AdvisorDashboard() {
  const [view, setView] = useState('feed'); // 'feed' or 'dashboard'
  const navigate = useNavigate();

  // Mock data - will be real data later
  const mockStats = {
    totalStudents: 8,
    pendingApprovals: 2,
    logsThisWeek: 15,
    checkInsToday: 5
  };

  const mockFeedItems = [
    {
      id: 1,
      type: 'checkin',
      studentName: 'Sarah Martinez',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      location: 'Cedar Rapids Library',
      duration: '3h 15m',
      status: 'completed'
    },
    {
      id: 2,
      type: 'log',
      studentName: 'Alex Johnson',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      content: 'Today I helped catalog new books in the children\'s section. It was interesting to see how the library organizes materials by reading level and theme.',
      likes: 3
    },
    {
      id: 3,
      type: 'checkin',
      studentName: 'Marcus Brown',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      location: 'Community Health Clinic',
      status: 'active'
    },
    {
      id: 4,
      type: 'log',
      studentName: 'Emily Chen',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      content: 'Shadowed a nurse during patient check-ins. Learned about taking vitals and the importance of patient communication.',
      likes: 5
    }
  ];

  const mockPendingItems = [
    {
      id: 1,
      studentName: 'Jordan Smith',
      type: 'checkin',
      location: 'Animal Shelter',
      time: '30 minutes ago',
      needsApproval: true
    },
    {
      id: 2,
      studentName: 'Taylor Davis',
      type: 'log',
      preview: 'Today I learned about social media marketing strategies...',
      time: '1 hour ago',
      needsReview: true
    }
  ];

  const mockRecentActivity = [
    {
      student: 'Sarah Martinez',
      action: 'Completed 3.2 hours at Cedar Rapids Library',
      time: '2 hours ago'
    },
    {
      student: 'Alex Johnson',
      action: 'Submitted reflection log',
      time: '4 hours ago'
    },
    {
      student: 'Emily Chen',
      action: 'Checked out from Community Health Clinic',
      time: '5 hours ago'
    }
  ];

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 1) return `${Math.floor(diffMs / 60000)}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Toggle between Feed and Dashboard */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Home</h1>
        
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setView('feed')}
            className={`
              px-4 py-2 rounded-md font-medium transition-all text-sm
              ${view === 'feed' 
                ? 'bg-white shadow-sm text-gray-900' 
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            Feed
          </button>
          <button
            onClick={() => setView('dashboard')}
            className={`
              px-4 py-2 rounded-md font-medium transition-all text-sm
              ${view === 'dashboard' 
                ? 'bg-white shadow-sm text-gray-900' 
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Feed View */}
      {view === 'feed' && (
        <div>
          <p className="text-gray-600 mb-6">Stay connected with your students' activity</p>
          
          <div className="space-y-4">
            {mockFeedItems.map(item => (
              <div 
                key={item.id}
                className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.studentName}</h3>
                    <p className="text-sm text-gray-500">{formatDateTime(item.timestamp)}</p>
                  </div>
                  <span className={`
                    text-xs font-medium px-3 py-1 rounded-full
                    ${item.type === 'log' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-green-100 text-green-700'
                    }
                  `}>
                    {item.type === 'log' ? '📝 Log' : '✓ Check-in'}
                  </span>
                </div>

                {item.type === 'log' ? (
                  <div>
                    <p className="text-gray-700 mb-3">{item.content}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>❤️ {item.likes}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-gray-700">📍 {item.location}</p>
                    {item.status === 'completed' ? (
                      <p className="text-sm text-green-600 font-medium">
                        Duration: {item.duration}
                      </p>
                    ) : (
                      <p className="text-sm text-green-600 font-medium">
                        🟢 Currently checked in
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dashboard View */}
      {view === 'dashboard' && (
        <div>
          <p className="text-gray-600 mb-6">Manage your advisees and approve their activity</p>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">Students</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{mockStats.totalStudents}</p>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">Pending</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{mockStats.pendingApprovals}</p>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-50 rounded-lg">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">Logs This Week</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{mockStats.logsThisWeek}</p>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">Check-ins Today</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{mockStats.checkInsToday}</p>
            </div>
          </div>

          {/* Pending Approvals Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Needs Your Attention</h2>
              <span className="text-sm text-orange-600 font-medium">
                {mockPendingItems.length} items
              </span>
            </div>
            <div className="divide-y divide-gray-200">
              {mockPendingItems.map(item => (
                <div 
                  key={item.id}
                  className="p-5 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    if (item.type === 'checkin') navigate('/checkins');
                    if (item.type === 'log') navigate('/advisorlogs');
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.studentName}</h3>
                        <p className="text-sm text-gray-600">
                          {item.type === 'checkin' 
                            ? `Check-in at ${item.location}` 
                            : item.preview
                          }
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {mockRecentActivity.map((activity, index) => (
                <div key={index} className="p-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {activity.student.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{activity.student}</span>
                      {' '}{activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdvisorDashboard;
