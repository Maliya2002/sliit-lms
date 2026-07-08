// components/landing/cta-section.tsx
"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowRight, Sparkles } from "lucide-react"

export function CtaSection() {
  const router = useRouter()

  return (
    <section
      style={{
        padding: "120px 24px",
        background: "#F8FAFC",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            background:
              "linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #312E81 100%)",
            borderRadius: "32px",
            padding: "64px 48px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* BG Effects */}
          <div
            style={{
              position: "absolute",
              top: "-60px",
              right: "-60px",
              width: "250px",
              height: "250px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(0,102,255,0.2) 0%, transparent 70%)",
              filter: "blur(50px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-60px",
              left: "-60px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(108,58,237,0.2) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          {/* Content */}
          <div style={{ position: "relative" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 16px",
                background: "rgba(0,102,255,0.15)",
                border: "1px solid rgba(0,102,255,0.25)",
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
                Join 20,000+ Students & Lecturers
              </span>
            </motion.div>

            <h2
              style={{
                fontSize: "clamp(28px, 5vw, 44px)",
                fontWeight: "900",
                color: "white",
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                marginBottom: "20px",
              }}
            >
              Ready to Transform
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #60A5FA, #A78BFA, #F472B6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Your Education?
              </span>
            </h2>

            <p
              style={{
                fontSize: "18px",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.7,
                maxWidth: "500px",
                margin: "0 auto 40px",
              }}
            >
              Sign up for free today and experience the most
              advanced LMS platform built for SLIIT.
            </p>

            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow:
                    "0 12px 30px rgba(0,102,255,0.4)",
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/register")}
                style={{
                  padding: "16px 36px",
                  background:
                    "linear-gradient(135deg, #0066FF, #6C3AED)",
                  color: "white",
                  border: "none",
                  borderRadius: "16px",
                  fontSize: "16px",
                  fontWeight: "800",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  boxShadow:
                    "0 6px 20px rgba(0,102,255,0.35)",
                  letterSpacing: "-0.01em",
                }}
              >
                Get Started Free
                <ArrowRight size={18} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/login")}
                style={{
                  padding: "16px 36px",
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "16px",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                  backdropFilter: "blur(10px)",
                  letterSpacing: "-0.01em",
                }}
              >
                Sign In
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}