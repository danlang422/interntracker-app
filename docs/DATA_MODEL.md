# InternTracker Data Model

*Last Updated: December 12, 2024*

## Overview

This document defines the complete data structure for InternTracker's attendance and scheduling system. The system is designed to be **flexible and configurable** - it provides tools for schools to build their own schedules, block types, and workflows rather than prescribing a specific structure.

## Core Principles

1. **Tools, Not Solutions** - We build schedule builders and block type creators, not "City View's schedule"
2. **Staff Authority** - Teachers and administrators have final say on attendance records
3. **Flexible Rollup** - Student schedules (actual activities) can differ from reporting blocks (what SIS requires)
4. **Multi-School Ready** - All data includes organizationId for future multi-tenancy

---

## Data Structures

### 1. Block Type Definitions

**Purpose:** Defines different types of schedule segments and their check-in behavior.

**Examples:** "City View Class", "Kirkwood Class", "Remote Work", "Internship"

```javascript
BlockType = {
  id: "bt_kirkwood_class",
  organizationId: "org_cityview",
  
  // Display
  name: "Kirkwood Class",
  description: "Community college dual enrollment class",
  icon: "📚",              // Emoji for visual identification
  color: "#3B82F6",        // Hex color for UI theming
  
  // Check-in behavior
  requiresCheckIn: true,
  checkInInterface: "modal" | "tap",  // "tap" = instant, "modal" = opens form
  
  // What to ask during check-in
  promptSettings: {
    askLocation: false,          // "Where are you working?" (for remote)
    askPlan: false,              // "What will you do today?"
    askProgress: false,          // "How's it going?"
    customPrompt: null           // Optional custom question text
  },
  
  // Geolocation
  requiresGeolocation: false,
  geofenceRadius: null,          // In meters (e.g., 100, 500)
  
  // Check-out
  requiresCheckOut: false,       // True for internships to track hours
  
  // Timing
  lateThresholdMinutes: 15,      // Check-in after this = flagged as late
  
  // Metadata
  createdBy: "admin_id",
  createdAt: "2024-12-12T10:00:00Z",
  modifiedBy: "admin_id",
  modifiedAt: "2024-12-12T10:00:00Z",
  isActive: true
}
```

**Common Block Types:**

```javascript
// In-person class (simple tap check-in)
{
  name: "City View Class",
  checkInInterface: "tap",
  promptSettings: { askLocation: false, askPlan: false, askProgress: false },
  requiresGeolocation: false,
  requiresCheckOut: false
}

// Remote work - first check-in (needs plan)
{
  name: "Remote Work (Morning)",
  checkInInterface: "modal",
  promptSettings: { askLocation: true, askPlan: true, askProgress: false },
  requiresGeolocation: false,
  requiresCheckOut: false
}

// Remote work - subsequent check-in (needs progress)
{
  name: "Remote Work (Progress)",
  checkInInterface: "modal",
  promptSettings: { askLocation: false, askPlan: false, askProgress: true },
  requiresGeolocation: false,
  requiresCheckOut: false
}

// Internship (geolocation required, tracks hours)
{
  name: "Internship",
  checkInInterface: "modal",
  promptSettings: { askLocation: false, askPlan: true, askProgress: false },
  requiresGeolocation: true,
  geofenceRadius: 100,
  requiresCheckOut: true
}

// College class (simple check-in)
{
  name: "Kirkwood Class",
  checkInInterface: "modal",
  promptSettings: { askLocation: false, askPlan: false, askProgress: false },
  requiresGeolocation: false,
  requiresCheckOut: false
}

// Study hall / monitor (simple check-in)
{
  name: "Monitor Group",
  checkInInterface: "tap",
  promptSettings: { askLocation: false, askPlan: false, askProgress: false },
  requiresGeolocation: false,
  requiresCheckOut: false
}
```

---

### 2. Schedule Templates

**Purpose:** Defines what a "day" looks like in terms of reporting blocks for the SIS.

