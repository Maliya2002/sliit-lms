// app/unauthorized/page.tsx
"use client"

import { motion } from "framer-motion"
import { Lock, Home, LogIn } from "lucide-react"
import { useDarkMode } from "@/hooks/use-dark-mode"

export default function UnauthorizedPage() {
  const { bg, text, border } = useDarkMode()

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: bg.primary,
        padding: "24px",
        textAlign: "center",
        transition: "background 0.3s ease",
      }}
    >
      {/* Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        style={{
          width: "90px",
          height: "90px",
          borderRadius: "24px",
          background:
            "linear-gradient(135deg, #FFF1F2, #FFE4E6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "28px",
          border: "1px solid #FECDD3",
          boxShadow: "0 8px 24px rgba(225,29,72,0.15)",
        }}
      >
        <Lock size={44} color="#E11D48" />
      </motion.div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          fontSize: "12px",
          fontWeight: "700",
          color: "#E11D48",
          letterSpacing: "0.1em",
          marginBottom: "16px",
          background: "rgba(225,29,72,0.1)",
          padding: "6px 16px",
          borderRadius: "20px",
          border: "1px solid rgba(225,29,72,0.2)",
        }}
      >
        ERROR 403 — FORBIDDEN
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          fontSize: "32px",
          fontWeight: "900",
          color: text.primary,
          marginBottom: "12px",
          letterSpacing: "-0.02em",
        }}
      >
        Access Denied
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          fontSize: "16px",
          color: text.secondary,
          maxWidth: "420px",
          lineHeight: 1.7,
          marginBottom: "12px",
        }}
      >
        You don&apos;t have permission to access this page.
        This area is restricted to authorized users only.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          fontSize: "14px",
          color: text.muted,
          marginBottom: "40px",
        }}
      >
        If you believe this is a mistake, please contact
        your administrator.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <motion.a
          href="/login"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "13px 28px",
            background:
              "linear-gradient(135deg, #0066FF, #6C3AED)",
            color: "white",
            borderRadius: "14px",
            fontSize: "15px",
            fontWeight: "700",
            textDecoration: "none",
            boxShadow: "0 4px 16px rgba(0,102,255,0.3)",
          }}
        >
          <LogIn size={16} />
          Sign In
        </motion.a>

        <motion.a
          href="/"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "13px 28px",
            background: bg.card,
            color: text.primary,
            border: `1.5px solid ${border.strong}`,
            borderRadius: "14px",
            fontSize: "15px",
            fontWeight: "600",
            textDecoration: "none",
          }}
        >
          <Home size={16} />
          Go Home
        </motion.a>
      </motion.div>
    </div>
  )
}