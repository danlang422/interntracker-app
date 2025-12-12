# Multi-Role System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        AuthContext                               │
│  Manages: user.roles[], user.activeRole, role switching         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ provides
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         MainLayout                               │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Header: [Logo] [Name] (activeRole) [RoleSwitcher?] [Logout]│ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌──────────────┐  ┌──────────────────────────────────────────┐│
│  │              │  │                                          ││
│  │  Navigation  │  │           Page Content                  ││
│  │              │  │           <Outlet />                    ││
│  │              │  │                                          ││
│  └──────────────┘  └──────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════
                     NAVIGATION BY ACTIVE ROLE
═══════════════════════════════════════════════════════════════════

┌─────────────────────┐
│  activeRole:        │
│    'student'        │
├─────────────────────┤
│ ▶ Home              │
│ ▶ Check In          │
│ ▶ My Logs           │
│ ▶ Profile           │
└─────────────────────┘

┌─────────────────────┐
│  activeRole:        │
│    'advisor'        │
│  (no admin role)    │
├─────────────────────┤
│ ▶ Dashboard         │
│ ▶ Students          │
│ ▶ Check-ins         │
│ ▶ Logs              │
│ ▶ Profile           │
└─────────────────────┘

┌─────────────────────┐
│  activeRole:        │
│    'advisor'        │
│  + hasRole('admin') │
├─────────────────────┤
│ ▶ Dashboard         │
│ ▶ Students          │
│ ▶ Check-ins         │
│ ▶ Logs              │
│ ▼ Admin             │ ← Submenu
│   • Manage Students │
│   • Manage Sites    │
│ ▶ Profile           │
└─────────────────────┘

┌─────────────────────┐
│  activeRole:        │
│    'mentor'         │
├─────────────────────┤
│ ▶ Dashboard         │
│ ▶ My Students       │
│ ▶ Profile           │
└─────────────────────┘

═══════════════════════════════════════════════════════════════════
                        ROLE SWITCHING LOGIC
═══════════════════════════════════════════════════════════════════

                    ┌─────────────────────┐
                    │   User Logs In      │
                    │  roles: [...array]  │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Determine Initial  │
                    │    activeRole       │
                    │  Priority Order:    │
                    │  1. student         │
                    │  2. advisor         │
                    │  3. mentor          │
                    └──────────┬──────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
    ┌───────▼───────┐  ┌──────▼──────┐  ┌───────▼───────┐
    │  Has 'mentor' │  │ Has 'admin' │  │ Has 'advisor' │
    │      AND      │  │     AND     │  │      AND      │
    │  'advisor'?   │  │ 'advisor'?  │  │   'mentor'?   │
    └───────┬───────┘  └──────┬──────┘  └───────┬───────┘
            │                 │                  │
        ┌───▼───┐         ┌───▼───┐          ┌──▼──┐
        │ Show  │         │ Show  │          │Same │
        │ Role  │         │ Admin │          │ as  │
        │Switch │         │Sub-   │          │Left │
        │ er    │         │ menu  │          └─────┘
        └───────┘         └───────┘

═══════════════════════════════════════════════════════════════════
                     DATA ACCESS BY ROLE
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                          DATA SCOPE                              │
├─────────────────────┬───────────────────────────────────────────┤
│  Role               │  Can Access                               │
├─────────────────────┼───────────────────────────────────────────┤
│  Student            │  - Own check-ins, logs                    │
│                     │  - Public logs from all students          │
│                     │  - Own profile                            │
├─────────────────────┼───────────────────────────────────────────┤
│  Advisor            │  - ALL students' data                     │
│                     │  - Can filter to "my advisees"            │
│                     │  - ALL check-ins and logs                 │
│                     │  - Can comment on student logs            │
├─────────────────────┼───────────────────────────────────────────┤
│  Advisor + Admin    │  Everything Advisor has +                 │
│                     │  - Create/edit student accounts           │
│                     │  - Create/edit internship sites           │
│                     │  - System configuration                   │
├─────────────────────┼───────────────────────────────────────────┤
│  Mentor             │  - ONLY assigned students                 │
│                     │  - ONLY at their site                     │
│                     │  - Approve/reject check-ins               │
│                     │  - Comment on mentee logs                 │
├─────────────────────┼───────────────────────────────────────────┤
│  Advisor + Mentor   │  When in ADVISOR mode: full advisor access│
│  (can switch)       │  When in MENTOR mode: limited to mentees  │
└─────────────────────┴───────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════
                          COMPONENT FLOW
═══════════════════════════════════════════════════════════════════

Login Page
   │
   │ User selects roles: ['advisor', 'admin', 'mentor']
   │ Enters name
   │ Clicks Login
   ▼
AuthContext.login()
   │
   │ Creates user object:
   │  {
   │    name: "Daniel",
   │    email: "daniel@example.com",
   │    roles: ['advisor', 'admin', 'mentor'],
   │    activeRole: 'advisor'  ← Determined by priority
   │  }
   │
   ▼
Navigate to /dashboard (advisor's landing page)
   │
   ▼
MainLayout renders
   │
   ├──→ Header shows:
   │    "Daniel (advisor) [Switch to mentor] [Logout]"
   │
   ├──→ Navigation renders advisor nav + admin submenu
   │    (because hasRole('admin'))
   │
   └──→ Page content shows AdvisorDashboard
        (via <Outlet />)

User clicks "Switch to mentor"
   │
   ▼
RoleSwitcher.handleSwitch()
   │
   │ Calls switchRole('mentor')
   │ Updates user.activeRole to 'mentor'
   │ Navigates to /mentor
   │
   ▼
MainLayout re-renders
   │
   ├──→ Header now shows:
   │    "Daniel (mentor) [Switch to advisor] [Logout]"
   │
   ├──→ Navigation re-renders with mentor nav
   │    (no admin submenu, even though has admin role)
   │
   └──→ Page content shows MentorDashboard

═══════════════════════════════════════════════════════════════════
                      FUTURE ENHANCEMENTS
═══════════════════════════════════════════════════════════════════

1. Route Protection
   ┌─────────────────────────────────────────┐
   │  <ProtectedRoute requiredRole="admin">  │
   │    <AdminStudents />                    │
   │  </ProtectedRoute>                      │
   └─────────────────────────────────────────┘

2. Permission System (if roles get complex)
   Instead of checking roles, check permissions:
   
   hasPermission('create_student')
   hasPermission('approve_checkin')
   hasPermission('view_all_students')

3. Role History/Breadcrumbs
   Remember which page user was on when switching roles

4. Default Role Preference
   Let users set their preferred starting role
   (stored in user profile or localStorage)
