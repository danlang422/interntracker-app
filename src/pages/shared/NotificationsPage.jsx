import { useAuth } from '../../context/AuthContext';
import { Bell, CheckCircle, MessageCircle, UserPlus } from 'lucide-react';

function NotificationsPage() {
  const { user } = useAuth();

  // Placeholder notifications - will be replaced with real data later
  const getNotifications = () => {
    const activeRole = user.activeRole;

    const notifications = [];

    switch(activeRole) {
      case 'student':
        notifications.push(
          {
            id: 1,
            type: 'approval',
            icon: CheckCircle,
            title: 'Check-in approved',
            message: 'Your mentor approved your check-in at Cedar Rapids Library',
            time: '2 hours ago',
            read: false
          },
          {
            id: 2,
            type: 'comment',
            icon: MessageCircle,
            title: 'New comment on your log',
            message: 'Ms. Johnson commented on your reflection',
            time: '1 day ago',
            read: true
          }
        );
        break;

      case 'advisor':
      case 'mentor':
        notifications.push(
          {
            id: 1,
            type: 'checkin',
            icon: CheckCircle,
            title: 'New check-in awaiting approval',
            message: 'Sarah Martinez checked in at the hospital',
            time: '30 minutes ago',
            read: false
          },
          {
            id: 2,
            type: 'log',
            icon: MessageCircle,
            title: 'New log submitted',
            message: 'Alex Johnson submitted a reflection',
            time: '3 hours ago',
            read: false
          }
        );
        break;

      case 'admin':
        notifications.push(
          {
            id: 1,
            type: 'user',
            icon: UserPlus,
            title: 'New student registered',
            message: 'Jordan Smith has been added to the system',
            time: '1 hour ago',
            read: false
          }
        );
        break;
    }

    return notifications;
  };

  const notifications = getNotifications();

  return (
    <div className="max-w-2xl mx-auto pt-8">
      <h1 className="text-3xl font-bold mb-8">Notifications</h1>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.id}
                className={`
                  flex items-start gap-4 p-4 rounded-lg border
                  transition-colors cursor-pointer
                  ${notification.read 
                    ? 'bg-white border-gray-200 hover:bg-gray-50' 
                    : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                  }
                `}
              >
                <div className={`
                  p-2 rounded-full flex-shrink-0
                  ${notification.read ? 'bg-gray-100' : 'bg-blue-500 text-white'}
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                    )}
                  </div>
                  <p className="text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-sm text-gray-400 mt-2">{notification.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;
