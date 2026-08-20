"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

import { createServerSupabaseClient } from "@/lib/supabase/server"

export type CheckoutResult = { ok: true } | { ok: false; error: string }

export async function checkoutAction(promptIds: string[]): Promise<CheckoutResult> {
  const { userId } = await auth()
  if (!userId) return { ok: false, error: "Unauthorized" }

  const uniqueIds = [...new Set(promptIds.filter(Boolean))]
  if (uniqueIds.length === 0) return { ok: false, error: "Empty cart" }

  const supabase = createServerSupabaseClient()

  const { data: existing, error: existingError } = await supabase
    .from("purchases")
    .select("prompt_id")
    .in("prompt_id", uniqueIds)

  if (existingError) return { ok: false, error: existingError.message }

  const owned = new Set((existing ?? []).map((row) => row.prompt_id))
  const toBuy = uniqueIds.filter((id) => !owned.has(id))

  if (toBuy.length === 0) return { ok: false, error: "Already purchased" }

  const orderBase = `demo_${Date.now()}`
  const rows = toBuy.map((promptId, index) => ({
    buyer_id: userId,
    prompt_id: promptId,
    payment_order_id: `${orderBase}_${index}_${promptId}`,
  }))

  const { error: insertError } = await supabase.from("purchases").insert(rows)
  if (insertError) return { ok: false, error: insertError.message }

  const { error: deleteError } = await supabase.from("carts").delete().in("prompt_id", toBuy)
  if (deleteError) return { ok: false, error: deleteError.message }

  revalidatePath("/")
  revalidatePath("/cart")
  revalidatePath("/my-page")
  revalidatePath("/wishlist")

  for (const promptId of toBuy) {
    revalidatePath(`/prompt/${promptId}`)
  }

  return { ok: true }
}
