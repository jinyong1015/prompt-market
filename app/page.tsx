import { Suspense } from "react"
import type { Metadata } from "next"

import { HomePageContent } from "@/components/home-page-content"
import { JsonLd } from "@/components/json-ld"
import { listPublishedPrompts } from "@/lib/prompts/queries"
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo/config"
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: {
    absolute: `${SITE_NAME} — AI 프롬프트 마켓플레이스`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} — AI 프롬프트 마켓플레이스`,
    description: SITE_DESCRIPTION,
    url: "/",
    type: "website",
  },
}

async function PromptsSection() {
  const prompts = await listPublishedPrompts()
  return <HomePageContent prompts={prompts} />
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={organizationJsonLd()} />
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-6xl px-4 py-12 text-sm text-muted-foreground sm:px-6">
            Loading prompts...
          </div>
        }
      >
        <PromptsSection />
      </Suspense>
    </>
  )
}
