# InternTracker - Current State & Direction

*Last Updated: December 13, 2024*

## 🎯 What This Is

InternTracker is an **attendance and scheduling system** for City View Community High School in Cedar Rapids, Iowa. It's designed to handle their unique educational model that blends traditional classes, community college courses, off-site internships, and remote learning - a complexity that traditional SIS systems can't accommodate.

**Current Status:** Core scheduling foundation complete! Building student-facing features next.

---

## 📍 Where We Are Now

### ✅ What's Built & Working

**Infrastructure:**
- ✅ Multi-role authentication system (student, advisor, mentor, admin, secretary)
- ✅ Role switching for users with multiple roles
- ✅ Instagram-style navigation (bottom nav mobile, sidebar desktop)
- ✅ Tailwind CSS styling (migrated from Material-UI)
- ✅ React Context architecture for state management
- ✅ Component reuse pattern (same components in preview and production)

**Core Scheduling System (NEW!):**
- ✅ **Block Types** - Define check-in behaviors (tap vs modal, questions, geolocation, clock in/out)
  - 6 default types: City View Class, Kirkwood Class, Remote Work (Morning), Remote Work (Progress), Internship, Monitor Group
  - Live preview shows students exactly what they'll see
  - Modular design: change a block type, all sections using it update
- ✅ **Schedule Templates** - Define SIS reporting blocks
  - Time-based automatic mapping (sections map to blocks based on time overlap)
  - 3 default templates: Regular Day (4 blocks), Early Dismissal (3 blocks), Late Start (4 blocks)
  - Handles edge cases (sections spanning multiple blocks, partial overlaps)
- ✅ **Sections** - Create classes/groups with student enrollment
  - Inherits check-in behavior from Block Type
  - Auto-maps to reporting blocks based on time
  - Live preview of student experience
  - Bulk student enrollment with search/filter
  - Flexible for both shared classes and individual internships

**Admin Tools:**
- ✅ Student management (add, edit, view students)
- ✅ Internship management (add, edit, view internship sites)
- ✅ Assignment system (link students to internships with schedules) - *Will evolve into Section enrollment*
- ✅ XQ Competencies display (full competency framework viewer)
- ✅ Block Types management (create/edit check-in behaviors)
- ✅ Schedule Templates management (define reporting blocks)
- ✅ Sections management (create classes/groups, enroll students)

**Student Features:**
- ✅ Basic check-in/check-out interface (ready for integration with sections)
- ✅ Logs/reflections system (ready for integration)
- ⚠️ Home feed view (needs refactoring to agenda-first)

**Teacher/Advisor Features:**
- ⚠️ Dashboard view (placeholder, needs rebuilding with section-based attendance)
- ⚠️ Student list views (placeholder, needs rebuilding)

**Shared Pages:**
- ✅ Profile page
- ✅ Create page (stub)
- ✅ Notifications page (stub)

### 🏗️ What's In Progress

**Schedule System Integration:**
- Architecture complete, now needs integration into student/staff views
- Student components built (ScheduleSegmentCard, CheckInButton, CheckInModal)
- Ready to display in student agenda

**Attendance System:**
- Concept: Separate check-ins (student proof) from attendance (staff marking)
- Block type check-in logic: Complete
- Attendance review interface: Next to build

### ❌ What's Not Built Yet

**Critical for V1:**
- ❌ Daily Schedule Setter (select which template applies on specific dates)
- ❌ Student Agenda View (show enrolled sections with appropriate check-in buttons)
- ❌ Attendance Review Interface (staff mark attendance by reporting block)
- ❌ Secretary Dashboard (bulk operations, attendance rollup view)
- ❌ Data export for SIS

**Nice-to-Have:**
- ❌ Social feed (deprioritized)
- ❌ Competency tagging on work
- ❌ Photo uploads
- ❌ Push notifications
- ❌ Bulk section creation tools

---

## 🎨 System Architecture

### The Three-Layer Model

```
Block Types (Behavior Templates)
    ↓ (defines)
Sections (Actual Classes/Groups)
    ↓ (maps to via time overlap)
Schedule Templates (Reporting Blocks)
    ↓ (displays in)
Student Agenda + Staff Attendance Review
```

