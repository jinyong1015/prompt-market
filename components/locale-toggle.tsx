"use client"

import { Languages } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function LocaleToggle() {
  const { locale, setLocale, t } = useI18n()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
        aria-label={t("header.language")}
      >
        <Languages className="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuItem onClick={() => setLocale("ko")} className="justify-between">
          {t("header.korean")}
          {locale === "ko" && <span className="text-primary">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLocale("en")} className="justify-between">
          {t("header.english")}
          {locale === "en" && <span className="text-primary">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
