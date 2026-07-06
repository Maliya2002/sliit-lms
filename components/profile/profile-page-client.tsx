// components/profile/profile-page-client.tsx
"use client"

import { useState } from "react"
import { ProfileHeader } from "./profile-header"
import { PersonalInfoForm } from "./personal-info-form"
import { AccountInfoCard } from "./account-info-card"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { studentConfig } from "@/lib/dashboard-config"

interface UserData {
  id: string
  email: string
  role: string
  status: string
  emailVerified: string | null
  lastLogin: string | null
  createdAt: string
}

interface ProfileData {
  firstName: string
  lastName: string
  avatar: string | null
  studentId: string | null
  employeeId: string | null
  yearOfStudy: number | null
  bio: string | null
  phone: string | null
  address: string | null
  gender: string | null
  dateOfBirth: string | null
}

interface Props {
  user: UserData
  profile: ProfileData | null
}

export function ProfilePageClient({ user, profile }: Props) {
  const [refreshKey, setRefreshKey] = useState(0)

  const dashboardUser = {
    firstName: profile?.firstName || "User",
    lastName: profile?.lastName || "",
    email: user.email,
    role: user.role,
  }

  return (
    <div>
      {/* Header */}
      <DashboardHeader
        config={studentConfig}
        user={dashboardUser}
        title="My Profile"
        subtitle="Manage your personal information and account settings"
      />

      {/* Content */}
      <div style={{ padding: "28px" }}>

        {/* Profile Header Card */}
        <ProfileHeader
          key={refreshKey}
          user={user}
          profile={profile}
          onEditClick={() => {
            setRefreshKey((k) => k + 1)
          }}
        />

        {/* Bottom Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: "24px",
          }}
        >
          {/* Personal Info Form */}
          <PersonalInfoForm
            profile={profile}
            onSuccess={() => setRefreshKey((k) => k + 1)}
          />

          {/* Account Info */}
          <AccountInfoCard user={user} />
        </div>
      </div>
    </div>
  )
}