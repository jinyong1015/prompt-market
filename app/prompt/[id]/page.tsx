import { notFound } from "next/navigation"
import { getPrompt, prompts } from "@/lib/data"
import { PromptDetail } from "@/components/prompt-detail"

export function generateStaticParams() {
  return prompts.map((p) => ({ id: p.id }))
}

export default async function PromptPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const prompt = getPrompt(id)
  if (!prompt) notFound()
  return <PromptDetail prompt={prompt} />
}
