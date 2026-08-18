"use client"

import { useSession } from "@clerk/nextjs"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { useMemo } from "react"

import { getSupabaseEnv } from "@/lib/supabase/env"

export function createBrowserSupabaseClient(
  getToken: () => Promise<string | null>,
): SupabaseClient {
  const { url, publishableKey } = getSupabaseEnv()

  return createClient(url, publishableKey, {
    async accessToken() {
      return getToken()
    },
  })
}

export function useSupabaseClient() {
  const { session } = useSession()

  return useMemo(
    () => createBrowserSupabaseClient(() => session?.getToken() ?? Promise.resolve(null)),
    [session],
  )
}
