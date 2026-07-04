// app/(auth)/login/page.tsx
import { Suspense } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { AuthWrapper } from "@/components/auth/auth-wrapper"

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