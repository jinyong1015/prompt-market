import type { Metadata } from "next"

export const SITE_NAME = "Prompt Market"

export const SITE_DESCRIPTION =
  "검증된 AI 프롬프트를 탐색하고 구매하세요. 이미지, 일러스트, 브랜딩까지 바로 쓸 수 있는 고품질 프롬프트를 제공합니다."

export const SITE_KEYWORDS = [
  "AI 프롬프트",
  "프롬프트 마켓",
  "Prompt Market",
  "Midjourney",
  "ChatGPT",
  "DALL·E",
  "이미지 프롬프트",
  "AI 프롬프트 상점",
] as const

/** Production site origin without trailing slash. */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (explicit) return explicit.replace(/\/$/, "")

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  if (vercelProduction) return `https://${vercelProduction.replace(/\/$/, "")}`

  const vercelUrl = process.env.VERCEL_URL?.trim()
  if (vercelUrl) return `https://${vercelUrl.replace(/\/$/, "")}`

  return "http://localhost:3000"
}

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path
  const normalized = path.startsWith("/") ? path : `/${path}`
  return new URL(normalized, `${getSiteUrl()}/`).toString()
}

export const noIndexRobots = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
  },
} as const satisfies NonNullable<Metadata["robots"]>

export function buildNoIndexMetadata(title: string): Metadata {
  return {
    title,
    robots: noIndexRobots,
  }
}
