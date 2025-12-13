# Database Schema & Data Architecture

*Generated: December 12, 2024*

## Overview

This document outlines the database structure for InternTracker, designed to support:
- Flexible scheduling
- Multi-layer attendance tracking
- Internship time logging
- Audit trails and compliance
- Role-based access control

## Core Entities

### Users & Roles

```sql
-- Users table (all system users)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'student', 'advisor', 'mentor', 'admin', 'secretary'
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Student profiles (extends users)
CREATE TABLE students (
  id UUID PRIMARY KEY REFERENCES users(id),
  student_number VARCHAR(50),
  grade_level INTEGER,
  advisor_id UUID REFERENCES users(id),
  expected_graduation DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Mentor profiles (extends users)
CREATE TABLE mentors (
  id UUID PRIMARY KEY REFERENCES users(id),
  organization_name VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Schedule Management

```sql
-- School schedule templates
CREATE TABLE schedule_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL, -- 'Regular Day', 'Early Dismissal', etc.
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Blocks/periods within a schedule
CREATE TABLE schedule_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES schedule_templates(id),
  name VARCHAR(100) NOT NULL, -- 'Block 1', 'Advisory', etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  order_index INTEGER NOT NULL, -- for sorting
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Daily schedule (which template is used on a specific date)
CREATE TABLE daily_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE UNIQUE NOT NULL,
  template_id UUID REFERENCES schedule_templates(id),
  notes TEXT, -- 'Half day for conferences', etc.
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Student block assignments (where is each student each block)
CREATE TABLE student_block_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  block_id UUID REFERENCES schedule_blocks(id),
  location_type VARCHAR(50) NOT NULL, -- 'classroom', 'kirkwood', 'internship', 'remote', 'monitor'
  location_name VARCHAR(255), -- 'English 9', 'Math Lab', specific Kirkwood course, etc.
  instructor_id UUID REFERENCES users(id), -- who's responsible for attendance
  start_date DATE NOT NULL,
  end_date DATE, -- null if ongoing
  days_of_week INTEGER[], -- [1,2,3,4,5] for M-F, allows for MWF or T/Th schedules
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Attendance System

```sql
-- Layer 1: Student check-ins
CREATE TABLE student_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  block_id UUID REFERENCES schedule_blocks(id),
  date DATE NOT NULL,
  checked_in_at TIMESTAMP NOT NULL,
  location_type VARCHAR(50) NOT NULL, -- 'classroom', 'remote', 'kirkwood', 'other'
  note TEXT, -- required if remote
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'modified'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, block_id, date) -- prevent duplicate check-ins
);

-- Layer 2: Staff reviews
CREATE TABLE attendance_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checkin_id UUID REFERENCES student_checkins(id), -- can be null if preemptive
  student_id UUID REFERENCES students(id),
  block_id UUID REFERENCES schedule_blocks(id),
  date DATE NOT NULL,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP DEFAULT NOW(),
  attendance_status VARCHAR(50) NOT NULL, -- 'present', 'absent', 'tardy', 'excused', etc.
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Layer 3: Final attendance records
CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  block_id UUID REFERENCES schedule_blocks(id),
  date DATE NOT NULL,
  status VARCHAR(50) NOT NULL, -- 'present', 'absent', 'tardy', 'excused'
  last_modified_by UUID REFERENCES users(id),
  last_modified_at TIMESTAMP DEFAULT NOW(),
  audit_trail JSONB, -- full history of changes
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, block_id, date)
);
```

### Internship System

