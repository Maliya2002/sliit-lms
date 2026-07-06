// components/profile/profile-header.tsx
"use client"


import {
  Camera,
  Mail,
  Shield,
  CheckCircle,
} from "lucide-react"

interface ProfileHeaderProps {
  user: {
    id: string
    email: string
    role: string
    status: string
    emailVerified: string | null
    createdAt: string
  }
  profile: {
    firstName: string
    lastName: string
    avatar: string | null
    studentId: string | null
    employeeId: string | null
    yearOfStudy: number | null
    bio: string | null
  } | null
  onEditClick: () => void
}

const ROLE_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  ADMIN: { label: "Administrator", color: "#dc2626", bg: "#fef2f2" },
  LECTURER: { label: "Lecturer", color: "#d97706", bg: "#fffbeb" },
  STUDENT: { label: "Student", color: "#2563eb", bg: "#eff6ff" },
  DEPARTMENT_HEAD: { label: "Department Head", color: "#7c3aed", bg: "#f5f3ff" },
  COURSE_COORDINATOR: { label: "Coordinator", color: "#059669", bg: "#ecfdf5" },
  TEACHING_ASSISTANT: { label: "Teaching Assistant", color: "#0891b2", bg: "#ecfeff" },
}

export function ProfileHeader({
  user,
  profile,
  onEditClick,
}: ProfileHeaderProps) {
  const roleConfig = ROLE_CONFIG[user.role] || ROLE_CONFIG.STUDENT
  const initials = profile
    ? `${profile.firstName[0]}${profile.lastName[0]}`
    : user.email[0].toUpperCase()

  return (
    <div
      style={{
        background: "white",
        borderRadius: "20px",
        border: "1px solid #f1f5f9",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        overflow: "hidden",
        marginBottom: "24px",
      }}
    >
      {/* Cover Image */}
      <div
        style={{
          height: "120px",
          background:
            "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #7c3aed 100%)",
        }}
      />

      {/* Profile Info */}
      <div style={{ padding: "0 32px 32px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          {/* Avatar */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: "96px",
                height: "96px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, #2563eb, #7c3aed)",
                border: "4px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "32px",
                fontWeight: "800",
                marginTop: "-48px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                cursor: "pointer",
                overflow: "hidden",
              }}
            >
              {profile?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar}
                  alt="Avatar"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                initials
              )}
            </div>

            {/* Camera Icon */}
            <div
              style={{
                position: "absolute",
                bottom: "2px",
                right: "2px",
                width: "28px",
                height: "28px",
                background: "#2563eb",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: "2px solid white",
              }}
            >
              <Camera size={14} color="white" />
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={onEditClick}
            style={{
              padding: "10px 24px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Edit Profile
          </button>
        </div>

        {/* Name & Role */}
        <div style={{ marginBottom: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "6px",
            }}
          >
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "800",
                color: "#1e293b",
                margin: 0,
              }}
            >
              {profile
                ? `${profile.firstName} ${profile.lastName}`
                : "User"}
            </h1>

            {/* Verified Badge */}
            {user.emailVerified && (
              <CheckCircle size={20} color="#2563eb" />
            )}
          </div>

          {/* Badges Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            {/* Role Badge */}
            <span
              style={{
                fontSize: "12px",
                fontWeight: "600",
                background: roleConfig.bg,
                color: roleConfig.color,
                padding: "4px 12px",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Shield size={12} />
              {roleConfig.label}
            </span>

            {/* Student ID */}
            {profile?.studentId && (
              <span
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  background: "#f8fafc",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  border: "1px solid #e2e8f0",
                }}
              >
                🎓 {profile.studentId}
              </span>
            )}

            {/* Year of Study */}
            {profile?.yearOfStudy && (
              <span
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  background: "#f8fafc",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  border: "1px solid #e2e8f0",
                }}
              >
                📅 Year {profile.yearOfStudy}
              </span>
            )}
          </div>
        </div>

        {/* Email */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          <Mail size={16} />
          <span>{user.email}</span>
        </div>

        {/* Bio */}
        {profile?.bio && (
          <p
            style={{
              fontSize: "14px",
              color: "#64748b",
              marginTop: "12px",
              lineHeight: 1.6,
              maxWidth: "600px",
            }}
          >
            {profile.bio}
          </p>
        )}
      </div>
    </div>
  )
}