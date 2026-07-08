// components/landing/how-it-works.tsx
"use client"

import { motion } from "framer-motion"

const STEPS = [
  {
    number: "01",
    title: "Create Your Account",
    description:
      "Register as a student or lecturer. Get instant access to your personalized dashboard.",
    icon: "🎓",
    gradient: "linear-gradient(135deg, #0066FF, #6C3AED)",
  },
  {
    number: "02",
    title: "Enroll in Courses",
    description:
      "Browse available courses and enroll with one click. Track your progress in real-time.",
    icon: "📚",
    gradient: "linear-gradient(135deg, #7C3AED, #EC4899)",
  },
  {
    number: "03",
    title: "Learn & Complete",
    description:
      "Submit assignments, take quizzes, attend classes. Everything in one place.",
    icon: "✅",
    gradient: "linear-gradient(135deg, #059669, #0D9488)",
  },
  {
    number: "04",
    title: "Excel & Graduate",
    description:
      "Track your GPA, view grades, and celebrate your academic achievements.",
    icon: "🏆",
    gradient: "linear-gradient(135deg, #F59E0B, #EF4444)",
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        padding: "120px 24px",
        background: "white",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            textAlign: "center",
            marginBottom: "64px",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              fontWeight: "700",
              color: "#7C3AED",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              display: "block",
              marginBottom: "16px",
            }}
          >
            🚀 How It Works
          </span>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: "800",
              color: "#0F172A",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              marginBottom: "16px",
            }}
          >
            Get Started in{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #7C3AED, #0066FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              4 Simple Steps
            </span>
          </h2>
          <p
            style={{
              fontSize: "18px",
              color: "#64748B",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            From registration to graduation — we support your
            entire academic journey.
          </p>
        </motion.div>

        {/* Steps */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px",
            position: "relative",
          }}
        >
          {STEPS.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.12,
              }}
              whileHover={{ y: -8 }}
              style={{
                background: "#F8FAFC",
                borderRadius: "24px",
                padding: "32px",
                border: "1px solid #F1F5F9",
                position: "relative",
                overflow: "hidden",
                cursor: "default",
                transition: "all 0.3s ease",
              }}
            >
              {/* Number */}
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  fontSize: "48px",
                  fontWeight: "900",
                  color: "rgba(0,0,0,0.04)",
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                {step.number}
              </div>

              {/* Icon */}
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "18px",
                  background: step.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  marginBottom: "20px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                }}
              >
                {step.icon}
              </div>

              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "800",
                  color: "#0F172A",
                  marginBottom: "10px",
                  letterSpacing: "-0.01em",
                }}
              >
                {step.title}
              </h3>

              <p
                style={{
                  fontSize: "14px",
                  color: "#64748B",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}