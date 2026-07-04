// components/auth/register-form.tsx
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"

// ─────────────────────────────────────────
// Validation Schema
// ─────────────────────────────────────────
const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "At least 2 characters required")
      .max(50, "Too long"),
    lastName: z
      .string()
      .min(2, "At least 2 characters required")
      .max(50, "Too long"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .min(8, "At least 8 characters required")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Must contain uppercase, lowercase and number"
      ),
    confirmPassword: z.string().min(1, "Please confirm password"),
    role: z.enum(["STUDENT", "LECTURER"], {
      message: "Please select a role",
    }),
    studentId: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type RegisterFormData = z.infer<typeof registerSchema>

// ─────────────────────────────────────────
// Password Strength Helper
// ─────────────────────────────────────────
function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
} {
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

// ─────────────────────────────────────────
// Register Form Component
// ─────────────────────────────────────────
export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passwordValue, setPasswordValue] = useState("")
  const [selectedRole, setSelectedRole] = useState<
    "STUDENT" | "LECTURER" | null
  >(null)

  const strength = getPasswordStrength(passwordValue)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  // ─────────────────────────────────────────
  // Submit Handler
  // ─────────────────────────────────────────
  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Registration failed")
        return
      }

      setSuccess(true)

      setTimeout(() => {
        router.push("/login?registered=true")
      }, 1500)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // ─────────────────────────────────────────
  // Input Style Helper
  // ─────────────────────────────────────────
  const inputStyle = (hasError: boolean) => ({
    width: "100%",
    padding: "11px 14px",
    border: `1px solid ${hasError ? "#ef4444" : "#e2e8f0"}`,
    borderRadius: "10px",
    fontSize: "14px",
    color: "#1e293b",
    background: "white",
    outline: "none",
    boxSizing: "border-box" as const,
  })

  const labelStyle = {
    display: "block" as const,
    fontSize: "13px",
    fontWeight: "600" as const,
    color: "#374151",
    marginBottom: "5px",
  }

  const errorStyle = {
    color: "#ef4444",
    fontSize: "11px",
    marginTop: "3px",
  }

  // ─────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      {/* ── Error Message ── */}
      {error && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            padding: "12px 16px",
            borderRadius: "10px",
            fontSize: "13px",
            marginBottom: "16px",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* ── Success Message ── */}
      {success && (
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            color: "#16a34a",
            padding: "12px 16px",
            borderRadius: "10px",
            fontSize: "13px",
            marginBottom: "16px",
          }}
        >
          ✅ Account created! Redirecting to login...
        </div>
      )}

      {/* ── Name Fields ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          marginBottom: "14px",
        }}
      >
        {/* First Name */}
        <div>
          <label style={labelStyle}>First Name</label>
          <input
            {...register("firstName")}
            placeholder="Kasun"
            disabled={isLoading || success}
            style={inputStyle(!!errors.firstName)}
          />
          {errors.firstName && (
            <p style={errorStyle}>{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label style={labelStyle}>Last Name</label>
          <input
            {...register("lastName")}
            placeholder="Perera"
            disabled={isLoading || success}
            style={inputStyle(!!errors.lastName)}
          />
          {errors.lastName && (
            <p style={errorStyle}>{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* ── Email ── */}
      <div style={{ marginBottom: "14px" }}>
        <label style={labelStyle}>Email Address</label>
        <input
          {...register("email")}
          type="email"
          placeholder="you@sliit.lk"
          disabled={isLoading || success}
          style={inputStyle(!!errors.email)}
        />
        {errors.email && (
          <p style={errorStyle}>{errors.email.message}</p>
        )}
      </div>

      {/* ── Password ── */}
      <div style={{ marginBottom: "6px" }}>
        <label style={labelStyle}>Password</label>
        <div style={{ position: "relative" }}>
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Min 8 characters"
            disabled={isLoading || success}
            style={inputStyle(!!errors.password)}
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
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
              fontSize: "12px",
            }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.password && (
          <p style={errorStyle}>{errors.password.message}</p>
        )}
      </div>

      {/* ── Password Strength ── */}
      {passwordValue && (
        <div style={{ marginBottom: "14px" }}>
          <div
            style={{
              display: "flex",
              gap: "4px",
              marginBottom: "4px",
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: "4px",
                  borderRadius: "2px",
                  background:
                    i <= strength.score
                      ? strength.color
                      : "#e2e8f0",
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
            }}
          >
            {strength.label} password
          </p>
        </div>
      )}

      {/* ── Confirm Password ── */}
      <div style={{ marginBottom: "14px" }}>
        <label style={labelStyle}>Confirm Password</label>
        <div style={{ position: "relative" }}>
          <input
            {...register("confirmPassword")}
            type={showConfirm ? "text" : "password"}
            placeholder="Re-enter password"
            disabled={isLoading || success}
            style={inputStyle(!!errors.confirmPassword)}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
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
            }}
          >
            {showConfirm ? "Hide" : "Show"}
          </button>
        </div>
        {errors.confirmPassword && (
          <p style={errorStyle}>
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* ── Role Selection ── */}
      <div style={{ marginBottom: "14px" }}>
        <label style={labelStyle}>I am a...</label>
        <div style={{ display: "flex", gap: "10px" }}>
          {(["STUDENT", "LECTURER"] as const).map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => {
                setSelectedRole(role)
                setValue("role", role)
              }}
              style={{
                flex: 1,
                padding: "12px",
                border: `2px solid ${
                  selectedRole === role ? "#2563eb" : "#e2e8f0"
                }`,
                borderRadius: "10px",
                background:
                  selectedRole === role ? "#eff6ff" : "white",
                color:
                  selectedRole === role ? "#2563eb" : "#64748b",
                fontWeight: "600",
                fontSize: "13px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {role === "STUDENT" ? "🎓 Student" : "👨‍🏫 Lecturer"}
            </button>
          ))}
        </div>
        {errors.role && (
          <p style={errorStyle}>{errors.role.message}</p>
        )}
      </div>

      {/* ── Student ID (conditional) ── */}
      {selectedRole === "STUDENT" && (
        <div style={{ marginBottom: "14px" }}>
          <label style={labelStyle}>
            Student ID{" "}
            <span style={{ color: "#94a3b8", fontWeight: "400" }}>
              (optional)
            </span>
          </label>
          <input
            {...register("studentId")}
            placeholder="IT21XXXXXX"
            disabled={isLoading || success}
            style={inputStyle(false)}
          />
          <p
            style={{
              fontSize: "11px",
              color: "#94a3b8",
              marginTop: "3px",
            }}
          >
            Format: IT21000000
          </p>
        </div>
      )}

      {/* ── Submit Button ── */}
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
          marginBottom: "14px",
          opacity: isLoading ? 0.8 : 1,
        }}
      >
        {isLoading
          ? "Creating Account..."
          : success
          ? "✅ Account Created!"
          : "Create Account"}
      </button>

      {/* ── Login Link ── */}
      <div style={{ textAlign: "center" }}>
        <span style={{ fontSize: "13px", color: "#64748b" }}>
          Already have an account?{" "}
        </span>
        <a
          href="/login"
          style={{
            fontSize: "13px",
            color: "#2563eb",
            fontWeight: "600",
            textDecoration: "none",
          }}
        >
          Sign In
        </a>
      </div>
    </form>
  )
}