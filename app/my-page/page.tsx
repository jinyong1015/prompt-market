"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Receipt } from "lucide-react"

import { getPrompt } from "@/lib/data"
import { useStore } from "@/lib/store"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { AuthPageSkeleton } from "@/components/auth-page-skeleton"
import { cn } from "@/lib/utils"

export default function MyPage() {
  const router = useRouter()
  const { user, purchases } = useStore()

  React.useEffect(() => {
    if (!user) router.replace("/login")
  }, [user, router])

  if (!user) return <AuthPageSkeleton />

  const items = purchases
    .map((p) => ({ ...p, prompt: getPrompt(p.id) }))
    .filter((p): p is typeof p & { prompt: NonNullable<typeof p.prompt> } => Boolean(p.prompt))

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-16">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Receipt />
            </EmptyMedia>
            <EmptyTitle>구매 내역</EmptyTitle>
            <EmptyDescription>아직 구매한 프롬프트가 없습니다.</EmptyDescription>
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
      <h1 className="font-display text-2xl font-bold">구매 내역</h1>
      <p className="mt-1 text-sm text-muted-foreground">{items.length}개의 프롬프트를 구매했어요.</p>

      <ul className="mt-8 flex flex-col gap-4">
        {items.map(({ id, date, prompt }) => (
          <li key={id}>
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={prompt.images[0] || "/placeholder.svg"}
                    alt={prompt.title}
                    className="size-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">{date} 구매</p>
                  <p className="mt-0.5 line-clamp-2 text-sm font-medium leading-snug">{prompt.title}</p>
                </div>
                <Link
                  href={`/prompt/${id}`}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0")}
                >
                  내용 다시보기
                </Link>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
