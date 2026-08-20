import type { Metadata } from "next"

import { buildNoIndexMetadata } from "@/lib/seo/config"

export const metadata: Metadata = buildNoIndexMetadata("장바구니")

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children
}
