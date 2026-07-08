// hooks/use-dark-mode.ts
"use client"

import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

export function useDarkMode() {
  const { theme } = useTheme()
  const mounted = useMounted()

  const isDark = mounted && theme === "dark"

  return {
    isDark,
    mounted,
    // Common color helpers
    bg: {
      primary: isDark ? "#0B0F1A" : "#F8FAFC",
      card: isDark ? "#1E293B" : "white",
      input: isDark ? "#1E293B" : "#F8FAFC",
      hover: isDark ? "#1E293B" : "#F8FAFC",
      muted: isDark ? "#111827" : "#F1F5F9",
    },
    text: {
      primary: isDark ? "#F1F5F9" : "#0F172A",
      secondary: isDark ? "#94A3B8" : "#475569",
      muted: isDark ? "#64748B" : "#94A3B8",
    },
    border: {
      default: isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9",
      strong: isDark ? "rgba(255,255,255,0.12)" : "#E2E8F0",
    },
    shadow: {
      sm: isDark
        ? "0 2px 8px rgba(0,0,0,0.3)"
        : "0 2px 8px rgba(0,0,0,0.04)",
      md: isDark
        ? "0 8px 24px rgba(0,0,0,0.4)"
        : "0 8px 24px rgba(0,0,0,0.08)",
    },
  }
}