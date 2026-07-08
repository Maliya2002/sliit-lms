// components/auth/auth-wrapper.tsx
"use client"

import { motion } from "framer-motion"
import { GraduationCap, Sparkles } from "lucide-react"
import { useDarkMode } from "@/hooks/use-dark-mode"

interface AuthWrapperProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export function AuthWrapper({
  children,
  title,
  subtitle,
}: AuthWrapperProps) {
  const { isDark } = useDarkMode()

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: isDark ? "#0B0F1A" : "#F8FAFC",
        transition: "background 0.3s ease",
      }}
    >
      {/* ── LEFT SIDE — Premium Branding ── */}
      <div
        style={{
          display: "none",
          width: "50%",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #312E81 100%)",
        }}
        className="auth-left"
      >
        {/* Floating Orbs */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: "15%",
            right: "20%",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,102,255,0.25) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            x: [0, -20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            bottom: "20%",
            left: "15%",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(108,58,237,0.25) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        <motion.div
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: "60%",
            right: "10%",
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(244,114,182,0.2) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* Grid Pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "48px",
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                background:
                  "linear-gradient(135deg, #0066FF, #6C3AED)",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  "0 4px 16px rgba(0,102,255,0.4)",
              }}
            >
              <GraduationCap size={24} color="white" />
            </div>
            <div>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "800",
                  color: "white",
                  letterSpacing: "-0.01em",
                }}
              >
                SLIIT
              </span>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "300",
                  color: "#93C5FD",
                  marginLeft: "6px",
                }}
              >
                LMS
              </span>
            </div>
          </motion.div>

          {/* Center Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                background: "rgba(0,102,255,0.15)",
                border:
                  "1px solid rgba(0,102,255,0.25)",
                borderRadius: "30px",
                marginBottom: "24px",
              }}
            >
              <Sparkles size={14} color="#60A5FA" />
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#93C5FD",
                }}
              >
                Learning Management System
              </span>
            </div>

            <h2
              style={{
                fontSize: "42px",
                fontWeight: "800",
                color: "white",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                marginBottom: "20px",
              }}
            >
              Empowering
              <br />
              Education{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #60A5FA, #A78BFA)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Digitally
              </span>
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.7,
                maxWidth: "400px",
              }}
            >
              Access courses, submit assignments, track
              grades, and manage your entire academic
              journey in one platform.
            </p>

            {/* Stats */}
            <div
              style={{
                display: "flex",
                gap: "24px",
                marginTop: "40px",
              }}
            >
              {[
                { value: "20K+", label: "Students" },
                { value: "500+", label: "Lecturers" },
                { value: "100+", label: "Courses" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05 }}
                  style={{
                    padding: "16px 20px",
                    background:
                      "rgba(255,255,255,0.06)",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "14px",
                    textAlign: "center",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "800",
                      color: "white",
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.5)",
                      marginTop: "4px",
                    }}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{
              padding: "24px",
              background: "rgba(255,255,255,0.05)",
              border:
                "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              backdropFilter: "blur(10px)",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.7)",
                fontStyle: "italic",
                lineHeight: 1.6,
                margin: "0 0 8px",
              }}
            >
              &ldquo;Education is the most powerful
              weapon which you can use to change the
              world.&rdquo;
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.4)",
                margin: 0,
              }}
            >
              — Nelson Mandela
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── RIGHT SIDE — Form ── */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="auth-right-side"
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
          background: isDark ? "#111827" : "white",
          minHeight: "100vh",
          overflowY: "auto",
          transition: "background 0.3s ease",
        }}
      >
        <div
          className="auth-form-container"
          style={{ width: "100%", maxWidth: "420px" }}
        >
          {/* Mobile Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mobile-logo"
            style={{
              alignItems: "center",
              gap: "10px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                background:
                  "linear-gradient(135deg, #0066FF, #6C3AED)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  "0 4px 12px rgba(0,102,255,0.3)",
              }}
            >
              <GraduationCap size={22} color="white" />
            </div>
            <div>
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "800",
                  color: isDark ? "#F1F5F9" : "#0F172A",
                }}
              >
                SLIIT
              </span>
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "300",
                  color: "#6C3AED",
                  marginLeft: "4px",
                }}
              >
                LMS
              </span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ marginBottom: "32px" }}
          >
            <h2
              style={{
                fontSize: "clamp(22px, 5vw, 28px)",
                fontWeight: "800",
                color: isDark ? "#F1F5F9" : "#0F172A",
                letterSpacing: "-0.02em",
                marginBottom: "8px",
              }}
            >
              {title}
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: isDark ? "#64748B" : "#64748B",
                lineHeight: 1.6,
              }}
            >
              {subtitle}
            </p>
          </motion.div>

          {/* Form Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {children}
          </motion.div>
        </div>
      </motion.div>

      {/* Responsive CSS */}
      <style>{`
        .auth-left {
          display: none !important;
        }
        .mobile-logo {
          display: flex !important;
        }

        @media (min-width: 1024px) {
          .auth-left {
            display: flex !important;
          }
          .mobile-logo {
            display: none !important;
          }
        }

        @media (max-width: 480px) {
          .auth-right-side {
            padding: 20px 16px !important;
          }
          .auth-form-container {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  )
}