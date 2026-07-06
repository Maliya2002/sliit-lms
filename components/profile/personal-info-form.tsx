// components/profile/personal-info-form.tsx
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { User, Phone, MapPin, FileText, Save } from "lucide-react"

const schema = z.object({
  firstName: z.string().min(2, "Min 2 characters").max(50),
  lastName: z.string().min(2, "Min 2 characters").max(50),
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().max(500, "Max 500 characters").optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER", ""]).optional(),
  dateOfBirth: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  profile: {
    firstName: string
    lastName: string
    phone: string | null
    address: string | null
    bio: string | null
    gender: string | null
    dateOfBirth: string | null
  } | null
  onSuccess: () => void
}

export function PersonalInfoForm({ profile, onSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
      bio: profile?.bio || "",
      gender: (profile?.gender as FormData["gender"]) || "",
      dateOfBirth: profile?.dateOfBirth
        ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
        : "",
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Failed to update profile")
        return
      }

      setSuccess(true)
      setIsEditing(false)
      onSuccess()

      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const inputStyle = (hasError: boolean) => ({
    width: "100%",
    padding: "11px 14px",
    border: `1px solid ${hasError ? "#ef4444" : "#e2e8f0"}`,
    borderRadius: "10px",
    fontSize: "14px",
    color: "#1e293b",
    background: isEditing ? "white" : "#f8fafc",
    outline: "none",
    boxSizing: "border-box" as const,
    cursor: isEditing ? "text" : "default",
  })

  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        border: "1px solid #f1f5f9",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              background: "#eff6ff",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User size={18} color="#2563eb" />
          </div>
          <div>
            <h3
              style={{
                fontSize: "15px",
                fontWeight: "700",
                color: "#1e293b",
                margin: 0,
              }}
            >
              Personal Information
            </h3>
            <p
              style={{
                fontSize: "12px",
                color: "#94a3b8",
                margin: 0,
              }}
            >
              Update your personal details
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsEditing(!isEditing)
            setError(null)
            setSuccess(false)
          }}
          style={{
            padding: "8px 20px",
            background: isEditing ? "#f1f5f9" : "#eff6ff",
            color: isEditing ? "#64748b" : "#2563eb",
            border: "none",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ padding: "24px" }}>

          {/* Success */}
          {success && (
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#16a34a",
                padding: "12px 16px",
                borderRadius: "10px",
                fontSize: "13px",
                marginBottom: "20px",
              }}
            >
              ✅ Profile updated successfully!
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
                fontSize: "13px",
                marginBottom: "20px",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* Name Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                First Name
              </label>
              <input
                {...register("firstName")}
                disabled={!isEditing}
                style={inputStyle(!!errors.firstName)}
              />
              {errors.firstName && (
                <p
                  style={{
                    color: "#ef4444",
                    fontSize: "11px",
                    marginTop: "3px",
                  }}
                >
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Last Name
              </label>
              <input
                {...register("lastName")}
                disabled={!isEditing}
                style={inputStyle(!!errors.lastName)}
              />
              {errors.lastName && (
                <p
                  style={{
                    color: "#ef4444",
                    fontSize: "11px",
                    marginTop: "3px",
                  }}
                >
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "6px",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Phone size={14} />
                Phone Number
              </span>
            </label>
            <input
              {...register("phone")}
              placeholder="+94 77 123 4567"
              disabled={!isEditing}
              style={inputStyle(false)}
            />
          </div>

          {/* Gender & DOB Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Gender
              </label>
              <select
                {...register("gender")}
                disabled={!isEditing}
                style={{
                  ...inputStyle(false),
                  appearance: "none",
                }}
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Date of Birth
              </label>
              <input
                {...register("dateOfBirth")}
                type="date"
                disabled={!isEditing}
                style={inputStyle(false)}
              />
            </div>
          </div>

          {/* Address */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "6px",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <MapPin size={14} />
                Address
              </span>
            </label>
            <input
              {...register("address")}
              placeholder="Your address"
              disabled={!isEditing}
              style={inputStyle(false)}
            />
          </div>

          {/* Bio */}
          <div style={{ marginBottom: isEditing ? "24px" : "0" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "6px",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <FileText size={14} />
                Bio
              </span>
            </label>
            <textarea
              {...register("bio")}
              placeholder="Tell us about yourself..."
              disabled={!isEditing}
              rows={3}
              style={{
                ...inputStyle(false),
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />
            {errors.bio && (
              <p
                style={{
                  color: "#ef4444",
                  fontSize: "11px",
                  marginTop: "3px",
                }}
              >
                {errors.bio.message}
              </p>
            )}
          </div>

          {/* Save Button */}
          {isEditing && (
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
              }}
            >
              <Save size={16} />
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}