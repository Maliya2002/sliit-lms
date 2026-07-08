// components/dashboard/student/my-courses.tsx
"use client"

import { motion } from "framer-motion"
import {
  BookOpen,
  ChevronRight,
  Users,
  Clock,
} from "lucide-react"

const DEMO_COURSES = [
  {
    id: "1",
    title: "Software Engineering",
    code: "SE3040",
    instructor: "Dr. Silva",
    progress: 65,
    color: "#0066FF",
    gradient: "linear-gradient(135deg, #0066FF, #6C3AED)",
    students: 45,
    nextClass: "Today 2:00 PM",
    modules: 8,
  },
  {
    id: "2",
    title: "Database Management",
    code: "IT3030",
    instructor: "Dr. Fernando",
    progress: 45,
    color: "#7C3AED",
    gradient: "linear-gradient(135deg, #7C3AED, #EC4899)",
    students: 38,
    nextClass: "Tomorrow 10AM",
    modules: 6,
  },
  {
    id: "3",
    title: "Web Technologies",
    code: "IT3050",
    instructor: "Ms. Perera",
    progress: 80,
    color: "#059669",
    gradient: "linear-gradient(135deg, #059669, #0D9488)",
    students: 52,
    nextClass: "Dec 20, 1PM",
    modules: 10,
  },
  {
    id: "4",
    title: "Computer Networks",
    code: "IT3020",
    instructor: "Dr. Kumara",
    progress: 30,
    color: "#F59E0B",
    gradient: "linear-gradient(135deg, #F59E0B, #EF4444)",
    students: 41,
    nextClass: "Dec 21, 9AM",
    modules: 7,
  },
]

export function MyCourses() {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "24px",
        border: "1px solid #F1F5F9",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid #F8FAFC",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BookOpen size={18} color="#0066FF" />
          </div>
          <div>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#0F172A",
                margin: 0,
              }}
            >
              My Courses
            </h3>
            <p
              style={{
                fontSize: "12px",
                color: "#94A3B8",
                margin: 0,
              }}
            >
              {DEMO_COURSES.length} enrolled this semester
            </p>
          </div>
        </div>
        <motion.a
          href="/student/courses"
          whileHover={{ x: 3 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "13px",
            fontWeight: "600",
            color: "#0066FF",
            textDecoration: "none",
          }}
        >
          View all
          <ChevronRight size={14} />
        </motion.a>
      </div>

      {/* Course List */}
      <div style={{ padding: "12px" }}>
        {DEMO_COURSES.map((course, index) => (
          <motion.a
            key={course.id}
            href={`/student/courses/${course.id}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: index * 0.08,
              duration: 0.4,
            }}
            whileHover={{
              backgroundColor: "#F8FAFC",
              x: 4,
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "14px 12px",
              borderRadius: "16px",
              textDecoration: "none",
              transition: "all 0.2s ease",
              marginBottom:
                index < DEMO_COURSES.length - 1 ? "4px" : 0,
            }}
          >
            {/* Course Avatar */}
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: course.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: `0 4px 12px ${course.color}30`,
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "800",
                  color: "white",
                  letterSpacing: "-0.02em",
                }}
              >
                {course.code.substring(0, 2)}
              </span>
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#0F172A",
                  marginBottom: "2px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {course.title}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    color: "#94A3B8",
                  }}
                >
                  {course.code}
                </span>
                <span
                  style={{
                    width: "3px",
                    height: "3px",
                    borderRadius: "50%",
                    background: "#CBD5E1",
                  }}
                />
                <span
                  style={{
                    fontSize: "11px",
                    color: "#94A3B8",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}
                >
                  <Clock size={10} />
                  {course.nextClass}
                </span>
              </div>

              {/* Progress Bar */}
              <div
                style={{
                  height: "5px",
                  background: "#F1F5F9",
                  borderRadius: "3px",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${course.progress}%`,
                  }}
                  transition={{
                    delay: index * 0.1 + 0.3,
                    duration: 0.8,
                    ease: "easeOut",
                  }}
                  style={{
                    height: "100%",
                    background: course.gradient,
                    borderRadius: "3px",
                  }}
                />
              </div>
            </div>

            {/* Progress % */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "800",
                  color: course.color,
                  lineHeight: 1,
                }}
              >
                {course.progress}%
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#94A3B8",
                  marginTop: "2px",
                }}
              >
                Complete
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  )
}