# InternTracker - Current State & Direction

*Last Updated: December 12, 2024*

## 🎯 What This Is

InternTracker is an **attendance and scheduling system** for City View Community High School in Cedar Rapids, Iowa. It's designed to handle their unique educational model that blends traditional classes, community college courses, off-site internships, and remote learning - a complexity that traditional SIS systems can't accommodate.

**Current Status:** Mid-development pivot following stakeholder feedback.

---

## 📍 Where We Are Now

### ✅ What's Built & Working

**Infrastructure:**
- ✅ Multi-role authentication system (student, advisor, mentor, admin, secretary)
- ✅ Role switching for users with multiple roles
- ✅ Instagram-style navigation (bottom nav mobile, sidebar desktop)
- ✅ Tailwind CSS styling (migrated from Material-UI)
- ✅ React Context architecture for state management

**Admin Tools:**
- ✅ Student management (add, edit, view students)
- ✅ Internship management (add, edit, view internship sites)
- ✅ Assignment system (link students to internships with schedules)
- ✅ XQ Competencies display (full competency framework viewer)

**Student Features:**
- ✅ Basic check-in/check-out interface (needs refactoring)
- ✅ Logs/reflections system (needs refactoring)
- ✅ Home feed view (needs refactoring to agenda-first)

**Teacher/Advisor Features:**
- ✅ Dashboard view (placeholder, needs rebuilding)
- ✅ Student list views (placeholder, needs rebuilding)

**Shared Pages:**
- ✅ Profile page
- ✅ Create page (stub)
- ✅ Notifications page (stub)

### ⚠️ What's Partially Built (Needs Refactoring)

**Check-In System:**
- Currently: Generic check-in interface
- Needs: Separate interfaces for internships (geolocation + questions) vs. classes/remote (varied requirements)
- Status: Core logic exists but needs restructuring

**Schedule System:**
- Currently: Assignment system links students to internships with schedules
- Needs: Full daily schedule builder supporting mixed class/Kirkwood/internship/remote blocks
- Status: Data structure exists but needs expansion

**Attendance System:**
- Currently: Basic check-in tracking
- Needs: Separation of check-ins (student proof) from attendance records (staff marking)
- Status: Concept exists but not implemented

### ❌ What's Not Built Yet

**Critical for V1:**
- ❌ Block Type Builder (admin creates different segment types with check-in rules)
- ❌ Schedule Template Builder (admin defines reporting blocks for SIS)
- ❌ Daily Schedule Setter (which template applies each day)
- ❌ Student Schedule Builder (build individual student schedules)
- ❌ Agenda View (student sees their daily schedule with check-in buttons)
- ❌ Attendance Review Interface (teachers mark official attendance)
- ❌ Secretary Dashboard (bulk operations, SIS export)
- ❌ Rollup Logic (student segments → reporting blocks)

**Nice-to-Have:**
- ❌ Social feed (deprioritized for now)
- ❌ Competency tagging on work
- ❌ Photo uploads
- ❌ Push notifications

---

## 🎬 How We Got Here

### Week 1-1.5: Exploration Phase
Built foundation as a learning project:
- Multi-role auth and navigation
- Basic check-in/logs for internships
- Assignment system
- Competencies display

### The Pivot: Meeting with Dennis
Showed Dennis the prototype. His response:
- "This is cool, but can it handle our attendance situation?"
- City View moving to self-scheduled remote days next semester
- Current system (paper + spreadsheets) isn't working
- **Attendance/scheduling became the urgent need**

### Week 2 (Now): Refocusing
- Attendance and scheduling are now the core features
- Check-ins must support different requirements (in-person vs remote vs internship)
- Need to map flexible student schedules to rigid SIS reporting blocks
- Social/reflection features deprioritized but not abandoned

---

## 🗺️ Current Direction

### V1 MVP Goal: January 2025 Launch

**Core Features (Must-Have):**

1. **Flexible Schedule System**
   - Admin creates "block types" (e.g., City View class, Kirkwood class, internship, remote work)
   - Block types define check-in requirements (tap vs modal, what questions to ask, geolocation, etc.)
   - Admin builds schedule templates (what reporting blocks exist for SIS)
   - Staff/students build individual student schedules (actual activities during the day)
   - Student schedules can have MORE activities than SIS has reporting blocks (rollup logic)

2. **Two Check-In Systems**
   - **Internship Check-In:** Geolocation required, check in AND out, prompt for daily plan
   - **Class/Remote Check-In:** No geolocation, different prompts based on type (tap for class, notes for remote)

