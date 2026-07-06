// components/courses/course-card.tsx
"use client"

import { Users, BookOpen, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { CourseStatusBadge } from "./course-status-badge"
import { useState, useRef, useEffect } from "react"

interface Course {
  id: string
  title: string
  code: string
  description: string | null
  thumbnail: string | null
  status: string
  credits: number
  maxStudents: number
  createdAt: string
  instructor: {
    profile: {
      firstName: string
      lastName: string
    } | null
  }
  department: {
    name: string
  } | null
  _count?: {
    enrollments: number
  }
}

interface Props {
  course: Course
  onEdit: (course: Course) => void
  onDelete: (id: string) => void
  onView: (id: string) => void
}

const COURSE_COLORS = [
  "#2563eb",
  "#7c3aed",
  "#059669",
  "#d97706",
  "#dc2626",
  "#0891b2",
]

export function CourseCard({
  course,
  onEdit,
  onDelete,
  onView,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const color =
    COURSE_COLORS[
      course.code.charCodeAt(0) % COURSE_COLORS.length
    ]

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const instructorName = course.instructor.profile
    ? `${course.instructor.profile.firstName} ${course.instructor.profile.lastName}`
    : "Unknown"

  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        border: "1px solid #f1f5f9",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
      }}
      onClick={() => onView(course.id)}
    >
      {/* Thumbnail / Color Banner */}
      <div
        style={{
          height: "120px",
          background: course.thumbnail
            ? `url(${course.thumbnail}) center/cover`
            : `linear-gradient(135deg, ${color}22, ${color}44)`,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!course.thumbnail && (
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BookOpen size={28} color="white" />
          </div>
        )}

        {/* Status Badge */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
          }}
        >
          <CourseStatusBadge status={course.status} />
        </div>

        {/* Actions Menu */}
        <div
          ref={menuRef}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "white",
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#64748b",
            }}
          >
            <MoreHorizontal size={16} />
          </button>

          {menuOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "36px",
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                zIndex: 50,
                minWidth: "140px",
                padding: "6px",
              }}
            >
              {[
                {
                  label: "View",
                  icon: <Eye size={14} />,
                  color: "#1e293b",
                  action: () => onView(course.id),
                },
                {
                  label: "Edit",
                  icon: <Edit size={14} />,
                  color: "#2563eb",
                  action: () => onEdit(course),
                },
                {
                  label: "Delete",
                  icon: <Trash2 size={14} />,
                  color: "#dc2626",
                  action: () => {
                    if (
                      confirm(
                        `Delete "${course.title}"?`
                      )
                    ) {
                      onDelete(course.id)
                    }
                  },
                },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    item.action()
                    setMenuOpen(false)
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "9px 12px",
                    background: "transparent",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "13px",
                    color: item.color,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Course Info */}
      <div style={{ padding: "16px" }}>
        {/* Code */}
        <div
          style={{
            fontSize: "11px",
            fontWeight: "700",
            color: color,
            marginBottom: "6px",
            letterSpacing: "0.05em",
          }}
        >
          {course.code}
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: "15px",
            fontWeight: "700",
            color: "#1e293b",
            margin: "0 0 6px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {course.title}
        </h3>

        {/* Instructor */}
        <p
          style={{
            fontSize: "12px",
            color: "#64748b",
            margin: "0 0 12px",
          }}
        >
          👨‍🏫 {instructorName}
        </p>

        {/* Description */}
        {course.description && (
          <p
            style={{
              fontSize: "12px",
              color: "#94a3b8",
              margin: "0 0 12px",
              lineHeight: 1.5,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical" as const,
            }}
          >
            {course.description}
          </p>
        )}

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "12px",
            borderTop: "1px solid #f1f5f9",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "12px",
              color: "#64748b",
            }}
          >
            <Users size={14} />
            <span>{course.maxStudents} max</span>
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "#64748b",
            }}
          >
            {course.credits} credits
          </div>
        </div>
      </div>
    </div>
  )
}