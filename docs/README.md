# InternTracker Documentation

*Last Updated: December 12, 2024*

## 🚀 Start Here

**New to this project?** Read these in order:

1. **[CURRENT_STATE.md](./CURRENT_STATE.md)** ⭐ **Start here!**
   - Where we are in development
   - What's built vs what's planned
   - How we got here (the pivot story)
   - Current direction and priorities

2. **[DATA_MODEL.md](./DATA_MODEL.md)** 📊 **Essential reading**
   - Complete data structure specification
   - How schedules, check-ins, and attendance work together
   - Edge cases and business rules
   - Examples of every data type

3. **[questions-for-dennis-and-blenda.md](./questions-for-dennis-and-blenda.md)** ❓
   - Open questions for stakeholders
   - Decisions that affect implementation
   - Daniel's working notes and decisions

---

## 📚 Reference Documentation

### System Design
- **[NAVIGATION_REFACTOR.md](./NAVIGATION_REFACTOR.md)** - Instagram-style nav implementation
- **[MULTI_ROLE_IMPLEMENTATION.md](./MULTI_ROLE_IMPLEMENTATION.md)** - Multi-role auth system
- **[COMPLETE_ASSIGNMENT_SYSTEM.md](./COMPLETE_ASSIGNMENT_SYSTEM.md)** - Student-internship assignments
- **[COMPETENCIES_FEATURE.md](./COMPETENCIES_FEATURE.md)** - XQ Competencies display

### Historical / May Need Updates
- **[product-roadmap.md](./product-roadmap.md)** - Roadmap written during pivot (mixed old/new vision)
- **[ROADMAP.md](./ROADMAP.md)** - Development roadmap (partially outdated)
- **[attendance-system-design.md](./attendance-system-design.md)** - Attendance deep dive (pre-pivot)
- **[internship-tracking-system.md](./internship-tracking-system.md)** - Internship tracking (pre-pivot)
- **[database-schema.md](./database-schema.md)** - Database structure (verify against DATA_MODEL.md)

---

## 🎯 Quick Reference by Task

### Building New Features
1. Check **[CURRENT_STATE.md](./CURRENT_STATE.md)** - Is this already built?
2. Check **[DATA_MODEL.md](./DATA_MODEL.md)** - What data structures do I need?
3. Check **[questions doc](./questions-for-dennis-and-blenda.md)** - Any open questions on this?
4. Build and document!

### Understanding User Roles
- Read **[MULTI_ROLE_IMPLEMENTATION.md](./MULTI_ROLE_IMPLEMENTATION.md)**
- See **[CURRENT_STATE.md](./CURRENT_STATE.md)** → "What's Built" section

### Understanding Navigation
- Read **[NAVIGATION_REFACTOR.md](./NAVIGATION_REFACTOR.md)**
- Bottom nav for mobile, sidebar for desktop
- Different home pages per role

### Understanding Schedules & Attendance
- Read **[DATA_MODEL.md](./DATA_MODEL.md)** first (critical!)
- See examples in data model for common scenarios
- Check **[questions doc](./questions-for-dennis-and-blenda.md)** for edge cases

---

## 🗂️ Documentation Organization

### Current & Accurate
These docs reflect the current state of the project:
- ✅ CURRENT_STATE.md
- ✅ DATA_MODEL.md  
- ✅ NAVIGATION_REFACTOR.md
- ✅ MULTI_ROLE_IMPLEMENTATION.md
- ✅ COMPLETE_ASSIGNMENT_SYSTEM.md
- ✅ COMPETENCIES_FEATURE.md
- ✅ questions-for-dennis-and-blenda.md (being actively updated)

### Needs Review/Update
These docs may contain outdated info from before the attendance pivot:
- ⚠️ product-roadmap.md
- ⚠️ ROADMAP.md
- ⚠️ attendance-system-design.md
- ⚠️ internship-tracking-system.md
- ⚠️ database-schema.md

