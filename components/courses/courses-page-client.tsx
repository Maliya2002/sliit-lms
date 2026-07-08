// components/courses/courses-page-client.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen,
  Plus,
  Search,
  Grid,
  List,
  Filter,
  TrendingUp,
  Users,
} from "lucide-react"
import { CourseForm } from "./course-form"
import { CourseStatusBadge } from "./course-status-badge"

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
  department: { name: string } | null
}

type ViewMode = "grid" | "list"

const COURSE_GRADIENTS = [
  "linear-gradient(135deg, #0066FF, #6C3AED)",
  "linear-gradient(135deg, #7C3AED, #EC4899)",
  "linear-gradient(135deg, #059669, #0D9488)",
  "linear-gradient(135deg, #F59E0B, #EF4444)",
  "linear-gradient(135deg, #0891B2, #6C3AED)",
  "linear-gradient(135deg, #E11D48, #F59E0B)",
]

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
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [search, statusFilter])

  useEffect(() => {
    const t = setTimeout(fetchCourses, 300)
    return () => clearTimeout(t)
  }, [fetchCourses])

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: "DELETE",
      })
      if (res.ok) fetchCourses()
    } catch (error) {
      console.error(error)
    }
  }

  const statusCounts = {
    all: courses.length,
    PUBLISHED: courses.filter(
      (c) => c.status === "PUBLISHED"
    ).length,
    DRAFT: courses.filter((c) => c.status === "DRAFT")
      .length,
    ARCHIVED: courses.filter(
      (c) => c.status === "ARCHIVED"
    ).length,
  }

  return (
    <div
      style={{
        padding: "28px 32px",
        background: "#F8FAFC",
        minHeight: "calc(100vh - 76px)",
      }}
    >
      {/* Stats Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        {[
          {
            label: "Total Courses",
            value: statusCounts.all,
            icon: BookOpen,
            color: "#0066FF",
            gradient:
              "linear-gradient(135deg, #0066FF, #6C3AED)",
            bg: "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
          },
          {
            label: "Published",
            value: statusCounts.PUBLISHED,
            icon: TrendingUp,
            color: "#059669",
            gradient:
              "linear-gradient(135deg, #059669, #0D9488)",
            bg: "linear-gradient(135deg, #ECFDF5, #D1FAE5)",
          },
          {
            label: "Draft",
            value: statusCounts.DRAFT,
            icon: Filter,
            color: "#F59E0B",
            gradient:
              "linear-gradient(135deg, #F59E0B, #EF4444)",
            bg: "linear-gradient(135deg, #FFFBEB, #FEF3C7)",
          },
          {
            label: "Total Students",
            value: courses.reduce(
              (sum, c) => sum + c.maxStudents,
              0
            ),
            icon: Users,
            color: "#7C3AED",
            gradient:
              "linear-gradient(135deg, #7C3AED, #EC4899)",
            bg: "linear-gradient(135deg, #F5F3FF, #EDE9FE)",
          },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "20px",
                border: "1px solid #F1F5F9",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                cursor: "default",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: stat.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 6px 16px ${stat.color}30`,
                  flexShrink: 0,
                }}
              >
                <Icon size={22} color="white" />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "900",
                    color: "#0F172A",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#94A3B8",
                    fontWeight: "500",
                    marginTop: "2px",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Main Card */}
      <div
        style={{
          background: "white",
          borderRadius: "24px",
          border: "1px solid #F1F5F9",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
      >
        {/* Toolbar */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #F8FAFC",
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
                fontSize: "18px",
                fontWeight: "800",
                color: "#0F172A",
                margin: 0,
                letterSpacing: "-0.01em",
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
              {/* View Toggle */}
              <div
                style={{
                  display: "flex",
                  background: "#F1F5F9",
                  borderRadius: "10px",
                  padding: "3px",
                }}
              >
                {(["grid", "list"] as ViewMode[]).map(
                  (mode) => (
                    <motion.button
                      key={mode}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewMode(mode)}
                      style={{
                        padding: "7px 10px",
                        borderRadius: "8px",
                        border: "none",
                        background:
                          viewMode === mode
                            ? "white"
                            : "transparent",
                        color:
                          viewMode === mode
                            ? "#0F172A"
                            : "#94A3B8",
                        cursor: "pointer",
                        boxShadow:
                          viewMode === mode
                            ? "0 1px 4px rgba(0,0,0,0.1)"
                            : "none",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {mode === "grid" ? (
                        <Grid size={16} />
                      ) : (
                        <List size={16} />
                      )}
                    </motion.button>
                  )
                )}
              </div>

              {/* Add Button */}
              <motion.button
                whileHover={{
                  scale: 1.04,
                  boxShadow:
                    "0 8px 20px rgba(0,102,255,0.3)",
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setEditingCourse(null)
                  setShowForm(true)
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  background:
                    "linear-gradient(135deg, #0066FF, #6C3AED)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(0,102,255,0.3)",
                }}
              >
                <Plus size={16} />
                Add Course
              </motion.button>
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
            <div
              style={{
                position: "relative",
                flex: 1,
                minWidth: "200px",
              }}
            >
              <Search
                size={15}
                color="#94A3B8"
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px 10px 40px",
                  border: "1.5px solid #E2E8F0",
                  borderRadius: "12px",
                  fontSize: "13px",
                  color: "#0F172A",
                  background: "#F8FAFC",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#0066FF"
                  e.target.style.background = "white"
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E2E8F0"
                  e.target.style.background = "#F8FAFC"
                }}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              style={{
                padding: "10px 16px",
                border: "1.5px solid #E2E8F0",
                borderRadius: "12px",
                fontSize: "13px",
                color: "#0F172A",
                background: "#F8FAFC",
                outline: "none",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              <option value="">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "24px" }}>
          {/* Loading */}
          {isLoading && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  viewMode === "grid"
                    ? "repeat(auto-fill, minmax(300px, 1fr))"
                    : "1fr",
                gap: "16px",
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  style={{
                    height: viewMode === "grid"
                      ? "260px"
                      : "80px",
                    background:
                      "linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)",
                    backgroundSize: "200% 100%",
                    animation:
                      "skeleton 1.5s infinite",
                    borderRadius: "16px",
                  }}
                />
              ))}
              <style>{`
                @keyframes skeleton {
                  0% { background-position: 200% 0; }
                  100% { background-position: -200% 0; }
                }
              `}</style>
            </div>
          )}

          {/* Empty */}
          {!isLoading && courses.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "80px 40px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  background:
                    "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
                  borderRadius: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <BookOpen size={36} color="#0066FF" />
              </div>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "800",
                  color: "#0F172A",
                  marginBottom: "8px",
                }}
              >
                No courses found
              </h3>
              <p
                style={{
                  color: "#94A3B8",
                  marginBottom: "24px",
                  fontSize: "14px",
                }}
              >
                Create your first course to get started
              </p>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setEditingCourse(null)
                  setShowForm(true)
                }}
                style={{
                  padding: "12px 28px",
                  background:
                    "linear-gradient(135deg, #0066FF, #6C3AED)",
                  color: "white",
                  border: "none",
                  borderRadius: "14px",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow:
                    "0 6px 20px rgba(0,102,255,0.35)",
                }}
              >
                Create First Course
              </motion.button>
            </motion.div>
          )}

          {/* Grid View */}
          <AnimatePresence>
            {!isLoading &&
              courses.length > 0 &&
              viewMode === "grid" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {courses.map((course, index) => {
                    const gradient =
                      COURSE_GRADIENTS[
                        index % COURSE_GRADIENTS.length
                      ]
                    return (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: index * 0.06,
                        }}
                        whileHover={{
                          y: -8,
                          boxShadow:
                            "0 20px 40px rgba(0,0,0,0.1)",
                        }}
                        style={{
                          background: "white",
                          borderRadius: "20px",
                          border: "1px solid #F1F5F9",
                          overflow: "hidden",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                        onClick={() =>
                          router.push(
                            `/admin/courses/${course.id}`
                          )
                        }
                      >
                        {/* Card Banner */}
                        <div
                          style={{
                            height: "120px",
                            background: gradient,
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {/* Pattern */}
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              backgroundImage: `
                                radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                                radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)
                              `,
                            }}
                          />

                          {/* Status */}
                          <div
                            style={{
                              position: "absolute",
                              top: "12px",
                              left: "12px",
                            }}
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                          >
                            <CourseStatusBadge
                              status={course.status}
                            />
                          </div>

                          {/* Course Initial */}
                          <div
                            style={{
                              width: "56px",
                              height: "56px",
                              borderRadius: "16px",
                              background:
                                "rgba(255,255,255,0.15)",
                              border:
                                "1px solid rgba(255,255,255,0.2)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backdropFilter: "blur(10px)",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "18px",
                                fontWeight: "900",
                                color: "white",
                              }}
                            >
                              {course.code.substring(0, 2)}
                            </span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div style={{ padding: "16px 20px" }}>
                          <div
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              color: "#94A3B8",
                              marginBottom: "4px",
                              letterSpacing: "0.05em",
                              textTransform: "uppercase",
                            }}
                          >
                            {course.code}
                          </div>
                          <h3
                            style={{
                              fontSize: "15px",
                              fontWeight: "800",
                              color: "#0F172A",
                              marginBottom: "6px",
                              letterSpacing: "-0.01em",
                            }}
                          >
                            {course.title}
                          </h3>

                          {course.instructor.profile && (
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#64748B",
                                marginBottom: "14px",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <div
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  borderRadius: "50%",
                                  background: gradient,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "8px",
                                  fontWeight: "800",
                                  color: "white",
                                }}
                              >
                                {course.instructor.profile.firstName[0]}
                              </div>
                              {
                                course.instructor.profile
                                  .firstName
                              }{" "}
                              {course.instructor.profile.lastName}
                            </div>
                          )}

                          {/* Footer */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              paddingTop: "12px",
                              borderTop: "1px solid #F1F5F9",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "12px",
                                color: "#64748B",
                              }}
                            >
                              <Users size={13} />
                              {course.maxStudents} max
                            </div>
                            <div
                              style={{
                                fontSize: "12px",
                                fontWeight: "700",
                                color: "#0066FF",
                                background: "#EFF6FF",
                                padding: "3px 10px",
                                borderRadius: "20px",
                              }}
                            >
                              {course.credits} credits
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              )}
          </AnimatePresence>

          {/* List View */}
          <AnimatePresence>
            {!isLoading &&
              courses.length > 0 &&
              viewMode === "list" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "2fr 1fr 1fr 1fr 1fr auto",
                      gap: "12px",
                      padding: "10px 16px",
                      background: "#F8FAFC",
                      borderRadius: "12px",
                      marginBottom: "8px",
                    }}
                  >
                    {[
                      "Course",
                      "Code",
                      "Credits",
                      "Status",
                      "Capacity",
                      "",
                    ].map((h) => (
                      <div
                        key={h}
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          color: "#64748B",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {h}
                      </div>
                    ))}
                  </div>

                  {/* Rows */}
                  {courses.map((course, index) => {
                    const gradient =
                      COURSE_GRADIENTS[
                        index % COURSE_GRADIENTS.length
                      ]
                    return (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{
                          backgroundColor: "#FAFBFF",
                          x: 2,
                        }}
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "2fr 1fr 1fr 1fr 1fr auto",
                          gap: "12px",
                          padding: "14px 16px",
                          border: "1px solid #F1F5F9",
                          borderRadius: "14px",
                          marginBottom: "6px",
                          alignItems: "center",
                          cursor: "pointer",
                          background: "white",
                          transition: "all 0.15s ease",
                        }}
                        onClick={() =>
                          router.push(
                            `/admin/courses/${course.id}`
                          )
                        }
                      >
                        {/* Course */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "10px",
                              background: gradient,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "11px",
                              fontWeight: "800",
                              flexShrink: 0,
                            }}
                          >
                            {course.code.substring(0, 2)}
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: "14px",
                                fontWeight: "700",
                                color: "#0F172A",
                              }}
                            >
                              {course.title}
                            </div>
                            {course.instructor.profile && (
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: "#94A3B8",
                                }}
                              >
                                {
                                  course.instructor
                                    .profile.firstName
                                }{" "}
                                {
                                  course.instructor
                                    .profile.lastName
                                }
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Code */}
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: "700",
                            color: "#0066FF",
                          }}
                        >
                          {course.code}
                        </div>

                        {/* Credits */}
                        <div
                          style={{
                            fontSize: "13px",
                            color: "#64748B",
                          }}
                        >
                          {course.credits}
                        </div>

                        {/* Status */}
                        <CourseStatusBadge
                          status={course.status}
                        />

                        {/* Capacity */}
                        <div
                          style={{
                            fontSize: "13px",
                            color: "#64748B",
                          }}
                        >
                          {course.maxStudents}
                        </div>

                        {/* Actions */}
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                          }}
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                        >
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => {
                              setEditingCourse(course)
                              setShowForm(true)
                            }}
                            style={{
                              padding: "6px 14px",
                              background: "#EFF6FF",
                              color: "#0066FF",
                              border: "none",
                              borderRadius: "8px",
                              fontSize: "12px",
                              fontWeight: "700",
                              cursor: "pointer",
                            }}
                          >
                            Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
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
                              background: "#FFF1F2",
                              color: "#E11D48",
                              border: "none",
                              borderRadius: "8px",
                              fontSize: "12px",
                              fontWeight: "700",
                              cursor: "pointer",
                            }}
                          >
                            Delete
                          </motion.button>
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              )}
          </AnimatePresence>
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