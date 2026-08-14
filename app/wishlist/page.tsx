"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, Heart, ShoppingCart, X } from "lucide-react"
import { toast } from "sonner"

import { getPrompt, formatPrice } from "@/lib/data"
import { useStore } from "@/lib/store"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { AuthPageSkeleton } from "@/components/auth-page-skeleton"
import { cn } from "@/lib/utils"

export default function WishlistPage() {
  const router = useRouter()
  const { user, wishlist, removeFromWishlist, addToCart, isInCart, isPurchased } = useStore()

  React.useEffect(() => {
    if (!user) router.replace("/login")
  }, [user, router])

  if (!user) return <AuthPageSkeleton />

  const items = wishlist.map(getPrompt).filter((p): p is NonNullable<typeof p> => Boolean(p))

  function handleRemove(id: string) {
    removeFromWishlist(id)
    toast.success("찜을 해제했습니다")
  }

  function handleAddToCart(id: string, purchased: boolean, inCart: boolean) {
    if (purchased) {
      toast.error("이미 구매한 상품입니다")
      return
    }
    if (inCart) {
      toast.error("이미 장바구니에 있습니다")
      return
    }
    const ok = addToCart(id)
    if (!ok) {
      toast.error("이미 장바구니에 있습니다")
      return
    }
    toast.success("장바구니에 담았습니다")
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-16">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Heart />
            </EmptyMedia>
            <EmptyTitle>찜 내역</EmptyTitle>
            <EmptyDescription>아직 찜한 프롬프트가 없습니다.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link href="/" className={cn(buttonVariants())}>
              프롬프트 둘러보기
            </Link>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold">찜 내역</h1>
      <p className="mt-1 text-sm text-muted-foreground">{items.length}개의 프롬프트를 찜했어요.</p>

      <ul className="mt-8 flex flex-col gap-4">
        {items.map((prompt) => {
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
                      alt={prompt.title}
                      className="size-full object-cover"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/prompt/${prompt.id}`}
                      className="line-clamp-2 text-sm font-medium leading-snug hover:text-primary"
                    >
                      {prompt.title}
                    </Link>
                    <p className="mt-1 font-display text-sm font-bold text-foreground">
                      {formatPrice(prompt.price)}
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
                            담김
                          </>
                        ) : (
                          <>
                            <ShoppingCart data-icon="inline-start" />
                            담기
                          </>
                        )}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(prompt.id)}
                      aria-label="찜 해제"
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
