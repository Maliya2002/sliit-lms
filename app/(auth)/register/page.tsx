// app/(auth)/register/page.tsx
import type { Metadata } from "next"
import { AuthWrapper } from "@/components/auth/auth-wrapper"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Register",
  description: "Create your SLIIT LMS account",
}

export default function RegisterPage() {
  return (
    <AuthWrapper
      title="Create Account 🎓"
      subtitle="Join thousands of students and lecturers on SLIIT LMS"
    >
      <RegisterForm />
    </AuthWrapper>
  )
}