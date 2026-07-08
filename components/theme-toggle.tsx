// components/theme-toggle.tsx
"use client"

import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon } from "lucide-react"

// Safe way to check if component is mounted (no useEffect + setState)
function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const mounted = useMounted()

  if (!mounted) {
    return (
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "12px",
          background: "#F8FAFC",
          border: "1.5px solid #E2E8F0",
        }}
      />
    )
  }

  const isDark = theme === "dark"

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "12px",
        background: isDark
          ? "rgba(255,255,255,0.08)"
          : "#F8FAFC",
        border: `1.5px solid ${
          isDark
            ? "rgba(255,255,255,0.12)"
            : "#E2E8F0"
        }`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: isDark ? "#FDE68A" : "#64748B",
        position: "relative",
        overflow: "hidden",
      }}
      title={
        isDark
          ? "Switch to Light Mode"
          : "Switch to Dark Mode"
      }
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon size={18} />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun size={18} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}