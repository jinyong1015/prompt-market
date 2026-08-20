"use client"

import { Sparkles } from "lucide-react"

import type { Prompt } from "@/lib/data"
import { PromptCard } from "@/components/prompt-card"
import { useI18n } from "@/lib/i18n"

export function HomePageContent({ prompts }: { prompts: Prompt[] }) {
  const { t } = useI18n()

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" />
          {t("home.badge")}
        </span>
        <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          {t("home.title")}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          {t("home.subtitle")}
        </p>
      </section>

      <section className="mt-12">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="font-display text-lg font-semibold">{t("home.allPrompts")}</h2>
          <span className="text-sm text-muted-foreground">{t("home.count", { count: prompts.length })}</span>
        </div>
        {prompts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
            {t("home.empty")}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {prompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
