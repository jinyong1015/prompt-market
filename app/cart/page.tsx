"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Minus, Plus, ShoppingBag, X } from "lucide-react"
import { toast } from "sonner"

import { getPrompt, formatPrice } from "@/lib/data"
import { useStore } from "@/lib/store"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { CheckoutDialog } from "@/components/checkout-dialog"
import { AuthPageSkeleton } from "@/components/auth-page-skeleton"
import { cn } from "@/lib/utils"

export default function CartPage() {
  const router = useRouter()
  const { user, cart, removeFromCart, setCartQuantity } = useStore()
  const [checkoutOpen, setCheckoutOpen] = React.useState(false)

  React.useEffect(() => {
    if (!user) router.replace("/login")
  }, [user, router])

  if (!user) return <AuthPageSkeleton />

  const items = cart
    .map((item) => {
      const prompt = getPrompt(item.id)
      if (!prompt) return null
      return { ...item, prompt }
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))

  const total = items.reduce((sum, item) => sum + item.prompt.price * item.quantity, 0)
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0)
  const checkoutIds = items.map((item) => item.id)

  function handleRemove(id: string, title: string) {
    removeFromCart(id)
    toast.success(`'${title.slice(0, 12)}...' 삭제됨`)
  }

  function handleDecrease(id: string, quantity: number) {
    if (quantity <= 1) {
      removeFromCart(id)
      toast.success("장바구니에서 삭제했습니다")
      return
    }
    setCartQuantity(id, quantity - 1)
  }

  function handleIncrease(id: string, quantity: number) {
    setCartQuantity(id, quantity + 1)
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-16">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShoppingBag />
            </EmptyMedia>
            <EmptyTitle>장바구니가 비어 있어요</EmptyTitle>
            <EmptyDescription>장바구니에 담긴 상품이 없습니다.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link href="/" className={cn(buttonVariants())}>
              쇼핑 계속하기
            </Link>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold">장바구니</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {items.length}종의 프롬프트 · 총 {totalUnits}개
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <ul className="flex flex-col gap-4">
          {items.map(({ id, quantity, prompt }) => (
            <li key={id}>
              <Card>
                <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Link
                    href={`/prompt/${id}`}
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
                      href={`/prompt/${id}`}
                      className="line-clamp-2 text-sm font-medium leading-snug hover:text-primary"
                    >
                      {prompt.title}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatPrice(prompt.price)} · 단가
                    </p>
                    <p className="mt-0.5 font-display text-sm font-bold text-foreground">
                      {formatPrice(prompt.price * quantity)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center rounded-lg border border-border">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-none"
                        onClick={() => handleDecrease(id, quantity)}
                        aria-label="수량 감소"
                      >
                        <Minus className="size-4" />
                      </Button>
                      <span className="min-w-8 text-center text-sm font-medium tabular-nums">
                        {quantity}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-none"
                        onClick={() => handleIncrease(id, quantity)}
                        aria-label="수량 증가"
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(id, prompt.title)}
                      aria-label="장바구니에서 삭제"
                    >
                      <X />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardContent className="flex flex-col gap-4">
              <h2 className="font-display font-semibold">결제 요약</h2>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">총 상품 금액</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">결제 예정 금액</span>
                <span className="font-display text-xl font-bold text-primary">{formatPrice(total)}</span>
              </div>
              <Button className="w-full" onClick={() => setCheckoutOpen(true)}>
                결제하기
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        items={checkoutIds}
        amount={total}
      />
    </div>
  )
}
