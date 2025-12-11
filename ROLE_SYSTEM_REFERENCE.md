# Multi-Role System - Quick Reference

## Role Combinations & Behavior

### Single Role Users
| Roles | Active Role | Navigation Shown | Role Switcher? |
|-------|-------------|------------------|----------------|
| `['student']` | `student` | Student nav | No |
| `['advisor']` | `advisor` | Advisor nav | No |
| `['mentor']` | `mentor` | Mentor nav | No |
| `['admin']` | `admin` | Advisor nav (admin is an add-on) | No |

### Multi-Role Users (Common Cases)
| Roles | Active Role | Navigation Shown | Role Switcher? |
|-------|-------------|------------------|----------------|
| `['advisor', 'admin']` | `advisor` | Advisor nav + Admin submenu | No |
| `['advisor', 'mentor']` | `advisor` | Advisor nav (can switch) | **Yes** |
| `['advisor', 'admin', 'mentor']` | `advisor` | Advisor nav + Admin submenu (can switch) | **Yes** |

## Key Principles

### 1. Admin is an Add-On Role
- Admin is NOT a separate view/interface
- Admin adds a **submenu** to the advisor navigation
- Users with admin role are essentially "advisors with system management privileges"

### 2. Mentor Requires Switching
- Mentor view is DISTINCT from advisor view
- If user has both advisor and mentor, they must explicitly switch
- Role switcher only appears when user has BOTH advisor AND mentor roles

### 3. Role Priority (Initial Login)
When user logs in with multiple roles, determine `activeRole` by:
1. `student` (if present, always primary)
2. `advisor` (if no student role)
3. `mentor` (only if no student or advisor)

### 4. Navigation Rules by Active Role

**When activeRole = 'student':**
```javascript
// Show: Home, Check In, My Logs, Profile
// Hide: Everything else
// Admin submenu: Never shown
```

**When activeRole = 'advisor':**
```javascript
// Show: Dashboard, Students, Check-ins, Logs, Profile
// + Admin submenu IF hasRole('admin')
// Role Switcher: Show IF hasRole('mentor')
```

**When activeRole = 'mentor':**
```javascript
// Show: Dashboard, My Students, Profile
// Hide: All advisor functionality
// Admin submenu: Never shown (even if has admin role)
// Role Switcher: Show (to switch back to advisor)
```

## Code Examples

### Checking if User Has Multiple Roles
```javascript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, hasRole, needsRoleSwitcher } = useAuth();
  
  // Check single role
  if (hasRole('admin')) {
    // Show admin-only features
  }
  
  // Check if role switcher needed
  if (needsRoleSwitcher()) {
    // User has both advisor and mentor
  }
}
```

### Switching Roles
```javascript
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const { switchRole } = useAuth();
  const navigate = useNavigate();
  
  const handleSwitch = () => {
    switchRole('mentor'); // Change to mentor view
    navigate('/mentor'); // Navigate to mentor dashboard
  };
}
```

### Conditional Navigation Items
```javascript
// In Navigation.jsx
const advisorItems = [
  { path: '/dashboard', label: 'Dashboard' },
  // ... other items
];

// Add admin submenu if user has admin role
if (hasRole('admin')) {
  advisorItems.push({
    type: 'submenu',
    label: 'Admin',
    items: [
      { path: '/admin/students', label: 'Manage Students' },
      { path: '/admin/internships', label: 'Manage Internships' }
    ]
  });
}
```

## Real-World Scenarios

### Scenario 1: Teacher/Advisor (Most Common)
**Roles:** `['advisor']`
- Sees: Dashboard, Students, Check-ins, Logs
- Can: Monitor all students, filter to advisees, view/comment on logs

### Scenario 2: Teacher/Advisor with Admin Access
**Roles:** `['advisor', 'admin']`
- Sees: Everything from Scenario 1 + Admin submenu
- Can: Everything from Scenario 1 + create/edit students and internships

### Scenario 3: Teacher Who Also Mentors In-House Internship
**Roles:** `['advisor', 'mentor']`
- Sees: Advisor nav by default + Role Switcher button
- Can: Switch to mentor view to approve check-ins for their specific intern(s)
- **Mentor view:** Only sees students assigned to them at their site

### Scenario 4: Admin Teacher Who Also Mentors
**Roles:** `['advisor', 'admin', 'mentor']`
- Sees: Advisor nav + Admin submenu + Role Switcher
- Can: Full system management + ability to switch to mentor mode
- **In advisor mode:** Full access + admin functions
- **In mentor mode:** Limited to assigned students

### Scenario 5: External Workplace Supervisor
**Roles:** `['mentor']`
- Sees: Mentor nav only
- Can: Only interact with students assigned to their workplace
- **No access to:** System-wide data, other internships, admin functions

## UI Indicators

### Header Display
```
InternTracker                 [Daniel] (advisor) [Switch to mentor] [Logout]
                                 ↑         ↑            ↑
                              name    activeRole   role switcher
                                                   (if applicable)
```

### Navigation Display (Advisor with Admin)
```
Dashboard
Students
Check-ins
Logs
Admin ▼         ← Expandable submenu
  Manage Students
  Manage Internships
Profile
```

## Future Considerations

### Potential Future Roles
- **Parent** - View their student's progress only
- **District Admin** - System-wide oversight across multiple schools
- **Compliance Officer** - Review documents and approvals

### Scaling the System
If more role combinations emerge:
- Consider a "role matrix" or permission system
- Separate UI "views" from backend "permissions"
- May need more sophisticated role switching UI (dropdown instead of toggle)
