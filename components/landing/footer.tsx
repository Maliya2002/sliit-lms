// components/landing/footer.tsx
"use client"

import { GraduationCap } from "lucide-react"

export function Footer() {
  return (
    <footer
      style={{
        background: "#0F172A",
        padding: "64px 24px 32px",
        color: "white",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Top */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "48px",
            marginBottom: "48px",
          }}
        >
          {/* Logo */}
          <div style={{ maxWidth: "300px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  background:
                    "linear-gradient(135deg, #0066FF, #6C3AED)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <GraduationCap size={20} color="white" />
              </div>
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "800",
                }}
              >
                SLIIT{" "}
                <span
                  style={{
                    fontWeight: "300",
                    color: "#93C5FD",
                  }}
                >
                  LMS
                </span>
              </span>
            </div>
            <p
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.7,
              }}
            >
              Empowering education through technology.
              A complete learning management system for
              SLIIT.
            </p>
          </div>

          {/* Links */}
          {[
            {
              title: "Platform",
              links: [
                "Courses",
                "Assignments",
                "Quizzes",
                "Grades",
              ],
            },
            {
              title: "Resources",
              links: [
                "Documentation",
                "Help Center",
                "Privacy Policy",
                "Terms",
              ],
            },
            {
              title: "Contact",
              links: [
                "support@sliit.lk",
                "+94 11 754 4801",
                "Malabe, Sri Lanka",
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "white",
                  marginBottom: "16px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {col.title}
              </h4>
              {col.links.map((link) => (
                <p
                  key={link}
                  style={{
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.4)",
                    marginBottom: "10px",
                    cursor: "pointer",
                  }}
                >
                  {link}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            © {new Date().getFullYear()} SLIIT LMS. All
            rights reserved.
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            Built with ❤️ by Malith Madushan
          </p>
        </div>
      </div>
    </footer>
  )
}