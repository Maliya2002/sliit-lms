// components/landing/hero.tsx
"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Play,
  Users,
  BookOpen,
  Award,
} from "lucide-react"

export function Hero() {
  const router = useRouter()

  return (
    <section
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #312E81 100%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        padding: "120px 24px 80px",
      }}
    >
      {/* Background Effects */}
      <div
        style={{
          position: "absolute",
          top: "-200px",
          right: "-200px",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,102,255,0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          left: "-100px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(108,58,237,0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
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
          backgroundSize: "60px 60px",
        }}
      />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          zIndex: 10,
          width: "100%",
        }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 16px",
            background: "rgba(0,102,255,0.15)",
            border: "1px solid rgba(0,102,255,0.3)",
            borderRadius: "30px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#0066FF",
              animation: "pulse 2s infinite",
            }}
          />
          <span
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#93C5FD",
              letterSpacing: "0.02em",
            }}
          >
            🎓 Sri Lanka Institute of Information Technology
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontSize: "clamp(36px, 6vw, 72px)",
            fontWeight: "800",
            color: "white",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            marginBottom: "24px",
            maxWidth: "800px",
          }}
        >
          Transform Your{" "}
          <span
            style={{
              background:
                "linear-gradient(135deg, #60A5FA, #A78BFA, #F472B6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Learning Experience
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            fontSize: "clamp(16px, 2vw, 20px)",
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.7,
            maxWidth: "600px",
            marginBottom: "40px",
          }}
        >
          Access courses, submit assignments, take quizzes,
          track attendance, and manage your academic journey
          — all in one powerful platform.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{
            display: "flex",
            gap: "16px",
            marginBottom: "64px",
            flexWrap: "wrap",
          }}
        >
          {/* Primary CTA */}
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 8px 30px rgba(0,102,255,0.4)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/register")}
            style={{
              padding: "16px 32px",
              background:
                "linear-gradient(135deg, #0066FF, #6C3AED)",
              color: "white",
              border: "none",
              borderRadius: "14px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "0 4px 20px rgba(0,102,255,0.35)",
            }}
          >
            Get Started Free
            <ArrowRight size={18} />
          </motion.button>

          {/* Secondary CTA */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/login")}
            style={{
              padding: "16px 32px",
              background: "rgba(255,255,255,0.08)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "14px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backdropFilter: "blur(10px)",
            }}
          >
            <Play size={18} />
            Sign In
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            display: "flex",
            gap: "48px",
            flexWrap: "wrap",
          }}
        >
          {[
            {
              icon: <Users size={24} color="#60A5FA" />,
              value: "20,000+",
              label: "Active Students",
            },
            {
              icon: <BookOpen size={24} color="#A78BFA" />,
              value: "500+",
              label: "Expert Lecturers",
            },
            {
              icon: <Award size={24} color="#F472B6" />,
              value: "100+",
              label: "Courses Available",
            },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.06)",
                  border:
                    "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {stat.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "800",
                    color: "white",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.5)",
                    marginTop: "2px",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </section>
  )
}