import type { SupabaseClient } from "@supabase/supabase-js"

export interface CommerceSnapshot {
  cart: string[]
  wishlist: string[]
  purchases: { id: string; date: string }[]
}

export async function loadCommerceSnapshot(
  supabase: SupabaseClient,
): Promise<CommerceSnapshot> {
  const [cartRes, wishlistRes, purchasesRes] = await Promise.all([
    supabase.from("carts").select("prompt_id").order("created_at", { ascending: true }),
    supabase.from("wishlists").select("prompt_id").order("created_at", { ascending: true }),
    supabase
      .from("purchases")
      .select("prompt_id, created_at")
      .order("created_at", { ascending: false }),
  ])

  if (cartRes.error) console.error("[loadCommerceSnapshot/cart]", cartRes.error.message)
  if (wishlistRes.error) console.error("[loadCommerceSnapshot/wishlist]", wishlistRes.error.message)
  if (purchasesRes.error) console.error("[loadCommerceSnapshot/purchases]", purchasesRes.error.message)

  return {
    cart: (cartRes.data ?? []).map((row) => row.prompt_id),
    wishlist: (wishlistRes.data ?? []).map((row) => row.prompt_id),
    purchases: (purchasesRes.data ?? []).map((row) => ({
      id: row.prompt_id,
      date: row.created_at.slice(0, 10),
    })),
  }
}
