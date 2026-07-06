// app/(auth)/reset-password/page.tsx
import type { Metadata } from "next"
import { Suspense } from "react"
import { AuthWrapper } from "@/components/auth/auth-wrapper"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Create a new password for your SLIIT LMS account",
}

export default function ResetPasswordPage() {
  return (
    <AuthWrapper
      title="Reset Password 🔑"
      subtitle="Create a strong new password for your account."
    >
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthWrapper>
  )
}