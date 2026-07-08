// lib/rate-limit.ts
const requestMap = new Map<string, number[]>()

export function rateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): boolean {
  const now = Date.now()
  const windowStart = now - windowMs

  const requests = requestMap.get(identifier) || []
  const recentRequests = requests.filter(
    (time) => time > windowStart
  )

  if (recentRequests.length >= maxRequests) {
    return false
  }

  recentRequests.push(now)
  requestMap.set(identifier, recentRequests)

  return true
}