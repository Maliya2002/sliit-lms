"use client"

import { Bell, Search, Shield } from "lucide-react"

interface Props {
  firstName: string
  lastName: string
}

export function AdminHeader({ firstName, lastName }: Props) {
  return (
    <header
      style={{
        height: "70px",
        background: "white",
        borderBottom: "1px solid #f1f5f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Left */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Shield size={18} color="#dc2626" />
          <h1
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#1e293b",
              margin: 0,
            }}
          >
            Admin Dashboard
          </h1>
        </div>
        <p
          style={{
            fontSize: "13px",
            color: "#94a3b8",
            margin: 0,
          }}
        >
          Welcome back, {firstName}! Manage your LMS system.
        </p>
      </div>

      {/* Right */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            padding: "8px 14px",
          }}
        >
          <Search size={15} color="#94a3b8" />
          <input
            placeholder="Search users, courses..."
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              fontSize: "13px",
              color: "#1e293b",
              width: "200px",
            }}
          />
        </div>

        {/* Bell */}
        <div
          style={{
            position: "relative",
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Bell size={18} color="#64748b" />
          <div
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              width: "8px",
              height: "8px",
              background: "#dc2626",
              borderRadius: "50%",
              border: "2px solid white",
            }}
          />
        </div>

        {/* Avatar */}
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, #dc2626, #7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "700",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          {firstName[0]}
          {lastName[0]}
        </div>
      </div>
    </header>
  )
}