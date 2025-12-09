# InternTracker

A web application for managing high school student internships, replacing ImBlaze with enhanced features at a fraction of the cost.

## Project Overview

**Target School:** City View Community High School, Cedar Rapids, Iowa  
**Estimated Users:** ~50 students, plus mentors, advisors, and admin staff  
**Budget Goal:** ~$200/year (vs $6000/year for ImBlaze)

## User Roles

### Student (Mobile-first)
Primary users who check in/out of internships and document their learning.

### Mentor (Mobile-first)
Workplace supervisors who approve check-ins and provide feedback.

### Advisor/Teacher (Desktop + Mobile)
School staff who monitor student progress and create prompts/assignments.

### Admin (Desktop-focused)
Manages setup, user accounts, internships, and system configuration.

## MVP Features (Phase 1)

### Authentication
- Students/Teachers: Google OAuth (school accounts)
- Mentors: Email/password
- Role-based access control

### Core Functionality
1. **Check-in/out with Geolocation**
   - Students check in/out at internship sites
   - Automatic location capture and timestamp
   - Mentor approval workflow (approve/flag for review)

2. **Text-based Reflections/Logs**
   - Students write reflections about their work
   - Optional: make logs public to share with other students
   - Teachers can comment on logs

3. **Basic Feed**
   - View check-ins and public logs from all students
   - Simple like/upvote system (no comments to avoid moderation issues)

4. **Notifications**
   - Notify mentors when students check in/out
   - Notify students when mentors comment
   - Notify advisors when students respond to prompts

5. **Admin Setup Panel**
   - Create/manage user accounts
   - Set up internships and locations
   - Assign students to internships and mentors

## Future Features (Phase 2+)

### AI & Analysis
- Voice note recording with transcription (Whisper API)
- AI analysis matching logs to XQ competencies
- Auto-generated badge graphics showing demonstrated skills

### Enhanced Content
- Teacher-created prompts and reflection questions
- Media uploads (photos/videos of internship work)
- Compliance document management (background checks, permissions)

### Scheduling
- Student internship schedules (irregular time blocks supported)
- Automated check-in reminders
- Attendance tracking and reports

### Social Features
- Swipeable internship browser (Tinder-style)
- Browse other students' reflections
- Weekly "most helpful log" recognition

## Page Structure

### Student Pages

#### `/` - Student Home/Feed
**MVP:** 
- Feed of all students' check-ins and public logs
- Upvote/like functionality
- Filter by date or student
- View own check-in status

**Future:**
- See AI-generated competency badges
- Active prompts to respond to
- Upcoming scheduled shifts

#### `/checkin` - Check In/Out Hub
**MVP:**
- Three-mode switcher (CHECK IN/OUT, LOG, MEDIA)
- Check-in mode: Show location, big check-in/out button
- Log mode: Text area for reflections, optional prompts, make public toggle
- Media mode: Placeholder for future photo/video uploads

**Future:**
- Voice note recording
- AI competency analysis on submission
- "What are your goals today?" on check-in
- Photo/video uploads with captions

#### `/logs` - My Logs History
**MVP:**
- List of all student's own logs
- Filter by date, public/private
- Edit/delete own logs

**Future:**
- See which competencies were demonstrated
- Export logs for portfolio/resume

### Mentor Pages

#### `/mentor` - Mentor Dashboard
**MVP:**
- List of assigned mentees
- Pending check-ins to approve
- Recent activity from mentees

**Future:**
- Analytics on student progress
- Scheduled shifts for mentees
- Communication tools

#### `/mentor/students` - My Students
**MVP:**
- Detailed view of each mentee
- Their check-in history
- Their logs and reflections
- Approve/flag check-ins
- Leave comments

**Future:**
- Add observations/notes about student
- Track competency development
- Message students

### Admin Pages

#### `/admin` - Admin Dashboard
**MVP:**
- Overview of all users
- Recent system activity
- Quick stats (total students, active internships)

**Future:**
- Analytics and reports
- Compliance tracking
- System health monitoring

#### `/admin/students` - Manage Students
**MVP:**
- List all students
- Create new student accounts
- Assign students to internships
- Assign students to mentors
- View student profiles

**Future:**
- Bulk import from CSV
- Set student schedules
- Track attendance/completion rates

#### `/admin/internships` - Manage Internships
**MVP:**
- List all internship sites
- Create new internships
- Set location/address for geofencing
- Assign mentors to internships

**Future:**
- Approval workflow for new internships
- Compliance requirements per site
- Capacity management

### Shared Pages

#### `/profile` - User Profile
**MVP:**
- View/edit own profile information
- Change password (for mentor accounts)
- Basic settings

**Future:**
- Notification preferences
- Profile pictures
- Communication preferences
- For students: Portfolio view with all badges/competencies

## Technical Stack

- **Frontend:** React + Vite
- **Routing:** React Router
- **UI Components:** Material-UI (MUI)
- **Authentication:** Firebase Auth or Supabase (TBD)
- **Database:** Firebase Firestore or Supabase (TBD)
- **Hosting:** Render (free tier for MVP testing)

## Future Tech Additions
- **Transcription:** OpenAI Whisper API (~$0.006/minute)
- **AI Analysis:** Claude/GPT API (~$0.01-0.02 per analysis)
- **Cost Estimate:** ~$150-200/year for 50 students

## Development Notes

- Built mobile-first with responsive desktop views
- Role-based routing and component access
- Using React Context for authentication state
- Currently using dev-only login (pick a role) - will be replaced with real OAuth
- XQ Competencies: 5 Learner Outcomes → 37 Competencies → 3-6 Component Skills each

## Contact

Developer: Daniel (former teacher, substitute at City View)  
School Contact: Dennis Becker