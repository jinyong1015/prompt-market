"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowUpDown,
  CalendarDays,
  Check,
  ChevronDown,
  Download,
  FileText,
  Filter,
  Receipt,
  Search,
  Star,
  Wallet,
} from "lucide-react"
import { toast } from "sonner"

import { formatPrice, getPrompt } from "@/lib/data"
import type { Prompt } from "@/lib/data"
import { useStore } from "@/lib/store"
import type { Review } from "@/lib/store"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { AuthPageSkeleton } from "@/components/auth-page-skeleton"
import { cn } from "@/lib/utils"

type PurchaseRow = {
  id: string
  date: string
  prompt: Prompt
}

type StatusFilter = "all" | "reviewed" | "unreviewed"
type SortOption = "newest" | "oldest" | "price-desc" | "price-asc"

const SELLER_NAME = "PromptMarket"

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "reviewed", label: "리뷰 작성" },
  { value: "unreviewed", label: "리뷰 미작성" },
]

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "최신순" },
  { value: "oldest", label: "오래된순" },
  { value: "price-desc", label: "가격 높은순" },
  { value: "price-asc", label: "가격 낮은순" },
]

function downloadPromptFile(title: string, promptText: string) {
  const safeName = title.replace(/[\\/:*?"<>|]/g, "_").slice(0, 40)
  const blob = new Blob([promptText], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = `${safeName || "prompt"}.txt`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

function formatCompactWon(amount: number) {
  if (amount >= 10_000) {
    const man = amount / 10_000
    const label = Number.isInteger(man) ? String(man) : man.toFixed(1).replace(/\.0$/, "")
    return `₩${label}만`
  }
  return `₩${amount.toLocaleString("ko-KR")}`
}

function downloadAllReceipts(items: PurchaseRow[]) {
  const lines = [
    "Prompt Market 구매 영수증",
    `발급일: ${new Date().toISOString().slice(0, 10)}`,
    "",
    ...items.flatMap((item, index) => [
      `${index + 1}. ${item.prompt.title}`,
      `   구매일: ${item.date}`,
      `   금액: ${formatPrice(item.prompt.price)}`,
      `   판매자: ${SELLER_NAME}`,
      "",
    ]),
    `합계: ${formatPrice(items.reduce((sum, item) => sum + item.prompt.price, 0))}`,
  ]
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = "prompt-market-receipts.txt"
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export default function MyPage() {
  const router = useRouter()
  const { user, purchases, getReview, saveReview } = useStore()
  const [query, setQuery] = React.useState("")
  const [status, setStatus] = React.useState<StatusFilter>("all")
  const [sort, setSort] = React.useState<SortOption>("newest")
  const [reviewTarget, setReviewTarget] = React.useState<PurchaseRow | null>(null)
  const [downloadTarget, setDownloadTarget] = React.useState<PurchaseRow | null>(null)

  React.useEffect(() => {
    if (!user) router.replace("/login")
  }, [user, router])

  if (!user) return <AuthPageSkeleton />

  const items: PurchaseRow[] = purchases
    .map((p) => {
      const prompt = getPrompt(p.id)
      if (!prompt) return null
      return { id: p.id, date: p.date, prompt }
    })
    .filter((item): item is PurchaseRow => Boolean(item))

  const totalPaid = items.reduce((sum, item) => sum + item.prompt.price, 0)
  const orderCount = new Set(items.map((item) => item.date)).size || items.length

  const filtered = items
    .filter((item) => {
      const haystack = `${item.prompt.title} ${SELLER_NAME} ${item.prompt.category}`.toLowerCase()
      const matchesQuery = !query.trim() || haystack.includes(query.trim().toLowerCase())
      const hasReview = Boolean(getReview(item.id))
      const matchesStatus =
        status === "all" ||
        (status === "reviewed" && hasReview) ||
        (status === "unreviewed" && !hasReview)
      return matchesQuery && matchesStatus
    })
    .sort((a, b) => {
      if (sort === "newest") return b.date.localeCompare(a.date)
      if (sort === "oldest") return a.date.localeCompare(b.date)
      if (sort === "price-desc") return b.prompt.price - a.prompt.price
      return a.prompt.price - b.prompt.price
    })

  const statusLabel = STATUS_OPTIONS.find((o) => o.value === status)?.label ?? "전체"
  const sortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "최신순"

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
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">구매 내역</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            총 {items.length}개 프롬프트 · {formatPrice(totalPaid)} 결제
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="h-10"
          onClick={() => {
            downloadAllReceipts(items)
            toast.success("전체 영수증을 다운로드했습니다")
          }}
        >
          <FileText data-icon="inline-start" />
          전체 영수증 다운로드
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          icon={<Download className="size-5" />}
          value={String(items.length)}
          label="구매한 프롬프트"
        />
        <StatCard
          icon={<Wallet className="size-5" />}
          value={formatCompactWon(totalPaid)}
          label="총 결제 금액"
        />
        <StatCard
          icon={<CalendarDays className="size-5" />}
          value={String(orderCount)}
          label="총 주문 수"
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border/80 bg-card/60 p-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="프롬프트 제목이나 판매자로 검색..."
            className="h-10 border-0 bg-muted/50 pl-9 shadow-none focus-visible:bg-background"
            aria-label="구매 내역 검색"
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <FilterDropdown
            ariaLabel="상태 필터"
            prefix="상태"
            icon={<Filter className="size-4 text-muted-foreground" />}
            label={statusLabel}
            options={STATUS_OPTIONS}
            value={status}
            onChange={setStatus}
          />
          <FilterDropdown
            ariaLabel="정렬"
            prefix="정렬"
            icon={<ArrowUpDown className="size-4 text-muted-foreground" />}
            label={sortLabel}
            options={SORT_OPTIONS}
            value={sort}
            onChange={setSort}
          />
        </div>
      </div>

      <ul className="mt-6 flex flex-col gap-4">
        {filtered.length === 0 ? (
          <li>
            <Card className="shadow-none">
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                검색 조건에 맞는 구매 내역이 없습니다.
              </CardContent>
            </Card>
          </li>
        ) : (
          filtered.map((item) => (
            <li key={item.id}>
              <PurchaseListCard
                item={item}
                hasReview={Boolean(getReview(item.id))}
                onDownload={() => setDownloadTarget(item)}
                onReview={() => setReviewTarget(item)}
              />
            </li>
          ))
        )}
      </ul>

      <DownloadDialog
        item={downloadTarget}
        onOpenChange={(open) => {
          if (!open) setDownloadTarget(null)
        }}
        onConfirm={() => {
          if (!downloadTarget) return
          downloadPromptFile(downloadTarget.prompt.title, downloadTarget.prompt.promptText)
          toast.success("프롬프트를 다운로드했습니다")
          setDownloadTarget(null)
        }}
      />

      <ReviewDialog
        item={reviewTarget}
        review={reviewTarget ? getReview(reviewTarget.id) : undefined}
        onOpenChange={(open) => {
          if (!open) setReviewTarget(null)
        }}
        onSave={(data) => {
          if (!reviewTarget) return
          saveReview(reviewTarget.id, data)
          toast.success("리뷰를 저장했습니다")
          setReviewTarget(null)
        }}
      />
    </div>
  )
}

function FilterDropdown<T extends string>({
  ariaLabel,
  prefix,
  icon,
  label,
  options,
  value,
  onChange,
}: {
  ariaLabel: string
  prefix: string
  icon: React.ReactNode
  label: string
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "group h-10 min-w-[11.5rem] justify-between gap-2 bg-background px-3 font-normal",
        )}
        aria-label={ariaLabel}
      >
        <span className="flex min-w-0 items-center gap-2">
          {icon}
          <span className="truncate text-left">
            <span className="text-muted-foreground">{prefix}: </span>
            {label}
          </span>
        </span>
        <ChevronDown className="size-4 shrink-0 opacity-80 transition-transform duration-200 group-data-popup-open:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className="justify-between gap-3"
          >
            {option.label}
            {value === option.value && <Check className="size-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: string
  label: string
}) {
  return (
    <Card className="shadow-none">
      <CardContent className="flex items-center gap-4 py-5">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="font-display text-2xl font-bold tracking-tight">{value}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function PurchaseListCard({
  item,
  hasReview,
  onDownload,
  onReview,
}: {
  item: PurchaseRow
  hasReview: boolean
  onDownload: () => void
  onReview: () => void
}) {
  return (
    <Card className="overflow-hidden shadow-none transition-shadow hover:shadow-sm">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <Link
              href={`/prompt/${item.id}`}
              className="size-20 shrink-0 overflow-hidden rounded-xl bg-muted ring-1 ring-border/60 sm:size-24"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.prompt.images[0] || "/placeholder.svg"}
                alt={item.prompt.title}
                className="size-full object-cover"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <Badge variant="secondary" className="mb-2">
                {item.prompt.category}
              </Badge>
              <Link
                href={`/prompt/${item.id}`}
                className="line-clamp-2 font-display text-base font-semibold leading-snug hover:text-primary sm:text-lg"
              >
                {item.prompt.title}
              </Link>
              <p className="mt-1.5 text-sm text-muted-foreground">작성자: {SELLER_NAME}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.date} 구매</p>
            </div>
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:items-end">
            <p className="font-display text-lg font-bold sm:text-xl">
              {formatPrice(item.prompt.price)}
            </p>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" className="h-8" onClick={onDownload}>
                <Download data-icon="inline-start" />
                다운로드
              </Button>
              <Button type="button" variant="outline" size="sm" className="h-8" onClick={onReview}>
                <Star data-icon="inline-start" />
                {hasReview ? "리뷰 수정" : "리뷰"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function DownloadDialog({
  item,
  onOpenChange,
  onConfirm,
}: {
  item: PurchaseRow | null
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}) {
  return (
    <Dialog open={Boolean(item)} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        <div className="bg-gradient-to-br from-primary/15 via-background to-background px-5 pt-5 pb-4">
          <DialogHeader className="gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <Download className="size-5" />
            </div>
            <div>
              <DialogTitle className="font-display text-xl">프롬프트 다운로드</DialogTitle>
              <DialogDescription className="mt-1.5">
                구매하신 프롬프트 본문을 .txt 파일로 저장합니다.
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        {item && (
          <div className="px-5 py-4">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
              <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.prompt.images[0] || "/placeholder.svg"}
                  alt=""
                  className="size-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="line-clamp-2 text-sm font-medium leading-snug">{item.prompt.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.date} 구매</p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="mx-0 mb-0 rounded-none border-t bg-muted/30 p-4 sm:justify-end">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button type="button" onClick={onConfirm}>
            <Download data-icon="inline-start" />
            다운로드
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ReviewDialog({
  item,
  review,
  onOpenChange,
  onSave,
}: {
  item: PurchaseRow | null
  review: Review | undefined
  onOpenChange: (open: boolean) => void
  onSave: (data: { rating: number; content: string }) => void
}) {
  const [rating, setRating] = React.useState(0)
  const [hovered, setHovered] = React.useState(0)
  const [content, setContent] = React.useState("")

  React.useEffect(() => {
    setRating(review?.rating ?? 0)
    setContent(review?.content ?? "")
    setHovered(0)
  }, [item?.id, review])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating < 1) {
      toast.error("별점을 선택해주세요")
      return
    }
    if (!content.trim()) {
      toast.error("리뷰 내용을 입력해주세요")
      return
    }
    onSave({ rating, content })
  }

  const displayRating = hovered || rating

  return (
    <Dialog open={Boolean(item)} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg" showCloseButton>
        <div className="bg-gradient-to-br from-primary/15 via-background to-background px-5 pt-5 pb-4">
          <DialogHeader className="gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <Star className="size-5 fill-current" />
            </div>
            <div>
              <DialogTitle className="font-display text-xl">
                {review ? "리뷰 수정" : "리뷰 작성"}
              </DialogTitle>
              <DialogDescription className="mt-1.5">
                구매 경험과 활용 팁을 공유해 주세요.
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        {item && (
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-muted ring-1 ring-border/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.prompt.images[0] || "/placeholder.svg"}
                  alt=""
                  className="size-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <Badge variant="secondary" className="mb-1">
                  {item.prompt.category}
                </Badge>
                <p className="line-clamp-2 text-sm font-medium leading-snug">{item.prompt.title}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-5 py-5">
          <div>
            <p className="mb-2 text-sm font-medium">별점</p>
            <div
              className="flex items-center gap-1"
              role="radiogroup"
              aria-label="별점"
              onMouseLeave={() => setHovered(0)}
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHovered(value)}
                  className="rounded-md p-1 text-muted-foreground transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`${value}점`}
                  aria-checked={rating === value}
                  role="radio"
                >
                  <Star
                    className={cn(
                      "size-7 transition-colors",
                      displayRating >= value && "fill-primary text-primary",
                    )}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {displayRating > 0 ? `${displayRating}/5` : "선택해주세요"}
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="review-content" className="mb-2 block text-sm font-medium">
              리뷰 내용
            </label>
            <textarea
              id="review-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              placeholder="사용 후기나 팁을 적어주세요"
              className="w-full resize-y rounded-xl border border-input bg-muted/30 px-3.5 py-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:bg-background focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <DialogFooter className="mx-0 mb-0 rounded-none border-0 bg-transparent p-0 sm:justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="submit">{review ? "리뷰 수정" : "리뷰 등록"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
