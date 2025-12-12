# InternTracker Development Roadmap

## 📋 Table of Contents
- [Recently Completed](#recently-completed)
- [Next Steps](#next-steps)
- [Major Feature Decisions](#major-feature-decisions)
- [Technical Decisions](#technical-decisions)
- [Open Questions](#open-questions)
- [Future Enhancements](#future-enhancements)

---

## ✅ Recently Completed

### Tailwind CSS Migration (December 2024)
- **Branch:** `feature/tailwind-migration`
- **Status:** Complete
- **Summary:** Migrated entire app from Material-UI to Tailwind CSS v3
- **Changes:**
  - Installed Tailwind CSS, PostCSS, and Autoprefixer
  - Configured for Vite build system
  - Migrated all components and pages to Tailwind utility classes
  - Replaced MUI icons with Lucide React icons
  - Removed all custom CSS files
  - Removed MUI dependencies

**Benefits:**
- Smaller bundle size
- Consistent design system with utility-first approach
- Better mobile performance
- Easier responsive design with Tailwind's mobile-first breakpoints
- Cleaner, more maintainable code

---

## 🎯 Next Steps

### Phase 1: Navigation Restructure (Instagram-Style)
**Priority:** High  
**Branch:** `feature/instagram-navigation`

#### Design Decision
Move from current navigation to Instagram-style layout:
- **Home** - Activity feed (internship check-ins, logs)
- **New/+** - Unified creation hub (check in, add log, check in to class)
- **Notifications** - All alerts and approval requests
- **Profile** - User info, settings, admin access

#### Why This Change?
- More familiar to students (Instagram/TikTok pattern)
- Better mobile UX
- Works well for all user roles
- Consolidates admin access into Profile → Settings (industry standard)

#### Implementation Tasks
- [ ] Create new bottom navigation component (mobile)
- [ ] Create sidebar navigation component (desktop)
- [ ] Build notifications page/component
- [ ] Move admin panel access to Profile → Settings
- [ ] Update routing structure
- [ ] Test all user roles (student, advisor, mentor, admin)

---

### Phase 2: Attendance & Class Check-in System
**Priority:** High  
**Branch:** `feature/attendance-system`

#### Feature Overview
Expand check-in system to handle both internships AND class attendance.

#### Why Add This?
- City View currently uses spreadsheets for attendance
- Secretary manually enters data into SIS
- This feature automates their workflow
- Students can check in to classes from anywhere (library, off-campus with permission)
- Teachers review/approve before finalizing

#### Data Model Changes

**Check-in Types:**
```javascript
{
  id: "checkin_123",
  studentId: "student_456",
  type: "internship" | "class",  // NEW
  sessionName: "Block 1 Math" | "Cedar Rapids Library", // NEW
  checkInTime: "ISO timestamp",
  checkOutTime: "ISO timestamp" | null,
  location: { lat, lng, name } | null,  // Required for internships, optional for classes
  requiresApproval: true | false,  // NEW
  approvedBy: "mentor_id" | "teacher_id" | null,
  status: "pending" | "approved" | "flagged" // NEW
}
```

#### Implementation Tasks
- [ ] Update CheckInContext to handle check-in types
- [ ] Add `type` field to check-in data model
- [ ] Make geolocation optional for class check-ins
- [ ] Required for internship check-ins
- [ ] Build teacher approval workflow for class attendance
- [ ] Create schedule/agenda view for students
- [ ] Add organizationId to all data models (multi-school prep)

#### UI Changes
- [ ] Update Check-In page to show type selector (Internship vs. Class)
- [ ] Build Agenda view showing today's schedule
- [ ] Add quick check-in buttons on Agenda view
- [ ] Filter class check-ins from main activity feed (too noisy)

---

### Phase 3: Enhanced Feed with Map
**Priority:** Medium  
**Branch:** `feature/enhanced-feed`

#### Map Component
**Design Decision:** Collapsible/expandable map at top of feed

**Why Collapsible Instead of TikTok-style Swipe?**
- Avoids gesture conflicts (map pan vs. card swipe)
- Cleaner interaction model
- Easier to implement
- Can evolve to full-screen swipe later if needed

#### Implementation Approach
- Map shown in compressed state at top of feed
- Shows all internship locations for the day
- Tap to expand full-screen with modal overlay
- While expanded: normal map interaction works
- Close button or swipe down to return to feed
- Feed content starts below collapsed map

#### Feed Content Rules
**Include:**
- ✅ Internship check-ins (completed with duration)
- ✅ Public logs/reflections
- ✅ Achievements/milestones
- ✅ Mentor comments

**Exclude:**
- ❌ Class check-ins (live in Agenda view instead)

#### Visual Enhancements
Make text-heavy posts more engaging:
- Background gradients (themed to location/context)
- Location imagery (Google Places API)
- Profile photos/avatars
- Large, readable typography
- Icon overlays for reactions/duration

#### Implementation Tasks
- [ ] Build collapsible map component
- [ ] Integrate Google Maps API (or Leaflet + OpenStreetMap)
- [ ] Add location pins for daily internship sites
- [ ] Filter class check-ins from feed
- [ ] Add visual enhancements to feed cards (gradients, images)
- [ ] Consider card-based layout as step toward full-screen swipe

---

### Phase 4: Agenda/Schedule View
**Priority:** High (part of attendance system)  
**Branch:** `feature/agenda-view`

#### Design Options

**Option A: Home Tab Sub-views**
```
┌─────────────────────────────┐
│  [Feed] [Agenda]            │ ← Tabs within Home
├─────────────────────────────┤
│  Content switches based on  │
│  which sub-tab is active    │
└─────────────────────────────┘
```

**Option B: Agenda as Primary Home**
```
Home = Today's schedule + quick check-in buttons
Feed = Separate section or scrollable within Home
```

**Decision:** Option A - gives students choice, keeps everything cohesive

#### What Agenda Shows
- Today's scheduled blocks (classes + internships)
- Check-in status for each (not started, in progress, completed)
- Quick action buttons for each block
- Mini-map showing today's internship location(s)
- Time remaining until next block

#### Implementation Tasks
- [ ] Create Agenda component with schedule display
- [ ] Add tab switcher to Home page (Feed vs. Agenda)
- [ ] Build schedule data structure
- [ ] Add quick check-in buttons per schedule block
- [ ] Show check-in status indicators
- [ ] Add mini-map for internship locations

---

### Phase 5: Settings & Admin Restructure
**Priority:** Medium  
**Branch:** `feature/settings-refactor`

#### Current Structure
- Admin functionality in dropdown menu
- Settings scattered or non-existent

#### New Structure
```
Profile Page
├─ User Info (name, email, photo)
├─ My Stats (hours logged, check-ins this week)
├─ Settings ⚙️
│  ├─ Notifications
│  ├─ Privacy
│  ├─ Account
│  └─ [ADMIN PANEL] ← Only visible if hasRole('admin')
│     ├─ Manage Students
│     ├─ Manage Internships
│     ├─ System Settings
│     └─ [DEV TOOLS] ← Only visible if isDeveloper
```

#### Why This Change?
- Industry standard UX pattern (Instagram, Twitter, Discord all do this)
- Cleaner, more intuitive
- Easy to hide admin features for non-admin users
- Consistent with mobile app conventions

#### Implementation Tasks
- [ ] Build Settings page component
- [ ] Add settings icon/link in Profile page
- [ ] Move admin routes under Settings
- [ ] Add role-based visibility (only show admin panel if hasRole('admin'))
- [ ] Create developer tools section (isDeveloper flag)
- [ ] Remove old admin dropdown from navigation

---

## 🔧 Technical Decisions

### UI Framework: Tailwind CSS ✅
**Decision:** Migrate from Material-UI to Tailwind CSS v3  
**Rationale:**
- Modern utility-first approach
- Better mobile performance
- Highly customizable without feeling "frameworky"
- Smaller bundle sizes
- Excellent responsive design support

**Status:** ✅ Complete

---

### Icon Library: Lucide React ✅
**Decision:** Use Lucide React for all icons  
**Rationale:**
- Clean, modern icon set
- Larger selection than Heroicons
- Great TypeScript support
- MIT licensed
- Easy to use with React

**Status:** ✅ Complete

---

### Multi-School Architecture
**Decision:** Add `organizationId` to all data models NOW, implement multi-tenancy LATER

**Rationale:**
- Future-proofs the app without over-engineering
- Easy to add now while touching data models anyway
- Avoids massive refactor later if we want to offer to other schools

**Implementation:**
```javascript
// Add to all data models
const user = {
  id: "user_123",
  organizationId: "org_cityview", // NEW - hardcoded for now
  name: "Daniel",
  // ...
}

const internship = {
  id: "internship_456",
  organizationId: "org_cityview", // NEW
  name: "Cedar Rapids Library",
  // ...
}
```

**Future Developer Dashboard:**
```
Super Admin Panel (developer-only)
├─ Organizations
│  ├─ City View Community HS
│  ├─ Jefferson High School
│  └─ + Add New School
├─ Billing & Subscriptions
├─ Feature Flags
└─ System Health
```

**Status:** 🔜 Next major refactor

---

### Geolocation Requirements
**Decision:** Required for internships, optional for classes

**Rationale:**
- Internships need location verification (students are off-campus)
- Classes are more flexible (might be in library, coffee shop with permission)
- Students can optionally add location to class check-in if working off-campus

**Implementation:**
```javascript
const checkIn = (type, sessionName, userLocation = null) => {
  if (type === 'internship' && !userLocation) {
    throw new Error('Location required for internship check-ins');
  }
  // Class check-ins can optionally include location
}
```

**Status:** 🔜 To implement with attendance system

---

### Feed Content Strategy
**Decision:** Separate internship activity from class check-ins

**Why:**
- 50+ students checking in to "Block 1" floods the feed
- Internship check-ins are pseudo-social (interesting to see)
- Class check-ins are administrative (live in Agenda view)

**Feed includes:**
- Internship check-ins (completed)
- Public logs/reflections
- Achievements
- Mentor comments

**Agenda includes:**
- Class check-ins
- Today's schedule
- Quick action buttons

**Status:** 🔜 To implement with enhanced feed

---

### Map Interaction Pattern
**Decision:** Collapsible/modal map (not full-screen swipe)

**Why:**
- Avoids gesture conflicts (map pan vs card swipe)
- Cleaner UX
- Can evolve to swipe later if needed

**Implementation:**
- Map compressed at top of feed by default
- Tap to expand full-screen modal
- Normal map interaction while expanded
- Close to return to feed

**Alternative considered:**
- TikTok-style full-screen cards with embedded map as first card
- Rejected due to gesture complexity

**Status:** 🔜 To implement with enhanced feed

---

### Full-Screen Card Swipe
**Decision:** Start with card-based feed, evolve to swipe later

**Why:**
- Simpler to implement and test
- Works better with current content (mostly text)
- Can add swipe functionality once we have richer media
- Allows us to test content types first

**Path forward:**
1. Build card-based feed (like Instagram grid) ← Start here
2. Add visual enhancements (backgrounds, images)
3. Test with users
4. Consider full-screen swipe if card feed feels lacking

**Status:** 🔜 Card-based feed first, swipe later

---

## ❓ Open Questions

### 1. Header Component for Student Status
**Question:** Should we create a separate Header component to show student check-in status?

**Context:**
- Currently no separate Header.jsx
- Header functionality is inside MainLayout.jsx
- Might want dedicated space to show "Checked In" / "Checked Out" status

**Decision needed:** After navigation restructure

---

### 2. Notifications Implementation
**Question:** Real-time or polling? Push notifications?

**Options:**
- Firebase Cloud Messaging (push notifications)
- WebSocket connection (real-time)
- Polling every 30-60 seconds (simpler)

**Decision needed:** Before building notifications page

---

### 3. Media Upload Strategy
**Question:** How to handle photo/video uploads?

**Options:**
- Firebase Storage
- Cloudinary (image optimization built-in)
- AWS S3
- Supabase Storage

**Decision needed:** Before implementing media features

---

### 4. Schedule Data Source
**Question:** Where does student schedule data come from?

**Options:**
- Manual admin entry
- Import from CSV
- Sync with school SIS (if they have an API)
- Students create their own schedules

**Decision needed:** Before building agenda view

---

## 🚀 Future Enhancements (Post-MVP)

### AI & Analysis
- Voice note recording with transcription (OpenAI Whisper API)
- AI analysis matching logs to XQ competencies
- Auto-generated badge graphics showing skills

### Enhanced Social Features
- Swipeable internship browser (Tinder-style)
- Browse other students' reflections
- Weekly "most helpful log" recognition
- Comment system with moderation

### Scheduling & Automation
- Automated check-in reminders
- Attendance reports and analytics
- Irregular schedule support (not just blocks)

### Compliance & Documents
- Background check tracking
- Permission forms
- Document management

### Analytics & Reporting
- Student progress dashboards
- Competency development tracking
- Export for portfolios/resumes
- Admin analytics and insights

---

## 📝 Notes for Future Development

### When Starting a New Feature
1. Create feature branch: `git checkout -b feature/feature-name`
2. Review this roadmap for context and decisions
3. Update roadmap with any new decisions made
4. Make atomic commits with conventional commit messages
5. Test thoroughly before merging to main

### Commit Message Format
```
type(scope): description

Types: feat, fix, refactor, docs, chore, test, style
Scopes: ui, student, advisor, admin, mentor, auth, data
```

### Portfolio Considerations
- Keep commit history clean and meaningful
- Use feature branches and merge commits
- Document architectural decisions
- Include comprehensive README
- Add screenshots/demo videos later

---

## 🎓 Learning Resources

### Tailwind CSS
- [Official Docs](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/) (paid, but examples are free)
- [Headless UI](https://headlessui.com/) (accessible components for Tailwind)

### React Patterns
- [React Router v6](https://reactrouter.com/)
- [Context API Best Practices](https://react.dev/learn/scaling-up-with-reducer-and-context)

### Git Workflow
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Feature Branch Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow)

---

**Last Updated:** December 11, 2024  
**Current Branch:** `feature/tailwind-migration`  
**Next Branch:** `feature/instagram-navigation`
