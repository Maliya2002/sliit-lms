// components/auth/login-form.tsx
"use client"

import { useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react"

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")
  const registered = searchParams.get("registered")
  const reset = searchParams.get("reset")

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const infoMessage = useMemo(() => {
    if (registered === "true") {
      return "Account created successfully! Please sign in."
    }
    if (reset === "success") {
      return "Password reset successfully! Sign in with your new password."
    }
    return null
  }, [registered, reset])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
        return
      }

      setSuccess(true)

      await new Promise((r) => setTimeout(r, 800))

      const res = await fetch("/api/auth/session")
      const session = await res.json()
      const role = session?.user?.role

      const map: Record<string, string> = {
        ADMIN: "/admin",
        DEPARTMENT_HEAD: "/admin",
        COURSE_COORDINATOR: "/admin",
        LECTURER: "/lecturer",
        TEACHING_ASSISTANT: "/lecturer",
        STUDENT: "/student",
      }

      const dest = callbackUrl || map[role] || "/student"
      router.push(dest)
      router.refresh()
    } catch (err) {
      console.error(err)
      setError("Something went wrong. Try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const inputWrapperStyle = {
    position: "relative" as const,
    marginBottom: "20px",
  }

  const inputStyle = (hasError: boolean, hasIcon: boolean) => ({
    width: "100%",
    padding: `14px ${hasIcon ? "48px" : "16px"} 14px ${
      hasIcon ? "44px" : "16px"
    }`,
    border: `2px solid ${
      hasError ? "#E11D48" : "#E2E8F0"
    }`,
    borderRadius: "14px",
    fontSize: "15px",
    color: "#0F172A",
    background: "#F8FAFC",
    outline: "none",
    boxSizing: "border-box" as const,
    transition: "all 0.2s ease",
  })

  const iconStyle = {
    position: "absolute" as const,
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#94A3B8",
    pointerEvents: "none" as const,
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Info Message */}
      <AnimatePresence>
        {infoMessage && !success && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            style={{
              background:
                "linear-gradient(135deg, #ECFDF5, #D1FAE5)",
              border: "1px solid #A7F3D0",
              color: "#065F46",
              padding: "14px 16px",
              borderRadius: "14px",
              fontSize: "14px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <CheckCircle size={18} />
            {infoMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            style={{
              background:
                "linear-gradient(135deg, #FFF1F2, #FFE4E6)",
              border: "1px solid #FECDD3",
              color: "#9F1239",
              padding: "14px 16px",
              borderRadius: "14px",
              fontSize: "14px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <AlertCircle size={18} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background:
                "linear-gradient(135deg, #ECFDF5, #D1FAE5)",
              border: "1px solid #A7F3D0",
              color: "#065F46",
              padding: "14px 16px",
              borderRadius: "14px",
              fontSize: "14px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Loader2
              size={18}
              style={{ animation: "spin 1s linear infinite" }}
            />
            Signing in... Redirecting to dashboard
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email */}
      <div style={inputWrapperStyle}>
        <label
          style={{
            display: "block",
            fontSize: "13px",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "8px",
          }}
        >
          Email Address
        </label>
        <div style={{ position: "relative" }}>
          <Mail size={18} style={iconStyle} />
          <input
            {...register("email")}
            type="email"
            placeholder="you@sliit.lk"
            disabled={isLoading || success}
            style={inputStyle(!!errors.email, true)}
            onFocus={(e) => {
              e.target.style.borderColor = "#0066FF"
              e.target.style.background = "white"
              e.target.style.boxShadow =
                "0 0 0 4px rgba(0,102,255,0.1)"
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.email
                ? "#E11D48"
                : "#E2E8F0"
              e.target.style.background = "#F8FAFC"
              e.target.style.boxShadow = "none"
            }}
          />
        </div>
        {errors.email && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              color: "#E11D48",
              fontSize: "12px",
              marginTop: "6px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <AlertCircle size={12} />
            {errors.email.message}
          </motion.p>
        )}
      </div>

      {/* Password */}
      <div style={inputWrapperStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <label
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#374151",
            }}
          >
            Password
          </label>
          <a
            href="/forgot-password"
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "#0066FF",
              textDecoration: "none",
            }}
          >
            Forgot password?
          </a>
        </div>
        <div style={{ position: "relative" }}>
          <Lock size={18} style={iconStyle} />
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            disabled={isLoading || success}
            style={inputStyle(!!errors.password, true)}
            onFocus={(e) => {
              e.target.style.borderColor = "#0066FF"
              e.target.style.background = "white"
              e.target.style.boxShadow =
                "0 0 0 4px rgba(0,102,255,0.1)"
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.password
                ? "#E11D48"
                : "#E2E8F0"
              e.target.style.background = "#F8FAFC"
              e.target.style.boxShadow = "none"
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94A3B8",
              padding: "4px",
              display: "flex",
            }}
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
        {errors.password && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              color: "#E11D48",
              fontSize: "12px",
              marginTop: "6px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <AlertCircle size={12} />
            {errors.password.message}
          </motion.p>
        )}
      </div>

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={isLoading || success}
        whileHover={
          !isLoading && !success
            ? {
                scale: 1.02,
                boxShadow:
                  "0 8px 25px rgba(0,102,255,0.35)",
              }
            : {}
        }
        whileTap={
          !isLoading && !success ? { scale: 0.98 } : {}
        }
        style={{
          width: "100%",
          padding: "15px",
          background: success
            ? "linear-gradient(135deg, #059669, #10B981)"
            : "linear-gradient(135deg, #0066FF, #6C3AED)",
          color: "white",
          border: "none",
          borderRadius: "14px",
          fontSize: "15px",
          fontWeight: "700",
          cursor:
            isLoading || success ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          boxShadow:
            "0 4px 16px rgba(0,102,255,0.3)",
          marginBottom: "24px",
          opacity: isLoading ? 0.85 : 1,
          transition: "all 0.2s ease",
        }}
      >
        {isLoading ? (
          <>
            <Loader2
              size={18}
              style={{
                animation: "spin 1s linear infinite",
              }}
            />
            Signing in...
          </>
        ) : success ? (
          <>
            <CheckCircle size={18} />
            Success!
          </>
        ) : (
          <>
            Sign In
            <ArrowRight size={18} />
          </>
        )}
      </motion.button>

      {/* Divider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            flex: 1,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, #E2E8F0, transparent)",
          }}
        />
        <span
          style={{
            fontSize: "12px",
            color: "#94A3B8",
            fontWeight: "500",
          }}
        >
          New to SLIIT LMS?
        </span>
        <div
          style={{
            flex: 1,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, #E2E8F0, transparent)",
          }}
        />
      </div>

      {/* Register Link */}
      <motion.a
        href="/register"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          width: "100%",
          padding: "14px",
          background: "white",
          color: "#0F172A",
          border: "2px solid #E2E8F0",
          borderRadius: "14px",
          fontSize: "15px",
          fontWeight: "600",
          textDecoration: "none",
          marginBottom: "32px",
          transition: "all 0.2s ease",
          cursor: "pointer",
        }}
      >
        Create an Account
        <ArrowRight size={16} color="#6C3AED" />
      </motion.a>
{/* Demo Credentials */}
<div
  style={{
    background: "#F8FAFC",
    border: "1px solid #E2E8F0",
    borderRadius: "14px",
    padding: "14px 16px",
  }}
