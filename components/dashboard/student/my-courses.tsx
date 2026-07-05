"use client"

import { BookOpen, ChevronRight } from "lucide-react"

const DEMO_COURSES = [
  {
    id: "1",
    title: "Software Engineering",
    code: "SE3040",
    instructor: "Dr. Silva",
    progress: 65,
    color: "#2563eb",
  },
  {
    id: "2",
    title: "Database Management",
    code: "IT3030",
    instructor: "Dr. Fernando",
    progress: 45,
    color: "#7c3aed",
  },
  {
    id: "3",
    title: "Web Technologies",
    code: "IT3050",
    instructor: "Ms. Perera",
    progress: 80,
    color: "#059669",
  },
  {
    id: "4",
    title: "Computer Networks",
    code: "IT3020",
    instructor: "Dr. Kumara",
    progress: 30,
    color: "#d97706",
  },
]

export function MyCourses() {
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
              background: "#eff6ff",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BookOpen size={18} color="#2563eb" />
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
              My Courses
            </h3>
            <p
              style={{
                fontSize: "12px",
                color: "#94a3b8",
                margin: 0,
              }}
            >
              {DEMO_COURSES.length} enrolled this semester
            </p>
          </div>
        </div>
        <a
          href="/student/courses"
          style={{
            fontSize: "13px",
            color: "#2563eb",
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

      {/* List */}
      <div style={{ padding: "12px" }}>
        {DEMO_COURSES.map((course) => (
          <a
            key={course.id}
            href={`/student/courses/${course.id}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "14px 12px",
              borderRadius: "12px",
              textDecoration: "none",
              marginBottom: "4px",
            }}
          >
            {/* Icon Box */}
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: `${course.color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
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
            <div style={{ flex: 1 }}>
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
                  fontSize: "12px",
                  color: "#94a3b8",
                  marginBottom: "8px",
                }}
              >
                {course.code} • {course.instructor}
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

            {/* % */}
            <div
              style={{
                fontSize: "13px",
                fontWeight: "700",
                color: course.color,
                flexShrink: 0,
              }}
            >
              {course.progress}%
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}