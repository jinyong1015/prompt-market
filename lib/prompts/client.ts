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
  const idsKey = ids.join(",")

  React.useEffect(() => {
    let cancelled = false

    fetchPromptsByIds(supabase, ids).then((result) => {
      if (!cancelled) setPrompts(result)
    })

    return () => {
      cancelled = true
    }
  }, [supabase, idsKey, ids])

  return prompts
}
