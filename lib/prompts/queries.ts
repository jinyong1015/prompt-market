import type { Prompt } from "@/lib/data"
import { rowToPrompt } from "@/lib/prompts/map"
import { createPublicSupabaseClient, createServiceRoleSupabaseClient } from "@/lib/supabase/server"
import type { PromptRow } from "@/lib/supabase/database.types"

export async function listPublishedPrompts(): Promise<Prompt[]> {
  const supabase = createPublicSupabaseClient()
  const { data, error } = await supabase
    .from("prompts")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[listPublishedPrompts]", error.message)
    return []
  }

  return (data as PromptRow[]).map(rowToPrompt)
}

export async function getPromptById(id: string): Promise<Prompt | null> {
  const supabase = createPublicSupabaseClient()
  const { data, error } = await supabase.from("prompts").select("*").eq("id", id).maybeSingle()

  if (error) {
    console.error("[getPromptById]", error.message)
    return null
  }

  if (!data) return null

  return rowToPrompt(data as PromptRow)
}

export async function listAllPromptsForAdmin(): Promise<PromptRow[]> {
  const supabase = createServiceRoleSupabaseClient()
  const { data, error } = await supabase
    .from("prompts")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[listAllPromptsForAdmin]", error.message)
    return []
  }

  return (data ?? []) as PromptRow[]
}
