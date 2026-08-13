"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, CreditCard } from "lucide-react"

import { formatPrice } from "@/lib/data"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type CheckoutDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: string[]
  amount: number
}

export function CheckoutDialog({ open, onOpenChange, items, amount }: CheckoutDialogProps) {
  const router = useRouter()
  const { checkout } = useStore()
  const [status, setStatus] = React.useState<"idle" | "processing" | "done">("idle")

  React.useEffect(() => {
    if (open) setStatus("idle")
  }, [open])

  function handlePay() {
    setStatus("processing")
    // Simulate Toss Payments call
    setTimeout(() => {
      checkout(items)
      setStatus("done")
    }, 1400)
  }

  function handleGoToMyPage() {
    onOpenChange(false)
    router.push("/my-page")
  }

  return (
    <Dialog open={open} onOpenChange={(o) => status !== "processing" && onOpenChange(o)}>
      <DialogContent className="sm:max-w-sm">
        {status === "done" ? (
          <>
            <DialogHeader>
              <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="size-6 text-primary" />
              </div>
              <DialogTitle className="text-center">결제가 완료되었습니다</DialogTitle>
              <DialogDescription className="text-center">
                구매하신 프롬프트는 구매 내역에서 확인할 수 있습니다.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button className="w-full" onClick={handleGoToMyPage}>
                구매 내역 보기
              </Button>
              <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
                닫기
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>결제하기</DialogTitle>
              <DialogDescription>
                토스페이먼츠로 안전하게 결제를 진행합니다. (데모 시뮬레이션)
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3">
              <span className="text-sm text-muted-foreground">결제 예정 금액</span>
              <span className="font-display text-lg font-bold text-foreground">{formatPrice(amount)}</span>
            </div>
            <DialogFooter>
              <Button className="w-full" onClick={handlePay} disabled={status === "processing"}>
                {status === "processing" ? (
                  <>
                    <Spinner data-icon="inline-start" />
                    결제 중...
                  </>
                ) : (
                  <>
                    <CreditCard data-icon="inline-start" />
                    {formatPrice(amount)} 결제하기
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
