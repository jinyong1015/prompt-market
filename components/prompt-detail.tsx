"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Copy, Heart, Lock, ShoppingCart, Zap } from "lucide-react"
import { toast } from "sonner"

import type { Prompt } from "@/lib/data"
import { formatPrice } from "@/lib/data"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckoutDialog } from "@/components/checkout-dialog"
import { cn } from "@/lib/utils"

export function PromptDetail({ prompt }: { prompt: Prompt }) {
  const router = useRouter()
  const { user, addToCart, isPurchased, isInWishlist, toggleWishlist, getCartQuantity } = useStore()
  const [activeImage, setActiveImage] = React.useState(0)
  const [buyOpen, setBuyOpen] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const purchased = isPurchased(prompt.id)
  const wishlisted = isInWishlist(prompt.id)
  const cartQuantity = getCartQuantity(prompt.id)

  function requireLogin() {
    toast.error("로그인이 필요합니다")
    router.push("/login")
  }

  function handleAdd() {
    if (!user) return requireLogin()
    addToCart(prompt.id)
    toast.success(cartQuantity > 0 ? "수량을 추가했습니다" : "장바구니에 담았습니다")
  }

  function handleWishlist() {
    if (!user) return requireLogin()
    toggleWishlist(prompt.id)
    toast.success(wishlisted ? "찜을 해제했습니다" : "찜 목록에 추가했습니다")
  }

  function handleBuyNow() {
    if (!user) return requireLogin()
    setBuyOpen(true)
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(prompt.promptText)
    setCopied(true)
    toast.success("프롬프트를 복사했습니다")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="mb-6 -ml-2">
        <ArrowLeft data-icon="inline-start" />
        목록으로
      </Button>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="flex flex-col gap-3">
          <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={prompt.images[activeImage] || "/placeholder.svg"}
              alt={`${prompt.title} 결과물 예시 ${activeImage + 1}`}
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
                  aria-label={`이미지 ${i + 1} 보기`}
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

        {/* Info + actions */}
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{prompt.category}</Badge>
            <Badge variant="outline">{prompt.model}</Badge>
          </div>
          <div className="mt-3 flex items-start justify-between gap-3">
            <h1 className="font-display text-2xl font-bold leading-snug text-balance sm:text-3xl">
              {prompt.title}
            </h1>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={handleWishlist}
              aria-label={wishlisted ? "찜 해제" : "찜하기"}
              aria-pressed={wishlisted}
            >
              <Heart className={cn("size-5", wishlisted && "fill-primary text-primary")} />
            </Button>
          </div>
          <p className="mt-4 font-display text-3xl font-bold text-primary">{formatPrice(prompt.price)}</p>

          <Separator className="my-6" />

          <div className="flex flex-col gap-5 text-sm leading-relaxed">
            <div>
              <h2 className="mb-1.5 font-semibold text-foreground">상세 설명</h2>
              <p className="text-muted-foreground">{prompt.description}</p>
            </div>
            <div>
              <h2 className="mb-1.5 font-semibold text-foreground">활용법</h2>
              <p className="text-muted-foreground">{prompt.usage}</p>
            </div>
            <div>
              <h2 className="mb-1.5 font-semibold text-foreground">주의사항</h2>
              <p className="text-muted-foreground">{prompt.caution}</p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Action area */}
          {purchased ? (
            <PurchasedContent promptText={prompt.promptText} copied={copied} onCopy={handleCopy} />
          ) : (
            <div className="flex flex-col gap-4">
              <LockedContent />
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="outline" className="flex-1" onClick={handleAdd}>
                  <ShoppingCart data-icon="inline-start" />
                  {cartQuantity > 0 ? `장바구니 담기 (${cartQuantity})` : "장바구니 담기"}
                </Button>
                <Button className="flex-1" onClick={handleBuyNow}>
                  <Zap data-icon="inline-start" />
                  바로 구매하기
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
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 px-6 py-8 text-center">
      <Lock className="size-6 text-muted-foreground" />
      <p className="text-sm font-medium text-foreground">프롬프트 전문이 잠겨 있어요</p>
      <p className="text-xs text-muted-foreground">구매 시 프롬프트 전문을 확인하실 수 있습니다.</p>
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
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
        <Check className="size-4" />
        구매 완료
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">
          구매해주셔서 감사합니다. 프롬프트 내용은 다음과 같습니다.
        </p>
        <div className="relative rounded-xl border border-border bg-card p-4">
          <pre className="whitespace-pre-wrap break-words pr-24 font-mono text-sm leading-relaxed text-foreground">
            {promptText}
          </pre>
          <Button
            variant="outline"
            size="sm"
            onClick={onCopy}
            className="absolute right-2 top-2"
            aria-label="프롬프트 복사"
          >
            {copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
            복사
          </Button>
        </div>
      </div>
    </div>
  )
}
