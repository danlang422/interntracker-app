# InternTracker

A flexible attendance and scheduling system designed for City View Community High School's unique educational model - blending traditional classes, community college courses, off-site internships, and remote learning.

## 🎯 Project Overview

**Target School:** City View Community High School, Cedar Rapids, Iowa  
**Problem:** Traditional SIS systems can't handle flexible, non-traditional schedules  
**Solution:** Custom attendance system with flexible schedule building tools  
**Timeline:** V1 MVP targeting January 2025 launch

## 📚 Documentation

**Start Here:**
- **[docs/CURRENT_STATE.md](./docs/CURRENT_STATE.md)** - Project status, what's built vs planned, the pivot story
- **[docs/DATA_MODEL.md](./docs/DATA_MODEL.md)** - Complete data structure specification
- **[docs/README.md](./docs/README.md)** - Full documentation index

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd interntrackerv1

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app.

### Login (Development)

The app currently uses a dev-only login system where you can select roles to test different user experiences:

- **Student** - See agenda view, check in/out, manage logs
- **Advisor/Teacher** - Review attendance, monitor students
- **Mentor** - Approve internship hours, provide feedback
- **Secretary** - Bulk attendance operations, SIS export
- **Admin** - Manage students, internships, schedules, system settings

## 🏗️ Current State

### ✅ What's Working
- Multi-role authentication with role switching
- Instagram-style responsive navigation
- Admin tools (students, internships, assignments, competencies)
- Basic check-in and logs features

### 🚧 In Development
- Block type builder (define check-in requirements)
- Schedule template builder (SIS reporting blocks)
- Student schedule builder (individual schedules)
- Attendance review interface (teacher marking)
- Secretary dashboard (bulk operations, export)

See [docs/CURRENT_STATE.md](./docs/CURRENT_STATE.md) for detailed status.

## 🎓 Key Concepts

### Two Check-In Systems
1. **Internship Check-Ins** - Geolocation required, clock in/out, track hours
2. **Class/Remote Check-Ins** - No geolocation, different prompts based on context

### Check-Ins ≠ Attendance
- **Check-Ins** = Student proof of engagement (timestamps, notes, location)
- **Attendance Records** = Official status for SIS (what staff marks)
- Teachers review check-ins but make independent attendance decisions

### Flexible Schedule Rollup
- Student's real schedule might have 6-8 activities per day
- SIS only needs 5 reporting blocks
- Multiple student activities can map to one reporting block
- System handles the complexity, staff see both views

## 🛠️ Tech Stack

**Frontend:**
- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- React Context for state management
- Lucide React for icons

**Planned Backend:**
- Supabase (PostgreSQL + Auth + Storage)
- Row-level security
- Real-time subscriptions

**Deployment:**
- Frontend: Vercel or Netlify
- Backend: Supabase cloud

## 📁 Project Structure

```
interntrackerv1/
├── docs/                    # Documentation (start with CURRENT_STATE.md)
│   ├── CURRENT_STATE.md    # Project status and direction
│   ├── DATA_MODEL.md       # Data structure specification
│   ├── README.md           # Documentation index
│   └── archive/            # Historical docs
├── src/
│   ├── components/         # React components
│   │   ├── admin/          # Admin-specific components
│   │   ├── layout/         # Navigation and layout
│   │   └── common/         # Shared components (future)
│   ├── context/            # React Context providers
│   ├── pages/              # Page components by role
│   │   ├── student/
│   │   ├── advisor/
│   │   ├── mentor/
│   │   ├── admin/
│   │   ├── shared/
│   │   └── auth/
│   └── utils/              # Utility functions and data
└── public/                 # Static assets
```

## 🎯 Development Roadmap

### Phase 1: Core Schedule System (Current)
- [ ] Block Type Builder
- [ ] Schedule Template Builder
- [ ] Student Schedule Builder
- [ ] Refactor check-in system (two interfaces)

### Phase 2: Attendance & Review
- [ ] Attendance review interface for teachers
- [ ] Secretary dashboard with bulk operations
- [ ] SIS export functionality
- [ ] Rollup logic (segments → reporting blocks)

### Phase 3: Polish & Launch
- [ ] Mobile optimization
- [ ] Staff training materials
- [ ] Testing with actual data
- [ ] January 2025 launch

### V2 Features (Post-Launch)
- Reflections with competency tagging
- Social feed features
- Photo/video uploads
- Push notifications
- Parent portal
- Advanced analytics

## 🤝 Contributing

This is a learning project and portfolio piece, but if you're interested in the approach or have ideas:

1. Read [docs/CURRENT_STATE.md](./docs/CURRENT_STATE.md) to understand the project
2. Check [docs/DATA_MODEL.md](./docs/DATA_MODEL.md) for data structures
3. Look at existing code patterns before adding new features
4. Document your decisions

## 📝 Design Principles

1. **Tools, Not Solutions** - Build flexible schedule builders, not City View's specific schedule
2. **Staff Authority** - Teachers and admins always have final say on attendance
3. **Separation of Concerns** - Check-ins and attendance are separate data structures
4. **Mobile-First** - Students primarily use phones, design accordingly
5. **Offline-Ready** - Future feature, but design with this in mind

## ❓ Questions?

- Check [docs/CURRENT_STATE.md](./docs/CURRENT_STATE.md) for project overview
- Read [docs/DATA_MODEL.md](./docs/DATA_MODEL.md) for data structures
- See [docs/questions-for-dennis-and-blenda.md](./docs/questions-for-dennis-and-blenda.md) for open questions

## 📜 License

[To be determined]

## 👤 Developer

Daniel - Former City View teacher, current substitute teacher, learning full-stack development

---

*Built with ❤️ for City View Community High School and other non-traditional schools*
