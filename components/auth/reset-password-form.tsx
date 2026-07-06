"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  Lock,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
} from "lucide-react"

const schema = z
  .object({
    password: z
      .string()
      .min(8, "At least 8 characters required")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Must contain uppercase, lowercase and number"
      ),
    confirmPassword: z.string().min(1, "Please confirm password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type FormData = z.infer<typeof schema>

function getStrength(password: string) {
  if (!password) return { score: 0, label: "", color: "#e2e8f0" }
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  if (score <= 2) return { score, label: "Weak", color: "#ef4444" }
  if (score <= 4) return { score, label: "Medium", color: "#f59e0b" }
  return { score, label: "Strong", color: "#22c55e" }
}

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(Boolean(token))
  const [isValidToken, setIsValidToken] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passwordValue, setPasswordValue] = useState("")

  const strength = getStrength(passwordValue)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  // Verify token on mount
  useEffect(() => {
    if (!token) {
      return
    }

    fetch(`/api/auth/reset-password?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        setIsValidToken(data.valid)
        setIsVerifying(false)
      })
      .catch(() => {
        setIsValidToken(false)
        setIsVerifying(false)
      })
  }, [token])

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Failed to reset password")
        return
      }

      setSuccess(true)

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login?reset=success")
      }, 2000)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // ── Verifying State ──
  if (isVerifying) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid #e2e8f0",
            borderTop: "3px solid #2563eb",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 16px",
          }}
        />
        <p style={{ color: "#64748b", fontSize: "14px" }}>
          Verifying your reset link...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
      </div>
    )
  }

  // ── Invalid Token State ──
  if (!isValidToken) {
    return (
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "72px",
            height: "72px",
            background: "#fef2f2",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <AlertTriangle size={36} color="#dc2626" />
        </div>

        <h3
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#1e293b",
            marginBottom: "12px",
          }}
        >
          Invalid or Expired Link
        </h3>

        <p
          style={{
            fontSize: "14px",
            color: "#64748b",
            lineHeight: 1.6,
            marginBottom: "28px",
          }}
        >
          This password reset link is invalid or has expired.
          Please request a new one.
        </p>

        <a
          href="/forgot-password"
          style={{
            display: "block",
            padding: "13px",
            background: "#2563eb",
            color: "white",
            borderRadius: "10px",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "12px",
            textAlign: "center",
          }}
        >
          Request New Reset Link
        </a>

        <a
          href="/login"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            fontSize: "14px",
            color: "#64748b",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={16} />
          Back to Login
        </a>
      </div>
    )
  }

  // ── Success State ──
  if (success) {
    return (
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "72px",
            height: "72px",
            background: "#f0fdf4",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            border: "1px solid #bbf7d0",
          }}
        >
          <CheckCircle size={36} color="#16a34a" />
        </div>

        <h3
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#1e293b",
            marginBottom: "12px",
          }}
        >
          Password Reset! 🎉
        </h3>

        <p
          style={{
            fontSize: "14px",
            color: "#64748b",
            lineHeight: 1.6,
            marginBottom: "8px",
          }}
        >
          Your password has been reset successfully.
        </p>

        <p
          style={{
            fontSize: "13px",
            color: "#94a3b8",
          }}
        >
          Redirecting to login...
        </p>
      </div>
    )
  }

  // ── Reset Form ──
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            padding: "12px 16px",
            borderRadius: "10px",
            fontSize: "13px",
            marginBottom: "20px",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* New Password */}
      <div style={{ marginBottom: "8px" }}>
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "6px",
          }}
        >
          New Password
        </label>

        <div style={{ position: "relative" }}>
          <Lock
            size={16}
            color="#94a3b8"
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Min 8 characters"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px 48px 12px 42px",
              border: `1px solid ${errors.password ? "#ef4444" : "#e2e8f0"}`,
              borderRadius: "10px",
              fontSize: "14px",
              color: "#1e293b",
              background: "white",
              outline: "none",
              boxSizing: "border-box",
            }}
            onChange={(e) => {
              setPasswordValue(e.target.value)
              register("password").onChange(e)
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
              padding: 0,
            }}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {errors.password && (
          <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Password Strength */}
      {passwordValue && (
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: "4px",
                  borderRadius: "2px",
                  background:
                    i <= strength.score ? strength.color : "#e2e8f0",
                  transition: "background 0.3s",
                }}
              />
            ))}
          </div>
          <p
            style={{
              fontSize: "11px",
              color: strength.color,
              fontWeight: "600",
              margin: 0,
            }}
          >
            {strength.label} password
          </p>
        </div>
      )}

      {/* Confirm Password */}
      <div style={{ marginBottom: "24px" }}>
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "6px",
          }}
        >
          Confirm Password
        </label>

        <div style={{ position: "relative" }}>
          <Lock
            size={16}
            color="#94a3b8"
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <input
            {...register("confirmPassword")}
            type={showConfirm ? "text" : "password"}
            placeholder="Re-enter password"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px 48px 12px 42px",
              border: `1px solid ${
                errors.confirmPassword ? "#ef4444" : "#e2e8f0"
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
            onClick={() => setShowConfirm(!showConfirm)}
            style={{
              position: "absolute",
              right: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
              padding: 0,
            }}
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {errors.confirmPassword && (
          <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        style={{
          width: "100%",
          padding: "13px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "10px",
          fontSize: "15px",
          fontWeight: "600",
          cursor: isLoading ? "not-allowed" : "pointer",
          opacity: isLoading ? 0.8 : 1,
          marginBottom: "16px",
        }}
      >
        {isLoading ? "Resetting..." : "Reset Password"}
      </button>

      <a
        href="/login"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          fontSize: "14px",
          color: "#64748b",
          textDecoration: "none",
        }}
      >
        <ArrowLeft size={16} />
        Back to Login
      </a>
    </form>
  )
}