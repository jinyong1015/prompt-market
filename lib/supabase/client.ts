"use client"

import { useAuth } from "@clerk/nextjs"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { useMemo, useRef } from "react"

import { getSupabaseEnv } from "@/lib/supabase/env"

export function createBrowserSupabaseClient(
  getToken: () => Promise<string | null>,
): SupabaseClient {
  const { url, publishableKey } = getSupabaseEnv()

  return createClient(url, publishableKey, {
    async accessToken() {
      if (typeof window === "undefined") return null
      try {
        return await getToken()
      } catch {
        return null
      }
    },
  })
}

export function useSupabaseClient() {
  const { getToken } = useAuth()
  const getTokenRef = useRef(getToken)
  getTokenRef.current = getToken

  return useMemo(
    () => createBrowserSupabaseClient(() => getTokenRef.current()),
    [],
  )
}
