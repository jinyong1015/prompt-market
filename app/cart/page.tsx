"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingBag, X } from "lucide-react"
import { toast } from "sonner"

import { usePromptsByIds } from "@/lib/prompts/client"
import { useStore } from "@/lib/store"
import { formatPrice, useI18n } from "@/lib/i18n"
import { localizePrompt } from "@/lib/prompt-i18n"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { CheckoutDialog } from "@/components/checkout-dialog"
import { AuthPageSkeleton } from "@/components/auth-page-skeleton"
import { cn } from "@/lib/utils"

export default function CartPage() {
  const router = useRouter()
  const { user, cart, removeFromCart, isCommerceReady } = useStore()
  const { t, locale } = useI18n()
  const [checkoutOpen, setCheckoutOpen] = React.useState(false)
  const promptItems = usePromptsByIds(cart)

  React.useEffect(() => {
    if (!user) router.replace("/sign-in")
  }, [user, router])

  if (!user || !isCommerceReady || (cart.length > 0 && promptItems.length === 0)) {
    return <AuthPageSkeleton />
  }

  const items = promptItems
  const total = items.reduce((sum, p) => sum + p.price, 0)

  function handleRemove(id: string) {
    void removeFromCart(id).then(() => toast.success(t("toast.cartRemoved")))
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-16">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShoppingBag />
            </EmptyMedia>
            <EmptyTitle>{t("cart.emptyTitle")}</EmptyTitle>
            <EmptyDescription>{t("cart.emptyDesc")}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link href="/" className={cn(buttonVariants())}>
              {t("cart.continue")}
            </Link>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold">{t("cart.title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("cart.count", { count: items.length })}</p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <ul className="flex flex-col gap-4">
          {items.map((prompt) => {
            const copy = localizePrompt(prompt, locale)
            return (
              <li key={prompt.id}>
                <Card>
                  <CardContent className="flex items-center gap-4">
                    <Link
                      href={`/prompt/${prompt.id}`}
                      className="size-16 shrink-0 overflow-hidden rounded-lg bg-muted"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={prompt.images[0] || "/placeholder.svg"}
                        alt={copy.title}
                        className="size-full object-cover"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/prompt/${prompt.id}`}
                        className="line-clamp-2 text-sm font-medium leading-snug hover:text-primary"
                      >
                        {copy.title}
                      </Link>
                      <p className="mt-1 font-display text-sm font-bold text-foreground">
                        {formatPrice(prompt.price, locale)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(prompt.id)}
                      aria-label={t("cart.remove")}
                    >
                      <X />
                    </Button>
                  </CardContent>
                </Card>
              </li>
            )
          })}
        </ul>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardContent className="flex flex-col gap-4">
              <h2 className="font-display font-semibold">{t("cart.summary")}</h2>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("cart.subtotal")}</span>
                <span className="font-medium">{formatPrice(total, locale)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("cart.due")}</span>
                <span className="font-display text-xl font-bold text-primary">
                  {formatPrice(total, locale)}
                </span>
              </div>
              <Button className="w-full" onClick={() => setCheckoutOpen(true)}>
                {t("cart.checkout")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        items={cart}
        amount={total}
      />
    </div>
  )
}
