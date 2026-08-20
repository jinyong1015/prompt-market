import type { Prompt } from "@/lib/data"
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo/config"

/** Serialize JSON-LD safely for inline <script> (Next.js docs). */
export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description: SITE_DESCRIPTION,
    inLanguage: "ko-KR",
  }
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/icon.svg"),
  }
}

export function promptProductJsonLd(prompt: Prompt) {
  const image = prompt.images[0] ? absoluteUrl(prompt.images[0]) : undefined

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: prompt.title,
    description: prompt.shortDescription || prompt.description,
    category: prompt.category,
    ...(image ? { image: [image] } : {}),
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/prompt/${prompt.id}`),
      priceCurrency: "KRW",
      price: prompt.price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  }
}
