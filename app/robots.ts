import type { MetadataRoute } from "next"

import { absoluteUrl, getSiteUrl } from "@/lib/seo/config"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/cart",
        "/wishlist",
        "/profile",
        "/my-page",
        "/purchase-history",
        "/checkout",
        "/checkout/",
        "/sign-in",
        "/sign-up",
        "/login",
        "/signup",
        "/instruments",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: getSiteUrl(),
  }
}
