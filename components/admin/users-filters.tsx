// components/admin/users-filters.tsx
"use client"

import { Search, Plus } from "lucide-react"

interface Props {
  search: string
  role: string
  status: string
  onSearchChange: (value: string) => void
  onRoleChange: (value: string) => void
  onStatusChange: (value: string) => void
  onAddUser: () => void
}

export function UsersFilters({
  search,
  role,
  status,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onAddUser,
}: Props) {
  const selectStyle = {
    padding: "9px 14px",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "13px",
    color: "#1e293b",
    background: "white",
    outline: "none",
    cursor: "pointer",
    appearance: "none" as const,
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "20px",
        flexWrap: "wrap",
      }}
    >
      {/* Search */}
      <div
        style={{
          position: "relative",
          flex: 1,
          minWidth: "240px",
        }}
      >
        <Search
          size={16}
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
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 14px 10px 38px",
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

      {/* Role Filter */}
      <select
        value={role}
        onChange={(e) => onRoleChange(e.target.value)}
        style={selectStyle}
      >
        <option value="">All Roles</option>
        <option value="STUDENT">Student</option>
        <option value="LECTURER">Lecturer</option>
        <option value="ADMIN">Admin</option>
        <option value="DEPARTMENT_HEAD">Department Head</option>
        <option value="COURSE_COORDINATOR">Coordinator</option>
        <option value="TEACHING_ASSISTANT">Teaching Assistant</option>
      </select>

      {/* Status Filter */}
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        style={selectStyle}
      >
        <option value="">All Status</option>
        <option value="ACTIVE">Active</option>
        <option value="PENDING">Pending</option>
        <option value="INACTIVE">Inactive</option>
        <option value="SUSPENDED">Suspended</option>
      </select>

      {/* Add User Button */}
      <button
        onClick={onAddUser}
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
          whiteSpace: "nowrap",
        }}
      >
        <Plus size={16} />
        Add User
      </button>
    </div>
  )
}