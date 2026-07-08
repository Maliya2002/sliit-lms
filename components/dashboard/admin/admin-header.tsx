// components/dashboard/admin/admin-header.tsx
"use client"

import { motion } from "framer-motion"
import { Search, Shield } from "lucide-react"
import { NotificationBell } from "@/components/notifications/notification-bell"

interface Props {
  firstName: string
  lastName: string
}

export function AdminHeader({ firstName, lastName }: Props) {
  const hour = new Date().getHours()
  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 17
      ? "Good Afternoon"
      : "Good Evening"

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        height: "76px",
        background: "white",
        borderBottom: "1px solid #F1F5F9",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        position: "sticky",
        top: 0,
        zIndex: 10,
        boxShadow: "0 1px 0 rgba(0,0,0,0.04)",
      }}
    >
      {/* Left */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 200,
          }}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background:
              "linear-gradient(135deg, #FFF1F2, #FFE4E6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Shield size={18} color="#E11D48" />
        </motion.div>
        <div>
          <h1
            style={{
              fontSize: "18px",
              fontWeight: "800",
              color: "#0F172A",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            {greeting}, {firstName}! 👋
          </h1>
          <p
            style={{
              fontSize: "12px",
              color: "#94A3B8",
              margin: 0,
              fontWeight: "500",
            }}
          >
            {today} · Admin Panel
          </p>
        </div>
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
        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "#F8FAFC",
            border: "1.5px solid #E2E8F0",
            borderRadius: "12px",
            padding: "9px 16px",
            cursor: "pointer",
          }}
        >
          <Search size={15} color="#94A3B8" />
          <input
            placeholder="Search users, courses..."
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              fontSize: "13px",
              color: "#0F172A",
              width: "200px",
            }}
          />
        </motion.div>

        {/* Notification Bell */}
        <NotificationBell />

        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, #E11D48, #7C3AED)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "800",
            fontSize: "14px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(225,29,72,0.3)",
          }}
        >
          {firstName[0]}
          {lastName[0]}
        </motion.div>
      </div>
    </motion.header>
  )
}