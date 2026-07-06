"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, Mail, Send, CheckCircle } from "lucide-react"

const schema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
})

type FormData = z.infer<typeof schema>

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [sentEmail, setSentEmail] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Something went wrong")
        return
      }

      setSentEmail(data.email)
      setSuccess(true)
    } catch {
      setError("Network error. Please check your connection.")
    } finally {
      setIsLoading(false)
    }
  }

  // ── Success State ──
  if (success) {
    return (
      <div style={{ textAlign: "center" }}>
        {/* Success Icon */}
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
            marginBottom: "8px",
          }}
        >
          Check your email! 📧
        </h3>

        <p
          style={{
            fontSize: "14px",
            color: "#64748b",
            marginBottom: "8px",
            lineHeight: 1.6,
          }}
        >
          We sent a password reset link to
        </p>

        <p
          style={{
            fontSize: "15px",
            fontWeight: "600",
            color: "#2563eb",
            marginBottom: "24px",
          }}
        >
          {sentEmail}
        </p>

        <div
          style={{
            background: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: "10px",
            padding: "14px 16px",
            marginBottom: "28px",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              color: "#92400e",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            ⏰ The reset link will expire in{" "}
            <strong>1 hour</strong>. Check your spam folder if
            you don&apos;t see it.
          </p>
        </div>

        {/* Resend Button */}
        <button
          type="button"
          onClick={() => {
            setSuccess(false)
            setSentEmail("")
          }}
          style={{
            width: "100%",
            padding: "12px",
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: "600",
            color: "#1e293b",
            cursor: "pointer",
            marginBottom: "12px",
          }}
        >
          Resend Email
        </button>

        {/* Back to Login */}
        <a
          href="/login"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            fontSize: "14px",
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          <ArrowLeft size={16} />
          Back to Login
        </a>
      </div>
    )
  }

  // ── Form State ──
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Error */}
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

      {/* Email Field */}
      <div style={{ marginBottom: "20px" }}>
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

        <div style={{ position: "relative" }}>
          <Mail
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
            {...register("email")}
            type="email"
            placeholder="you@sliit.lk"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px 14px 12px 42px",
              border: `1px solid ${errors.email ? "#ef4444" : "#e2e8f0"}`,
              borderRadius: "10px",
              fontSize: "14px",
              color: "#1e293b",
              background: "white",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

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

      {/* Info Box */}
      <div
        style={{
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: "10px",
          padding: "14px 16px",
          marginBottom: "24px",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            color: "#1d4ed8",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          💡 Enter your registered email address and we&apos;ll
          send you a link to reset your password.
        </p>
      </div>

      {/* Submit Button */}
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "20px",
        }}
      >
        <Send size={16} />
        {isLoading ? "Sending..." : "Send Reset Link"}
      </button>

      {/* Back to Login */}
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
          fontWeight: "500",
        }}
      >
        <ArrowLeft size={16} />
        Back to Login
      </a>
    </form>
  )
}