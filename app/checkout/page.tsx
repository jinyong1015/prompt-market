"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CreditCard, Loader2 } from "lucide-react"
import { loadTossPayments } from "@tosspayments/tosspayments-sdk"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

type PrepareResult = {
  clientKey: string
  customerKey: string
  orderId: string
  orderName: string
  amount: number
  customerEmail?: string
  customerName?: string
  successUrl: string
  failUrl: string
}

type WidgetsInstance = ReturnType<
  Awaited<ReturnType<typeof loadTossPayments>>["widgets"]
>

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const ids = React.useMemo(
    () => (searchParams.get("items") ?? "").split(",").map((id) => id.trim()).filter(Boolean),
    [searchParams],
  )

  const [data, setData] = React.useState<PrepareResult | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [widgetReady, setWidgetReady] = React.useState(false)
  const [paying, setPaying] = React.useState(false)
  const widgetsRef = React.useRef<WidgetsInstance | null>(null)

  React.useEffect(() => {
    let cancelled = false

    async function prepare() {
      if (ids.length === 0) {
        setLoading(false)
        return
      }

      const res = await fetch("/api/payments/toss/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptIds: ids }),
      })

      const payload = (await res.json()) as PrepareResult | { error: string }
      if (!res.ok) {
        if (!cancelled) {
          toast.error("결제 준비에 실패했습니다.")
          setLoading(false)
        }
        return
      }

      if (!cancelled) {
        setData(payload as PrepareResult)
        setLoading(false)
      }
    }

    void prepare()

    return () => {
      cancelled = true
    }
  }, [ids])

  React.useEffect(() => {
    if (!data) return

    let cancelled = false

    async function initWidget() {
      try {
        const tossPayments = await loadTossPayments(data.clientKey)
        const widgets = tossPayments.widgets({ customerKey: data.customerKey })

        await widgets.setAmount({ currency: "KRW", value: data.amount })
        await widgets.renderPaymentMethods({
          selector: "#payment-method",
          variantKey: "DEFAULT",
        })
        await widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        })

        if (!cancelled) {
          widgetsRef.current = widgets
          setWidgetReady(true)
        }
      } catch (error) {
        console.error(error)
        if (!cancelled) toast.error("결제 UI를 불러오지 못했습니다.")
      }
    }

    void initWidget()

    return () => {
      cancelled = true
      widgetsRef.current = null
      setWidgetReady(false)
    }
  }, [data])

  async function handlePay() {
    const widgets = widgetsRef.current
    if (!widgets || !data) return

    try {
      setPaying(true)
      await widgets.requestPayment({
        orderId: data.orderId,
        orderName: data.orderName,
        customerEmail: data.customerEmail,
        customerName: data.customerName,
        successUrl: data.successUrl,
        failUrl: data.failUrl,
      })
    } catch (error) {
      console.error(error)
      toast.error("결제창을 여는 중 오류가 발생했습니다.")
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-2xl items-center justify-center px-4">
        <Loader2 className="size-5 animate-spin" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sm text-muted-foreground">결제할 상품이 없습니다.</p>
        <Link href="/cart">
          <Button variant="outline">장바구니로 돌아가기</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold">결제하기</h1>
      <p className="mt-2 text-sm text-muted-foreground">토스페이먼츠 테스트 결제를 진행합니다.</p>

      <div className="mt-8 rounded-xl border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground">상품명</p>
        <p className="mt-1 font-medium">{data.orderName}</p>
        <p className="mt-4 text-sm text-muted-foreground">결제 금액</p>
        <p className="mt-1 text-2xl font-bold">₩{data.amount.toLocaleString("ko-KR")}</p>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <p className="mb-3 text-sm font-medium">결제수단 선택</p>
        <div id="payment-method" />
        <div id="agreement" className="mt-4" />
      </div>

      <Button
        className="mt-6 w-full"
        size="lg"
        onClick={handlePay}
        disabled={!widgetReady || paying}
      >
        {paying ? (
          <Loader2 className="animate-spin" data-icon="inline-start" />
        ) : (
          <CreditCard data-icon="inline-start" />
        )}
        테스트 결제 진행
      </Button>
    </div>
  )
}
