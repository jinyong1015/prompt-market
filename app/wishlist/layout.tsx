import type { Metadata } from "next"

import { buildNoIndexMetadata } from "@/lib/seo/config"

export const metadata: Metadata = buildNoIndexMetadata("찜 목록")

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return children
}
