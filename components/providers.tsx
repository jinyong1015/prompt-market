"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "next-themes"
import { StoreProvider } from "@/lib/store"
import { I18nProvider } from "@/lib/i18n"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="prompt-market-theme"
    >
      <I18nProvider>
        <StoreProvider>{children}</StoreProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}