>
  <p
    style={{
      fontSize: "12px",
      fontWeight: "700",
      color: "#0F172A",
      marginBottom: "10px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    }}
  >
    🧪 Demo Credentials
  </p>
  {[
    {
      role: "Admin",
      email: "admin@sliit.lk",
      pass: "Admin@123",
      color: "#E11D48",
    },
    {
      role: "Lecturer",
      email: "silva@sliit.lk",
      pass: "Lecturer@123",
      color: "#F59E0B",
    },
    {
      role: "Student",
      email: "student@sliit.lk",
      pass: "Student@123",
      color: "#0066FF",
    },
  ].map((cred) => (
    <div
      key={cred.role}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "11px",
        color: "#64748B",
        marginBottom: "6px",
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          fontSize: "10px",
          fontWeight: "700",
          color: cred.color,
          background: `${cred.color}15`,
          padding: "2px 8px",
          borderRadius: "6px",
          minWidth: "55px",
          textAlign: "center",
        }}
      >
        {cred.role}
      </span>
      <span style={{ color: "#475569", fontSize: "11px" }}>
        {cred.email}
      </span>
      <span style={{ color: "#CBD5E1" }}>/</span>
      <span style={{ color: "#475569", fontSize: "11px" }}>
        {cred.pass}
      </span>
    </div>
  ))}
</div>
    </form>
  )
}