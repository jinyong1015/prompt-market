import { auth, currentUser } from "@clerk/nextjs/server"

function parseAdminAllowlist() {
  const raw = [
    process.env.CLERK_ADMIN_USER_IDS,
    process.env.CLERK_ADMIN_EMAILS,
  ]
    .filter(Boolean)
    .join(",")

  return raw
    .split(",")
    .map((value) => value.trim().replace(/^["']|["']$/g, "").toLowerCase())
    .filter(Boolean)
}

export async function isAdmin() {
  const { userId } = await auth()
  if (!userId) return false

  const user = await currentUser()
  if (user?.publicMetadata?.role === "admin") return true

  const allowlist = parseAdminAllowlist()
  if (allowlist.length === 0) return false

  if (allowlist.includes(userId.toLowerCase())) return true

  const emails = [
    user?.primaryEmailAddress?.emailAddress,
    ...(user?.emailAddresses.map((item) => item.emailAddress) ?? []),
  ]
    .filter(Boolean)
    .map((email) => email.toLowerCase())

  return emails.some((email) => allowlist.includes(email))
}
