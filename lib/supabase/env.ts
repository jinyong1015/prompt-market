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
