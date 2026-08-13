import { Sparkles } from "lucide-react"
import { prompts } from "@/lib/data"
import { PromptCard } from "@/components/prompt-card"

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" />
          검증된 AI 프롬프트 마켓플레이스
        </span>
        <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          최신 프롬프트를 만나보세요
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          이미지, 일러스트, 브랜딩까지 — 바로 쓸 수 있는 고품질 AI 프롬프트를
          둘러보고 장바구니에 담아보세요.
        </p>
      </section>

      <section className="mt-12">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="font-display text-lg font-semibold">전체 프롬프트</h2>
          <span className="text-sm text-muted-foreground">{prompts.length}개</span>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      </section>
    </div>
  )
}
