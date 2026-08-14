"use client"

import type { MouseEvent } from "react"
import Link from "next/link"
import { Check, Heart, ShoppingCart } from "lucide-react"
import { toast } from "sonner"

import type { Prompt } from "@/lib/data"
import { formatPrice } from "@/lib/data"
import { useStore } from "@/lib/store"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function PromptCard({ prompt }: { prompt: Prompt }) {
  const { user, addToCart, isPurchased, isInWishlist, toggleWishlist, getCartQuantity } = useStore()
  const purchased = isPurchased(prompt.id)
  const wishlisted = isInWishlist(prompt.id)
  const cartQuantity = getCartQuantity(prompt.id)

  function handleAdd() {
    if (!user) {
      toast.error("로그인이 필요합니다")
      return
    }
    addToCart(prompt.id)
    toast.success(cartQuantity > 0 ? "수량을 추가했습니다" : "장바구니에 담았습니다")
  }

  function handleWishlist(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      toast.error("로그인이 필요합니다")
      return
    }
    toggleWishlist(prompt.id)
    toast.success(wishlisted ? "찜을 해제했습니다" : "찜 목록에 추가했습니다")
  }

  return (
    <Card className="group flex flex-col overflow-hidden pt-0 transition-shadow hover:shadow-lg">
      <Link href={`/prompt/${prompt.id}`} className="relative block aspect-[4/3] overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={prompt.images[0] || "/placeholder.svg"}
          alt={`${prompt.title} 결과물 예시`}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg"
          }}
        />
        <Badge className="absolute left-3 top-3 bg-background/85 text-foreground backdrop-blur-sm" variant="secondary">
          {prompt.category}
        </Badge>
        {purchased && (
          <Badge className="absolute right-12 top-3">구매완료</Badge>
        )}
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="absolute right-3 top-3 size-8 rounded-full bg-background/85 backdrop-blur-sm hover:bg-background"
          onClick={handleWishlist}
          aria-label={wishlisted ? "찜 해제" : "찜하기"}
          aria-pressed={wishlisted}
        >
          <Heart className={cn("size-4", wishlisted && "fill-primary text-primary")} />
        </Button>
      </Link>

      <CardContent className="flex flex-1 flex-col gap-2">
        <p className="text-xs font-medium text-muted-foreground">{prompt.model}</p>
        <Link href={`/prompt/${prompt.id}`}>
          <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug text-balance transition-colors group-hover:text-primary">
            {prompt.title}
          </h3>
        </Link>
        <p className="mt-auto pt-2 font-display text-lg font-bold text-foreground">
          {formatPrice(prompt.price)}
        </p>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Link
          href={`/prompt/${prompt.id}`}
          className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
        >
          상세보기
        </Link>
        {purchased ? (
          <Button className="flex-1" disabled>
            <Check data-icon="inline-start" />
            구매완료
          </Button>
        ) : (
          <Button className="flex-1" onClick={handleAdd}>
            <ShoppingCart data-icon="inline-start" />
            {cartQuantity > 0 ? `담기 (${cartQuantity})` : "장바구니 담기"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
