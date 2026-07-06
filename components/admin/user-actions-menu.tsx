// components/admin/user-actions-menu.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import {
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  ShieldAlert,
} from "lucide-react"

interface User {
  id: string
  email: string
  role: string
  status: string
}

interface Props {
  user: User
  currentUserId: string
  onStatusChange: (userId: string, status: string) => void
  onDelete: (userId: string) => void
}

export function UserActionsMenu({
  user,
  currentUserId,
  onStatusChange,
  onDelete,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () =>
      document.removeEventListener("mousedown", handleClick)
  }, [])

  const isCurrentUser = user.id === currentUserId

  const menuItems = [
    {
      label: "View Profile",
      icon: <Eye size={14} />,
      color: "#1e293b",
      action: () => {
        window.location.href = `/admin/users/${user.id}`
      },
    },
    ...(user.status !== "ACTIVE"
      ? [
          {
            label: "Set Active",
            icon: <CheckCircle size={14} />,
            color: "#16a34a",
            action: () => {
              onStatusChange(user.id, "ACTIVE")
              setIsOpen(false)
            },
          },
        ]
      : []),
    ...(user.status !== "SUSPENDED"
      ? [
          {
            label: "Suspend User",
            icon: <ShieldAlert size={14} />,
            color: "#d97706",
            action: () => {
              onStatusChange(user.id, "SUSPENDED")
              setIsOpen(false)
            },
          },
        ]
      : []),
    ...(user.status !== "INACTIVE"
      ? [
          {
            label: "Deactivate",
            icon: <XCircle size={14} />,
            color: "#64748b",
            action: () => {
              onStatusChange(user.id, "INACTIVE")
              setIsOpen(false)
            },
          },
        ]
      : []),
    ...(!isCurrentUser
      ? [
          {
            label: "Delete User",
            icon: <Trash2 size={14} />,
            color: "#dc2626",
            action: () => {
              if (
                confirm(
                  `Are you sure you want to delete ${user.email}?`
                )
              ) {
                onDelete(user.id)
                setIsOpen(false)
              }
            },
          },
        ]
      : []),
  ]

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "8px",
          background: "transparent",
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

      {isOpen && (
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
            minWidth: "160px",
            padding: "6px",
          }}
        >
          {menuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
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
  )
}