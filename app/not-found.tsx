// app/not-found.tsx
"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Home, ArrowLeft } from "lucide-react"
import { useDarkMode } from "@/hooks/use-dark-mode"

export default function NotFound() {
  const router = useRouter()
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
      {/* 404 Number */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: "clamp(80px, 15vw, 140px)",
          fontWeight: "900",
          background:
            "linear-gradient(135deg, #0066FF, #6C3AED)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: 1,
          marginBottom: "24px",
          letterSpacing: "-0.04em",
        }}
      >
        404
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          fontSize: "28px",
          fontWeight: "800",
          color: text.primary,
          marginBottom: "12px",
          letterSpacing: "-0.02em",
        }}
      >
        Page Not Found
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          fontSize: "16px",
          color: text.muted,
          maxWidth: "420px",
          lineHeight: 1.7,
          marginBottom: "40px",
        }}
      >
        The page you are looking for doesn&apos;t exist or
        has been moved. Please check the URL or go back to
        the home page.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ display: "flex", gap: "12px" }}
      >
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.back()}
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
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <ArrowLeft size={16} />
          Go Back
        </motion.button>

        <motion.a
          href="/"
          whileHover={{
            scale: 1.04,
            boxShadow: "0 8px 24px rgba(0,102,255,0.35)",
          }}
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
          <Home size={16} />
          Go Home
        </motion.a>
      </motion.div>
    </div>
  )
}