3. **Attendance Review System**
   - Teachers see student check-ins for their blocks
   - Teachers mark official attendance (Present/Absent/Tardy/Excused) separately
   - Student check-in ≠ automatic attendance status
   - Staff override anything

4. **Secretary Tools**
   - Bulk operations (mark student absent all day, mark whole class present)
   - Handle absence calls efficiently
   - Export to SIS format (CSV for Infinite Campus)
   - Full audit trail

5. **Student Agenda View**
   - See daily schedule with check-in status
   - Tap to check in based on block type requirements
   - Visual feedback on what's coming up

### V2 Features (Post-Launch)
- Reflections system with competency tagging
- Photo/video uploads
- Social feed of student work
- Push notifications
- Parent portal
- Advanced analytics

---

## 📊 Key Architectural Decisions

### 1. Tools, Not Solutions
We're building SCHEDULE BUILDERS and BLOCK TYPE CREATORS, not "City View's schedule." This makes the system adaptable to other non-traditional schools.

### 2. Separation of Concerns
- **Check-Ins** = Student proof of engagement (timestamps, notes, location)
- **Attendance Records** = Official status for SIS (what staff marks)
- These are separate data structures with different purposes

### 3. Flexible Rollup
- Student's real schedule = 6-8 activities per day
- SIS reporting = 5 blocks per day
- Multiple student activities can map to one reporting block
- Teachers see all check-ins when making attendance decisions

### 4. Staff Authority
- Teachers/administrators have final say on attendance
- They can override check-in data
- System provides evidence, humans make decisions

### 5. Block Types Define Behavior
- Admin creates reusable block types
- Each type specifies its check-in requirements
- Students' schedule segments reference block types
- Changing a block type affects all segments using it

---

## 🔧 Technology Stack

**Current:**
- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- React Context for state management
- Lucide React for icons

**Planned:**
- Supabase for backend (PostgreSQL + Auth + Storage)
- Row-level security for access control
- Real-time subscriptions for live updates

**Deployment:**
- Frontend: Vercel or Netlify
- Backend: Supabase cloud

---

## 📁 Current Code Structure

```
src/
├── components/
│   ├── admin/
│   │   └── StudentManagementModal.jsx
│   ├── layout/
│   │   ├── BottomNav.jsx
│   │   ├── Sidebar.jsx
│   │   ├── MainLayout.jsx
│   │   ├── Navigation.jsx (old, can be removed)
│   │   └── RoleSwitcher.jsx
│   └── common/ (empty - future shared components)
│
├── context/
│   ├── AuthContext.jsx ✅ (multi-role working)
│   ├── CheckInContext.jsx ⚠️ (needs refactor)
│   ├── LogsContext.jsx ⚠️ (needs refactor)
│   ├── StudentsContext.jsx ✅ (working)
│   ├── InternshipsContext.jsx ✅ (working)
│   └── AssignmentsContext.jsx ✅ (working)
│
├── pages/
│   ├── student/
│   │   ├── StudentHome.jsx ⚠️ (needs agenda rebuild)
│   │   ├── CheckIn.jsx ⚠️ (needs split into multiple interfaces)
│   │   └── Logs.jsx ⚠️ (needs refactor)
│   ├── advisor/
│   │   ├── AdvisorDashboard.jsx ⚠️ (placeholder)
│   │   ├── Students.jsx ⚠️ (placeholder)
│   │   ├── CheckIns.jsx ⚠️ (placeholder)
│   │   └── AdvisorLogs.jsx ⚠️ (placeholder)
│   ├── mentor/
│   │   ├── MentorDashboard.jsx ⚠️ (basic)
│   │   └── MentorStudents.jsx ⚠️ (basic)
│   ├── admin/
│   │   ├── AdminDashboard.jsx ✅
│   │   ├── AdminStudents.jsx ✅
│   │   ├── AdminInternships.jsx ✅
│   │   └── AdminCompetencies.jsx ✅
│   ├── shared/
│   │   ├── Profile.jsx ✅
│   │   ├── CreatePage.jsx (stub)
│   │   └── NotificationsPage.jsx (stub)
│   └── auth/
│       └── Login.jsx ✅
│
└── utils/
    └── competenciesData.js ✅
```

---

## 📚 Documentation Status

### Current & Accurate
- ✅ **DATA_MODEL.md** - Complete data structure specification (just created)
- ✅ **CURRENT_STATE.md** - This document
- ✅ **NAVIGATION_REFACTOR.md** - Describes Instagram-style nav (accurate)
- ✅ **MULTI_ROLE_IMPLEMENTATION.md** - Multi-role auth system (accurate)
- ✅ **COMPLETE_ASSIGNMENT_SYSTEM.md** - Assignment/scheduling base (accurate)
- ✅ **COMPETENCIES_FEATURE.md** - XQ Competencies display (accurate)

