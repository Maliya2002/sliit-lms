// components/settings/settings-client.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  User,
  Lock,
  Mail,
  Shield,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  Save,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { useDarkMode } from "@/hooks/use-dark-mode"

interface UserData {
  id: string
  email: string
  role: string
  status: string
  emailVerified: string | null
  createdAt: string
  lastLogin: string | null
}

interface ProfileData {
  firstName: string
  lastName: string
  displayName: string | null
  phone: string | null
  address: string | null
  bio: string | null
  gender: string | null
  dateOfBirth: string | null
  avatar: string | null
  studentId: string | null
  employeeId: string | null
}

export function SettingsClient() {
  const { isDark, bg, text, border, shadow } = useDarkMode()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "account">("profile")

  // Profile form
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [bio, setBio] = useState("")
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)

  // Password form
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setIsLoading(true)
        const res = await fetch("/api/settings")
        const data = await res.json()
        if (!cancelled && res.ok) {
          setUserData(data.user)
          setProfileData(data.profile)
          if (data.profile) {
            setFirstName(data.profile.firstName || "")
            setLastName(data.profile.lastName || "")
            setPhone(data.profile.phone || "")
            setAddress(data.profile.address || "")
            setBio(data.profile.bio || "")
          }
        }
      } catch (error) {
        console.error("Load settings error:", error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  const handleProfileSave = async () => {
    try {
      setProfileSaving(true)
      setProfileError(null)

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          phone: phone || null,
          address: address || null,
          bio: bio || null,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        setProfileError(
          typeof result.error === "string"
            ? result.error
            : "Failed to update profile"
        )
        return
      }

      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
    } catch {
      setProfileError("Network error")
    } finally {
      setProfileSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters")
      return
    }

    try {
      setPasswordSaving(true)
      setPasswordError(null)

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        setPasswordError(result.error || "Failed to change password")
        return
      }

      setPasswordSuccess(true)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch {
      setPasswordError("Network error")
    } finally {
      setPasswordSaving(false)
    }
  }

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "security" as const, label: "Security", icon: Lock },
    { id: "account" as const, label: "Account", icon: Shield },
  ]

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    border: `1.5px solid ${border.strong}`,
    borderRadius: "12px",
    fontSize: "14px",
    color: text.primary,
    background: bg.input,
    outline: "none",
    boxSizing: "border-box" as const,
    transition: "border-color 0.2s ease",
  }

  const labelStyle = {
    display: "block" as const,
    fontSize: "13px",
    fontWeight: "600" as const,
    color: text.secondary,
    marginBottom: "6px",
  }

  if (isLoading) {
    return (
      <div style={{ padding: "32px", textAlign: "center", color: text.muted }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            border: "3px solid #E2E8F0",
            borderTop: "3px solid #0066FF",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "40px auto 12px",
          }}
        />
        Loading settings...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div
      style={{
        padding: "28px 32px",
        background: bg.primary,
        minHeight: "calc(100vh - 76px)",
      }}
    >
      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "24px",
          background: bg.card,
          borderRadius: "16px",
          padding: "6px",
          border: `1px solid ${border.default}`,
          width: "fit-content",
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "12px",
                border: "none",
                background: isActive
                  ? "linear-gradient(135deg, #0066FF, #6C3AED)"
                  : "transparent",
                color: isActive ? "white" : text.muted,
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <Icon size={16} />
              {tab.label}
            </motion.button>
          )
        })}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: bg.card,
            borderRadius: "20px",
            border: `1px solid ${border.default}`,
            boxShadow: shadow.sm,
            padding: "28px",
          }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: "800", color: text.primary, marginBottom: "4px" }}>
            Profile Information
          </h3>
          <p style={{ fontSize: "13px", color: text.muted, marginBottom: "24px" }}>
            Update your personal details
          </p>

          {/* Success */}
          {profileSuccess && (
            <div
              style={{
                background: isDark ? "rgba(5,150,105,0.15)" : "#ECFDF5",
                border: `1px solid ${isDark ? "rgba(5,150,105,0.3)" : "#A7F3D0"}`,
                color: "#059669",
                padding: "12px 16px",
                borderRadius: "12px",
                fontSize: "13px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <CheckCircle size={16} />
              Profile updated successfully!
            </div>
          )}

          {/* Error */}
          {profileError && (
            <div
              style={{
                background: isDark ? "rgba(225,29,72,0.15)" : "#FFF1F2",
                border: `1px solid ${isDark ? "rgba(225,29,72,0.3)" : "#FECDD3"}`,
                color: "#E11D48",
                padding: "12px 16px",
                borderRadius: "12px",
                fontSize: "13px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <AlertCircle size={16} />
              {profileError}
            </div>
          )}

          {/* Name Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={labelStyle}>First Name</label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={inputStyle}
                placeholder="First name"
              />
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={inputStyle}
                placeholder="Last name"
              />
            </div>
          </div>

          {/* Phone */}
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Phone Number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={inputStyle}
              placeholder="+94 77 123 4567"
            />
          </div>

          {/* Address */}
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={inputStyle}
              placeholder="Your address"
            />
          </div>

          {/* Bio */}
          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 8px 20px rgba(0,102,255,0.3)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleProfileSave}
            disabled={profileSaving}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "14px 28px",
              background: profileSuccess
                ? "linear-gradient(135deg, #059669, #0D9488)"
                : "linear-gradient(135deg, #0066FF, #6C3AED)",
              color: "white",
              border: "none",
              borderRadius: "14px",
              fontSize: "14px",
              fontWeight: "700",
              cursor: profileSaving ? "not-allowed" : "pointer",
              opacity: profileSaving ? 0.8 : 1,
            }}
          >
            <Save size={16} />
            {profileSaving ? "Saving..." : profileSuccess ? "Saved!" : "Save Changes"}
          </motion.button>
        </motion.div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: bg.card,
            borderRadius: "20px",
            border: `1px solid ${border.default}`,
            boxShadow: shadow.sm,
            padding: "28px",
          }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: "800", color: text.primary, marginBottom: "4px" }}>
            Change Password
          </h3>
          <p style={{ fontSize: "13px", color: text.muted, marginBottom: "24px" }}>
            Update your password to keep your account secure
          </p>

          {/* Success */}
          {passwordSuccess && (
            <div
              style={{
                background: isDark ? "rgba(5,150,105,0.15)" : "#ECFDF5",
                border: `1px solid ${isDark ? "rgba(5,150,105,0.3)" : "#A7F3D0"}`,
                color: "#059669",
                padding: "12px 16px",
                borderRadius: "12px",
                fontSize: "13px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <CheckCircle size={16} />
              Password changed successfully!
            </div>
          )}

          {/* Error */}
          {passwordError && (
            <div
              style={{
                background: isDark ? "rgba(225,29,72,0.15)" : "#FFF1F2",
                border: `1px solid ${isDark ? "rgba(225,29,72,0.3)" : "#FECDD3"}`,
                color: "#E11D48",
                padding: "12px 16px",
                borderRadius: "12px",
                fontSize: "13px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <AlertCircle size={16} />
              {passwordError}
            </div>
          )}

          {/* Current Password */}
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Current Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showCurrentPw ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: "48px" }}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw(!showCurrentPw)}
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: text.muted,
                }}
              >
                {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>New Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showNewPw ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: "48px" }}
                placeholder="Min 8 characters with uppercase, lowercase, number"
              />
              <button
                type="button"
                onClick={() => setShowNewPw(!showNewPw)}
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: text.muted,
                }}
              >
                {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
              placeholder="Re-enter new password"
            />
          </div>

          {/* Change Password Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePasswordChange}
            disabled={passwordSaving || !currentPassword || !newPassword || !confirmPassword}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "14px 28px",
              background: passwordSuccess
                ? "linear-gradient(135deg, #059669, #0D9488)"
                : "linear-gradient(135deg, #E11D48, #F59E0B)",
              color: "white",
              border: "none",
              borderRadius: "14px",
              fontSize: "14px",
              fontWeight: "700",
              cursor:
                passwordSaving || !currentPassword || !newPassword || !confirmPassword
                  ? "not-allowed"
                  : "pointer",
              opacity:
                passwordSaving || !currentPassword || !newPassword || !confirmPassword
                  ? 0.6
                  : 1,
            }}
          >
            <Lock size={16} />
            {passwordSaving ? "Changing..." : passwordSuccess ? "Changed!" : "Change Password"}
          </motion.button>
        </motion.div>
      )}

      {/* Account Tab */}
      {activeTab === "account" && userData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: bg.card,
            borderRadius: "20px",
            border: `1px solid ${border.default}`,
            boxShadow: shadow.sm,
            padding: "28px",
          }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: "800", color: text.primary, marginBottom: "4px" }}>
            Account Information
          </h3>
          <p style={{ fontSize: "13px", color: text.muted, marginBottom: "24px" }}>
            Your account details (read-only)
          </p>

          {[
            {
              icon: <Mail size={16} color="#0066FF" />,
              label: "Email",
              value: userData.email,
            },
            {
              icon: <Shield size={16} color="#7C3AED" />,
              label: "Role",
              value: userData.role.replace("_", " "),
            },
            {
              icon: <CheckCircle size={16} color={userData.status === "ACTIVE" ? "#059669" : "#E11D48"} />,
              label: "Status",
              value: userData.status,
            },
            {
              icon: <Calendar size={16} color="#F59E0B" />,
              label: "Member Since",
              value: new Date(userData.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
            },
            {
              icon: <Clock size={16} color="#0891B2" />,
              label: "Last Login",
              value: userData.lastLogin
                ? new Date(userData.lastLogin).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Never",
            },
            {
              icon: <CheckCircle size={16} color="#059669" />,
              label: "Email Verified",
              value: userData.emailVerified ? "✅ Verified" : "❌ Not verified",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 0",
                borderBottom:
                  i < 5 ? `1px solid ${border.default}` : "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "14px",
                  color: text.secondary,
                  fontWeight: "500",
                }}
              >
                {item.icon}
                {item.label}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: text.primary,
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}