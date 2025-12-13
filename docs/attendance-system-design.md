# Attendance System Design

*Generated: December 12, 2024*

## Overview

InternTracker's attendance system is designed for City View's unique educational model, which combines:
- Traditional classroom attendance
- Kirkwood Community College classes
- Off-site internships
- Remote work days
- Flexible "monitor" periods

The system enables students to self-report attendance while giving staff oversight and correction capabilities.

## Core Concepts

### Two Different Check-In Systems

#### 1. Regular Attendance Check-Ins (Self-Closing)
- Student marks themselves present for a block/period
- Single action - no "check-out" required
- Creates a timestamped attendance record
- Staff reviews and approves/modifies
- Used for: Classroom, Kirkwood classes, remote work

#### 2. Internship Clock-In/Out (Paired Events)
- Student clocks in upon arrival (requires geolocation)
- Student clocks out upon departure
- Creates timesheet entry with duration
- Used for: Off-site internships only

**Key Difference:** Regular check-ins are point-in-time attestations ("I'm here for Block 2"), while internship check-ins track duration for hours worked.

## Three-Layer Attendance Architecture

### Layer 1: Student Check-In (Raw Data)
The initial check-in action by the student.

```javascript
{
  id: uuid,
  studentId: uuid,
  blockId: uuid,
  date: date,
  checkedInAt: timestamp,
  locationType: "classroom" | "remote" | "kirkwood" | "other",
  note: text, // Required if remote, optional otherwise
  status: "pending" | "approved" | "modified",
  createdAt: timestamp
}
```

**States:**
- `pending` - Waiting for staff review
- `approved` - Staff confirmed the check-in
- `modified` - Staff overrode the check-in (see Layer 2)

### Layer 2: Staff Review/Override
Staff action on the check-in record.

```javascript
{
  id: uuid,
  checkInId: uuid, // References Layer 1
  reviewedBy: uuid,
  reviewedAt: timestamp,
  attendanceStatus: "present" | "absent" | "tardy" | "excused" | "other",
  notes: text, // Why it was changed, if modified
  createdAt: timestamp
}
```

**Staff Actions:**
- **Approve:** Accept the check-in as-is → Mark present
- **Override:** Change the attendance status (e.g., late check-in → mark tardy or absent)
- **Preemptive Mark:** Create attendance record without student check-in

### Layer 3: Final Attendance Record
The official attendance record (what goes to Infinite Campus).

```javascript
{
  id: uuid,
  studentId: uuid,
  date: date,
  blockId: uuid,
  status: "present" | "absent" | "tardy" | "excused" | "other",
  lastModifiedBy: uuid,
  lastModifiedAt: timestamp,
  auditTrail: jsonb, // Full history of changes
  createdAt: timestamp
}
```

**Audit Trail Structure:**
```javascript
[
  {
    timestamp: "2024-12-12T08:15:00Z",
    action: "student_checkin",
    userId: "student-uuid",
    details: { locationType: "classroom" }
  },
  {
    timestamp: "2024-12-12T08:45:00Z",
    action: "staff_override",
    userId: "teacher-uuid",
    details: { 
      from: "present", 
      to: "tardy", 
      reason: "Checked in 30 min late" 
    }
  }
]
```

## Staff Workflow Examples

### Scenario 1: Normal Check-In
1. Student checks in at 9:28am for Block 2 (starts 9:30am)
2. System creates Layer 1 record (status: pending)
3. Staff sees pending check-in
4. Staff clicks "Approve"
5. System creates Layer 2 review (status: present)
6. System creates/updates Layer 3 final record (status: present)

### Scenario 2: Late Check-In Override
1. Student checks in at 10:30am for Block 2 (started 9:30am - 1 hour late)
2. System creates Layer 1 record, flags as late
3. Staff sees late check-in warning
4. Staff chooses "Mark Absent" (too late to count)
5. System creates Layer 2 review (status: absent, notes: "Checked in 1 hour late")
6. Layer 1 record preserved (audit trail) but Layer 3 = absent
7. Student can still see their check-in was recorded, just marked absent

### Scenario 3: Preemptive Marking
1. Teacher sees student in class but student forgot to check in
2. Staff clicks "Mark Present" directly
3. System creates Layer 2 review without Layer 1 check-in
4. System creates Layer 3 final record (status: present)
5. Audit trail notes: "Staff marked present without student check-in"

### Scenario 4: Bulk Absence (Student Sick)
1. Parent calls secretary - student sick all day
2. Secretary selects student, date, and "Mark Excused - All Blocks"
3. System creates Layer 3 records for all blocks (status: excused)
4. Audit trail notes: "Bulk excused by secretary - reason: illness"
5. Student check-ins disabled for that day (UI shows "Excused - No check-in needed")

## Remote Work Check-Ins

For students working remotely, check-ins include progress notes:

```javascript
{
  // ... standard check-in fields ...
  locationType: "remote",
  note: "Working on chapters 5-6 of English essay. Will have draft ready by end of period.",
  remoteWorkType: "schoolwork" | "internship_remote" | "college_class",
}
```

**Display for Staff:**
Remote check-ins show the progress note prominently so staff can monitor what students are working on.

## Notification System (Future)

### When to Notify Staff:
- Student hasn't checked in X minutes after block starts (threshold TBD)
- Student checks in very late (>30 min? TBD)
- Student marks themselves remote without prior approval (if applicable)

### Notification Preferences:
- Per-staff notification settings (push, email, in-app)
- Escalation rules (notify advisor → notify attendance coordinator)
- Digest options (every 15 min vs. real-time)

## UI Components Needed

### Student Views:
1. **Check-In Dashboard** - "Where are you today?" with quick check-in buttons
2. **Schedule View** - Today's blocks with check-in status
3. **Check-In Form** - Location selection + optional note
4. **Check-In History** - Past check-ins with staff approval status

### Staff Views:
1. **Attendance Dashboard** - Real-time overview of who's checked in
2. **Block Attendance List** - All students for a specific block
3. **Student Attendance Detail** - Individual student's attendance history
4. **Bulk Actions Panel** - Mark multiple students/blocks at once
5. **Pending Review Queue** - Check-ins waiting for staff action

### Admin/Secretary Views:
1. **Daily Attendance Report** - All blocks, all students
2. **Absence Management** - Handle calls from parents
3. **Attendance Analytics** - Patterns, trends, chronic issues
4. **Infinite Campus Export** - Generate attendance data for import

## Data Integrity Rules

1. **No Duplicate Check-Ins:** Student can only check in once per block per day
2. **Immutable History:** Layer 1 records never deleted, only status changed
3. **Required Audit Trail:** Every change to attendance must be logged
4. **Staff Override Authority:** Only staff roles can modify attendance records
5. **Time-Based Validation:** Check-ins must be within reasonable window of block time

## Future Enhancements

- Automatic tardiness calculation based on check-in time
- Parent portal to view attendance
- Integration with Infinite Campus API (if available)
- Predictive alerts for students with chronic attendance issues
- Attendance patterns visible to advisors (helps with intervention)

---

## Technical Notes

- Attendance records are point-in-time snapshots (no updates, only new records)
- Use database triggers to maintain audit trail integrity
- Consider read replicas for reporting (don't query production DB for analytics)
- Cache frequently accessed data (today's schedule, student block assignments)
