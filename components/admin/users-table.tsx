// components/admin/users-table.tsx
"use client"

import { UserActionsMenu } from "./user-actions-menu"

interface User {
  id: string
  email: string
  role: string
  status: string
  createdAt: string
  lastLogin: string | null
  profile: {
    firstName: string
    lastName: string
    avatar: string | null
    studentId: string | null
    employeeId: string | null
  } | null
}

interface Props {
  users: User[]
  currentUserId: string
  onStatusChange: (userId: string, status: string) => void
  onDelete: (userId: string) => void
  isLoading: boolean
}

const ROLE_STYLE: Record<string, { color: string; bg: string }> =
  {
    ADMIN: { color: "#dc2626", bg: "#fef2f2" },
    LECTURER: { color: "#d97706", bg: "#fffbeb" },
    STUDENT: { color: "#2563eb", bg: "#eff6ff" },
    DEPARTMENT_HEAD: { color: "#7c3aed", bg: "#f5f3ff" },
    COURSE_COORDINATOR: { color: "#059669", bg: "#ecfdf5" },
    TEACHING_ASSISTANT: { color: "#0891b2", bg: "#ecfeff" },
  }

const STATUS_STYLE: Record<
  string,
  { color: string; bg: string }
> = {
  ACTIVE: { color: "#16a34a", bg: "#f0fdf4" },
  PENDING: { color: "#d97706", bg: "#fffbeb" },
  INACTIVE: { color: "#64748b", bg: "#f8fafc" },
  SUSPENDED: { color: "#dc2626", bg: "#fef2f2" },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function UsersTable({
  users,
  currentUserId,
  onStatusChange,
  onDelete,
  isLoading,
}: Props) {
  if (isLoading) {
    return (
      <div
        style={{
          padding: "60px",
          textAlign: "center",
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
        Loading users...
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div
        style={{
          padding: "60px",
          textAlign: "center",
          color: "#94a3b8",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>
          👥
        </div>
        <p style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>
          No users found
        </p>
        <p style={{ fontSize: "14px" }}>
          Try adjusting your search or filters
        </p>
      </div>
    )
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        {/* Header */}
        <thead>
          <tr
            style={{
              background: "#f8fafc",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            {[
              "User",
              "Email",
              "Role",
              "Status",
              "Joined",
              "Last Login",
              "",
            ].map((h) => (
              <th
                key={h}
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "#64748b",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {users.map((user, index) => {
            const roleStyle =
              ROLE_STYLE[user.role] || ROLE_STYLE.STUDENT
            const statusStyle =
              STATUS_STYLE[user.status] || STATUS_STYLE.ACTIVE
            const fullName = user.profile
              ? `${user.profile.firstName} ${user.profile.lastName}`
              : user.email
            const initials = user.profile
              ? `${user.profile.firstName[0]}${user.profile.lastName[0]}`
              : user.email[0].toUpperCase()

            return (
              <tr
                key={user.id}
                style={{
                  borderBottom:
                    index < users.length - 1
                      ? "1px solid #f1f5f9"
                      : "none",
                  background:
                    user.id === currentUserId
                      ? "#fafbff"
                      : "white",
                }}
              >
                {/* User */}
                <td style={{ padding: "14px 20px" }}>
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
                      {initials}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#1e293b",
                        }}
                      >
                        {fullName}
                        {user.id === currentUserId && (
                          <span
                            style={{
                              fontSize: "10px",
                              color: "#2563eb",
                              marginLeft: "6px",
                              fontWeight: "400",
                            }}
                          >
                            (You)
                          </span>
                        )}
                      </div>
                      {user.profile?.studentId && (
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#94a3b8",
                          }}
                        >
                          {user.profile.studentId}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td style={{ padding: "14px 20px" }}>
                  <span
                    style={{
                      fontSize: "13px",
                      color: "#64748b",
                    }}
                  >
                    {user.email}
                  </span>
                </td>

                {/* Role */}
                <td style={{ padding: "14px 20px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      background: roleStyle.bg,
                      color: roleStyle.color,
                      padding: "4px 10px",
                      borderRadius: "20px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.role.replace("_", " ")}
                  </span>
                </td>

                {/* Status */}
                <td style={{ padding: "14px 20px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      background: statusStyle.bg,
                      color: statusStyle.color,
                      padding: "4px 10px",
                      borderRadius: "20px",
                    }}
                  >
                    {user.status}
                  </span>
                </td>

                {/* Joined */}
                <td style={{ padding: "14px 20px" }}>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#94a3b8",
                    }}
                  >
                    {formatDate(user.createdAt)}
                  </span>
                </td>

                {/* Last Login */}
                <td style={{ padding: "14px 20px" }}>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#94a3b8",
                    }}
                  >
                    {user.lastLogin
                      ? formatDate(user.lastLogin)
                      : "Never"}
                  </span>
                </td>

                {/* Actions */}
                <td style={{ padding: "14px 20px" }}>
                  <UserActionsMenu
                    user={user}
                    currentUserId={currentUserId}
                    onStatusChange={onStatusChange}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}