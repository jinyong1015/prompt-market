import type { Metadata } from "next"

import { buildNoIndexMetadata } from "@/lib/seo/config"

export const metadata: Metadata = buildNoIndexMetadata("Instruments")

export default function InstrumentsLayout({ children }: { children: React.ReactNode }) {
  return children
}
