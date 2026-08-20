import { redirect } from "next/navigation"

import { PromptAdminPanel } from "@/components/admin/prompt-admin-panel"
import { isAdmin } from "@/lib/admin"
import { listAllPromptsForAdmin } from "@/lib/prompts/queries"

export const dynamic = "force-dynamic"

export default async function AdminPromptsPage() {
  if (!(await isAdmin())) {
    redirect("/")
  }

  const prompts = await listAllPromptsForAdmin()

  return <PromptAdminPanel prompts={prompts} />
}
