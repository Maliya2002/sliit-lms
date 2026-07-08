// components/dashboard/student/student-header.tsx
"use client"

import { motion } from "framer-motion"
import { Search,  } from "lucide-react"
import { NotificationBell } from "@/components/notifications/notification-bell"

interface Props {
  firstName: string
  lastName: string
}

export function StudentHeader({ firstName, lastName }: Props) {
  const hour = new Date().getHours()
  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 17
      ? "Good Afternoon"
      : "Good Evening"

  const emoji =
    hour < 12 ? "☀️" : hour < 17 ? "🌤️" : "🌙"

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
      <div>
        <motion.h1
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            fontSize: "18px",
            fontWeight: "800",
            color: "#0F172A",
            margin: 0,
            letterSpacing: "-0.01em",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {emoji} {greeting}, {firstName}!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: "12px",
            color: "#94A3B8",
            margin: 0,
            fontWeight: "500",
          }}
        >
          {today}
        </motion.p>
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
            transition: "all 0.2s ease",
          }}
        >
          <Search size={15} color="#94A3B8" />
          <input
            placeholder="Search anything..."
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              fontSize: "13px",
              color: "#0F172A",
              width: "180px",
            }}
          />
        </motion.div>

        {/* Notifications */}
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
              "linear-gradient(135deg, #0066FF, #6C3AED)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "800",
            fontSize: "14px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,102,255,0.3)",
          }}
        >
          {firstName[0]}
          {lastName[0]}
        </motion.div>
      </div>
    </motion.header>
  )
}