### Archived (Historical)
Event-specific and implementation docs moved to `/docs/archive/`:
- 📦 DEMO_*.md files (demo-related)
- 📦 ADMIN_*_IMPLEMENTATION.md files (historical implementation notes)
- 📦 Other completed implementation guides

---

## 🎓 Understanding the Project Evolution

InternTracker started as an **internship tracking and reflection system** (Week 1-1.5), then pivoted to become an **attendance and scheduling system** following stakeholder feedback (Week 2+).

**Why the pivot?**
- Dennis (director) needed attendance tools more urgently
- City View moving to self-scheduled remote days next semester
- Current paper/spreadsheet system wasn't sustainable
- Internship tracking is still important but became secondary

**Current Focus:**
- Flexible scheduling system (handles mixed class/Kirkwood/internship/remote)
- Two check-in systems (internship with geolocation vs class/remote without)
- Attendance review interface (teachers mark official status)
- Secretary tools (bulk operations, SIS export)

**Still Planned:**
- Reflections and competency tagging (V2)
- Social feed features (V2)
- Photo/video uploads (V2)

Read **[CURRENT_STATE.md](./CURRENT_STATE.md)** for the full story.

---

## ❓ Common Questions

**Q: What's actually built vs planned?**  
A: See **[CURRENT_STATE.md](./CURRENT_STATE.md)** → "Where We Are Now" section

**Q: How do check-ins and attendance work together?**  
A: See **[DATA_MODEL.md](./DATA_MODEL.md)** → "Check-Ins" and "Attendance Records" sections. Key: they're separate! Check-ins = student proof, Attendance = teacher marking.

**Q: Why are there so many docs about implementations that are done?**  
A: Those are historical. We'll archive them. Focus on CURRENT_STATE.md and DATA_MODEL.md.

**Q: Which docs should I update as I build?**  
A: Update CURRENT_STATE.md when status changes. Update DATA_MODEL.md if data structures change. Create new implementation docs for major features if helpful.

**Q: Where are the UI mockups/wireframes?**  
A: Not created yet. Next step after data model is finalized.

---

## 🔄 Document Update Protocol

**When building new features:**
1. Update CURRENT_STATE.md (move from "not built" to "built")
2. Update DATA_MODEL.md if data structures change
3. Create feature-specific doc if complex (like NAVIGATION_REFACTOR.md)
4. Update this index if you add new docs

**When getting stakeholder feedback:**
1. Update questions-for-dennis-and-blenda.md with answers
2. Update CURRENT_STATE.md if direction changes
3. Update DATA_MODEL.md if business rules change

**When pivoting direction:**
1. Update CURRENT_STATE.md prominently
2. Archive outdated docs
3. Create new docs as needed
4. Update this index

---

## 📝 Contributing

**Before writing code:**
- Read CURRENT_STATE.md and DATA_MODEL.md
- Check if the feature is planned or needs discussion
- Look for open questions in questions doc

**While writing code:**
- Follow existing patterns (see CURRENT_STATE.md → Code Structure)
- Document decisions in code comments
- Update docs if you learn something important

**After finishing:**
- Update CURRENT_STATE.md status
- Write tests (when test infrastructure exists)
- Consider creating a feature doc if complex

---

## 🎯 Project Goals

**V1 MVP (January 2025):**
- Attendance system that handles City View's unique schedule
- Flexible schedule builder (not just for City View)
- Two check-in systems (internship vs class/remote)
- Secretary tools for SIS export
- Teacher attendance review

**V2 (Spring 2025):**
- Reflections with competency tagging
- Social feed features
- Photo/video uploads
- Advanced analytics

**Long-term Vision:**
- Multi-school platform
- Help other alternative/project-based schools
- Replace expensive systems like ImBlaze

---

*Need help? Check CURRENT_STATE.md first, then DATA_MODEL.md. Still stuck? Look at the code structure in /src/ to see working examples.*
