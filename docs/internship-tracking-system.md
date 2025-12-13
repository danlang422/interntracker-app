# Internship Tracking System

*Generated: December 12, 2024*

## Overview

The internship tracking component handles students' off-site work experiences. Unlike regular attendance (which is point-in-time), internship tracking captures:
- Duration of time worked
- Location verification via geolocation
- Work activities and reflections
- Hours toward internship requirements

## Internship Clock-In/Out System

### Core Workflow

1. **Student Arrives at Internship**
   - Opens app
   - Clicks "Clock In"
   - System verifies geolocation matches internship site
   - Records arrival timestamp

2. **Student Works**
   - Can add notes/tasks during shift (optional)
   - Can take photos of work (if enabled)

3. **Student Leaves Internship**
   - Clicks "Clock Out"
   - System records departure timestamp
   - Calculates hours worked
   - Prompts for brief reflection (optional)

### Data Model

```javascript
// Internship Time Entry
{
  id: uuid,
  studentId: uuid,
  internshipId: uuid,
  clockInTime: timestamp,
  clockInLocation: {
    latitude: float,
    longitude: float,
    accuracy: float // in meters
  },
  clockOutTime: timestamp, // null if still clocked in
  clockOutLocation: {
    latitude: float,
    longitude: float,
    accuracy: float
  },
  hoursWorked: float, // calculated
  activities: text, // what they worked on
  reflection: text, // optional end-of-shift reflection
  photos: string[], // array of photo URLs
  status: "in_progress" | "completed" | "flagged",
  flaggedReason: text, // if location verification failed, etc.
  createdAt: timestamp,
  updatedAt: timestamp
}

// Internship Assignment (Master Record)
{
  id: uuid,
  studentId: uuid,
  mentorId: uuid,
  organizationName: string,
  siteName: string,
  address: text,
  expectedLocation: {
    latitude: float,
    longitude: float,
    radiusMeters: float // allowed variance
  },
  startDate: date,
  endDate: date,
  requiredHours: float,
  schedule: jsonb, // expected days/times
  status: "active" | "completed" | "inactive",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Geolocation Verification

### Location Matching Logic

```javascript
// Pseudocode for location verification
function verifyLocation(checkInLocation, expectedLocation) {
  const distance = calculateDistance(
    checkInLocation.latitude,
    checkInLocation.longitude,
    expectedLocation.latitude,
    expectedLocation.longitude
  )
  
  const allowedRadius = expectedLocation.radiusMeters
  
  if (distance <= allowedRadius) {
    return { verified: true, distance }
  } else if (distance <= allowedRadius * 2) {
    return { verified: "warning", distance, message: "Close but outside normal range" }
  } else {
    return { verified: false, distance, message: "Too far from expected location" }
  }
}
```

### Handling Location Issues

**Scenario 1: GPS Inaccuracy**
- Student is at correct location but GPS shows 200m away
- Allow check-in but flag for staff review
- Staff can approve/override

**Scenario 2: Legitimate Off-Site Work**
- Internship sometimes requires going to different locations
- Student can add note: "Working at different site today - [address]"
- Staff reviews and approves

**Scenario 3: Location Spoofing Concerns**
- System logs GPS accuracy and other metadata
- Patterns of suspiciously perfect locations trigger review
- Can require periodic re-verification during shift

## Hours Tracking

### Calculation

```javascript
function calculateHours(clockIn, clockOut) {
  const milliseconds = clockOut - clockIn
  const hours = milliseconds / (1000 * 60 * 60)
  
  // Round to nearest 0.25 hours (15 min increments)
  return Math.round(hours * 4) / 4
}
```

### Weekly/Total Hours Display

```javascript
// Student Dashboard shows:
{
  thisWeek: {
    hoursWorked: 12.5,
    shifts: 3,
    avgShiftLength: 4.17
  },
  thisMonth: {
    hoursWorked: 48.0,
    shifts: 11
  },
  total: {
    hoursWorked: 156.75,
    requiredHours: 200,
    percentComplete: 78,
    projectedCompletionDate: "2025-04-15"
  }
}
```

## Mentor Oversight

### What Mentors See

- Student's clock-in/out times
- Activities/reflections student logged
- Photos student uploaded
- Ability to verify/dispute hours
- Ability to add comments/feedback

### Mentor Actions

```javascript
// Mentor Review Record
{
  id: uuid,
  timeEntryId: uuid,
  mentorId: uuid,
  status: "verified" | "disputed" | "adjusted",
  adjustedHours: float, // if different from calculated
  feedback: text,
  createdAt: timestamp
}
```

**Workflow:**
1. Student completes shift and clocks out
2. Time entry appears in mentor's review queue
3. Mentor verifies hours and activities
4. If disputed, mentor adjusts and adds note
5. Student and advisor receive notification

## UI Components

### Student Clock-In Screen

```
┌─────────────────────────────────────┐
│  📍 City View Community School       │
│     Check in at internship          │
│                                     │
│  [🕐 Clock In]                      │
│                                     │
│  📊 This Week: 8.5 hours            │
│  📈 Total: 156.75 / 200 hours       │
│                                     │
│  Recent Shifts:                     │
│  • Mon 12/9: 4.5 hrs ✓             │
│  • Wed 12/11: 4.0 hrs ✓            │
└─────────────────────────────────────┘
```

### Clock-Out + Reflection Screen

```
┌─────────────────────────────────────┐
│  Clocked in: 8:30 AM                │
│  Duration: 4h 15m                   │
│                                     │
│  What did you work on today?        │
│  ┌─────────────────────────────┐   │
│  │ Helped customers, restocked │   │
│  │ shelves, learned inventory  │   │
│  │ system                      │   │
│  └─────────────────────────────┘   │
│                                     │
│  📷 Add photos (optional)           │
│  [+] [+] [+]                        │
│                                     │
│  [Clock Out]                        │
└─────────────────────────────────────┘
```

### Advisor Hours Overview

```
┌─────────────────────────────────────┐
│  Sarah Martinez - Internship Hours  │
│                                     │
│  Organization: Cedar Rapids Library │
│  Progress: 156.75 / 200 hrs (78%)  │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░              │
│                                     │
│  Recent Activity:                   │
│  Dec 11 • 4.0 hrs ✓ Verified       │
│  Dec 9  • 4.5 hrs ⚠ Flagged        │
│         → Location slightly off     │
│  Dec 6  • 3.75 hrs ✓ Verified      │
│                                     │
│  [View All Shifts] [Export Report] │
└─────────────────────────────────────┘
```

## Integration with Attendance System

### Key Question (Pending Answer from Dennis):
Does internship clock-in count as attendance for specific blocks?

**Option A: Separate Systems**
- Internship hours tracked independently
- Student still marks attendance for "Block 3: Internship" separately
- Two different records: attendance + hours worked

**Option B: Integrated**
- Clocking in at internship = attendance for associated blocks
- Hours worked automatically satisfy attendance requirement
- Single unified record

**Our Recommendation:** Option B (simpler for students)
- When student clocks in at internship, system:
  1. Records internship time entry
  2. Automatically marks attendance for relevant blocks
  3. Advisor sees both in unified view

## Reporting & Analytics

### Reports Needed

**For Students:**
- Hours worked this week/month/total
- Shifts completed
- Average shift length
- Projected completion date

**For Advisors:**
- All students' internship progress
- Students falling behind on hours
- Verification status (pending mentor review)
- Attendance correlation (are they showing up?)

**For Mentors:**
- Individual student's hours and activities
- Shifts pending verification
- Historical performance

**For Admin:**
- School-wide internship hours
- Program compliance (are students meeting requirements?)
- Mentor engagement metrics

## Edge Cases & Rules

1. **Forgot to Clock Out**
   - After 12 hours, system flags shift as incomplete
   - Student can edit end time (with note explaining)
   - Advisor must approve retroactive edits

2. **Multiple Internships**
   - Student can have >1 active internship
   - Each has separate hours tracking
   - Must select which internship when clocking in

3. **Location Permission Denied**
   - Student can't clock in without location services
   - Can submit manual time entry for staff approval
   - Requires explanation note

4. **Clock In/Out While Offline**
   - App stores timestamp locally
   - Syncs when connection restored
   - Uses device timestamp, flags for review if suspicious

5. **Internship Break/Suspension**
   - Can pause internship (temporary)
   - Can end early (with reason)
   - Hours remain in record but requirement adjusts

## Privacy & Safety Considerations

- **Location data:** Only used for verification, not tracking throughout shift
- **Photo uploads:** Student controls what they share
- **Mentor communication:** Messages kept professional, logged
- **Data retention:** Location data deleted after X months (TBD compliance requirement)

## Future Enhancements

- Push notification reminders: "Don't forget to clock out!"
- Mentor rating/feedback system
- Skill development tracking (link hours to competencies)
- Video check-ins for remote internships
- Integration with local employer database
- Automatic schedule creation based on internship hours

---

## Technical Notes

- Use device GPS for location, not IP-based (more accurate)
- Store location with timestamp to detect spoofing
- Consider battery drain from location services
- Implement offline mode for unreliable connections
- Use React Native Geolocation API (future mobile app)