**Examples:** "Regular Day", "Early Dismissal", "Late Start", "A/B Day Schedule"

```javascript
ScheduleTemplate = {
  id: "st_regular",
  organizationId: "org_cityview",
  
  name: "Regular Day",
  description: "Standard 5-block schedule (Mon-Fri)",
  
  // SIS reporting blocks for this template
  reportingBlocks: [
    {
      blockNumber: 1,
      name: "Block 1",
      startTime: "08:00",
      endTime: "09:30"
    },
    {
      blockNumber: 2,
      name: "Block 2",
      startTime: "09:30",
      endTime: "11:00"
    },
    {
      blockNumber: 3,
      name: "Block 3",
      startTime: "11:00",
      endTime: "12:30"
    },
    {
      blockNumber: 4,
      name: "Block 4",
      startTime: "12:30",
      endTime: "14:00"
    },
    {
      blockNumber: 5,
      name: "Block 5",
      startTime: "14:00",
      endTime: "15:30"
    }
  ],
  
  // Settings
  isDefault: true,           // Use this template if no specific template set
  
  // Metadata
  createdBy: "admin_id",
  createdAt: "2024-12-12T10:00:00Z",
  isActive: true
}
```

**Other Template Examples:**

```javascript
// Early dismissal
{
  name: "Early Dismissal",
  reportingBlocks: [
    { blockNumber: 1, startTime: "08:00", endTime: "09:00" },
    { blockNumber: 2, startTime: "09:00", endTime: "10:00" },
    { blockNumber: 3, startTime: "10:00", endTime: "11:00" }
  ]
}

// A/B Day (alternating schedule)
{
  name: "A Day",
  reportingBlocks: [
    { blockNumber: 1, name: "Period 1", startTime: "08:00", endTime: "09:30" },
    { blockNumber: 2, name: "Period 3", startTime: "09:30", endTime: "11:00" },
    // ... odd periods only
  ]
}

{
  name: "B Day", 
  reportingBlocks: [
    { blockNumber: 1, name: "Period 2", startTime: "08:00", endTime: "09:30" },
    { blockNumber: 2, name: "Period 4", startTime: "09:30", endTime: "11:00" },
    // ... even periods only
  ]
}
```

---

### 3. Daily Schedule

**Purpose:** Which template applies on a specific date.

```javascript
DailySchedule = {
  id: "ds_20241212",
  date: "2024-12-12",
  organizationId: "org_cityview",
  
  templateId: "st_regular",      // Which template to use
  
  // Optional: Override specific blocks for this date
  customBlocks: null,            // null = use template blocks
  
  // Optional notes
  notes: "Regular schedule - no changes",
  
  // Who set this
  setBy: "admin_id",
  setAt: "2024-12-10T14:30:00Z"
}
```

**Special Cases:**

```javascript
// No school day
{
  date: "2024-12-25",
  templateId: null,              // No template = no school
  notes: "Winter Break"
}

// Custom schedule (overrides template)
{
  date: "2024-12-15",
  templateId: "st_regular",      // Base template
  customBlocks: [                // Override for assembly
    { blockNumber: 1, startTime: "08:00", endTime: "09:00" },
    { blockNumber: 2, name: "Assembly", startTime: "09:00", endTime: "10:30" },
    { blockNumber: 3, startTime: "10:30", endTime: "12:00" }
  ],
  notes: "Winter assembly - modified schedule"
}
```

---

### 4. Student Schedule Segments

**Purpose:** What an individual student actually does during the day (their real schedule).

**Key Concept:** A student might have 6-8 different activities in a day, but the SIS only needs 5 reporting blocks. This is the student's ACTUAL schedule - the rollup to reporting blocks happens separately.

