import { Suspense } from "react"

import { HomePageContent } from "@/components/home-page-content"
import { listPublishedPrompts } from "@/lib/prompts/queries"

export const dynamic = "force-dynamic"

async function PromptsSection() {
  const prompts = await listPublishedPrompts()
  return <HomePageContent prompts={prompts} />
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-6xl px-4 py-12 text-sm text-muted-foreground sm:px-6">
          Loading prompts...
        </div>
      }
    >
      <PromptsSection />
    </Suspense>
  )
}
