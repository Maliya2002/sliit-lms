// app/page.tsx
// Temporary homepage — we will design this properly later

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          SLIIT LMS
        </h1>
        <p className="text-muted-foreground">
          Learning Management System
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
          >
            Login
          </a>
          <a
            href="/register"
            className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition"
          >
            Register
          </a>
        </div>
      </div>
    </main>
  )
}