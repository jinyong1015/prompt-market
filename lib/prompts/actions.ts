"use server"

import { revalidatePath } from "next/cache"

import { isAdmin } from "@/lib/admin"
import { formToInsert, formToUpdate, type PromptFormInput } from "@/lib/prompts/map"
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server"

export type ActionResult = { ok: true } | { ok: false; error: string }

async function requireAdmin() {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized")
  }
}

function revalidatePromptPaths(id?: string) {
  revalidatePath("/")
  revalidatePath("/admin/prompts")
  if (id) revalidatePath(`/prompt/${id}`)
}

export async function createPromptAction(input: PromptFormInput): Promise<ActionResult> {
  try {
    await requireAdmin()
    const supabase = createServiceRoleSupabaseClient()
    const payload = formToInsert(input)

    const { error } = await supabase.from("prompts").insert(payload)
    if (error) return { ok: false, error: error.message }

    revalidatePromptPaths(payload.id)
    return { ok: true }
  } catch {
    return { ok: false, error: "Unauthorized" }
  }
}

export async function updatePromptAction(
  originalId: string,
  input: PromptFormInput,
): Promise<ActionResult> {
  try {
    await requireAdmin()
    const supabase = createServiceRoleSupabaseClient()
    const payload = formToUpdate(input)

    const { error } = await supabase.from("prompts").update(payload).eq("id", originalId)
    if (error) return { ok: false, error: error.message }

    revalidatePromptPaths(originalId)
    if (originalId !== input.id.trim()) {
      revalidatePromptPaths(input.id.trim())
    }
    return { ok: true }
  } catch {
    return { ok: false, error: "Unauthorized" }
  }
}

export async function deletePromptAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()
    const supabase = createServiceRoleSupabaseClient()
    const { error } = await supabase.from("prompts").delete().eq("id", id)
    if (error) return { ok: false, error: error.message }

    revalidatePromptPaths(id)
    return { ok: true }
  } catch {
    return { ok: false, error: "Unauthorized" }
  }
}

export async function togglePromptPublishedAction(
  id: string,
  isPublished: boolean,
): Promise<ActionResult> {
  try {
    await requireAdmin()
    const supabase = createServiceRoleSupabaseClient()
    const { error } = await supabase.from("prompts").update({ is_published: isPublished }).eq("id", id)
    if (error) return { ok: false, error: error.message }

    revalidatePromptPaths(id)
    return { ok: true }
  } catch {
    return { ok: false, error: "Unauthorized" }
  }
}
