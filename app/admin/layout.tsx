import type { Metadata } from "next"

import { buildNoIndexMetadata } from "@/lib/seo/config"

export const metadata: Metadata = buildNoIndexMetadata("프롬프트 관리")

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
