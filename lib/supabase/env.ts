export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
export const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

export const hasSupabaseEnv = Boolean(supabaseUrl && supabasePublishableKey)

export function getSupabaseEnv() {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Add them to .env.local.",
    )
  }

  return { url: supabaseUrl, publishableKey: supabasePublishableKey }
}

export function getSupabaseServiceRoleKey() {
  const key =
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!key) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY). Required for admin writes.",
    )
  }

  return key
}
