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

import type { Prompt } from "@/lib/data"
import { usePromptsByIds } from "@/lib/prompts/client"
import { useStore } from "@/lib/store"
import type { Review } from "@/lib/store"
import { formatCompactWon, formatPrice, useI18n } from "@/lib/i18n"
import { localizePrompt } from "@/lib/prompt-i18n"
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

function downloadAllReceipts(
  items: PurchaseRow[],
  locale: "ko" | "en",
) {
  const total = formatPrice(
    items.reduce((sum, item) => sum + item.prompt.price, 0),
    locale,
  )
  const lines =
    locale === "en"
      ? [
          "Prompt Market Receipts",
          `Issued: ${new Date().toISOString().slice(0, 10)}`,
          "",
          ...items.flatMap((item, index) => [
            `${index + 1}. ${localizePrompt(item.prompt, locale).title}`,
            `   Date: ${item.date}`,
            `   Amount: ${formatPrice(item.prompt.price, locale)}`,
            `   Seller: ${SELLER_NAME}`,
            "",
          ]),
          `Total: ${total}`,
        ]
      : [
          "Prompt Market 구매 영수증",
          `발급일: ${new Date().toISOString().slice(0, 10)}`,
          "",
          ...items.flatMap((item, index) => [
            `${index + 1}. ${item.prompt.title}`,
            `   구매일: ${item.date}`,
            `   금액: ${formatPrice(item.prompt.price, locale)}`,
            `   판매자: ${SELLER_NAME}`,
            "",
          ]),
          `합계: ${total}`,
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
  const { user, isAuthLoaded, purchases, getReview, saveReview, isCommerceReady } = useStore()
  const { t, locale } = useI18n()
  const purchaseIds = purchases.map((purchase) => purchase.id)
  const { prompts: promptItems, isReady: promptsReady } = usePromptsByIds(purchaseIds)
  const [query, setQuery] = React.useState("")
  const [status, setStatus] = React.useState<StatusFilter>("all")
  const [sort, setSort] = React.useState<SortOption>("newest")
  const [reviewTarget, setReviewTarget] = React.useState<PurchaseRow | null>(null)
  const [downloadTarget, setDownloadTarget] = React.useState<PurchaseRow | null>(null)

  React.useEffect(() => {
    if (isAuthLoaded && !user) router.replace("/sign-in")
  }, [isAuthLoaded, user, router])

  if (!isAuthLoaded || !user || !isCommerceReady || (purchaseIds.length > 0 && !promptsReady)) {
    return <AuthPageSkeleton />
  }

  const promptById = new Map(promptItems.map((prompt) => [prompt.id, prompt]))
  const items: PurchaseRow[] = purchases
    .map((purchase) => {
      const prompt = promptById.get(purchase.id)
      if (!prompt) return null
      return { id: purchase.id, date: purchase.date, prompt }
    })
    .filter((item): item is PurchaseRow => Boolean(item))

  const totalPaid = items.reduce((sum, item) => sum + item.prompt.price, 0)
  const orderCount = new Set(items.map((item) => item.date)).size || items.length

  const filtered = items
    .filter((item) => {
      const localized = localizePrompt(item.prompt, locale)
      const english = localizePrompt(item.prompt, "en")
      const haystack =
        `${item.prompt.title} ${english.title} ${localized.title} ${SELLER_NAME} ${item.prompt.category} ${t(`category.${item.prompt.category}`)}`.toLowerCase()
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

  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: "all", label: t("purchases.statusAll") },
    { value: "reviewed", label: t("purchases.statusReviewed") },
    { value: "unreviewed", label: t("purchases.statusUnreviewed") },
  ]
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "newest", label: t("purchases.sortNewest") },
    { value: "oldest", label: t("purchases.sortOldest") },
    { value: "price-desc", label: t("purchases.sortPriceDesc") },
    { value: "price-asc", label: t("purchases.sortPriceAsc") },
  ]
  const statusLabel = statusOptions.find((o) => o.value === status)?.label ?? t("purchases.statusAll")
  const sortLabel = sortOptions.find((o) => o.value === sort)?.label ?? t("purchases.sortNewest")

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-16">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Receipt />
            </EmptyMedia>
            <EmptyTitle>{t("purchases.emptyTitle")}</EmptyTitle>
            <EmptyDescription>{t("purchases.emptyDesc")}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link href="/" className={cn(buttonVariants())}>
              {t("purchases.browse")}
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
          <h1 className="font-display text-3xl font-bold tracking-tight">{t("purchases.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("purchases.summary", { count: items.length, amount: formatPrice(totalPaid, locale) })}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="h-10"
          onClick={() => {
            downloadAllReceipts(items, locale)
            toast.success(t("toast.receiptsDownloaded"))
          }}
        >
          <FileText data-icon="inline-start" />
          {t("purchases.downloadAll")}
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          icon={<Download className="size-5" />}
          value={String(items.length)}
          label={t("purchases.statPrompts")}
        />
        <StatCard
          icon={<Wallet className="size-5" />}
          value={formatCompactWon(totalPaid, locale)}
          label={t("purchases.statPaid")}
        />
        <StatCard
          icon={<CalendarDays className="size-5" />}
          value={String(orderCount)}
          label={t("purchases.statOrders")}
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border/80 bg-card/60 p-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("purchases.searchPlaceholder")}
            className="h-10 border-0 bg-muted/50 pl-9 shadow-none focus-visible:bg-background"
            aria-label={t("purchases.searchAria")}
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <FilterDropdown
            ariaLabel={t("purchases.status")}
            prefix={t("purchases.status")}
            icon={<Filter className="size-4 text-muted-foreground" />}
            label={statusLabel}
            options={statusOptions}
            value={status}
            onChange={setStatus}
          />
          <FilterDropdown
            ariaLabel={t("purchases.sort")}
            prefix={t("purchases.sort")}
            icon={<ArrowUpDown className="size-4 text-muted-foreground" />}
            label={sortLabel}
            options={sortOptions}
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
                {t("purchases.noMatch")}
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
          toast.success(t("toast.downloaded"))
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
          toast.success(t("toast.reviewSaved"))
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
  const { t, locale } = useI18n()
  const copy = localizePrompt(item.prompt, locale)
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
                alt={copy.title}
                className="size-full object-cover"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <Badge variant="secondary" className="mb-2">
                {t(`category.${item.prompt.category}`)}
              </Badge>
              <Link
                href={`/prompt/${item.id}`}
                className="line-clamp-2 font-display text-base font-semibold leading-snug hover:text-primary sm:text-lg"
              >
                {copy.title}
              </Link>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {t("purchases.author", { name: SELLER_NAME })}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("purchases.boughtOn", { date: item.date })}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:items-end">
            <p className="font-display text-lg font-bold sm:text-xl">
              {formatPrice(item.prompt.price, locale)}
            </p>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" className="h-8" onClick={onDownload}>
                <Download data-icon="inline-start" />
                {t("purchases.download")}
              </Button>
              <Button type="button" variant="outline" size="sm" className="h-8" onClick={onReview}>
                <Star data-icon="inline-start" />
                {hasReview ? t("purchases.reviewEdit") : t("purchases.review")}
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
  const { t, locale } = useI18n()
  const copy = item ? localizePrompt(item.prompt, locale) : null
  return (
    <Dialog open={Boolean(item)} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        <div className="bg-gradient-to-br from-primary/15 via-background to-background px-5 pt-5 pb-4">
          <DialogHeader className="gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <Download className="size-5" />
            </div>
            <div>
              <DialogTitle className="font-display text-xl">{t("purchases.downloadTitle")}</DialogTitle>
              <DialogDescription className="mt-1.5">
                {t("purchases.downloadDesc")}
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        {item && copy && (
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
                <p className="line-clamp-2 text-sm font-medium leading-snug">{copy.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("purchases.boughtOn", { date: item.date })}
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="mx-0 mb-0 rounded-none border-t bg-muted/30 p-4 sm:justify-end">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t("purchases.cancel")}
          </Button>
          <Button type="button" onClick={onConfirm}>
            <Download data-icon="inline-start" />
            {t("purchases.download")}
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
  const { t, locale } = useI18n()
  const copy = item ? localizePrompt(item.prompt, locale) : null
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
      toast.error(t("toast.ratingRequired"))
      return
    }
    if (!content.trim()) {
      toast.error(t("toast.reviewContentRequired"))
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
                {review ? t("purchases.reviewEdit") : t("purchases.reviewWrite")}
              </DialogTitle>
              <DialogDescription className="mt-1.5">
                {t("purchases.reviewHint")}
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        {item && copy && (
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
                  {t(`category.${item.prompt.category}`)}
                </Badge>
                <p className="line-clamp-2 text-sm font-medium leading-snug">{copy.title}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-5 py-5">
          <div>
            <p className="mb-2 text-sm font-medium">{t("purchases.rating")}</p>
            <div
              className="flex items-center gap-1"
              role="radiogroup"
              aria-label={t("purchases.rating")}
              onMouseLeave={() => setHovered(0)}
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHovered(value)}
                  className="rounded-md p-1 text-muted-foreground transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={t("purchases.ratingValue", { n: value })}
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
                {displayRating > 0 ? `${displayRating}/5` : t("purchases.ratingPick")}
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="review-content" className="mb-2 block text-sm font-medium">
              {t("purchases.content")}
            </label>
            <textarea
              id="review-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              placeholder={t("purchases.contentPlaceholder")}
              className="w-full resize-y rounded-xl border border-input bg-muted/30 px-3.5 py-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:bg-background focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <DialogFooter className="mx-0 mb-0 rounded-none border-0 bg-transparent p-0 sm:justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("purchases.cancel")}
            </Button>
            <Button type="submit">{review ? t("purchases.update") : t("purchases.submit")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
