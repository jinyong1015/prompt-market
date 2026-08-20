import type { Metadata } from "next"

import { buildNoIndexMetadata } from "@/lib/seo/config"

export const metadata: Metadata = buildNoIndexMetadata("프로필")

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children
}
