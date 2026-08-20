import type { Metadata } from "next"

import { buildNoIndexMetadata } from "@/lib/seo/config"

export const metadata: Metadata = buildNoIndexMetadata("결제")

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children
}
