import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { JsonLd } from "@/components/json-ld"
import { PromptDetail } from "@/components/prompt-detail"
import { getPublishedPromptById } from "@/lib/prompts/queries"
import { absoluteUrl } from "@/lib/seo/config"
import { promptProductJsonLd } from "@/lib/seo/json-ld"

export const dynamic = "force-dynamic"

type PromptPageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PromptPageProps): Promise<Metadata> {
  const { id } = await params
  const prompt = await getPublishedPromptById(id)

  if (!prompt) {
    return {
      title: "프롬프트를 찾을 수 없습니다",
      robots: { index: false, follow: false },
    }
  }

  const description = prompt.shortDescription || prompt.description
  const canonical = `/prompt/${prompt.id}`
  const image = prompt.images[0]
  const ogImages = image
    ? [
        {
          url: absoluteUrl(image),
          alt: prompt.title,
        },
      ]
    : undefined

  return {
    title: prompt.title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      title: prompt.title,
      description,
      url: canonical,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: prompt.title,
      description,
      images: image ? [absoluteUrl(image)] : undefined,
    },
  }
}

export default async function PromptPage({ params }: PromptPageProps) {
  const { id } = await params
  const prompt = await getPublishedPromptById(id)
  if (!prompt) notFound()

  return (
    <>
      <JsonLd data={promptProductJsonLd(prompt)} />
      <PromptDetail prompt={prompt} />
    </>
  )
}
