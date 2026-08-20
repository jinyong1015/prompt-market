import "server-only"

import { auth } from "@clerk/nextjs/server"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

import { getSupabaseEnv, getSupabaseServiceRoleKey } from "@/lib/supabase/env"

/** Public reads (anon role). No Clerk session required. */
export function createPublicSupabaseClient() {
  const { url, publishableKey } = getSupabaseEnv()
  return createSupabaseClient(url, publishableKey)
}

/** Authenticated requests: Clerk JWT is forwarded for RLS. */
export function createServerSupabaseClient() {
  const { url, publishableKey } = getSupabaseEnv()

  return createSupabaseClient(url, publishableKey, {
    async accessToken() {
      return (await auth()).getToken()
    },
  })
}

/**
 * Server-only privileged client. Bypasses RLS.
 * Use only after Clerk `isAdmin()` in Server Actions / Server Components.
 */
export function createServiceRoleSupabaseClient() {
  const { url } = getSupabaseEnv()

  return createSupabaseClient(url, getSupabaseServiceRoleKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
