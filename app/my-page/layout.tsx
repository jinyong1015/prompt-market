import type { Metadata } from "next"

import { buildNoIndexMetadata } from "@/lib/seo/config"

export const metadata: Metadata = buildNoIndexMetadata("구매 내역")

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return children
}
