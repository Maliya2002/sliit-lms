// components/dashboard/lecturer/teaching-courses.tsx
"use client"

import { motion } from "framer-motion"
import {
  BookOpen,
  ChevronRight,
  Users,
  Clock,
  TrendingUp,
} from "lucide-react"
import { useRouter } from "next/navigation"

const DEMO_COURSES = [
  {
    id: "1",
    title: "Software Engineering",
    code: "SE3040",
    students: 45,
    progress: 60,
    gradient: "linear-gradient(135deg, #0066FF, #6C3AED)",
    color: "#0066FF",
    nextClass: "Today 2:00 PM",
    submissions: 12,
    trend: "+5%",
  },
  {
    id: "2",
    title: "Database Management",
    code: "IT3030",
    students: 38,
    progress: 45,
    gradient: "linear-gradient(135deg, #7C3AED, #EC4899)",
    color: "#7C3AED",
    nextClass: "Tomorrow 10AM",
    submissions: 8,
    trend: "+12%",
  },
  {
    id: "3",
    title: "Web Technologies",
    code: "IT3050",
    students: 52,
    progress: 75,
    gradient: "linear-gradient(135deg, #059669, #0D9488)",
    color: "#059669",
    nextClass: "Dec 20, 1PM",
    submissions: 20,
    trend: "+8%",
  },
  {
    id: "4",
    title: "Computer Networks",
    code: "IT3020",
    students: 41,
    progress: 30,
    gradient: "linear-gradient(135deg, #F59E0B, #EF4444)",
    color: "#F59E0B",
    nextClass: "Dec 21, 9AM",
    submissions: 5,
    trend: "+3%",
  },
]

export function TeachingCourses() {
  const router = useRouter()

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
                "linear-gradient(135deg, #FFFBEB, #FEF3C7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BookOpen size={18} color="#F59E0B" />
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
              My Teaching Courses
            </h3>
            <p
              style={{
                fontSize: "12px",
                color: "#94A3B8",
                margin: 0,
              }}
            >
              {DEMO_COURSES.length} courses this semester
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, x: 2 }}
          onClick={() => router.push("/lecturer/courses")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            background:
              "linear-gradient(135deg, #FFFBEB, #FEF3C7)",
            color: "#F59E0B",
            border: "none",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          View all
          <ChevronRight size={14} />
        </motion.button>
      </div>

      {/* Course List */}
      <div style={{ padding: "12px" }}>
        {DEMO_COURSES.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: index * 0.08,
              duration: 0.4,
            }}
            whileHover={{
              backgroundColor: "#FAFBFF",
              x: 4,
            }}
            onClick={() =>
              router.push(`/lecturer/courses/${course.id}`)
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "14px 12px",
              borderRadius: "16px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              marginBottom:
                index < DEMO_COURSES.length - 1 ? "4px" : 0,
            }}
          >
            {/* Course Avatar */}
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "14px",
                background: course.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: `0 4px 14px ${course.color}35`,
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "800",
                  color: "white",
                }}
              >
                {course.code.substring(0, 2)}
              </span>
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "4px",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    color: "#0F172A",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {course.title}
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: "800",
                    color: course.color,
                    flexShrink: 0,
                    marginLeft: "8px",
                  }}
                >
                  {course.progress}%
                </span>
              </div>

              {/* Meta */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    color: "#94A3B8",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}
                >
                  <Users size={10} />
                  {course.students} students
                </span>
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
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#059669",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                    background: "#ECFDF5",
                    padding: "2px 8px",
                    borderRadius: "10px",
                  }}
                >
                  <TrendingUp size={10} />
                  {course.trend}
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
          </motion.div>
        ))}
      </div>
    </div>
  )
}