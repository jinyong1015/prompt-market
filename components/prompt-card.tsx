"use client"

import type { MouseEvent } from "react"
import Link from "next/link"
import { Check, Heart, ShoppingCart } from "lucide-react"
import { toast } from "sonner"

import type { Prompt } from "@/lib/data"
import { useStore } from "@/lib/store"
import { formatPrice, useI18n } from "@/lib/i18n"
import { localizePrompt } from "@/lib/prompt-i18n"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function PromptCard({ prompt }: { prompt: Prompt }) {
  const { user, addToCart, isPurchased, isInCart, isInWishlist, toggleWishlist } = useStore()
  const { t, locale } = useI18n()
  const copy = localizePrompt(prompt, locale)
  const purchased = isPurchased(prompt.id)
  const inCart = isInCart(prompt.id)
  const wishlisted = isInWishlist(prompt.id)

  async function handleAdd() {
    if (!user) {
      toast.error(t("toast.loginRequired"))
      return
    }
    if (purchased) {
      toast.error(t("toast.alreadyPurchased"))
      return
    }
    if (inCart) {
      toast.error(t("toast.alreadyInCart"))
      return
    }
    const ok = await addToCart(prompt.id)
    if (!ok) {
      toast.error(t("toast.alreadyInCart"))
      return
    }
    toast.success(t("toast.addedToCart"))
  }

  async function handleWishlist(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      toast.error(t("toast.loginRequired"))
      return
    }
    await toggleWishlist(prompt.id)
    toast.success(wishlisted ? t("toast.wishlistRemoved") : t("toast.wishlistAdded"))
  }

  return (
    <Card className="group flex flex-col overflow-hidden pt-0 transition-shadow hover:shadow-lg">
      <Link href={`/prompt/${prompt.id}`} className="relative block aspect-[4/3] overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={prompt.images[0] || "/placeholder.svg"}
          alt={t("card.imageAlt", { title: copy.title })}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg"
          }}
        />
        <Badge className="absolute left-3 top-3 bg-background/85 text-foreground backdrop-blur-sm" variant="secondary">
          {t(`category.${prompt.category}`)}
        </Badge>
        {purchased && (
          <Badge className="absolute right-12 top-3">{t("card.purchased")}</Badge>
        )}
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="absolute right-3 top-3 size-8 rounded-full bg-background/85 backdrop-blur-sm hover:bg-background"
          onClick={handleWishlist}
          aria-label={wishlisted ? t("card.wishlistRemove") : t("card.wishlistAdd")}
          aria-pressed={wishlisted}
        >
          <Heart className={cn("size-4", wishlisted && "fill-primary text-primary")} />
        </Button>
      </Link>

      <CardContent className="flex flex-1 flex-col gap-2">
        <p className="text-xs font-medium text-muted-foreground">{prompt.model}</p>
        <Link href={`/prompt/${prompt.id}`}>
          <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug text-balance transition-colors group-hover:text-primary">
            {copy.title}
          </h3>
        </Link>
        <p className="mt-auto pt-2 font-display text-lg font-bold text-foreground">
          {formatPrice(prompt.price, locale)}
        </p>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Link
          href={`/prompt/${prompt.id}`}
          className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
        >
          {t("card.details")}
        </Link>
        {purchased ? (
          <Button className="flex-1" disabled>
            <Check data-icon="inline-start" />
            {t("card.purchased")}
          </Button>
        ) : (
          <Button className="flex-1" onClick={handleAdd} disabled={inCart}>
            {inCart ? (
              <>
                <Check data-icon="inline-start" />
                {t("card.inCart")}
              </>
            ) : (
              <>
                <ShoppingCart data-icon="inline-start" />
                {t("card.addToCart")}
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