```javascript
StudentScheduleSegment = {
  id: "seg_emma_kirkwood_english",
  studentId: "student_emma",
  organizationId: "org_cityview",
  
  // When this segment applies
  recurring: {
    daysOfWeek: ["Monday", "Wednesday", "Friday"],  // Which days
    startDate: "2024-09-01",                        // Semester start
    endDate: "2024-12-20"                           // Semester end
  },
  // OR for one-time segments:
  specificDate: null,  // "2024-12-15" for a one-off
  
  // Time
  startTime: "09:00",
  endTime: "10:15",
  
  // What is it?
  name: "English Composition",
  blockTypeId: "bt_kirkwood_class",     // References block type
  location: "KHEC Building B - Room 205",
  
  // SIS Rollup - Which reporting block this counts toward
  mapsToReportingBlock: 1,              // This activity → Block 1 for SIS
  
  // Ownership
  teacherId: "teacher_johnson",         // Who reviews attendance for this
  
  // Who created it
  createdBy: "admin" | "student",       // Staff or student self-scheduled
  
  // Metadata
  isActive: true,
  notes: "Dual enrollment - college credit"
}
```

**Real-World Examples:**

```javascript
// Emma's Monday schedule (6 activities → 5 reporting blocks)

// Activity 1: City View Bio (8:00-9:00) → Block 1
{
  name: "Biology Lab",
  startTime: "08:00",
  endTime: "09:00",
  blockTypeId: "bt_cityview_class",
  mapsToReportingBlock: 1
}

// Activity 2: Kirkwood English (9:00-10:15) → Block 1 (also!)
{
  name: "English Composition", 
  startTime: "09:00",
  endTime: "10:15",
  blockTypeId: "bt_kirkwood_class",
  mapsToReportingBlock: 1            // Two activities in one reporting block!
}

// Activity 3: Kirkwood Math (10:30-11:45) → Block 2
{
  name: "College Algebra",
  startTime: "10:30", 
  endTime: "11:45",
  blockTypeId: "bt_kirkwood_class",
  mapsToReportingBlock: 2
}

// Activity 4: Lunch (11:45-12:30) → No block
{
  name: "Lunch",
  startTime: "11:45",
  endTime: "12:30",
  blockTypeId: "bt_lunch",           // Doesn't require check-in
  mapsToReportingBlock: null         // Doesn't map to reporting
}

// Activity 5: Remote Work (12:30-14:00) → Block 4
{
  name: "Independent Study Time",
  startTime: "12:30",
  endTime: "14:00", 
  blockTypeId: "bt_remote_work",
  mapsToReportingBlock: 4
}

// Activity 6: Library Internship (14:00-15:30) → Block 5
{
  name: "Cedar Rapids Library",
  startTime: "14:00",
  endTime: "15:30",
  blockTypeId: "bt_internship",
  mapsToReportingBlock: 5
}
```

---

### 5. Check-Ins

**Purpose:** Student's proof of engagement - timestamps and notes showing they engaged with a segment.

**Important:** Check-ins are separate from attendance records. A student can check in but still be marked absent if they leave early, or not check in but be marked present by staff.

```javascript
CheckIn = {
  id: "ci_emma_kirkwood_1",
  studentId: "student_emma",
  organizationId: "org_cityview",
  
  // What they checked into
  scheduleSegmentId: "seg_emma_kirkwood_english",  // Usually references a segment
  blockTypeId: "bt_kirkwood_class",                 // Type determines behavior
  
  // Exception: Ad-hoc internship check-ins
  // scheduleSegmentId: null,  // No scheduled segment
  // internshipId: "int_library",  // But they went to their internship site
  
  // When
  checkInTime: "2024-12-12T09:05:00Z",
  checkOutTime: null,                    // Only for block types with requiresCheckOut
  
  // Location (if required by block type)
  location: {
    name: "KHEC Building B",
    coords: { 
      lat: 41.9779, 
      lng: -91.6656 
    } | null  // null if geolocation not required
  },
  
  // Student responses (based on block type prompt settings)
  responses: {
    location: "coffee_shop" | null,           // If askLocation = true
    plan: "Finishing essay on Gatsby" | null, // If askPlan = true
    progress: "Made progress on intro" | null, // If askProgress = true
    custom: "Answer to custom question" | null // If customPrompt exists
  },
  
  // Status (for internships requiring approval)
  status: "pending" | "approved" | "flagged",
  approvedBy: "mentor_id" | null,
  approvedAt: "2024-12-12T15:30:00Z" | null,
  
  // Automatic flags
  isLate: true,                              // Checked in after segment start + threshold
  minutesLate: 5,                            // How late (relative to segment start)
  isVeryLate: false,                         // If > some high threshold (e.g., 30+ min)
  
  // Metadata
  createdAt: "2024-12-12T09:05:00Z"
}
```

