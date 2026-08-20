"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CreditCard } from "lucide-react"

import { formatPrice, useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
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
  const { t, locale } = useI18n()
  const price = formatPrice(amount, locale)
  const itemParam = items.join(",")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("checkout.title")}</DialogTitle>
          <DialogDescription>{t("checkout.desc")}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3">
          <span className="text-sm text-muted-foreground">{t("checkout.due")}</span>
          <span className="font-display text-lg font-bold text-foreground">{price}</span>
        </div>
        <DialogFooter>
          <Button
            className="w-full"
            onClick={() => {
              onOpenChange(false)
              router.push(`/checkout?items=${encodeURIComponent(itemParam)}`)
            }}
          >
            <CreditCard data-icon="inline-start" />
            {t("checkout.pay", { amount: price })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
