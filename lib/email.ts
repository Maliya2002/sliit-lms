// lib/email.ts
import nodemailer from "nodemailer"

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

// ─────────────────────────────────────────
// Send Password Reset Email
// ─────────────────────────────────────────
export async function sendPasswordResetEmail({
  email,
  firstName,
  resetToken,
}: {
  email: string
  firstName: string
  resetToken: string
}) {
  const transporter = createTransporter()

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset Your SLIIT LMS Password",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #f8fafc;
          margin: 0;
          padding: 40px 20px;
        ">
          <div style="
            max-width: 520px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          ">

            <!-- Header -->
            <div style="
              background: linear-gradient(135deg, #1e3a8a, #2563eb);
              padding: 40px;
              text-align: center;
            ">
              <div style="
                font-size: 48px;
                margin-bottom: 12px;
              ">🎓</div>
              <h1 style="
                color: white;
                font-size: 24px;
                font-weight: 700;
                margin: 0;
              ">SLIIT LMS</h1>
              <p style="
                color: rgba(255,255,255,0.7);
                margin: 4px 0 0;
                font-size: 14px;
              ">Learning Management System</p>
            </div>

            <!-- Body -->
            <div style="padding: 40px;">
              <h2 style="
                color: #1e293b;
                font-size: 22px;
                font-weight: 700;
                margin: 0 0 16px;
              ">Reset Your Password 🔐</h2>

              <p style="
                color: #64748b;
                font-size: 15px;
                line-height: 1.6;
                margin: 0 0 8px;
              ">
                Hi <strong style="color:#1e293b">${firstName}</strong>,
              </p>

              <p style="
                color: #64748b;
                font-size: 15px;
                line-height: 1.6;
                margin: 0 0 32px;
              ">
                We received a request to reset your password.
                Click the button below to create a new password.
                This link expires in <strong>1 hour</strong>.
              </p>

              <!-- Button -->
              <div style="text-align: center; margin-bottom: 32px;">
                <a
                  href="${resetUrl}"
                  style="
                    display: inline-block;
                    padding: 16px 40px;
                    background: linear-gradient(135deg, #2563eb, #1d4ed8);
                    color: white;
                    text-decoration: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                  "
                >
                  Reset My Password
                </a>
              </div>

              <!-- Link fallback -->
              <div style="
                border-top: 1px solid #f1f5f9;
                padding-top: 24px;
              ">
                <p style="
                  color: #94a3b8;
                  font-size: 13px;
                  margin: 0 0 8px;
                ">
                  If button doesn't work, copy this link:
                </p>
                <p style="
                  background: #f8fafc;
                  padding: 12px;
                  border-radius: 8px;
                  font-size: 12px;
                  color: #2563eb;
                  word-break: break-all;
                  margin: 0 0 20px;
                ">
                  ${resetUrl}
                </p>
                <p style="
                  color: #94a3b8;
                  font-size: 13px;
                  margin: 0;
                ">
                  If you didn't request this, ignore this email.
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="
              background: #f8fafc;
              padding: 20px 40px;
              text-align: center;
              border-top: 1px solid #f1f5f9;
            ">
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} SLIIT LMS · All rights reserved
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  })
}

// ─────────────────────────────────────────
// Send Welcome Email
// ─────────────────────────────────────────
export async function sendWelcomeEmail({
  email,
  firstName,
}: {
  email: string
  firstName: string
}) {
  const transporter = createTransporter()

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Welcome to SLIIT LMS! 🎓",
    html: `
      <div style="
        font-family: sans-serif;
        max-width: 500px;
        margin: 0 auto;
        padding: 40px 20px;
        background: white;
        border-radius: 16px;
      ">
        <div style="font-size: 48px; text-align: center; margin-bottom: 16px;">
          🎓
        </div>
        <h1 style="color: #2563eb; text-align: center;">
          Welcome, ${firstName}!
        </h1>
        <p style="color: #64748b; line-height: 1.6; text-align: center;">
          Your SLIIT LMS account has been created.
          You can now login and start learning!
        </p>
        <div style="text-align: center; margin-top: 24px;">
          <a
            href="${process.env.NEXT_PUBLIC_APP_URL}/login"
            style="
              display: inline-block;
              padding: 12px 32px;
              background: #2563eb;
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
            "
          >
            Login Now
          </a>
        </div>
      </div>
    `,
  })
}

// ─────────────────────────────────────────
// Verify email connection
// ─────────────────────────────────────────
export async function verifyEmailConnection() {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    console.log("✅ Email connection verified!")
    return true
  } catch (error) {
    console.error("❌ Email connection failed:", error)
    return false
  }
}