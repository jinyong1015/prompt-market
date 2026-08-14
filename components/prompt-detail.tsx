"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Copy, Heart, Lock, ShoppingCart, Zap } from "lucide-react"
import { toast } from "sonner"

import type { Prompt } from "@/lib/data"
import { useStore } from "@/lib/store"
import { formatPrice, useI18n } from "@/lib/i18n"
import { localizePrompt } from "@/lib/prompt-i18n"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckoutDialog } from "@/components/checkout-dialog"
import { cn } from "@/lib/utils"

export function PromptDetail({ prompt }: { prompt: Prompt }) {
  const router = useRouter()
  const { user, addToCart, isPurchased, isInCart, isInWishlist, toggleWishlist } = useStore()
  const { t, locale } = useI18n()
  const copy = localizePrompt(prompt, locale)
  const [activeImage, setActiveImage] = React.useState(0)
  const [buyOpen, setBuyOpen] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const purchased = isPurchased(prompt.id)
  const inCart = isInCart(prompt.id)
  const wishlisted = isInWishlist(prompt.id)

  function requireLogin() {
    toast.error(t("toast.loginRequired"))
    router.push("/login")
  }

  function handleAdd() {
    if (!user) return requireLogin()
    if (purchased) {
      toast.error(t("toast.alreadyPurchased"))
      return
    }
    if (inCart) {
      toast.error(t("toast.alreadyInCart"))
      return
    }
    const ok = addToCart(prompt.id)
    if (!ok) {
      toast.error(t("toast.alreadyInCart"))
      return
    }
    toast.success(t("toast.addedToCart"))
  }

  function handleWishlist() {
    if (!user) return requireLogin()
    toggleWishlist(prompt.id)
    toast.success(wishlisted ? t("toast.wishlistRemoved") : t("toast.wishlistAdded"))
  }

  function handleBuyNow() {
    if (!user) return requireLogin()
    if (purchased) {
      toast.error(t("toast.alreadyPurchased"))
      return
    }
    setBuyOpen(true)
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(prompt.promptText)
    setCopied(true)
    toast.success(t("toast.copied"))
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="mb-6 -ml-2">
        <ArrowLeft data-icon="inline-start" />
        {t("detail.back")}
      </Button>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={prompt.images[activeImage] || "/placeholder.svg"}
              alt={t("card.imageAlt", { title: copy.title })}
              className="size-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg"
              }}
            />
          </div>
          {prompt.images.length > 1 && (
            <div className="flex gap-3">
              {prompt.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square w-20 overflow-hidden rounded-lg border-2 transition-colors ${
                    i === activeImage ? "border-primary" : "border-transparent"
                  }`}
                  aria-label={t("detail.viewImage", { n: i + 1 })}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img || "/placeholder.svg"}
                    alt=""
                    className="size-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg"
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{t(`category.${prompt.category}`)}</Badge>
            <Badge variant="outline">{prompt.model}</Badge>
          </div>
          <div className="mt-3 flex items-start justify-between gap-3">
            <h1 className="font-display text-2xl font-bold leading-snug text-balance sm:text-3xl">
              {copy.title}
            </h1>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={handleWishlist}
              aria-label={wishlisted ? t("card.wishlistRemove") : t("card.wishlistAdd")}
              aria-pressed={wishlisted}
            >
              <Heart className={cn("size-5", wishlisted && "fill-primary text-primary")} />
            </Button>
          </div>
          <p className="mt-4 font-display text-3xl font-bold text-primary">
            {formatPrice(prompt.price, locale)}
          </p>

          <Separator className="my-6" />

          <div className="flex flex-col gap-5 text-sm leading-relaxed">
            <div>
              <h2 className="mb-1.5 font-semibold text-foreground">{t("detail.description")}</h2>
              <p className="text-muted-foreground">{copy.description}</p>
            </div>
            <div>
              <h2 className="mb-1.5 font-semibold text-foreground">{t("detail.usage")}</h2>
              <p className="text-muted-foreground">{copy.usage}</p>
            </div>
            <div>
              <h2 className="mb-1.5 font-semibold text-foreground">{t("detail.caution")}</h2>
              <p className="text-muted-foreground">{copy.caution}</p>
            </div>
          </div>

          <Separator className="my-6" />

          {purchased ? (
            <PurchasedContent promptText={prompt.promptText} copied={copied} onCopy={handleCopy} />
          ) : (
            <div className="flex flex-col gap-4">
              <LockedContent />
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="outline" className="flex-1" onClick={handleAdd} disabled={inCart}>
                  {inCart ? <Check data-icon="inline-start" /> : <ShoppingCart data-icon="inline-start" />}
                  {inCart ? t("card.inCart") : t("card.addToCart")}
                </Button>
                <Button className="flex-1" onClick={handleBuyNow}>
                  <Zap data-icon="inline-start" />
                  {t("detail.buyNow")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <CheckoutDialog
        open={buyOpen}
        onOpenChange={setBuyOpen}
        items={[prompt.id]}
        amount={prompt.price}
      />
    </div>
  )
}

function LockedContent() {
  const { t } = useI18n()
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 px-6 py-8 text-center">
      <Lock className="size-6 text-muted-foreground" />
      <p className="text-sm font-medium text-foreground">{t("detail.lockedTitle")}</p>
      <p className="text-xs text-muted-foreground">{t("detail.lockedDesc")}</p>
    </div>
  )
}

function PurchasedContent({
  promptText,
  copied,
  onCopy,
}: {
  promptText: string
  copied: boolean
  onCopy: () => void
}) {
  const { t } = useI18n()
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
        <Check className="size-4" />
        {t("detail.purchased")}
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">{t("detail.purchasedThanks")}</p>
        <div className="relative rounded-xl border border-border bg-card p-4">
          <pre className="whitespace-pre-wrap break-words pr-24 font-mono text-sm leading-relaxed text-foreground">
            {promptText}
          </pre>
          <Button
            variant="outline"
            size="sm"
            onClick={onCopy}
            className="absolute right-2 top-2"
            aria-label={t("detail.copy")}
          >
            {copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
            {t("detail.copy")}
          </Button>
        </div>
      </div>
    </div>
  )
}
