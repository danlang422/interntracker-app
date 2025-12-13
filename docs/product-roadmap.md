# InternTracker - Revised Product Roadmap

*Updated: December 12, 2024*

## Product Vision

InternTracker is a comprehensive attendance and accountability system designed for City View Community High School's unique educational model, which blends traditional classroom instruction, community college courses, off-site internships, and remote learning.

**Core Value Proposition:** Enable students to take ownership of their attendance while giving staff the oversight and tools they need to ensure accountability and compliance.

## What Changed

**Original Vision (Week 1):**
- Internship tracking platform with reflections
- Competency-based assessment
- Social feed for student work

**Current Vision (Week 2):**
- **Primary:** Attendance/accountability system for flexible schedules
- **Secondary:** Internship time tracking with geolocation
- **Future:** Reflections, competencies, social features

**Why the Shift:**
- Dennis's demo feedback revealed immediate need for schedule/attendance management
- City View moving to self-scheduled remote days next semester
- Existing ImBlaze system doesn't handle their non-traditional structure
- Attendance compliance is higher priority than reflections for V1

## V1 MVP - Target: January 2025 Launch

### Must-Have Features

#### 1. Schedule Management
- **Admin Setup:**
  - Define schedule templates (Regular Day, Early Dismissal, etc.)
  - Create blocks/periods with times
  - Set which template applies each day
  
- **Student Schedules:**
  - Staff/students input weekly schedule
  - Support mixed Kirkwood/City View/Internship blocks
  - Handle varying schedules (MWF vs. T/Th classes)
  - Grade level filtering

#### 2. Attendance Check-In System
- **Student Experience:**
  - View daily schedule
  - Check in for each block
  - Select location type (classroom/remote/Kirkwood)
  - Add note if working remotely
  - See check-in history and status
  
- **Staff Experience:**
  - See pending check-ins
  - Approve/override attendance
  - Mark students present/absent/tardy/excused
  - Bulk actions (mark whole class, student absent all day)
  - View daily/weekly attendance reports
  
- **Secretary Tools:**
  - Handle absence calls (mark excused for day)
  - Generate attendance for Infinite Campus export
  - Override and audit capabilities

#### 3. Internship Clock-In/Out
- **Student Actions:**
  - Clock in at internship (with geolocation)
  - Clock out when leaving
  - Add brief activity notes
  - View hours worked (weekly/total)
  
- **Location Verification:**
  - Verify student is at expected internship site
  - Allow reasonable GPS variance
  - Flag suspicious locations for review
  
- **Hours Tracking:**
  - Calculate hours worked
  - Show progress toward required hours
  - Weekly/monthly summaries

#### 4. Role-Based Access
- **Students:** Check in, view own schedule/attendance, log internship hours
- **Advisors:** View assigned students, approve attendance, review internship logs
- **Mentors:** Verify internship hours, provide feedback
- **Secretary:** Full attendance management, bulk operations
- **Admin:** System configuration, user management

#### 5. Basic Audit Trail
- Track who changed what and when
- Required for attendance compliance
- Visible to staff roles

### Nice-to-Have (V1.1 - If Time Permits)
- Push notifications for missed check-ins
- Photo uploads on reflections
- Basic reflection system (without competencies)
- Mobile-responsive design polish

### Explicitly Out of Scope for V1
- XQ Competency tagging
- Public feed / social features
- Advanced analytics dashboard
- Parent portal
- Infinite Campus direct integration (manual export is fine)

## V2 - Spring 2025

### Reflections System
- Students write reflections about learning/work
- Attach photos
- Link to internship shifts or class blocks
- Advisors can comment/provide feedback

### Competency Framework
- Import XQ Competencies
- Students tag work with competencies
- Self-assess progression levels
- Advisors see competency coverage

### Enhanced Scheduling
- Students self-build schedules (within constraints)
- Request schedule changes
- Calendar view with better UX

### Notifications System
- Push notifications (PWA or React Native)
- Customizable alerts for staff
- Student reminders

## V3 - Future Vision

### Public Feed / Social Layer
- Students share public reflections
- "Today's locations" map
- Swipeable cards UI
- Celebrate student work

