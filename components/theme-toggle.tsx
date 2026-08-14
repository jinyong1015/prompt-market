"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useI18n } from "@/lib/i18n"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const { t } = useI18n()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={mounted && isDark ? t("header.themeLight") : t("header.themeDark")}
    >
      <Sun className="size-5 dark:hidden" />
      <Moon className="hidden size-5 dark:block" />
    </button>
  )
}
