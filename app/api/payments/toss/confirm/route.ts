import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

import { checkoutAction } from "@/lib/commerce/actions"
import { getTossSecretKey, verifyCheckoutToken } from "@/lib/payments/toss"

type ConfirmRequest = {
  paymentKey: string
  orderId: string
  amount: number
  checkoutToken: string
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = (await request.json()) as ConfirmRequest
  const { paymentKey, orderId, amount, checkoutToken } = body
  if (!paymentKey || !orderId || !amount || !checkoutToken) {
    return NextResponse.json({ error: "Invalid payment payload." }, { status: 400 })
  }

  const verified = verifyCheckoutToken(checkoutToken)
  if (!verified) return NextResponse.json({ error: "Invalid checkout token." }, { status: 400 })
  if (verified.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  if (verified.orderId !== orderId || verified.amount !== Number(amount)) {
    return NextResponse.json({ error: "Order verification failed." }, { status: 400 })
  }

  const authHeader = Buffer.from(`${getTossSecretKey()}:`).toString("base64")
  const tossRes = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/json",
      "Idempotency-Key": orderId,
    },
    body: JSON.stringify({
      paymentKey,
      orderId,
      amount: Number(amount),
    }),
  })

  if (!tossRes.ok) {
    const payload = (await tossRes.json().catch(() => ({}))) as { code?: string; message?: string }
    const alreadyProcessed =
      payload.code === "ALREADY_PROCESSED_PAYMENT" ||
      (payload.message?.includes("이미 처리") ?? false)

    if (!alreadyProcessed) {
      return NextResponse.json({ error: payload.message ?? "Payment confirmation failed." }, { status: 400 })
    }
  }

  const checkout = await checkoutAction(verified.promptIds, orderId)
  if (!checkout.ok) return NextResponse.json({ error: checkout.error }, { status: 400 })

  return NextResponse.json({ ok: true })
}
