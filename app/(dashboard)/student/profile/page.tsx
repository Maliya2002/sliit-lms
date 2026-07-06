// app/(dashboard)/student/profile/page.tsx
import { requireRole } from "@/lib/auth-utils"
import { db } from "@/lib/db"
import { ProfilePageClient } from "@/components/profile/profile-page-client"

export default async function StudentProfilePage() {
  const user = await requireRole(["STUDENT"])

  const fullUser = await db.user.findUnique({
    where: { id: user.id },
    include: { profile: true },
  })

  if (!fullUser) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          color: "#64748b",
        }}
      >
        User not found
      </div>
    )
  }

  return (
    <ProfilePageClient
      user={{
        id: fullUser.id,
        email: fullUser.email,
        role: fullUser.role,
        status: fullUser.status,
        emailVerified:
          fullUser.emailVerified?.toISOString() ?? null,
        lastLogin:
          fullUser.lastLogin?.toISOString() ?? null,
        createdAt: fullUser.createdAt.toISOString(),
      }}
      profile={
        fullUser.profile
          ? {
              firstName: fullUser.profile.firstName,
              lastName: fullUser.profile.lastName,
              avatar: fullUser.profile.avatar,
              studentId: fullUser.profile.studentId,
              employeeId: fullUser.profile.employeeId,
              yearOfStudy: fullUser.profile.yearOfStudy,
              bio: fullUser.profile.bio,
              phone: fullUser.profile.phone,
              address: fullUser.profile.address,
              gender: fullUser.profile.gender,
              dateOfBirth:
                fullUser.profile.dateOfBirth?.toISOString() ??
                null,
            }
          : null
      }
    />
  )
}