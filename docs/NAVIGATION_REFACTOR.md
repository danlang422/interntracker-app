# Navigation Refactor - December 11, 2024

## Overview
Migrated from generic navigation to Instagram-style navigation pattern with responsive design optimized for both mobile (students) and desktop (teachers/advisors/admin).

## New Components

### BottomNav.jsx
- Mobile-only bottom navigation (< 640px)
- 4-item layout: Home, Create, Notifications, Profile
- Adapts "Home" destination based on user role
- Clean icons with labels
- Active state styling with bold icon stroke

### Sidebar.jsx
- Desktop/tablet left sidebar (≥ 640px)
- Full navigation items with icons and labels
- Tighter spacing, aligned to left margin (no centered constraint)
- Role-specific navigation items
- Sticky positioning
- "More" menu placeholder at bottom

### Updated MainLayout.jsx
- Responsive layout using both BottomNav and Sidebar
- Removed max-width constraint on desktop
- Separate headers for mobile and desktop
- Mobile header: Simple logo + role switcher + logout
- Desktop header: User info + role switcher + logout
- Content area with max-width container but no artificial constraints
- Bottom padding on mobile to account for fixed bottom nav

## New Pages

### CreatePage.jsx (`/create`)
- Unified creation hub for all roles
- Role-specific quick actions
- Students: Check in, Add log
- Advisors/Mentors: Add note, Review logs
- Admin: Add student, Add internship
- Clean card-based interface

### NotificationsPage.jsx (`/notifications`)
- Centralized notifications view
- Role-specific notification types
- Read/unread states
- Placeholder data (to be replaced with real notifications later)

## Routing Updates
- Added `/create` and `/notifications` routes
- All shared routes moved to top of route definitions
- Maintained all existing role-specific routes

## Responsive Breakpoints
- **Mobile**: < 640px (bottom nav, compact layout)
- **Tablet/Small Chromebook**: 640px - 1024px (sidebar starts, moderate spacing)
- **Desktop/Larger Chromebook**: 1024px+ (full sidebar, max spacing)

## Design Decisions

### Why Instagram Pattern?
- Familiar to students (matches social apps they use daily)
- Clean 4-item mobile bottom nav is optimal UX
- "Create" hub reduces navigation complexity
- Works well across all user roles

### Layout Philosophy
- Mobile: Focused, minimal, social media vibes
- Desktop: More functional, data-dense, multi-panel capable
- Adaptive: Layout intelligence based on available space
- Chromebook-friendly: Optimized for 13-14" displays, not just large monitors

### Navigation Structure
All roles get same 4-item structure on mobile:
1. **Home** - Adapts to role (student feed, advisor dashboard, etc.)
2. **Create** - Unified creation hub
3. **Notifications** - All alerts and approvals
4. **Profile** - User info + settings (admin access here later)

Desktop adds role-specific intermediate pages to sidebar while keeping core structure.

## Next Steps
1. Build out actual Create page functionality (modals vs separate pages)
2. Implement real notifications system
3. Add status indicators (parked for now - need to decide on peer visibility logic)
4. Move admin access to Profile → Settings (future phase)
5. Consider right sidebar panel for contextual tools on desktop
6. Apply visual theme/style (colors, gradients, unique identity)

## Notes
- Old Navigation.jsx is now unused (can be deleted)
- RoleSwitcher component still works unchanged
- All existing pages render correctly in new layout
- Ready for Claude Code to apply Tailwind polish if needed
