import { notFound } from "next/navigation"

import { PromptDetail } from "@/components/prompt-detail"
import { getPromptById } from "@/lib/prompts/queries"

export const dynamic = "force-dynamic"

export default async function PromptPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const prompt = await getPromptById(id)
  if (!prompt) notFound()
  return <PromptDetail prompt={prompt} />
}
