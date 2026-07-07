// components/attendance/lecturer-attendance-client.tsx
"use client"

import { useState, useEffect } from "react"
import { Plus, Calendar, Users, ChevronDown } from "lucide-react"
import { MarkAttendance } from "./mark-attendance"

interface Course {
  id: string
  title: string
  code: string
}

interface AttendanceSession {
  id: string
  date: string
  topic: string | null
  course: { title: string; code: string }
  attendances: Array<{
    studentId: string
    status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"
    student: {
      id: string
      email: string
      profile: {
        firstName: string
        lastName: string
        studentId: string | null
        avatar: string | null
      } | null
    }
  }>
  _count: { attendances: number }
}

export function LecturerAttendanceClient() {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] =
    useState<string>("")
  const [sessions, setSessions] = useState<
    AttendanceSession[]
  >([])
  const [activeSession, setActiveSession] =
    useState<AttendanceSession | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showNewForm, setShowNewForm] = useState(false)
  const [newTopic, setNewTopic] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  // Load courses
  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch("/api/courses")
        const data = await res.json()
        if (!cancelled && res.ok) {
          setCourses(data.courses || [])
          if (data.courses?.length > 0) {
            setSelectedCourse(data.courses[0].id)
          }
        }
      } catch (error) {
        console.error("Load courses error:", error)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  // Load sessions when course changes
  useEffect(() => {
    if (!selectedCourse) return

    let cancelled = false

    async function loadSessions() {
      try {
        setIsLoading(true)
        const res = await fetch(
          `/api/attendance?courseId=${selectedCourse}`
        )
        const data = await res.json()
        if (!cancelled && res.ok) {
          setSessions(data.sessions || [])
          setActiveSession(null)
        }
      } catch (error) {
        console.error("Load sessions error:", error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadSessions()
    return () => {
      cancelled = true
    }
  }, [selectedCourse])

  const refetchSessions = async () => {
    if (!selectedCourse) return
    try {
      const res = await fetch(
        `/api/attendance?courseId=${selectedCourse}`
      )
      const data = await res.json()
      if (res.ok) setSessions(data.sessions || [])
    } catch (error) {
      console.error("Refetch error:", error)
    }
  }

  const createSession = async () => {
    if (!selectedCourse) return

    try {
      setIsCreating(true)

      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: selectedCourse,
          date: new Date().toISOString(),
          topic: newTopic || undefined,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setShowNewForm(false)
        setNewTopic("")
        await refetchSessions()
        setActiveSession(data.session)
      }
    } catch (error) {
      console.error("Create session error:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getSessionStats = (session: AttendanceSession) => {
    const present = session.attendances.filter(
      (a) => a.status === "PRESENT"
    ).length
    const late = session.attendances.filter(
      (a) => a.status === "LATE"
    ).length
    const absent = session.attendances.filter(
      (a) => a.status === "ABSENT"
    ).length
    const total = session.attendances.length
    return { present, late, absent, total }
  }

  return (
    <div style={{ padding: "28px" }}>
      {/* Course Selector */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          border: "1px solid #f1f5f9",
          padding: "20px 24px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "200px" }}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "600",
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            Select Course
          </label>
          <div style={{ position: "relative" }}>
            <select
              value={selectedCourse}
              onChange={(e) =>
                setSelectedCourse(e.target.value)
              }
              style={{
                width: "100%",
                padding: "10px 36px 10px 14px",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                fontSize: "14px",
                color: "#1e293b",
                background: "white",
                outline: "none",
                appearance: "none",
                cursor: "pointer",
              }}
            >
              <option value="">Select a course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.title}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              color="#94a3b8"
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowNewForm(!showNewForm)}
          disabled={!selectedCourse}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            background: selectedCourse ? "#2563eb" : "#f1f5f9",
            color: selectedCourse ? "white" : "#94a3b8",
            border: "none",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: selectedCourse ? "pointer" : "not-allowed",
            marginTop: "20px",
          }}
        >
          <Plus size={16} />
          New Session
        </button>
      </div>

      {/* New Session Form */}
      {showNewForm && (
        <div
          style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: "16px",
            padding: "20px 24px",
            marginBottom: "24px",
          }}
        >
          <h3
            style={{
              fontSize: "15px",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "16px",
            }}
          >
            📅 New Attendance Session
          </h3>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "6px",
              }}
            >
              Session Topic (optional)
            </label>
            <input
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="e.g. Introduction to Design Patterns"
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid #bfdbfe",
                borderRadius: "10px",
                fontSize: "14px",
                color: "#1e293b",
                background: "white",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={() => {
                setShowNewForm(false)
                setNewTopic("")
              }}
              style={{
                flex: 1,
                padding: "10px",
                background: "white",
                color: "#64748b",
                border: "1px solid #bfdbfe",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={createSession}
              disabled={isCreating}
              style={{
                flex: 2,
                padding: "10px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: isCreating ? "not-allowed" : "pointer",
                opacity: isCreating ? 0.8 : 1,
              }}
            >
              {isCreating
                ? "Creating..."
                : "Create & Start Attendance"}
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            activeSession ? "1fr 1.5fr" : "1fr",
          gap: "24px",
        }}
      >
        {/* Sessions List */}
        <div>
          <h2
            style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "14px",
            }}
          >
            📅 Attendance Sessions
          </h2>

          {isLoading ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "#94a3b8",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  border: "3px solid #e2e8f0",
                  borderTop: "3px solid #2563eb",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  margin: "0 auto 12px",
                }}
              />
              Loading...
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : sessions.length === 0 ? (
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                border: "1px solid #f1f5f9",
                padding: "48px",
                textAlign: "center",
                color: "#94a3b8",
              }}
            >
              <div
                style={{
                  fontSize: "40px",
                  marginBottom: "12px",
                }}
              >
                📅
              </div>
              <p
                style={{
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#1e293b",
                  marginBottom: "4px",
                }}
              >
                No sessions yet
              </p>
              <p style={{ fontSize: "13px" }}>
                Create your first attendance session
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {sessions.map((sess) => {
                const stats = getSessionStats(sess)
                const isActive =
                  activeSession?.id === sess.id

                return (
                  <div
                    key={sess.id}
                    onClick={() =>
                      setActiveSession(
                        isActive ? null : sess
                      )
                    }
                    style={{
                      background: "white",
                      borderRadius: "12px",
                      border: `2px solid ${
                        isActive ? "#2563eb" : "#f1f5f9"
                      }`,
                      padding: "16px 20px",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {/* Date + Topic */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "4px",
                          }}
                        >
                          <Calendar
                            size={14}
                            color="#2563eb"
                          />
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: "700",
                              color: "#1e293b",
                            }}
                          >
                            {formatDate(sess.date)}
                          </span>
                        </div>
                        {sess.topic && (
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              margin: 0,
                            }}
                          >
                            {sess.topic}
                          </p>
                        )}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "12px",
                          color: "#64748b",
                        }}
                      >
                        <Users size={13} />
                        {stats.total}
                      </div>
                    </div>

                    {/* Mini Stats */}
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                      }}
                    >
                      {[
                        {
                          count: stats.present,
                          color: "#059669",
                          bg: "#ecfdf5",
                          label: "P",
                        },
                        {
                          count: stats.late,
                          color: "#d97706",
                          bg: "#fffbeb",
                          label: "L",
                        },
                        {
                          count: stats.absent,
                          color: "#dc2626",
                          bg: "#fef2f2",
                          label: "A",
                        },
                      ].map((s) => (
                        <div
                          key={s.label}
                          style={{
                            background: s.bg,
                            color: s.color,
                            padding: "3px 10px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: "700",
                          }}
                        >
                          {s.label}: {s.count}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Mark Attendance Panel */}
        {activeSession && (
          <div>
            <h2
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#1e293b",
                marginBottom: "4px",
              }}
            >
              ✅ Mark Attendance
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "#64748b",
                marginBottom: "16px",
              }}
            >
              {formatDate(activeSession.date)}
              {activeSession.topic &&
                ` — ${activeSession.topic}`}
            </p>

            <MarkAttendance
              sessionId={activeSession.id}
              students={activeSession.attendances.map(
                (a) => a.student
              )}
              initialAttendances={activeSession.attendances.map(
                (a) => ({
                  studentId: a.studentId,
                  status: a.status,
                })
              )}
              onSaved={refetchSessions}
            />
          </div>
        )}
      </div>
    </div>
  )
}