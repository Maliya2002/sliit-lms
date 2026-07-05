"use client"

import { BookOpen, ChevronRight, Users } from "lucide-react"

const DEMO_COURSES = [
  {
    id: "1",
    title: "Software Engineering",
    code: "SE3040",
    students: 45,
    progress: 60,
    color: "#2563eb",
    nextClass: "Today 2:00 PM",
  },
  {
    id: "2",
    title: "Database Management",
    code: "IT3030",
    students: 38,
    progress: 45,
    color: "#7c3aed",
    nextClass: "Tomorrow 10:00 AM",
  },
  {
    id: "3",
    title: "Web Technologies",
    code: "IT3050",
    students: 52,
    progress: 75,
    color: "#059669",
    nextClass: "Dec 20, 1:00 PM",
  },
  {
    id: "4",
    title: "Computer Networks",
    code: "IT3020",
    students: 41,
    progress: 30,
    color: "#d97706",
    nextClass: "Dec 21, 9:00 AM",
  },
]

export function TeachingCourses() {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        border: "1px solid #f1f5f9",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              background: "#fffbeb",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BookOpen size={18} color="#d97706" />
          </div>
          <div>
            <h3
              style={{
                fontSize: "15px",
                fontWeight: "700",
                color: "#1e293b",
                margin: 0,
              }}
            >
              My Teaching Courses
            </h3>
            <p
              style={{
                fontSize: "12px",
                color: "#94a3b8",
                margin: 0,
              }}
            >
              {DEMO_COURSES.length} courses this semester
            </p>
          </div>
        </div>
        <a
          href="/lecturer/courses"
          style={{
            fontSize: "13px",
            color: "#d97706",
            textDecoration: "none",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          View all
          <ChevronRight size={14} />
        </a>
      </div>

      {/* Courses */}
      <div style={{ padding: "12px" }}>
        {DEMO_COURSES.map((course) => (
          <a
            key={course.id}
            href={`/lecturer/courses/${course.id}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "14px 12px",
              borderRadius: "12px",
              textDecoration: "none",
              marginBottom: "4px",
              border: "1px solid transparent",
              transition: "all 0.15s",
            }}
          >
            {/* Color Box */}
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "12px",
                background: `${course.color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                border: `1px solid ${course.color}20`,
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "800",
                  color: course.color,
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
                  fontWeight: "600",
                  color: "#1e293b",
                  marginBottom: "2px",
                }}
              >
                {course.title}
              </div>

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
                    fontSize: "12px",
                    color: "#94a3b8",
                  }}
                >
                  {course.code}
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "12px",
                    color: "#64748b",
                  }}
                >
                  <Users size={12} />
                  {course.students} students
                </span>
              </div>

              {/* Progress */}
              <div
                style={{
                  height: "4px",
                  background: "#f1f5f9",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${course.progress}%`,
                    background: course.color,
                    borderRadius: "2px",
                  }}
                />
              </div>
            </div>

            {/* Right Side */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: course.color,
                  marginBottom: "4px",
                }}
              >
                {course.progress}%
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#94a3b8",
                  whiteSpace: "nowrap",
                }}
              >
                {course.nextClass}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}