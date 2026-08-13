"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingBag, X } from "lucide-react"
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
  const { user, cart, removeFromCart } = useStore()
  const [checkoutOpen, setCheckoutOpen] = React.useState(false)

  React.useEffect(() => {
    if (!user) router.replace("/login")
  }, [user, router])

  if (!user) return <AuthPageSkeleton />

  const items = cart.map(getPrompt).filter((p): p is NonNullable<typeof p> => Boolean(p))
  const total = items.reduce((sum, p) => sum + p.price, 0)

  function handleRemove(id: string, title: string) {
    removeFromCart(id)
    toast.success(`'${title.slice(0, 12)}...' 삭제됨`)
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
      <p className="mt-1 text-sm text-muted-foreground">{items.length}개의 프롬프트</p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        {/* Items */}
        <ul className="flex flex-col gap-4">
          {items.map((prompt) => (
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(prompt.id, prompt.title)}
                    aria-label="장바구니에서 삭제"
                  >
                    <X />
                  </Button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>

        {/* Summary */}
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
        items={cart}
        amount={total}
      />
    </div>
  )
}
