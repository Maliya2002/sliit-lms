// components/auth/auth-wrapper.tsx
"use client"

import { GraduationCap } from "lucide-react"

interface AuthWrapperProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export function AuthWrapper({
  children,
  title,
  subtitle,
}: AuthWrapperProps) {
  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>

      {/* LEFT SIDE */}
      <div
        style={{
          display: "none",
          width: "50%",
          background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
        className="lg-flex"
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              background: "white",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GraduationCap size={22} color="#2563eb" />
          </div>
          <div>
            <div style={{ fontWeight: "bold", fontSize: "18px" }}>
              SLIIT LMS
            </div>
            <div style={{ fontSize: "11px", opacity: 0.7 }}>
              Learning Management System
            </div>
          </div>
        </div>

        {/* Center */}
        <div>
          <h2
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              lineHeight: 1.2,
              marginBottom: "16px",
            }}
          >
            Empowering
            <br />
            Education
            <br />
            <span style={{ color: "#93c5fd" }}>Digitally</span>
          </h2>
          <p style={{ opacity: 0.8, fontSize: "15px" }}>
            Access your courses, assignments,
            grades and more — all in one place.
          </p>

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "12px",
              marginTop: "32px",
            }}
          >
            {[
              { value: "20K+", label: "Students" },
              { value: "500+", label: "Lecturers" },
              { value: "100+", label: "Courses" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "22px", fontWeight: "bold" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "11px", opacity: 0.7 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <p style={{ fontStyle: "italic", opacity: 0.9, fontSize: "13px" }}>
            &ldquo;Education is the most powerful weapon
            which you can use to change the world.&rdquo;
          </p>
          <p style={{ opacity: 0.6, fontSize: "12px", marginTop: "8px" }}>
            — Nelson Mandela
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px",
          background: "white",
        }}
      >
        <div style={{ width: "100%", maxWidth: "420px" }}>

          {/* Mobile Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "#2563eb",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <GraduationCap size={22} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: "bold", fontSize: "18px", color: "#1e293b" }}>
                SLIIT LMS
              </div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>
                Learning Management System
              </div>
            </div>
          </div>

          {/* Title */}
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#1e293b",
              marginBottom: "8px",
            }}
          >
            {title}
          </h2>
          <p
            style={{
              color: "#64748b",
              marginBottom: "32px",
              fontSize: "14px",
            }}
          >
            {subtitle}
          </p>

          {/* Form */}
          {children}
        </div>
      </div>
    </div>
  )
}