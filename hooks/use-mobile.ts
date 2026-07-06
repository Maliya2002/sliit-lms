// hooks/use-mobile.ts
// Custom hook to detect screen size

"use client"

import { useState, useEffect } from "react"

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [mounted] = useState(() => typeof window !== "undefined")

  useEffect(() => {
    const checkSize = () => {
      const width = window.innerWidth
      setIsMobile(width < breakpoint)
      setIsTablet(width >= breakpoint && width < 1024)
    }

    // Check on mount
    checkSize()

    // Listen for resize
    window.addEventListener("resize", checkSize)

    // Cleanup
    return () => window.removeEventListener("resize", checkSize)
  }, [breakpoint])

  return { isMobile, isTablet, mounted }
}

export function useWindowSize() {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    const update = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return size
}