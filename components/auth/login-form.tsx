// components/auth/login-form.tsx
"use client"

import { useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"

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

  // ── Derive info message from URL params (no useEffect needed) ──
  const infoMessage = useMemo(() => {
    if (registered === "true") {
      return "Account created successfully! Please sign in."
    }
    if (reset === "success") {
      return "Password reset successfully! Please sign in with your new password."
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      {/* Info Message */}
      {infoMessage && !success && (
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            color: "#16a34a",
            padding: "12px 16px",
            borderRadius: "10px",
            fontSize: "14px",
            marginBottom: "16px",
          }}
        >
          ✅ {infoMessage}
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            padding: "12px 16px",
            borderRadius: "10px",
            fontSize: "14px",
            marginBottom: "16px",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            color: "#16a34a",
            padding: "12px 16px",
            borderRadius: "10px",
            fontSize: "14px",
            marginBottom: "16px",
          }}
        >
          ✅ Login successful! Redirecting...
        </div>
      )}

      {/* Email */}
      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "6px",
          }}
        >
          Email Address
        </label>
        <input
          {...register("email")}
          type="email"
          placeholder="you@sliit.lk"
          disabled={isLoading || success}
          style={{
            width: "100%",
            padding: "12px 16px",
            border: `1px solid ${
              errors.email ? "#ef4444" : "#e2e8f0"
            }`,
            borderRadius: "10px",
            fontSize: "14px",
            color: "#1e293b",
            background: "white",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        {errors.email && (
          <p
            style={{
              color: "#ef4444",
              fontSize: "12px",
              marginTop: "4px",
            }}
          >
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "6px",
          }}
        >
          <label
            style={{
              fontSize: "14px",
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
              color: "#2563eb",
              textDecoration: "none",
            }}
          >
            Forgot password?
          </a>
        </div>

        <div style={{ position: "relative" }}>
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            disabled={isLoading || success}
            style={{
              width: "100%",
              padding: "12px 48px 12px 16px",
              border: `1px solid ${
                errors.password ? "#ef4444" : "#e2e8f0"
              }`,
              borderRadius: "10px",
              fontSize: "14px",
              color: "#1e293b",
              background: "white",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
              fontSize: "12px",
              padding: "4px",
            }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {errors.password && (
          <p
            style={{
              color: "#ef4444",
              fontSize: "12px",
              marginTop: "4px",
            }}
          >
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading || success}
        style={{
          width: "100%",
          padding: "13px",
          background: success ? "#16a34a" : "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "10px",
          fontSize: "15px",
          fontWeight: "600",
          cursor: isLoading || success ? "not-allowed" : "pointer",
          marginBottom: "16px",
          opacity: isLoading ? 0.8 : 1,
        }}
      >
        {isLoading
          ? "Signing in..."
          : success
          ? "✅ Success!"
          : "Sign In"}
      </button>

      {/* Divider */}
      <div
        style={{
          textAlign: "center",
          color: "#94a3b8",
          fontSize: "13px",
          marginBottom: "16px",
        }}
      >
        — New to SLIIT LMS? —
      </div>

      {/* Register Link */}
      <a
        href="/register"
        style={{
          display: "block",
          width: "100%",
          padding: "13px",
          background: "white",
          color: "#1e293b",
          border: "1px solid #e2e8f0",
          borderRadius: "10px",
          fontSize: "15px",
          fontWeight: "600",
          textAlign: "center",
          textDecoration: "none",
          marginBottom: "24px",
          boxSizing: "border-box",
        }}
      >
        Create an Account
      </a>

      {/* Demo Credentials */}
      <div
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "16px",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            fontWeight: "700",
            color: "#1e293b",
            marginBottom: "10px",
          }}
        >
          🧪 Demo Credentials
        </p>
        {[
          {
            role: "Admin",
            email: "admin@sliit.lk",
            pass: "Admin@123",
          },
          {
            role: "Lecturer",
            email: "silva@sliit.lk",
            pass: "Lecturer@123",
          },
          {
            role: "Student",
            email: "student@sliit.lk",
            pass: "Student@123",
          },
        ].map((cred) => (
          <div
            key={cred.role}
            style={{
              fontSize: "12px",
              color: "#64748b",
              marginBottom: "4px",
              display: "flex",
              gap: "8px",
            }}
          >
            <span
              style={{
                fontWeight: "600",
                color: "#374151",
                minWidth: "60px",
              }}
            >
              {cred.role}:
            </span>
            <span>{cred.email}</span>
            <span style={{ color: "#94a3b8" }}>/</span>
            <span>{cred.pass}</span>
          </div>
        ))}
      </div>
    </form>
  )
}