**Check-In Examples:**

```javascript
// Simple class check-in (just a tap)
{
  checkInTime: "2024-12-12T08:02:00Z",
  blockTypeId: "bt_cityview_class",
  location: { name: "Room 204", coords: null },
  responses: {},  // No prompts for this type
  isLate: false
}

// Remote work check-in (with plan and location)
{
  checkInTime: "2024-12-12T12:31:00Z",
  blockTypeId: "bt_remote_work_morning",
  location: { name: "Student home", coords: null },
  responses: {
    location: "home",
    plan: "Working on my English essay and studying for bio quiz"
  },
  isLate: true,
  minutesLate: 1
}

// Internship check-in (with geolocation and plan)
{
  checkInTime: "2024-12-12T14:02:00Z",
  blockTypeId: "bt_internship",
  location: {
    name: "Cedar Rapids Library",
    coords: { lat: 41.9779, lng: -91.6656 }
  },
  responses: {
    plan: "Helping with children's reading program and shelving books"
  },
  status: "pending",
  isLate: false
}

// Internship check-out (completing the shift)
{
  // Same check-in record, updated:
  checkOutTime: "2024-12-12T15:28:00Z",
  responses: {
    plan: "Helping with children's reading program and shelving books",
    progress: "Great session! Kids loved the new book series."
  },
  status: "approved",
  approvedBy: "mentor_sarah"
}
```

---

### 6. Attendance Records

**Purpose:** Official attendance status for SIS reporting - what teachers/staff mark.

**Key Concept:** This is SEPARATE from check-ins. Teachers review check-in data but make independent attendance decisions.

```javascript
AttendanceRecord = {
  id: "ar_emma_block1_1212",
  studentId: "student_emma",
  organizationId: "org_cityview",
  
  date: "2024-12-12",
  reportingBlock: 1,                 // Which SIS reporting block
  
  // Official status (teacher's mark)
  status: "present" | "absent" | "tardy" | "excused",
  markedBy: "teacher_johnson",
  markedAt: "2024-12-12T09:20:00Z",
  note: "Checked into both Bio and Kirkwood on time",
  
  // Reference to related check-ins
  checkInIds: [
    "ci_emma_bio_1",           // Bio class 8:02 AM
    "ci_emma_kirkwood_1"       // Kirkwood class 9:05 AM
  ],
  
  // Audit trail (tracks all changes)
  history: [
    {
      status: "present",
      markedBy: "teacher_johnson",
      markedAt: "2024-12-12T09:20:00Z",
      note: "Initial marking"
    }
    // If status changes, new entry added here
  ]
}
```

**Attendance Record Examples:**

