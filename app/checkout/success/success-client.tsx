"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, Loader2, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"

function getConfirmStorageKey(orderId: string) {
  return `checkout:confirmed:${orderId}`
}

const inFlightConfirms = new Map<string, Promise<{ ok: boolean; error?: string }>>()

async function confirmPayment(payload: {
  paymentKey: string
  orderId: string
  amount: number
  checkoutToken: string
}) {
  const existing = inFlightConfirms.get(payload.orderId)
  if (existing) return existing

  const request = (async () => {
    const res = await fetch("/api/payments/toss/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (res.ok) return { ok: true }

    const body = (await res.json().catch(() => ({}))) as { error?: string }
    const error = body.error ?? "결제 승인에 실패했습니다."

    if (error.includes("이미 처리") || error.includes("Already purchased")) {
      return { ok: true }
    }

    return { ok: false, error }
  })()

  inFlightConfirms.set(payload.orderId, request)

  try {
    return await request
  } finally {
    inFlightConfirms.delete(payload.orderId)
  }
}

export function CheckoutSuccessClient() {
  const searchParams = useSearchParams()
  const { refreshCommerce } = useStore()
  const paymentKey = searchParams.get("paymentKey")
  const orderId = searchParams.get("orderId")
  const amount = Number(searchParams.get("amount") ?? 0)
  const checkoutToken = searchParams.get("checkoutToken")

  const [status, setStatus] = React.useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = React.useState("결제 승인 중입니다.")

  React.useEffect(() => {
    let cancelled = false

    async function markSuccess() {
      await refreshCommerce()
      if (cancelled) return
      setStatus("success")
      setMessage("결제가 완료되었습니다.")
    }

    async function run() {
      if (!paymentKey || !orderId || !amount || !checkoutToken) {
        if (!cancelled) {
          setStatus("error")
          setMessage("결제 정보가 올바르지 않습니다.")
        }
        return
      }

      if (sessionStorage.getItem(getConfirmStorageKey(orderId)) === "true") {
        if (!cancelled) await markSuccess()
        return
      }

      const result = await confirmPayment({
        paymentKey,
        orderId,
        amount,
        checkoutToken,
      })

      if (cancelled) return

      if (result.ok) {
        sessionStorage.setItem(getConfirmStorageKey(orderId), "true")
        await markSuccess()
        return
      }

      setStatus("error")
      setMessage(result.error ?? "결제 승인에 실패했습니다.")
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [paymentKey, orderId, amount, checkoutToken, refreshCommerce])

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center px-4 text-center">
      {status === "loading" && <Loader2 className="size-10 animate-spin text-primary" />}
      {status === "success" && <CheckCircle2 className="size-10 text-green-600" />}
      {status === "error" && <XCircle className="size-10 text-red-500" />}

      <h1 className="mt-4 text-2xl font-bold">
        {status === "success" ? "결제 성공" : status === "error" ? "결제 실패" : "결제 처리 중"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>

      <div className="mt-6 flex gap-2">
        <Link href="/my-page">
          <Button>구매 내역 보기</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">홈으로</Button>
        </Link>
      </div>
    </div>
  )
}
