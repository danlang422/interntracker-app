import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, FileText, Users, Building2 } from 'lucide-react';

function CreatePage() {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();

  // Define available actions based on role
  const getActions = () => {
    const activeRole = user.activeRole;
    let actions = [];

    // Student actions
    if (activeRole === 'student') {
      actions = [
        {
          title: 'Check In',
          description: 'Check in to your internship or class',
          icon: CheckCircle,
          path: '/checkin',
          primary: true
        },
        {
          title: 'Add Log',
          description: 'Record your activities and reflections',
          icon: FileText,
          path: '/logs'
        }
      ];
    }

    // Advisor/Mentor actions
    if (activeRole === 'advisor' || activeRole === 'mentor') {
      actions = [
        {
          title: 'Add Student Note',
          description: 'Add observation or feedback for a student',
          icon: Users,
          path: activeRole === 'advisor' ? '/students' : '/mentor/students',
          primary: true
        },
        {
          title: 'Review Logs',
          description: 'Review and comment on student logs',
          icon: FileText,
          path: activeRole === 'advisor' ? '/advisorlogs' : '/mentor/students'
        }
      ];
    }

    // Admin actions (or combined with advisor)
    if (activeRole === 'admin' || hasRole('admin')) {
      const adminActions = [
        {
          title: 'Add Student',
          description: 'Register a new student in the system',
          icon: Users,
          path: '/admin/students',
          primary: activeRole === 'admin',
          category: 'admin'
        },
        {
          title: 'Add Internship',
          description: 'Create a new internship opportunity',
          icon: Building2,
          path: '/admin/internships',
          category: 'admin'
        }
      ];

      // If this is an admin+advisor combo, add admin actions to existing actions
      if (activeRole === 'advisor' && hasRole('admin')) {
        actions = [...actions, ...adminActions];
      } else if (activeRole === 'admin') {
        actions = adminActions;
      }
    }

    return actions;
  };

  const actions = getActions();

  // Group actions by category if we have both teaching and admin actions
  const teachingActions = actions.filter(a => !a.category);
  const adminActions = actions.filter(a => a.category === 'admin');
  const hasMultipleCategories = teachingActions.length > 0 && adminActions.length > 0;

  const ActionButton = ({ action }) => {
    const Icon = action.icon;
    return (
      <button
        onClick={() => navigate(action.path)}
        className={`
          w-full flex items-start gap-4 p-6 rounded-lg border-2 
          transition-all duration-200 text-left
          ${action.primary 
            ? 'border-blue-500 bg-blue-50 hover:bg-blue-100' 
            : 'border-gray-200 bg-white hover:bg-gray-50'
          }
        `}
      >
        <div className={`
          p-3 rounded-full flex-shrink-0
          ${action.primary ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}
        `}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-1">{action.title}</h3>
          <p className="text-gray-600">{action.description}</p>
        </div>
      </button>
    );
  };

  return (
    <div className="max-w-2xl mx-auto pt-8">
      <h1 className="text-3xl font-bold mb-2">Create</h1>
      <p className="text-gray-600 mb-8">What would you like to do?</p>

      {hasMultipleCategories ? (
        <>
          {/* Teaching Actions Section */}
          {teachingActions.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Teaching</h2>
              <div className="space-y-4">
                {teachingActions.map((action, index) => (
                  <ActionButton key={index} action={action} />
                ))}
              </div>
            </div>
          )}

          {/* Admin Actions Section */}
          {adminActions.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Administration</h2>
              <div className="space-y-4">
                {adminActions.map((action, index) => (
                  <ActionButton key={index} action={action} />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        /* Single category - no grouping needed */
        <div className="space-y-4">
          {actions.map((action, index) => (
            <ActionButton key={index} action={action} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CreatePage;
