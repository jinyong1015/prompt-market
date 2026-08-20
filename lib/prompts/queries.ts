import type { Prompt } from "@/lib/data"
import { rowToPrompt } from "@/lib/prompts/map"
import { createPublicSupabaseClient, createServiceRoleSupabaseClient } from "@/lib/supabase/server"
import type { PromptRow } from "@/lib/supabase/database.types"

export async function listPublishedPrompts(): Promise<Prompt[]> {
  try {
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
  } catch (error) {
    console.error("[listPublishedPrompts]", error)
    return []
  }
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

/** Public PDP / SEO — unpublished prompts are treated as missing. */
export async function getPublishedPromptById(id: string): Promise<Prompt | null> {
  try {
    const supabase = createPublicSupabaseClient()
    const { data, error } = await supabase
      .from("prompts")
      .select("*")
      .eq("id", id)
      .eq("is_published", true)
      .maybeSingle()

    if (error) {
      console.error("[getPublishedPromptById]", error.message)
      return null
    }

    if (!data) return null

    return rowToPrompt(data as PromptRow)
  } catch (error) {
    console.error("[getPublishedPromptById]", error)
    return null
  }
}

export interface PromptSitemapEntry {
  id: string
  created_at: string
}

export async function listPublishedPromptSitemapEntries(): Promise<PromptSitemapEntry[]> {
  try {
    const supabase = createPublicSupabaseClient()
    const { data, error } = await supabase
      .from("prompts")
      .select("id, created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[listPublishedPromptSitemapEntries]", error.message)
      return []
    }

    return (data ?? []) as PromptSitemapEntry[]
  } catch (error) {
    console.error("[listPublishedPromptSitemapEntries]", error)
    return []
  }
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
