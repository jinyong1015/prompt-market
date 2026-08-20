import type { Metadata } from "next"

import { buildNoIndexMetadata } from "@/lib/seo/config"

export const metadata: Metadata = buildNoIndexMetadata("로그인")

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return children
}
