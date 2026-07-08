// components/quizzes/quiz-results.tsx
"use client"

import { motion } from "framer-motion"
import {
  CheckCircle,
  XCircle,
  Trophy,
  ArrowRight,
  Star,
} from "lucide-react"

interface QuizResult {
  score: number
  totalScore: number
  maxScore: number
  isPassed: boolean
  passingScore: number
}

interface Props {
  quizTitle: string
  result: QuizResult
  onClose: () => void
}

export function QuizResults({
  quizTitle,
  result,
  onClose,
}: Props) {
  const { score, isPassed, passingScore } = result

  const getMessage = () => {
    if (score >= 90) return "Outstanding! 🌟"
    if (score >= 80) return "Excellent Work! 🎉"
    if (score >= 70) return "Great Job! 👏"
    if (isPassed) return "Well Done! ✅"
    return "Keep Practicing! 💪"
  }

  const stars = score >= 90 ? 3 : score >= 75 ? 2 : isPassed ? 1 : 0

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        backdropFilter: "blur(8px)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{
          background: "white",
          borderRadius: "28px",
          width: "100%",
          maxWidth: "480px",
          overflow: "hidden",
          boxShadow: "0 40px 80px rgba(0,0,0,0.3)",
        }}
      >
        {/* Hero */}
        <div
          style={{
            background: isPassed
              ? "linear-gradient(135deg, #059669, #0D9488)"
              : "linear-gradient(135deg, #E11D48, #F59E0B)",
            padding: "48px 40px 40px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background pattern */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
                radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)
              `,
            }}
          />

          {/* Stars */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              marginBottom: "20px",
              position: "relative",
            }}
          >
            {[1, 2, 3].map((s) => (
              <motion.div
                key={s}
                initial={{ opacity: 0, scale: 0, rotate: -30 }}
                animate={{
                  opacity: s <= stars ? 1 : 0.2,
                  scale: 1,
                  rotate: 0,
                }}
                transition={{
                  delay: s * 0.15,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                <Star
                  size={28}
                  color={s <= stars ? "#FDE68A" : "rgba(255,255,255,0.3)"}
                  fill={s <= stars ? "#FDE68A" : "transparent"}
                />
              </motion.div>
            ))}
          </div>

          {/* Big Score */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.3,
              type: "spring",
              stiffness: 150,
            }}
            style={{
              fontSize: "80px",
              fontWeight: "900",
              color: "white",
              lineHeight: 1,
              marginBottom: "8px",
              letterSpacing: "-0.04em",
              position: "relative",
            }}
          >
            {score}
            <span style={{ fontSize: "40px" }}>%</span>
          </motion.div>

          <p
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "rgba(255,255,255,0.9)",
              margin: "0 0 4px",
            }}
          >
            {getMessage()}
          </p>
          <p
            style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.7)",
              margin: 0,
            }}
          >
            {quizTitle}
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: "32px 40px 36px" }}>
          {/* Pass/Fail Badge */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 24px",
                background: isPassed ? "#ECFDF5" : "#FFF1F2",
                color: isPassed ? "#059669" : "#E11D48",
                borderRadius: "20px",
                fontSize: "16px",
                fontWeight: "800",
                border: `1px solid ${isPassed ? "#A7F3D0" : "#FECDD3"}`,
              }}
            >
              {isPassed ? (
                <CheckCircle size={20} />
              ) : (
                <XCircle size={20} />
              )}
              {isPassed ? "PASSED" : "FAILED"}
            </motion.div>
          </div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "12px",
              marginBottom: "28px",
            }}
          >
            {[
              {
                label: "Your Score",
                value: `${score}%`,
                color: isPassed ? "#059669" : "#E11D48",
                bg: isPassed ? "#ECFDF5" : "#FFF1F2",
              },
              {
                label: "Pass Mark",
                value: `${passingScore}%`,
                color: "#7C3AED",
                bg: "#F5F3FF",
              },
              {
                label: "Points",
                value: `${result.totalScore}/${result.maxScore}`,
                color: "#0066FF",
                bg: "#EFF6FF",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: stat.bg,
                  borderRadius: "14px",
                  padding: "16px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: "900",
                    color: stat.color,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#94A3B8",
                    marginTop: "4px",
                    fontWeight: "600",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Trophy message */}
          {isPassed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{
                background:
                  "linear-gradient(135deg, #FFFBEB, #FEF3C7)",
                border: "1px solid #FDE68A",
                borderRadius: "14px",
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "24px",
              }}
            >
              <Trophy size={22} color="#F59E0B" />
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    color: "#92400E",
                  }}
                >
                  {score >= 90
                    ? "Perfect Score!"
                    : score >= 75
                    ? "Great performance!"
                    : "Quiz completed successfully!"}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#B45309",
                  }}
                >
                  Keep up the excellent work!
                </div>
              </div>
            </motion.div>
          )}

          {/* Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{
              scale: 1.03,
              boxShadow: isPassed
                ? "0 8px 24px rgba(5,150,105,0.3)"
                : "0 8px 24px rgba(0,102,255,0.3)",
            }}
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            style={{
              width: "100%",
              padding: "16px",
              background: isPassed
                ? "linear-gradient(135deg, #059669, #0D9488)"
                : "linear-gradient(135deg, #0066FF, #6C3AED)",
              color: "white",
              border: "none",
              borderRadius: "16px",
              fontSize: "16px",
              fontWeight: "800",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              letterSpacing: "-0.01em",
            }}
          >
            Back to Quizzes
            <ArrowRight size={18} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}