// components/attendance/student-attendance-client.tsx
"use client"

import { useState, useEffect } from "react"

interface AttendanceRecord {
  session: {
    date: string
    topic: string | null
  }
  status: string
}

interface CourseAttendance {
  course: {
    id: string
    title: string
    code: string
  }
  totalSessions: number
  attended: number
  absent: number
  percentage: number
  recentRecords: AttendanceRecord[]
}

const STATUS_CONFIG: Record<
  string,
  { color: string; bg: string; label: string; emoji: string }
> = {
  PRESENT: {
    color: "#059669",
    bg: "#ecfdf5",
    label: "Present",
    emoji: "✅",
  },
  LATE: {
    color: "#d97706",
    bg: "#fffbeb",
    label: "Late",
    emoji: "⏰",
  },
  ABSENT: {
    color: "#dc2626",
    bg: "#fef2f2",
    label: "Absent",
    emoji: "❌",
  },
  EXCUSED: {
    color: "#2563eb",
    bg: "#eff6ff",
    label: "Excused",
    emoji: "📋",
  },
}

export function StudentAttendanceClient() {
  const [attendance, setAttendance] = useState<
    CourseAttendance[]
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(
    null
  )

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setIsLoading(true)
        const res = await fetch("/api/attendance/student")
        const data = await res.json()
        if (!cancelled && res.ok) {
          setAttendance(data.attendance || [])
        }
      } catch (error) {
        console.error("Load attendance error:", error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const getBarColor = (percentage: number) => {
    if (percentage >= 75) return "#059669"
    if (percentage >= 50) return "#d97706"
    return "#dc2626"
  }

  const getStatus = (percentage: number) => {
    if (percentage >= 75)
      return { text: "Good Standing", color: "#059669" }
    if (percentage >= 50)
      return { text: "Warning", color: "#d97706" }
    return { text: "Critical", color: "#dc2626" }
  }

  if (isLoading) {
    return (
      <div style={{ padding: "28px" }}>
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
          Loading attendance...
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: "28px" }}>
      {/* Summary Stats */}
      {attendance.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginBottom: "28px",
          }}
        >
          {[
            {
              label: "Enrolled Courses",
              value: attendance.length,
              emoji: "📚",
              bg: "#eff6ff",
            },
            {
              label: "Avg Attendance",
              value:
                Math.round(
                  attendance.reduce(
                    (sum, a) => sum + a.percentage,
                    0
                  ) / (attendance.length || 1)
                ) + "%",
              emoji: "📊",
              bg: "#f0fdf4",
            },
            {
              label: "Total Classes",
              value: attendance.reduce(
                (sum, a) => sum + a.totalSessions,
                0
              ),
              emoji: "🎓",
              bg: "#f5f3ff",
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
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: stat.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                }}
              >
                {stat.emoji}
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
      )}

      {/* Course Attendance Cards */}
      {attendance.length === 0 ? (
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            border: "1px solid #f1f5f9",
            padding: "60px",
            textAlign: "center",
          }}
        >
          <div
            style={{ fontSize: "48px", marginBottom: "16px" }}
          >
            📅
          </div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1e293b",
              marginBottom: "8px",
            }}
          >
            No attendance records yet
          </h3>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>
            Your attendance will appear here once your
            lecturers start marking attendance.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {attendance.map((item) => {
            const barColor = getBarColor(item.percentage)
            const status = getStatus(item.percentage)
            const isExpanded = expanded === item.course.id

            return (
              <div
                key={item.course.id}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  border: "1px solid #f1f5f9",
                  overflow: "hidden",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                {/* Course Header */}
                <div
                  style={{
                    padding: "20px 24px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setExpanded(
                      isExpanded ? null : item.course.id
                    )
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: "16px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          color: "#2563eb",
                          marginBottom: "4px",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {item.course.code}
                      </div>
                      <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: "700",
                          color: "#1e293b",
                          margin: 0,
                        }}
                      >
                        {item.course.title}
                      </h3>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: "32px",
                          fontWeight: "900",
                          color: barColor,
                          lineHeight: 1,
                        }}
                      >
                        {item.percentage}%
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          color: status.color,
                          marginTop: "4px",
                        }}
                      >
                        {status.text}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div
                    style={{
                      height: "8px",
                      background: "#f1f5f9",
                      borderRadius: "4px",
                      overflow: "hidden",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${item.percentage}%`,
                        background: barColor,
                        borderRadius: "4px",
                        transition: "width 0.5s ease",
                      }}
                    />
                  </div>

                  {/* Mini Stats */}
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      flexWrap: "wrap",
                    }}
                  >
                    {[
                      {
                        label: "Total Classes",
                        value: item.totalSessions,
                        color: "#64748b",
                      },
                      {
                        label: "Attended",
                        value: item.attended,
                        color: "#059669",
                      },
                      {
                        label: "Absent",
                        value: item.absent,
                        color: "#dc2626",
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        style={{
                          fontSize: "12px",
                          color: "#64748b",
                        }}
                      >
                        <span style={{ color: s.color, fontWeight: "700" }}>
                          {s.value}
                        </span>{" "}
                        {s.label}
                      </div>
                    ))}
                  </div>

                  {/* Warning */}
                  {item.percentage < 75 && (
                    <div
                      style={{
                        marginTop: "12px",
                        background: "#fef2f2",
                        border: "1px solid #fecaca",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        fontSize: "12px",
                        color: "#dc2626",
                        fontWeight: "500",
                      }}
                    >
                      ⚠️ Your attendance is below 75%. You may
                      not be eligible to sit the final exam.
                    </div>
                  )}
                </div>

                {/* Expanded: Recent Records */}
                {isExpanded &&
                  item.recentRecords.length > 0 && (
                    <div
                      style={{
                        borderTop: "1px solid #f1f5f9",
                        padding: "16px 24px",
                        background: "#f8fafc",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: "#64748b",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "12px",
                        }}
                      >
                        Recent Sessions
                      </p>
                      {item.recentRecords.map((record, i) => {
                        const sc =
                          STATUS_CONFIG[record.status] ||
                          STATUS_CONFIG.ABSENT

                        return (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "10px 0",
                              borderBottom:
                                i <
                                item.recentRecords.length - 1
                                  ? "1px solid #e2e8f0"
                                  : "none",
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "600",
                                  color: "#1e293b",
                                }}
                              >
                                {new Date(
                                  record.session.date
                                ).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </div>
                              {record.session.topic && (
                                <div
                                  style={{
                                    fontSize: "11px",
                                    color: "#94a3b8",
                                  }}
                                >
                                  {record.session.topic}
                                </div>
                              )}
                            </div>
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: "600",
                                background: sc.bg,
                                color: sc.color,
                                padding: "4px 10px",
                                borderRadius: "20px",
                              }}
                            >
                              {sc.emoji} {sc.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}