### Needs Updates
- ⚠️ **README.md** (root) - Still mentions Material-UI, outdated feature list
- ⚠️ **product-roadmap.md** - Written during transition, mixes old and new vision
- ⚠️ **ROADMAP.md** - Partially outdated development roadmap

### Status Unknown / May Be Outdated
- ❓ **attendance-system-design.md** - Detailed attendance design (may predate pivot)
- ❓ **internship-tracking-system.md** - Internship tracking (may predate pivot)
- ❓ **database-schema.md** - Database structure (needs verification vs DATA_MODEL.md)
- ❓ **questions-for-dennis-and-blenda.md** - Open questions (some answered, being updated)

### Event-Specific (Can Archive)
- 📦 **DEMO_GUIDE.md**
- 📦 **DEMO_CHEAT_SHEET.md**
- 📦 **DEMO_FEEDBACK_FORM.md**
- 📦 **PRE_DEMO_CHECKLIST.md**

### Historical Implementation Docs (Can Archive)
- 📦 **ADMIN_DASHBOARD_IMPLEMENTATION.md**
- 📦 **ADMIN_INTERNSHIPS_IMPLEMENTATION.md**
- 📦 **ADMIN_STUDENTS_IMPLEMENTATION.md**
- 📦 **ASSIGNMENT_SYSTEM_REFACTOR.md**
- 📦 **ARCHITECTURE_DIAGRAM.md**
- 📦 **TESTING_GUIDE.md**
- 📦 **ROLE_SYSTEM_REFERENCE.md**

---

## 🚧 Immediate Next Steps

### 1. Finalize Requirements (This Week)
- ✅ Data model documented (DATA_MODEL.md)
- 🔄 Questions doc being updated with Daniel's decisions
- 📧 Get Dennis/Blenda answers to remaining questions
- ✅ Document current state (this file)

### 2. Clean Up Documentation (Tonight)
- Update README.md to reflect current state
- Archive outdated docs to /docs/archive/
- Update docs/README.md index
- Create clear "start here" path for future contributors

### 3. Plan Refactor (Next)
- Decide whether to refactor existing code or rebuild sections
- Create implementation plan for block type builder
- Map out context changes needed
- Design UI for admin schedule tools

### 4. Build V1 (Upcoming)
- Block Type Builder (admin tool)
- Schedule Template Builder (admin tool)
- Student Schedule Builder (admin/student tool)
- Refactor check-in system (two interfaces)
- Build attendance review interface
- Build secretary dashboard

---

## ❓ Open Questions

**For Dennis/Blenda:**
1. Does Kirkwood take attendance? How does it get to Blenda?
2. Should we prevent late check-ins after X minutes or just flag them?
3. How many minutes absent = absent from a reporting block?
4. Can students check into things not on their schedule?
5. Rollup edge cases: 2 segments in one block, check into one but not the other = present/tardy/absent?
6. Which parts of schedule can students edit themselves?

**For Development:**
1. Refactor vs rebuild approach for existing features?
2. Which admin tools to build first?
3. Database setup timing (local dev vs Supabase)?

---

## 💡 Key Insights

### What Makes This Complex
City View's schedule is genuinely unique:
- Students have mixed schedules (City View + Kirkwood + Internship + Remote)
- Kirkwood classes don't align with City View blocks
- Some students have 6+ activities but SIS only needs 5 blocks
- Remote students need different check-in requirements than in-person
- Staff need flexibility but also accountability

### What Makes This Valuable
No existing system handles this:
- ImBlaze ($6000/year) is too rigid and expensive
- Traditional SIS systems assume standard schedules
- Building our own gives City View exactly what they need
- Potential to help other alternative/project-based schools

### What We're Learning
- Requirements will evolve - build flexibility in
- Stakeholder feedback is essential - Dennis's input pivoted the project
- Data modeling before coding prevents refactor pain
- Documentation saves future-you from whiplash

---

## 🎓 For Future Contributors

**If you're picking this up:**

1. **Start with DATA_MODEL.md** - Understand the data structures
2. **Read this document (CURRENT_STATE.md)** - Get oriented on where we are
3. **Check questions-for-dennis-and-blenda.md** - See what's still TBD
4. **Review code structure** - Know what exists vs what's stubbed
5. **Ask questions early** - This is a complex domain

**Key Principles:**
- Tools, not solutions (build flexible, not City View-specific)
- Staff authority (they always have final say)
- Separate check-ins from attendance (different purposes)
- Document decisions (future-you will thank you)

---

*This document will be updated as we build and learn. Last updated: December 12, 2024*
