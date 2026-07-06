// components/profile/account-info-card.tsx
"use client"

import {
  Shield,
  CheckCircle,
  Clock,
  Calendar,
  Key,
} from "lucide-react"

interface Props {
  user: {
    id: string
    email: string
    role: string
    status: string
    emailVerified: string | null
    lastLogin: string | null
    createdAt: string
  }
}

const STATUS_STYLE: Record<
  string,
  { color: string; bg: string }
> = {
  ACTIVE: { color: "#16a34a", bg: "#f0fdf4" },
  INACTIVE: { color: "#64748b", bg: "#f8fafc" },
  SUSPENDED: { color: "#dc2626", bg: "#fef2f2" },
  PENDING: { color: "#d97706", bg: "#fffbeb" },
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "Never"
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function formatDateTime(dateStr: string | null) {
  if (!dateStr) return "Never"
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function AccountInfoCard({ user }: Props) {
  const statusStyle =
    STATUS_STYLE[user.status] || STATUS_STYLE.ACTIVE

  const infoItems = [
    {
      icon: <Shield size={16} color="#2563eb" />,
      label: "Role",
      value: user.role.replace("_", " "),
    },
    {
      icon: (
        <CheckCircle size={16} color={statusStyle.color} />
      ),
      label: "Status",
      value: (
        <span
          style={{
            fontSize: "12px",
            fontWeight: "600",
            background: statusStyle.bg,
            color: statusStyle.color,
            padding: "3px 10px",
            borderRadius: "20px",
          }}
        >
          {user.status}
        </span>
      ),
    },
    {
      icon: <Calendar size={16} color="#7c3aed" />,
      label: "Member Since",
      value: formatDate(user.createdAt),
    },
    {
      icon: <Clock size={16} color="#d97706" />,
      label: "Last Login",
      value: formatDateTime(user.lastLogin),
    },
    {
      icon: <CheckCircle size={16} color="#059669" />,
      label: "Email Verified",
      value: user.emailVerified ? (
        <span style={{ color: "#059669", fontWeight: "600" }}>
          ✅ Verified
        </span>
      ) : (
        <span style={{ color: "#dc2626" }}>
          ❌ Not verified
        </span>
      ),
    },
  ]

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
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            background: "#f5f3ff",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Shield size={18} color="#7c3aed" />
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
            Account Information
          </h3>
          <p
            style={{
              fontSize: "12px",
              color: "#94a3b8",
              margin: 0,
            }}
          >
            Your account details
          </p>
        </div>
      </div>

      {/* Info Items */}
      <div style={{ padding: "16px 24px" }}>
        {infoItems.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom:
                index < infoItems.length - 1
                  ? "1px solid #f8fafc"
                  : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              {item.icon}
              {item.label}
            </div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "#1e293b",
              }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Change Password Button */}
      <div
        style={{
          padding: "16px 24px",
          borderTop: "1px solid #f1f5f9",
        }}
      >
        <a
          href="/forgot-password"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "12px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: "600",
            color: "#1e293b",
            textDecoration: "none",
          }}
        >
          <Key size={16} />
          Change Password
        </a>
      </div>
    </div>
  )
}