**Example Flow:**
1. Admin creates Block Type "City View Class" with tap check-in
2. Admin creates Section "Chemistry - Ms. Garcia" using that block type
3. Section runs 09:30-10:30, system calculates it maps to Block 2
4. Student sees Chemistry in agenda with tap check-in button
5. Ms. Garcia reviews Block 2 attendance, sees Chemistry students' check-ins

### Key Design Decisions

**Time-Based Mapping:**
- Sections don't manually specify reporting blocks
- System calculates overlap based on time windows
- Changing schedule templates automatically remaps everything

**Block Type Inheritance:**
- Sections inherit check-in behavior from their block type
- Update block type → all sections using it update
- Live preview ensures admin sees student experience

**Component Reuse:**
- Same ScheduleSegmentCard used in admin preview AND student agenda
- Same CheckInButton adapts to block type (tap vs modal vs clock in/out)
- Guarantees consistency between preview and reality

---

## 📊 Data Model Status

### Implemented Contexts
- ✅ AuthContext
- ✅ StudentsContext
- ✅ InternshipsContext
- ✅ AssignmentsContext (will evolve)
- ✅ BlockTypesContext (NEW)
- ✅ ScheduleTemplatesContext (NEW)
- ✅ SectionsContext (NEW)
- ⚠️ CheckInContext (needs refactoring for block types)
- ⚠️ LogsContext (ready for integration)

### Data Storage
- Current: localStorage for all contexts
- Next: Migrate to Supabase backend
- Design: Contexts abstracted to make backend swap easy

---

## 🎯 Immediate Next Steps

### Priority 1: Student Experience
1. **Student Agenda View**
   - Show sections student is enrolled in
   - Display with appropriate check-in buttons (from block type)
   - Handle sections on different days
   - Show which reporting block each section maps to

2. **Refactor Check-In System**
   - Connect CheckInButton to actual check-in recording
   - Handle different question sets per block type
   - Geolocation for internships
   - Clock in/out for time tracking

### Priority 2: Staff Experience
1. **Attendance Review Interface**
   - Staff view sections by reporting block
   - See all check-ins for their sections
   - Mark official attendance (present/absent/tardy)
   - Handle sections that span multiple blocks

2. **Secretary Dashboard**
   - View all sections by reporting block
   - Bulk attendance operations
   - Attendance rollup for SIS
   - Flag missing check-ins/attendance

### Priority 3: Integration
1. **Daily Schedule Setter**
   - Calendar view to set which template applies each day
   - Handle special schedules (assemblies, early dismissal)
   - Preview impact on sections

2. **Data Export**
   - Export attendance by reporting block
   - Format for SIS import
   - Historical reporting

---

## 🚀 Migration Path from Assignment System

The current Assignment system (student → internship → schedule) will evolve:

**Current:** 
- Assignments link students to internships
- Schedule array defines when they meet

**Future:**
- Assignments become Section enrollments
- Internships become Sections with Block Type "Internship"
- Existing assignment data can migrate to Section enrollments

**Timeline:** After student agenda is built, migrate existing assignments

---

## 📝 Open Questions for Stakeholders

See `questions-for-dennis-and-blenda.md` for full list. Key items:
- Exact reporting block structure (how many, what times)
- Staff roster for attendance assignment
- SIS export format requirements
- Edge case handling (late arrivals, early dismissals)

---

## 💾 Technical Notes

**Performance:**
- Block type changes recalculate on render (fine for current scale)
- Schedule template changes recalculate section mappings (fine for current scale)
- Student count: ~50 students (no optimization needed yet)
- Section count: Estimate 20-30 sections (localStorage handles easily)

**Browser Support:**
- Modern browsers only (Chrome, Firefox, Safari, Edge)
- Geolocation API for internship check-ins
- LocalStorage for offline capability

**Deployment:**
- Currently: Development only
- Next: Netlify/Vercel for hosting
- Future: Supabase for backend

---

*Document maintained by development team. Update after major feature completions.*