### Advanced Analytics
- Attendance patterns and trends
- Intervention alerts (chronic issues)
- Internship hours projections
- Competency coverage heatmaps

### Parent Portal
- View student attendance
- See internship hours
- Read reflections (if student allows)

### Integration & API
- Direct Infinite Campus integration
- Import schedules from IC
- Export attendance automatically
- Kirkwood schedule sync

### Mobile App (React Native)
- Native iOS/Android apps
- Better geolocation
- Offline mode
- Push notifications

### Full SIS/LMS Features
- Gradebook integration
- Assignment tracking
- Communication tools
- Resource library

## Technical Architecture

### Frontend
- React with Vite
- Tailwind CSS
- React Router for navigation
- React Context for state management

### Backend
- Supabase (PostgreSQL + Auth + Storage)
- Row-level security for access control
- Real-time subscriptions for live updates

### Deployment
- Frontend: Vercel or Netlify
- Backend: Supabase cloud
- File storage: Supabase Storage (photos)

### Future
- React Native for mobile apps
- Progressive Web App (PWA) features
- Service workers for offline support

## Success Metrics

### V1 Launch Goals
- 100% of City View students onboarded
- 90%+ daily check-in rate by week 2
- Staff adoption: All advisors using for attendance review
- Zero critical bugs in first month

### Long-Term Goals
- Replace ImBlaze entirely
- Expand to other alternative/project-based schools
- Become "the attendance system for non-traditional schools"

## Development Priorities

### This Week (Dec 12-19)
1. ✅ Finalize product requirements (this doc!)
2. 📧 Get Dennis/Blenda answers to open questions
3. 📐 Design database schema (done)
4. 🎨 Sketch key UI flows
5. 🔧 Set up Supabase project

### Next Week (Dec 19-26)
1. Build schedule management (admin side)
2. Build student check-in UI
3. Implement basic authentication
4. Create staff attendance review interface

### Week of Dec 26 - Jan 2
1. Internship clock-in/out functionality
2. Geolocation verification
3. Hours calculation and display
4. Testing and bug fixes

### Week of Jan 2-9
1. Polish UI/UX
2. Add bulk attendance actions
3. Secretary tools
4. Audit trail implementation

### Week of Jan 9-16
1. Final testing with Dennis
2. Staff training
3. Student onboarding plan
4. Launch! 🚀

## Open Questions (Pending Dennis/Blenda)

See: `docs/questions-for-dennis-and-blenda.md`

Key blockers we need answers for:
- Attendance status requirements
- Check-in window timing
- Schedule structure details
- Infinite Campus export needs

## Documentation Status

- ✅ Questions for Dennis/Blenda
- ✅ Attendance System Design
- ✅ Internship Tracking System
- ✅ Database Schema
- ✅ Product Roadmap (this doc)
- 🔲 UI/UX Wireframes (next)
- 🔲 API Documentation (as we build)
- 🔲 Deployment Guide (later)

## Risk Assessment

### High Risk
- **Schedule complexity:** City View's mixed model is harder than traditional periods
- **Mitigation:** Start with simple MVP, iterate based on real usage

### Medium Risk
- **Geolocation accuracy:** GPS can be unreliable indoors
- **Mitigation:** Allow staff override, reasonable tolerance radius

- **Student adoption:** Will students actually check in?
- **Mitigation:** Make it dead simple, faster than paper, push notifications

### Low Risk
- **Technical feasibility:** Core features are straightforward
- **Supabase reliability:** Established platform with good uptime

## Team & Resources

- **Developer:** Daniel (full-stack, learning as we build)
- **Product Owner:** Dennis (City View director)
- **Key Stakeholders:** Blenda (secretary), City View advisors
- **Budget:** TBD (currently free tier services)

---

## Summary

We're building an attendance and accountability system that meets City View where they are - with a flexible, non-traditional model that traditional SIS systems can't handle. V1 focuses ruthlessly on the core workflows: students checking in, staff reviewing, and internship time tracking. Everything else can wait until we validate these fundamentals work.

The beauty is that even V1 is valuable - it solves real pain points around tracking attendance for remote students and documenting internship hours. Reflections and competencies are icing on the cake.

Let's build something that works, ship it, and iterate based on real feedback. 🚀
