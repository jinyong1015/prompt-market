import type { Prompt } from "@/lib/data"
import type { PromptInsert, PromptRow } from "@/lib/supabase/database.types"

export function rowToPrompt(row: PromptRow): Prompt {
  return {
    id: row.id,
    title: row.title,
    price: row.price,
    category: row.category,
    model: row.model,
    shortDescription: row.short_description,
    description: row.description,
    usage: row.usage,
    caution: row.caution,
    promptText: row.prompt_text,
    images: row.image_urls.length > 0 ? row.image_urls : ["/placeholder.svg"],
  }
}

export function promptToInsert(prompt: Prompt, isPublished = true): PromptInsert {
  return {
    id: prompt.id,
    title: prompt.title,
    price: prompt.price,
    category: prompt.category,
    model: prompt.model,
    short_description: prompt.shortDescription,
    description: prompt.description,
    usage: prompt.usage,
    caution: prompt.caution,
    prompt_text: prompt.promptText,
    image_urls: prompt.images,
    is_published: isPublished,
  }
}

export function formToInsert(input: PromptFormInput): PromptInsert {
  return {
    id: input.id.trim(),
    title: input.title.trim(),
    price: input.price,
    category: input.category.trim(),
    model: input.model.trim(),
    short_description: input.shortDescription.trim(),
    description: input.description.trim(),
    usage: input.usage.trim(),
    caution: input.caution.trim(),
    prompt_text: input.promptText.trim(),
    image_urls: parseImageUrls(input.imageUrls),
    is_published: input.isPublished,
  }
}

export function formToUpdate(input: PromptFormInput): Omit<PromptInsert, "id"> {
  const { id: _id, ...rest } = formToInsert(input)
  return rest
}

export interface PromptFormInput {
  id: string
  title: string
  price: number
  category: string
  model: string
  shortDescription: string
  description: string
  usage: string
  caution: string
  promptText: string
  imageUrls: string
  isPublished: boolean
}

function parseImageUrls(raw: string) {
  return raw
    .split(/[\n,]/)
    .map((value) => value.trim())
    .filter(Boolean)
}

export function promptToFormInput(row: PromptRow): PromptFormInput {
  return {
    id: row.id,
    title: row.title,
    price: row.price,
    category: row.category,
    model: row.model,
    shortDescription: row.short_description,
    description: row.description,
    usage: row.usage,
    caution: row.caution,
    promptText: row.prompt_text,
    imageUrls: row.image_urls.join("\n"),
    isPublished: row.is_published,
  }
}
