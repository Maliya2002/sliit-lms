# 🎓 SLIIT LMS — Learning Management System

<div align="center">

![SLIIT LMS](https://img.shields.io/badge/SLIIT-LMS-blue?style=for-the-badge&logo=graduation-cap)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-green?style=for-the-badge&logo=postgresql)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)

**An industry-level Learning Management System built for Sri Lanka Institute of Information Technology**

[🌐 Live Demo](https://sliit-c43q0g4lz-malithmadushan25-4642s-projects.vercel.app) · [📧 Contact](mailto:malithmadushan25@gmail.com)

</div>

---

## 📸 Screenshots

| Login Page | Student Dashboard | Admin Analytics |
|-----------|-----------------|----------------|
| ![Login](screenshots/login.png) | ![Student](screenshots/student.png) | ![Admin](screenshots/admin.png) |

---

## ✨ Features

### 🔐 Authentication & Security
- Multi-role authentication (Admin, Lecturer, Student, Department Head, Course Coordinator, Teaching Assistant)
- JWT-based session management
- Password hashing with Bcrypt
- Forgot password with email reset
- Role-based route protection

### 👥 User Management
- Admin user management panel
- Search, filter, pagination
- Suspend/activate accounts
- Profile management

### 📚 Course Management
- Create, edit, delete courses
- Course modules and lessons
- Student enrollment system
- Course progress tracking

### 📝 Assignment System
- Create and publish assignments
- Student file/text submissions
- Late submission handling
- Lecturer grading with feedback

### 📊 Quiz System
- MCQ and True/False questions
- Configurable timer
- Auto-evaluation
- Pass/fail determination
- Quiz analytics

### 📅 Attendance System
- Create attendance sessions
- Manual attendance marking
- Per-student attendance percentage
- Attendance history

### 🎯 Grade Management
- Complete gradebook
- GPA calculation (SLIIT standard)
- Grade publishing
- CGPA tracking

### 🔔 Notifications & Announcements
- Real-time notification bell
- Mark as read functionality
- Global and course-specific announcements
- Email notifications

### 📈 Analytics Dashboard
- User growth charts (Recharts)
- Course enrollment statistics
- Assignment submission rates
- Quiz pass rates
- Recent activity feed

### 🎨 UI/UX Features
- Responsive design (Mobile, Tablet, Desktop)
- Dark sidebar navigation
- Loading skeletons
- Error and empty states
- Role-specific themes

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.x | React framework with App Router |
| React | 19.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| Recharts | 2.x | Data visualization |
| Framer Motion | 11.x | Animations |
| React Hook Form | 7.x | Form management |
| Zod | 3.x | Schema validation |
| Lucide React | latest | Icons |
| date-fns | 3.x | Date utilities |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js API Routes | 16.x | REST API |
| Prisma ORM | 5.x | Database ORM |
| PostgreSQL | 18 | Database |
| NextAuth.js | 5.x (beta) | Authentication |
| Bcrypt | 2.x | Password hashing |
| Nodemailer | 6.x | Email sending |

### Infrastructure
| Service | Purpose |
|---------|---------|
| Vercel | Hosting & Deployment |
| Neon | PostgreSQL Cloud Database |
| GitHub | Version Control |
| Gmail SMTP | Email Service |

---

## 🗄️ Database Schema
Users ──────── Profiles
│
├── Enrollments ──── Courses ──── CourseModules ──── Lessons
│ │
│ ├── Assignments ──── Submissions
│ ├── Quizzes ──── Questions ──── Attempts
│ ├── AttendanceSessions ──── Attendances
│ └── Discussions ──── Replies
│
├── Grades
├── Notifications
└── AuditLogs

Faculties ──── Departments ──── Programs
AcademicYears ──── Semesters

text


---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL (local) or Neon account

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/Maliya2002/sliit-lms.git
cd sliit-lm