```sql
-- Internship assignments (master records)
CREATE TABLE internships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  mentor_id UUID REFERENCES mentors(id),
  organization_name VARCHAR(255) NOT NULL,
  site_name VARCHAR(255),
  address TEXT,
  expected_location JSONB, -- { lat, lng, radiusMeters }
  start_date DATE NOT NULL,
  end_date DATE,
  required_hours DECIMAL(5,2),
  schedule JSONB, -- expected days/times
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'paused', 'ended'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Internship time entries (clock in/out)
CREATE TABLE internship_time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  internship_id UUID REFERENCES internships(id),
  clock_in_time TIMESTAMP NOT NULL,
  clock_in_location JSONB, -- { lat, lng, accuracy }
  clock_out_time TIMESTAMP,
  clock_out_location JSONB,
  hours_worked DECIMAL(4,2), -- calculated
  activities TEXT,
  reflection TEXT,
  photos TEXT[], -- array of URLs/paths
  status VARCHAR(50) DEFAULT 'in_progress', -- 'in_progress', 'completed', 'flagged'
  flagged_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Mentor reviews of time entries
CREATE TABLE mentor_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  time_entry_id UUID REFERENCES internship_time_entries(id),
  mentor_id UUID REFERENCES mentors(id),
  status VARCHAR(50) NOT NULL, -- 'verified', 'disputed', 'adjusted'
  adjusted_hours DECIMAL(4,2), -- if different from calculated
  feedback TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Reflections & Media

```sql
-- Student reflections
CREATE TABLE reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  title VARCHAR(255),
  content TEXT NOT NULL,
  reflection_type VARCHAR(50), -- 'daily', 'weekly', 'project', 'internship'
  related_date DATE,
  is_public BOOLEAN DEFAULT false, -- visible on public feed?
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Photos attached to reflections
CREATE TABLE reflection_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reflection_id UUID REFERENCES reflections(id),
  photo_url TEXT NOT NULL,
  caption TEXT,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Competency tags on reflections (future)
CREATE TABLE reflection_competencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reflection_id UUID REFERENCES reflections(id),
  competency_id UUID, -- will reference competencies table
  self_assessed_level INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Competencies/Standards (Future)

```sql
-- Competency scales (progression descriptors)
CREATE TABLE competency_scales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  levels JSONB, -- [{order: 1, name: "Emerging", description: "..."}, ...]
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Competencies/standards (hierarchical)
CREATE TABLE competencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(100),
  description TEXT,
  set_id UUID, -- top-level framework (e.g., "XQ Competencies")
  parent_id UUID REFERENCES competencies(id), -- for nesting
  type VARCHAR(50) NOT NULL, -- 'set', 'category', 'competency'
  scale_id UUID REFERENCES competency_scales(id),
  grade_level INTEGER[], -- [9, 10, 11, 12] or null for all
  sub_skills JSONB, -- nested sub-skills with their own progressions
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Indexes for Performance

```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Schedule queries
CREATE INDEX idx_daily_schedules_date ON daily_schedules(date);
CREATE INDEX idx_student_block_assignments_student ON student_block_assignments(student_id);
CREATE INDEX idx_student_block_assignments_block ON student_block_assignments(block_id);

-- Attendance queries
CREATE INDEX idx_student_checkins_student_date ON student_checkins(student_id, date);
CREATE INDEX idx_student_checkins_block_date ON student_checkins(block_id, date);
CREATE INDEX idx_attendance_records_student_date ON attendance_records(student_id, date);
CREATE INDEX idx_attendance_records_date ON attendance_records(date);

-- Internship queries
CREATE INDEX idx_internships_student ON internships(student_id);
CREATE INDEX idx_internships_mentor ON internships(mentor_id);
CREATE INDEX idx_time_entries_student ON internship_time_entries(student_id);
CREATE INDEX idx_time_entries_internship ON internship_time_entries(internship_id);

-- Reflection queries
CREATE INDEX idx_reflections_student ON reflections(student_id);
CREATE INDEX idx_reflections_date ON reflections(related_date);
CREATE INDEX idx_reflections_public ON reflections(is_public) WHERE is_public = true;
```

## Key Relationships

```
users (role: student) → students → student_block_assignments
                                 → attendance_records
                                 → internships → internship_time_entries
                                 → reflections

users (role: advisor) → students (via advisor_id)
                     → attendance_reviews

