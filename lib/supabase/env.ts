export const hasSupabaseEnv = Boolean(
  process.env["NEXT_PUBLIC_SUPABASE_URL"] && process.env["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"],
)

export function getSupabaseEnv() {
  const url = process.env["NEXT_PUBLIC_SUPABASE_URL"]
  const publishableKey = process.env["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]

  if (!url || !publishableKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Add them to Vercel Environment Variables and redeploy.",
    )
  }

  return { url, publishableKey }
}

export function getSupabaseServiceRoleKey() {
  const key = process.env["SUPABASE_SECRET_KEY"] ?? process.env["SUPABASE_SERVICE_ROLE_KEY"]

  if (!key) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY). Required for admin writes.",
    )
  }

  return key
}
