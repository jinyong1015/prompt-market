import type { MetadataRoute } from "next"

import { listPublishedPromptSitemapEntries } from "@/lib/prompts/queries"
import { absoluteUrl } from "@/lib/seo/config"

/** Cache sitemap for an hour so crawlers don’t hit the DB on every request. */
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
  ]

  const prompts = await listPublishedPromptSitemapEntries()
  const promptRoutes: MetadataRoute.Sitemap = prompts.map((prompt) => ({
    url: absoluteUrl(`/prompt/${prompt.id}`),
    lastModified: new Date(prompt.created_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [...staticRoutes, ...promptRoutes]
}
