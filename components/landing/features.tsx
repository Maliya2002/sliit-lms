// components/landing/features.tsx
"use client"

import { motion } from "framer-motion"
import {
  BookOpen,
  FileText,
  ClipboardList,
  Calendar,
  BarChart3,
  Bell,
  Users,
  Shield,
  Smartphone,
} from "lucide-react"

const features = [
  {
    icon: <BookOpen size={24} />,
    title: "Course Management",
    description:
      "Create, organize and manage courses with modules, lessons, and resources.",
    color: "#0066FF",
    bg: "#EFF6FF",
  },
  {
    icon: <FileText size={24} />,
    title: "Smart Assignments",
    description:
      "Submit assignments, track deadlines, and receive feedback seamlessly.",
    color: "#6C3AED",
    bg: "#F5F3FF",
  },
  {
    icon: <ClipboardList size={24} />,
    title: "Interactive Quizzes",
    description:
      "Take timed quizzes with auto-evaluation, MCQ, and instant results.",
    color: "#0D9488",
    bg: "#F0FDFA",
  },
  {
    icon: <Calendar size={24} />,
    title: "Attendance Tracking",
    description:
      "Mark and monitor attendance with real-time percentage tracking.",
    color: "#F59E0B",
    bg: "#FFFBEB",
  },
  {
    icon: <BarChart3 size={24} />,
    title: "Grade Management",
    description:
      "Automatic GPA calculation, gradebook, and transcript generation.",
    color: "#E11D48",
    bg: "#FFF1F2",
  },
  {
    icon: <Bell size={24} />,
    title: "Notifications",
    description:
      "Real-time notifications for assignments, grades, and announcements.",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    icon: <Users size={24} />,
    title: "Multi-Role System",
    description:
      "Admin, Lecturer, Student — each with tailored dashboards and features.",
    color: "#0066FF",
    bg: "#EFF6FF",
  },
  {
    icon: <Shield size={24} />,
    title: "Secure & Private",
    description:
      "JWT authentication, role-based access, and encrypted passwords.",
    color: "#059669",
    bg: "#ECFDF5",
  },
  {
    icon: <Smartphone size={24} />,
    title: "Mobile Responsive",
    description:
      "Perfect experience on phone, tablet, and desktop devices.",
    color: "#0891B2",
    bg: "#ECFEFF",
  },
]

export function Features() {
  return (
    <section
      id="features"
      style={{
        padding: "120px 24px",
        background: "#F8FAFC",
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: "center",
            marginBottom: "64px",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              fontWeight: "700",
              color: "#0066FF",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              display: "block",
              marginBottom: "16px",
            }}
          >
            ✨ Features
          </span>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: "800",
              color: "#0F172A",
              lineHeight: 1.2,
              marginBottom: "16px",
              letterSpacing: "-0.02em",
            }}
          >
            Everything You Need to{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #0066FF, #6C3AED)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Succeed
            </span>
          </h2>
          <p
            style={{
              fontSize: "18px",
              color: "#64748B",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            A complete academic toolkit designed for
            students, lecturers, and administrators.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "24px",
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              whileHover={{
                y: -8,
                boxShadow:
                  "0 20px 40px rgba(0,0,0,0.08)",
              }}
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "32px",
                border: "1px solid #E2E8F0",
                cursor: "default",
                transition: "all 0.3s ease",
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: feature.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: feature.color,
                  marginBottom: "20px",
                }}
              >
                {feature.icon}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#0F172A",
                  marginBottom: "10px",
                }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: "14px",
                  color: "#64748B",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}