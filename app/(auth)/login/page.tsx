import type { Metadata } from "next"
import { Suspense } from "react"
import { AuthWrapper } from "@/components/auth/auth-wrapper"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your SLIIT LMS account",
}

export default function LoginPage() {
  return (
    <AuthWrapper
      title="Welcome back! 👋"
      subtitle="Sign in to your account to continue"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </AuthWrapper>
  )
}