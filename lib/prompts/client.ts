"use client"

import * as React from "react"
import type { SupabaseClient } from "@supabase/supabase-js"

import type { Prompt } from "@/lib/data"
import { rowToPrompt } from "@/lib/prompts/map"
import { useSupabaseClient } from "@/lib/supabase/client"

export function fetchPromptsByIds(supabase: SupabaseClient, ids: string[]) {
  if (ids.length === 0) return Promise.resolve([] as Prompt[])

  return supabase
    .from("prompts")
    .select("*")
    .in("id", ids)
    .then(({ data, error }) => {
      if (error) {
        console.error("[fetchPromptsByIds]", error.message)
        return [] as Prompt[]
      }

      const byId = new Map((data ?? []).map((row) => [row.id, rowToPrompt(row)]))
      return ids.map((id) => byId.get(id)).filter((prompt): prompt is Prompt => Boolean(prompt))
    })
}

export function usePromptsByIds(ids: string[]) {
  const supabase = useSupabaseClient()
  const [prompts, setPrompts] = React.useState<Prompt[]>([])
  const [isReady, setIsReady] = React.useState(ids.length === 0)
  const idsKey = ids.join(",")

  React.useEffect(() => {
    let cancelled = false
    const currentIds = idsKey ? idsKey.split(",") : []

    if (currentIds.length === 0) {
      setPrompts((prev) => (prev.length === 0 ? prev : []))
      setIsReady(true)
      return
    }

    setIsReady(false)

    fetchPromptsByIds(supabase, currentIds).then((result) => {
      if (!cancelled) {
        setPrompts(result)
        setIsReady(true)
      }
    })

    return () => {
      cancelled = true
    }
  }, [supabase, idsKey])

  return { prompts, isReady }
}
