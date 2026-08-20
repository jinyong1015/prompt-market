"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, CreditCard } from "lucide-react"

import { toast } from "sonner"

import { useStore } from "@/lib/store"
import { formatPrice, useI18n } from "@/lib/i18n"
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

interface CheckoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: string[]
  amount: number
}

export function CheckoutDialog({ open, onOpenChange, items, amount }: CheckoutDialogProps) {
  const router = useRouter()
  const { checkout } = useStore()
  const { t, locale } = useI18n()
  const [status, setStatus] = React.useState<"idle" | "processing" | "done">("idle")
  const price = formatPrice(amount, locale)

  React.useEffect(() => {
    if (open) setStatus("idle")
  }, [open])

  async function handlePay() {
    setStatus("processing")
    const result = await checkout(items)
    if (!result.ok) {
      setStatus("idle")
      toast.error(result.error)
      return
    }
    setStatus("done")
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
              <DialogTitle className="text-center">{t("checkout.done")}</DialogTitle>
              <DialogDescription className="text-center">{t("checkout.doneDesc")}</DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button className="w-full" onClick={handleGoToMyPage}>
                {t("checkout.viewPurchases")}
              </Button>
              <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
                {t("checkout.close")}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{t("checkout.title")}</DialogTitle>
              <DialogDescription>{t("checkout.desc")}</DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3">
              <span className="text-sm text-muted-foreground">{t("checkout.due")}</span>
              <span className="font-display text-lg font-bold text-foreground">{price}</span>
            </div>
            <DialogFooter>
              <Button className="w-full" onClick={handlePay} disabled={status === "processing"}>
                {status === "processing" ? (
                  <>
                    <Spinner data-icon="inline-start" />
                    {t("checkout.paying")}
                  </>
                ) : (
                  <>
                    <CreditCard data-icon="inline-start" />
                    {t("checkout.pay", { amount: price })}
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
