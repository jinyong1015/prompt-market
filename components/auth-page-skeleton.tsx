"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useI18n } from "@/lib/i18n"

export function AuthPageSkeleton() {
  const { t } = useI18n()
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6" aria-busy="true" aria-label={t("common.loading")}>
      <Skeleton className="h-8 w-40" />
      <Skeleton className="mt-2 h-4 w-56" />
      <div className="mt-8 flex flex-col gap-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    </div>
  )
}