users (role: mentor) → mentors → internships
                              → mentor_reviews

schedule_templates → schedule_blocks → student_block_assignments
                                    → attendance_records

daily_schedules → schedule_templates
```

## Data Integrity Rules

1. **Referential Integrity:** All foreign keys use CASCADE on delete for dependent data
2. **Unique Constraints:** Prevent duplicate check-ins, duplicate block assignments on same date
3. **Check Constraints:** 
   - Grade level between 9-12
   - Hours worked >= 0
   - Block start time < end time
4. **JSONB Validation:** Use triggers to validate structure of JSON fields
5. **Audit Trails:** Triggers to maintain audit_trail field on updates

## Sample Queries

### Get student's schedule for today
```sql
SELECT 
  sb.name as block_name,
  sb.start_time,
  sb.end_time,
  sba.location_type,
  sba.location_name,
  ac.status as attendance_status,
  sc.checked_in_at
FROM student_block_assignments sba
JOIN schedule_blocks sb ON sba.block_id = sb.id
JOIN daily_schedules ds ON ds.date = CURRENT_DATE
JOIN schedule_templates st ON ds.template_id = st.id AND sb.template_id = st.id
LEFT JOIN attendance_records ac ON ac.student_id = sba.student_id 
  AND ac.block_id = sb.id 
  AND ac.date = CURRENT_DATE
LEFT JOIN student_checkins sc ON sc.student_id = sba.student_id 
  AND sc.block_id = sb.id 
  AND sc.date = CURRENT_DATE
WHERE sba.student_id = $1
  AND CURRENT_DATE BETWEEN sba.start_date AND COALESCE(sba.end_date, '2099-12-31')
  AND EXTRACT(DOW FROM CURRENT_DATE) = ANY(sba.days_of_week)
ORDER BY sb.order_index;
```

### Get pending attendance reviews for a teacher
```sql
SELECT 
  s.first_name,
  s.last_name,
  sb.name as block_name,
  sc.checked_in_at,
  sc.location_type,
  sc.note
FROM student_checkins sc
JOIN students st ON sc.student_id = st.id
JOIN users s ON st.id = s.id
JOIN schedule_blocks sb ON sc.block_id = sb.id
WHERE sc.status = 'pending'
  AND EXISTS (
    SELECT 1 FROM student_block_assignments sba
    WHERE sba.student_id = sc.student_id
      AND sba.block_id = sc.block_id
      AND sba.instructor_id = $1
  )
ORDER BY sc.checked_in_at DESC;
```

### Calculate total internship hours
```sql
SELECT 
  i.organization_name,
  i.required_hours,
  COALESCE(SUM(ite.hours_worked), 0) as total_hours_worked,
  i.required_hours - COALESCE(SUM(ite.hours_worked), 0) as hours_remaining,
  ROUND((COALESCE(SUM(ite.hours_worked), 0) / i.required_hours * 100), 1) as percent_complete
FROM internships i
LEFT JOIN internship_time_entries ite ON i.id = ite.internship_id 
  AND ite.status = 'completed'
WHERE i.student_id = $1
  AND i.status = 'active'
GROUP BY i.id, i.organization_name, i.required_hours;
```

## Migration Strategy

1. **Phase 1:** Core auth + users + roles
2. **Phase 2:** Schedule system + block assignments
3. **Phase 3:** Attendance check-ins + reviews
4. **Phase 4:** Internship tracking
5. **Phase 5:** Reflections + media
6. **Phase 6:** Competencies (future)

## Backup & Recovery

- Daily automated backups
- Point-in-time recovery enabled
- Audit trail preservation critical (never delete)
- Test restore procedures quarterly

---

## Technical Notes

- Using PostgreSQL for JSONB support and robust features
- Supabase provides real-time subscriptions for live updates
- Consider partitioning attendance_records by date for performance
- Use database triggers for maintaining audit trails
- Row-level security (RLS) in Supabase for access control
