// components/landing/navbar.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { GraduationCap, Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: "0 24px",
        transition: "all 0.3s ease",
        background: scrolled
          ? "rgba(255,255,255,0.85)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(226,232,240,0.6)"
          : "1px solid transparent",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
          }}
          onClick={() => router.push("/")}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              background:
                "linear-gradient(135deg, #0066FF, #6C3AED)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,102,255,0.3)",
            }}
          >
            <GraduationCap size={20} color="white" />
          </div>
          <div>
            <span
              style={{
                fontSize: "18px",
                fontWeight: "800",
                color: scrolled ? "#0F172A" : "white",
                letterSpacing: "-0.02em",
              }}
            >
              SLIIT
            </span>
            <span
              style={{
                fontSize: "18px",
                fontWeight: "300",
                color: scrolled ? "#6C3AED" : "#93C5FD",
                marginLeft: "4px",
              }}
            >
              LMS
            </span>
          </div>
        </motion.div>

        {/* Desktop Links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              whileHover={{ y: -2 }}
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: scrolled
                  ? "#475569"
                  : "rgba(255,255,255,0.8)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
            >
              {link.label}
            </motion.a>
          ))}

          {/* ✅ ThemeToggle is a sibling, NOT inside another button */}
          <ThemeToggle />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/login")}
            style={{
              padding: "10px 20px",
              background: scrolled
                ? "transparent"
                : "rgba(255,255,255,0.15)",
              color: scrolled ? "#0066FF" : "white",
              border: `1.5px solid ${
                scrolled ? "#0066FF" : "rgba(255,255,255,0.3)"
              }`,
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              backdropFilter: "blur(10px)",
            }}
          >
            Sign In
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/register")}
            style={{
              padding: "10px 24px",
              background:
                "linear-gradient(135deg, #0066FF, #6C3AED)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(0,102,255,0.35)",
            }}
          >
            Get Started
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: "none",
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "rgba(255,255,255,0.1)",
            border: "none",
            color: scrolled ? "#0F172A" : "white",
            cursor: "pointer",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="mobile-menu-btn"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: "absolute",
              top: "72px",
              left: 0,
              right: 0,
              background: "white",
              padding: "20px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "block",
                  padding: "14px 0",
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "#0F172A",
                  textDecoration: "none",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                {link.label}
              </a>
            ))}

            {/* Mobile theme toggle row */}
            <div
              style={{
                marginTop: "16px",
                marginBottom: "16px",
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <ThemeToggle />
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
              }}
            >
              <button
                onClick={() => router.push("/login")}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "white",
                  color: "#0066FF",
                  border: "1.5px solid #0066FF",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => router.push("/register")}
                style={{
                  flex: 1,
                  padding: "12px",
                  background:
                    "linear-gradient(135deg, #0066FF, #6C3AED)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </motion.nav>
  )
}