```javascript
// Student checked in on time, marked present
{
  reportingBlock: 1,
  status: "present",
  checkInIds: ["ci_emma_bio_1"],
  note: "On time, engaged in lab"
}

// Student didn't check in, but teacher marked present (they were there)
{
  reportingBlock: 2,
  status: "present",
  checkInIds: [],  // No check-in
  note: "In class - forgot to check in, marked present manually"
}

// Student checked in late, marked tardy
{
  reportingBlock: 3,
  status: "tardy",
  checkInIds: ["ci_emma_late_1"],
  note: "Arrived 10 minutes late"
}

// Parent called in sick, secretary marked excused (no check-in)
{
  reportingBlock: 4,
  status: "excused",
  checkInIds: [],
  note: "Parent called - illness",
  markedBy: "secretary_blenda",
  history: [
    {
      status: "absent",
      markedBy: "teacher_johnson",
      markedAt: "2024-12-12T13:00:00Z",
      note: "No check-in"
    },
    {
      status: "excused",
      markedBy: "secretary_blenda", 
      markedAt: "2024-12-12T14:30:00Z",
      note: "Parent called - illness"
    }
  ]
}

// Student checked in but left early - marked absent
{
  reportingBlock: 5,
  status: "absent",
  checkInIds: ["ci_emma_internship_1"],
  note: "Checked in but left after 15 minutes - counted as absent",
  history: [
    {
      status: "present",
      markedBy: "teacher_johnson",
      markedAt: "2024-12-12T14:05:00Z",
      note: "Checked in to internship"
    },
    {
      status: "absent",
      markedBy: "teacher_johnson",
      markedAt: "2024-12-12T14:45:00Z",
      note: "Left early - changed to absent"
    }
  ]
}
```

---

## Data Relationships

### The Complete Flow

```
Block Types (admin creates)
    ↓
Student Schedule Segments (references block types)
    ↓
Daily Schedule (which reporting blocks exist today)
    ↓
Check-Ins (student engages with segments)
    ↓
Attendance Records (staff marks official status for reporting blocks)
    ↓
SIS Export (CSV for Infinite Campus / other SIS)
```

### Rollup Logic: Segments → Reporting Blocks

**Scenario:** Emma has TWO schedule segments on Monday morning:

```javascript
Segment A: Bio Lab (8:00-9:00) → mapsToReportingBlock: 1
Segment B: Kirkwood English (9:00-10:15) → mapsToReportingBlock: 1
```

Both segments map to **Reporting Block 1 (8:00-9:30)**.

**Check-Ins:**
- Emma checks into Bio at 8:02 AM ✓
- Emma checks into Kirkwood at 9:05 AM ✓

**Attendance Record:**
- Teacher sees BOTH check-ins
- Marks **Block 1: Present**
- `checkInIds: ["ci_bio_1", "ci_kirkwood_1"]`

**Edge Case: Partial Attendance**

What if Emma checked into Bio but NOT Kirkwood?
- Emma checks into Bio at 8:02 AM ✓
- Emma does NOT check into Kirkwood ❌

**Teacher Decision:**
- Option 1: Mark "Present" (she was there for part of Block 1)
- Option 2: Mark "Absent" (missed significant portion)
- Option 3: Mark "Tardy" (arrived partway through)

**The system provides the data, the teacher makes the call based on school policy.**

---

## Edge Cases & Business Rules

### 1. Late Check-Ins

**Definition:** Check-in occurs after `segment.startTime + blockType.lateThresholdMinutes`

**Behavior:**
- Check-in is recorded with `isLate: true` and `minutesLate: X`
- Teacher sees visual warning (e.g., 🚨 "Checked in 15 min late")
- Teacher decides if this counts as tardy, present, or absent
- System does NOT auto-mark attendance status

**Very Late Check-Ins:**

If check-in is EXTREMELY late (e.g., checking in for Block 1 during Block 3):
- Still recorded as check-in
- Flagged with `isVeryLate: true`
- Prominent visual warning for staff
- Likely doesn't affect attendance if already marked

### 2. Ad-Hoc Internship Check-Ins

**Scenario:** Student goes to internship on an unscheduled day.

**Behavior:**
- Student can check in even without a scheduled segment
- `scheduleSegmentId: null`
- `internshipId: "int_library"` (still needs to know WHERE)
- Check-in recorded for mentor to see
- Does NOT create attendance record (no scheduled block to map to)

### 3. Missing Schedule Segments

**Scenario:** Student should be somewhere but has no segment scheduled.

**Options:**
1. **Don't allow check-in** - Students can only check into scheduled segments
2. **Allow ad-hoc check-in** - Create temporary segment on-the-fly
3. **Staff can create retroactively** - Add segment later and associate check-in

**Decision needed from Dennis/Blenda.**

