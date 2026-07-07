// components/attendance/mark-attendance.tsx
"use client"

import { useState } from "react"
import { CheckCircle, XCircle, Clock, AlertCircle, Save } from "lucide-react"

interface Student {
  id: string
  email: string
  profile: {
    firstName: string
    lastName: string
    studentId: string | null
    avatar: string | null
  } | null
}

interface AttendanceRecord {
  studentId: string
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"
}

interface Props {
  sessionId: string
  students: Student[]
  initialAttendances: AttendanceRecord[]
  onSaved: () => void
}

const STATUS_OPTIONS = [
  {
    value: "PRESENT",
    label: "Present",
    icon: CheckCircle,
    color: "#059669",
    bg: "#ecfdf5",
    border: "#bbf7d0",
  },
  {
    value: "LATE",
    label: "Late",
    icon: Clock,
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
  },
  {
    value: "EXCUSED",
    label: "Excused",
    icon: AlertCircle,
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    value: "ABSENT",
    label: "Absent",
    icon: XCircle,
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
  },
]

export function MarkAttendance({
  sessionId,
  students,
  initialAttendances,
  onSaved,
}: Props) {
  const [attendances, setAttendances] = useState<
    Record<string, "PRESENT" | "ABSENT" | "LATE" | "EXCUSED">
  >(
    Object.fromEntries(
      initialAttendances.map((a) => [a.studentId, a.status])
    )
  )
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const markAll = (
    status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"
  ) => {
    setAttendances(
      Object.fromEntries(students.map((s) => [s.id, status]))
    )
  }

  const markStudent = (
    studentId: string,
    status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"
  ) => {
    setAttendances((prev) => ({ ...prev, [studentId]: status }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)

      const res = await fetch(
        `/api/attendance/${sessionId}/mark`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            attendances: Object.entries(attendances).map(
              ([studentId, status]) => ({
                studentId,
                status,
              })
            ),
          }),
        }
      )

      if (res.ok) {
        setSaved(true)
        onSaved()
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error("Save attendance error:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Stats
  const counts = {
    present: Object.values(attendances).filter(
      (s) => s === "PRESENT"
    ).length,
    late: Object.values(attendances).filter((s) => s === "LATE")
      .length,
    excused: Object.values(attendances).filter(
      (s) => s === "EXCUSED"
    ).length,
    absent: Object.values(attendances).filter(
      (s) => s === "ABSENT"
    ).length,
  }

  return (
    <div>
      {/* Stats Bar */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {[
          {
            label: "Present",
            count: counts.present,
            color: "#059669",
            bg: "#ecfdf5",
          },
          {
            label: "Late",
            count: counts.late,
            color: "#d97706",
            bg: "#fffbeb",
          },
          {
            label: "Excused",
            count: counts.excused,
            color: "#2563eb",
            bg: "#eff6ff",
          },
          {
            label: "Absent",
            count: counts.absent,
            color: "#dc2626",
            bg: "#fef2f2",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: stat.bg,
              borderRadius: "10px",
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                fontSize: "20px",
                fontWeight: "800",
                color: stat.color,
              }}
            >
              {stat.count}
            </span>
            <span
              style={{ fontSize: "13px", color: stat.color }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Mark All Buttons */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "16px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            color: "#64748b",
            fontWeight: "600",
          }}
        >
          Mark all:
        </span>
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() =>
              markAll(
                opt.value as
                  | "PRESENT"
                  | "ABSENT"
                  | "LATE"
                  | "EXCUSED"
              )
            }
            style={{
              padding: "6px 14px",
              background: opt.bg,
              color: opt.color,
              border: `1px solid ${opt.border}`,
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Student List */}
      <div
        style={{
          border: "1px solid #f1f5f9",
          borderRadius: "12px",
          overflow: "hidden",
          marginBottom: "20px",
        }}
      >
        {students.length === 0 ? (
          <div
            style={{
              padding: "40px",
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
              👥
            </div>
            <p>No students enrolled in this course</p>
          </div>
        ) : (
          students.map((student, index) => {
            const currentStatus =
              attendances[student.id] || "ABSENT"
            const currentOption = STATUS_OPTIONS.find(
              (o) => o.value === currentStatus
            )

            return (
              <div
                key={student.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "14px 20px",
                  borderBottom:
                    index < students.length - 1
                      ? "1px solid #f1f5f9"
                      : "none",
                  background: "white",
                  gap: "16px",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #2563eb, #7c3aed)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "13px",
                    fontWeight: "700",
                    flexShrink: 0,
                  }}
                >
                  {student.profile?.firstName?.[0] || "?"}
                  {student.profile?.lastName?.[0] || ""}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#1e293b",
                    }}
                  >
                    {student.profile?.firstName}{" "}
                    {student.profile?.lastName}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#94a3b8",
                    }}
                  >
                    {student.profile?.studentId ||
                      student.email}
                  </div>
                </div>

                {/* Status Buttons */}
                <div
                  style={{ display: "flex", gap: "6px" }}
                >
                  {STATUS_OPTIONS.map((opt) => {
                    const Icon = opt.icon
                    const isActive =
                      currentStatus === opt.value

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          markStudent(
                            student.id,
                            opt.value as
                              | "PRESENT"
                              | "ABSENT"
                              | "LATE"
                              | "EXCUSED"
                          )
                        }
                        title={opt.label}
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "8px",
                          border: `2px solid ${
                            isActive
                              ? opt.color
                              : "#e2e8f0"
                          }`,
                          background: isActive
                            ? opt.bg
                            : "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        <Icon
                          size={18}
                          color={
                            isActive ? opt.color : "#94a3b8"
                          }
                        />
                      </button>
                    )
                  })}
                </div>

                {/* Current Status Label */}
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: currentOption?.color,
                    background: currentOption?.bg,
                    padding: "3px 10px",
                    borderRadius: "20px",
                    minWidth: "60px",
                    textAlign: "center",
                  }}
                >
                  {currentOption?.label}
                </span>
              </div>
            )
          })
        )}
      </div>

      {/* Save Button */}
      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving || students.length === 0}
        style={{
          width: "100%",
          padding: "14px",
          background: saved ? "#059669" : "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "12px",
          fontSize: "15px",
          fontWeight: "600",
          cursor:
            isSaving || students.length === 0
              ? "not-allowed"
              : "pointer",
          opacity: isSaving ? 0.8 : 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          transition: "background 0.2s",
        }}
      >
        <Save size={18} />
        {isSaving
          ? "Saving..."
          : saved
          ? "✅ Saved!"
          : "Save Attendance"}
      </button>
    </div>
  )
}