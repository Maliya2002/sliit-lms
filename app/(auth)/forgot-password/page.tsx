// app/(auth)/forgot-password/page.tsx
import type { Metadata } from "next"
import { AuthWrapper } from "@/components/auth/auth-wrapper"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your SLIIT LMS password",
}

export default function ForgotPasswordPage() {
  return (
    <AuthWrapper
      title="Forgot Password? 🔐"
      subtitle="No worries! Enter your email and we'll send you a reset link."
    >
      <ForgotPasswordForm />
    </AuthWrapper>
  )
}