### 4. Multiple Segments → One Reporting Block

**Already covered above, but key points:**
- Multiple segments CAN map to same reporting block
- One attendance record per reporting block (even with multiple check-ins)
- Teacher sees ALL check-ins when making decision
- Partial attendance (some segments but not all) = teacher judgment call

### 5. Schedule Changes Mid-Semester

**Scenario:** Student switches from Kirkwood Math to City View Math in October.

**Behavior:**
- Old segment: Set `endDate: "2024-10-15"`, `isActive: false`
- New segment: Create with `startDate: "2024-10-16"`, `isActive: true`
- Check-ins reference specific segment (preserves history)
- Attendance records continue normally

### 6. Geolocation Accuracy

**For internships requiring geolocation:**
- Block type sets `geofenceRadius` (e.g., 100 meters)
- Check-in compares student location to internship location
- Within radius: ✓ Accepted
- Outside radius: ⚠️ Flagged for review (but still recorded)
- Mentor can approve flagged check-ins

**GPS Issues:**
- Indoor GPS can be unreliable (±10-50 meters)
- Set reasonable radius (100-500m depending on venue)
- Allow mentor override for legitimate check-ins
- Don't block check-in completely if GPS fails - flag instead

---

## Migration Notes

### Adapting Existing Code

**Current State:**
- CheckInContext has basic check-in logic
- Student schedule is loosely defined
- No concept of block types or reporting blocks

**Migration Path:**

1. **Create Admin Tools First**
   - Build Block Type Builder
   - Build Schedule Template Builder
   - Create initial block types for City View

2. **Refactor Contexts**
   - Update CheckInContext to use block types
   - Create ScheduleContext for segment management
   - Create AttendanceContext for attendance records

3. **Update Student UI**
   - Refactor CheckIn page to show agenda
   - Different check-in interfaces based on block type
   - Pull schedule from ScheduleContext

4. **Update Teacher UI**
   - Attendance review by reporting block
   - Show multiple check-ins per block
   - Independent status marking

5. **Build Secretary Dashboard**
   - Bulk operations
   - SIS export
   - Override capabilities

---

## Open Questions (Need Dennis/Blenda Input)

1. **Kirkwood Attendance:** Do Kirkwood instructors take attendance? If yes, how does it get to Blenda?

2. **Late Check-In Cutoff:** Should we prevent check-ins after X minutes, or just flag them?

3. **Absence Threshold:** How many minutes absent from a segment = absent from the reporting block?

4. **Ad-Hoc Check-Ins:** Can students check in to things not on their schedule? (Besides internships)

5. **Rollup Edge Cases:** If student has 2 segments in Block 1, checks into one but not the other - is that present, tardy, or absent?

6. **Schedule Self-Service:** Which parts of their schedule can students edit themselves? Just "soft" blocks (remote work time) or everything?

---

## Future Enhancements

### V2 Features (Not in Initial Build)

- **Auto-generated schedules** from SIS import
- **Pattern detection** (e.g., "always late to Block 1 on Mondays")
- **Parent portal** to view student check-ins
- **Push notifications** for missed check-ins
- **Competency tagging** on reflections
- **Photo uploads** on check-ins/logs
- **Social feed** of student work

### Multi-School Features

- **Organization management** (add/remove schools)
- **Per-org billing** and feature flags
- **Cross-org reporting** (district level)
- **Template sharing** (block types across schools)

---

## Summary

This data model provides:

✅ **Flexibility** - Schools define their own schedules and block types  
✅ **Accuracy** - Separate check-ins (proof) from attendance (official record)  
✅ **Rollup** - Student schedules can differ from reporting requirements  
✅ **Authority** - Staff always have final say on attendance  
✅ **Audit Trail** - Full history of changes and who made them  
✅ **Scalability** - Ready for multiple schools, different SIS systems  

The system is designed to handle City View's complex scheduling needs while being adaptable to other non-traditional schools with similar challenges.

---

*This document will be updated as we refine requirements and get answers to open questions.*
