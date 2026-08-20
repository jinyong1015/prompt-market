import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { createCheckoutToken, createOrderId, getTossClientKey } from "@/lib/payments/toss"

type PrepareRequest = {
  promptIds: string[]
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = (await request.json()) as PrepareRequest
  const uniqueIds = [...new Set((body.promptIds ?? []).filter(Boolean))]
  if (uniqueIds.length === 0) {
    return NextResponse.json({ error: "No prompt items selected." }, { status: 400 })
  }

  const supabase = createServerSupabaseClient()

  const [{ data: prompts, error: promptError }, { data: ownedRows, error: ownedError }] = await Promise.all([
    supabase.from("prompts").select("id, title, price").in("id", uniqueIds).eq("is_published", true),
    supabase.from("purchases").select("prompt_id").eq("buyer_id", userId).in("prompt_id", uniqueIds),
  ])

  if (promptError) return NextResponse.json({ error: promptError.message }, { status: 500 })
  if (ownedError) return NextResponse.json({ error: ownedError.message }, { status: 500 })

  const owned = new Set((ownedRows ?? []).map((row) => row.prompt_id))
  const targets = (prompts ?? []).filter((prompt) => !owned.has(prompt.id))
  if (targets.length === 0) {
    return NextResponse.json({ error: "Already purchased." }, { status: 400 })
  }

  const amount = targets.reduce((sum, prompt) => sum + prompt.price, 0)
  const head = targets[0]?.title ?? "Prompt"
  const orderName = targets.length > 1 ? `${head} 외 ${targets.length - 1}건` : head
  const orderId = createOrderId()

  const token = createCheckoutToken({
    userId,
    promptIds: targets.map((prompt) => prompt.id),
    amount,
    orderId,
    issuedAt: Date.now(),
  })

  const user = await currentUser()
  const origin = request.headers.get("origin") ?? new URL(request.url).origin
  const successUrl = `${origin}/checkout/success?checkoutToken=${encodeURIComponent(token)}`
  const failUrl = `${origin}/checkout/fail`

  return NextResponse.json({
    clientKey: getTossClientKey(),
    customerKey: userId,
    orderId,
    orderName,
    amount,
    customerEmail: user?.primaryEmailAddress?.emailAddress ?? undefined,
    customerName: user?.fullName ?? user?.username ?? undefined,
    successUrl,
    failUrl,
  })
}
