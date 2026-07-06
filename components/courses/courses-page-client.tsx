// components/courses/courses-page-client.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  Plus,
  Search,
  Grid,
  List,
  Filter,
} from "lucide-react"
import { CourseCard } from "./course-card"
import { CourseForm } from "./course-form"
import { CourseStatusBadge } from "./course-status-badge"

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────
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
}

type ViewMode = "grid" | "list"

// ─────────────────────────────────────────
// Component
// ─────────────────────────────────────────
export function CoursesPageClient() {
  const router = useRouter()

  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [showForm, setShowForm] = useState(false)
  const [editingCourse, setEditingCourse] =
    useState<Course | null>(null)

  // ─────────────────────────────────────────
  // Fetch Courses
  // ─────────────────────────────────────────
  const fetchCourses = useCallback(async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        search,
        status: statusFilter,
      })
      const res = await fetch(`/api/courses?${params}`)
      const data = await res.json()
      if (res.ok) setCourses(data.courses)
    } catch (error) {
      console.error("Fetch courses error:", error)
    } finally {
      setIsLoading(false)
    }
  }, [search, statusFilter])

  useEffect(() => {
    const timer = setTimeout(fetchCourses, 300)
    return () => clearTimeout(timer)
  }, [fetchCourses])

  // ─────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: "DELETE",
      })
      if (res.ok) fetchCourses()
    } catch (error) {
      console.error("Delete error:", error)
    }
  }

  const handleEdit = (course: Course) => {
    setEditingCourse(course)
    setShowForm(true)
  }

  const handleView = (id: string) => {
    router.push(`/admin/courses/${id}`)
  }

  // ─────────────────────────────────────────
  // Stats
  // ─────────────────────────────────────────
  const statusCounts = {
    all: courses.length,
    DRAFT: courses.filter((c) => c.status === "DRAFT").length,
    PUBLISHED: courses.filter((c) => c.status === "PUBLISHED")
      .length,
    ARCHIVED: courses.filter((c) => c.status === "ARCHIVED")
      .length,
  }

  // ─────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────
  return (
    <div style={{ padding: "28px" }}>

      {/* Stats Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {[
          {
            label: "Total Courses",
            value: statusCounts.all,
            color: "#2563eb",
            bg: "#eff6ff",
          },
          {
            label: "Published",
            value: statusCounts.PUBLISHED,
            color: "#059669",
            bg: "#ecfdf5",
          },
          {
            label: "Draft",
            value: statusCounts.DRAFT,
            color: "#d97706",
            bg: "#fffbeb",
          },
          {
            label: "Archived",
            value: statusCounts.ARCHIVED,
            color: "#64748b",
            bg: "#f8fafc",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "16px 20px",
              border: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: stat.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BookOpen size={20} color={stat.color} />
            </div>
            <div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  color: "#1e293b",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  marginTop: "2px",
                }}
              >
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          border: "1px solid #f1f5f9",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
      >
        {/* Card Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <h2
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#1e293b",
                margin: 0,
              }}
            >
              All Courses
            </h2>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {/* View Mode Toggle */}
              <div
                style={{
                  display: "flex",
                  background: "#f8fafc",
                  borderRadius: "8px",
                  padding: "3px",
                  border: "1px solid #e2e8f0",
                }}
              >
                {(["grid", "list"] as ViewMode[]).map(
                  (mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setViewMode(mode)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "none",
                        background:
                          viewMode === mode
                            ? "white"
                            : "transparent",
                        color:
                          viewMode === mode
                            ? "#1e293b"
                            : "#94a3b8",
                        cursor: "pointer",
                        boxShadow:
                          viewMode === mode
                            ? "0 1px 3px rgba(0,0,0,0.1)"
                            : "none",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {mode === "grid" ? (
                        <Grid size={16} />
                      ) : (
                        <List size={16} />
                      )}
                    </button>
                  )
                )}
              </div>

              {/* Add Course Button */}
              <button
                type="button"
                onClick={() => {
                  setEditingCourse(null)
                  setShowForm(true)
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                <Plus size={16} />
                Add Course
              </button>
            </div>
          </div>

          {/* Filters */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            {/* Search */}
            <div
              style={{
                position: "relative",
                flex: 1,
                minWidth: "200px",
              }}
            >
              <Search
                size={15}
                color="#94a3b8"
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px 10px 36px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  fontSize: "13px",
                  color: "#1e293b",
                  background: "white",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Status Filter */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 14px",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                background: "white",
              }}
            >
              <Filter size={14} color="#64748b" />
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                style={{
                  border: "none",
                  fontSize: "13px",
                  color: "#1e293b",
                  background: "transparent",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="">All Status</option>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ padding: "24px" }}>
          {/* Loading */}
          {isLoading && (
            <div
              style={{
                textAlign: "center",
                padding: "60px",
                color: "#94a3b8",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  border: "3px solid #e2e8f0",
                  borderTop: "3px solid #2563eb",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  margin: "0 auto 12px",
                }}
              />
              Loading courses...
              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && courses.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px",
                color: "#94a3b8",
              }}
            >
              <div
                style={{
                  fontSize: "48px",
                  marginBottom: "16px",
                }}
              >
                📚
              </div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#1e293b",
                  marginBottom: "8px",
                }}
              >
                No courses found
              </h3>
              <p style={{ marginBottom: "24px" }}>
                Start by creating your first course
              </p>
              <button
                type="button"
                onClick={() => {
                  setEditingCourse(null)
                  setShowForm(true)
                }}
                style={{
                  padding: "12px 28px",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Create First Course
              </button>
            </div>
          )}

          {/* Grid View */}
          {!isLoading &&
            courses.length > 0 &&
            viewMode === "grid" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "20px",
                }}
              >
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                  />
                ))}
              </div>
            )}

          {/* List View */}
          {!isLoading &&
            courses.length > 0 &&
            viewMode === "list" && (
              <div>
                {/* List Header */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "2fr 1fr 1fr 1fr 1fr auto",
                    gap: "16px",
                    padding: "10px 16px",
                    background: "#f8fafc",
                    borderRadius: "8px",
                    marginBottom: "8px",
                  }}
                >
                  {[
                    "Course",
                    "Code",
                    "Credits",
                    "Status",
                    "Students",
                    "",
                  ].map((h) => (
                    <div
                      key={h}
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {h}
                    </div>
                  ))}
                </div>

                {/* List Rows */}
                {courses.map((course) => (
                  <div
                    key={course.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "2fr 1fr 1fr 1fr 1fr auto",
                      gap: "16px",
                      padding: "14px 16px",
                      border: "1px solid #f1f5f9",
                      borderRadius: "10px",
                      marginBottom: "8px",
                      alignItems: "center",
                      background: "white",
                      cursor: "pointer",
                    }}
                    onClick={() => handleView(course.id)}
                  >
                    {/* Course Name */}
                    <div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#1e293b",
                        }}
                      >
                        {course.title}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#94a3b8",
                        }}
                      >
                        {course.instructor.profile
                          ? `${course.instructor.profile.firstName} ${course.instructor.profile.lastName}`
                          : "Unknown"}
                      </div>
                    </div>

                    {/* Code */}
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#2563eb",
                        fontWeight: "600",
                      }}
                    >
                      {course.code}
                    </div>

                    {/* Credits */}
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#64748b",
                      }}
                    >
                      {course.credits}
                    </div>

                    {/* Status */}
                    <CourseStatusBadge status={course.status} />

                    {/* Max Students */}
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#64748b",
                      }}
                    >
                      {course.maxStudents} max
                    </div>

                    {/* Actions */}
                    <div
                      style={{ display: "flex", gap: "8px" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => handleEdit(course)}
                        style={{
                          padding: "6px 14px",
                          background: "#eff6ff",
                          color: "#2563eb",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            confirm(
                              `Delete "${course.title}"?`
                            )
                          ) {
                            handleDelete(course.id)
                          }
                        }}
                        style={{
                          padding: "6px 14px",
                          background: "#fef2f2",
                          color: "#dc2626",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>

      {/* Course Form Modal */}
      {showForm && (
        <CourseForm
          course={editingCourse}
          onSuccess={fetchCourses}
          onClose={() => {
            setShowForm(false)
            setEditingCourse(null)
          }}
        />
      )}
    </div>
  )
}