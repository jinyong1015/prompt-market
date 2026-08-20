"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, Heart, ShoppingCart, X } from "lucide-react"
import { toast } from "sonner"

import { usePromptsByIds } from "@/lib/prompts/client"
import { useStore } from "@/lib/store"
import { formatPrice, useI18n } from "@/lib/i18n"
import { localizePrompt } from "@/lib/prompt-i18n"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { AuthPageSkeleton } from "@/components/auth-page-skeleton"
import { cn } from "@/lib/utils"

export default function WishlistPage() {
  const router = useRouter()
  const { user, wishlist, removeFromWishlist, addToCart, isInCart, isPurchased, isCommerceReady } =
    useStore()
  const { t, locale } = useI18n()
  const promptItems = usePromptsByIds(wishlist)

  React.useEffect(() => {
    if (!user) router.replace("/sign-in")
  }, [user, router])

  if (!user || !isCommerceReady || (wishlist.length > 0 && promptItems.length === 0)) {
    return <AuthPageSkeleton />
  }

  const items = promptItems

  function handleRemove(id: string) {
    void removeFromWishlist(id).then(() => toast.success(t("toast.wishlistRemoved")))
  }

  async function handleAddToCart(id: string, purchased: boolean, inCart: boolean) {
    if (purchased) {
      toast.error(t("toast.alreadyPurchased"))
      return
    }
    if (inCart) {
      toast.error(t("toast.alreadyInCart"))
      return
    }
    const ok = await addToCart(id)
    if (!ok) {
      toast.error(t("toast.alreadyInCart"))
      return
    }
    toast.success(t("toast.addedToCart"))
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-16">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Heart />
            </EmptyMedia>
            <EmptyTitle>{t("wishlist.emptyTitle")}</EmptyTitle>
            <EmptyDescription>{t("wishlist.emptyDesc")}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link href="/" className={cn(buttonVariants())}>
              {t("wishlist.browse")}
            </Link>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold">{t("wishlist.title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("wishlist.count", { count: items.length })}</p>

      <ul className="mt-8 flex flex-col gap-4">
        {items.map((prompt) => {
          const copy = localizePrompt(prompt, locale)
          const inCart = isInCart(prompt.id)
          const purchased = isPurchased(prompt.id)

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
                  <div className="flex shrink-0 items-center gap-1">
                    {!purchased && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddToCart(prompt.id, purchased, inCart)}
                        disabled={inCart}
                      >
                        {inCart ? (
                          <>
                            <Check data-icon="inline-start" />
                            {t("wishlist.added")}
                          </>
                        ) : (
                          <>
                            <ShoppingCart data-icon="inline-start" />
                            {t("wishlist.add")}
                          </>
                        )}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(prompt.id)}
                      aria-label={t("wishlist.remove")}
                    >
                      <X />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
