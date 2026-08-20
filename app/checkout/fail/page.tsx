"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function CheckoutFailPage() {
  const searchParams = useSearchParams()
  const code = searchParams.get("code")
  const message = searchParams.get("message")

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center px-4 text-center">
      <XCircle className="size-10 text-red-500" />
      <h1 className="mt-4 text-2xl font-bold">결제를 완료하지 못했습니다</h1>
      <p className="mt-2 text-sm text-muted-foreground">{message ?? "결제를 다시 시도해주세요."}</p>
      {code && <p className="mt-1 text-xs text-muted-foreground">에러 코드: {code}</p>}

      <div className="mt-6 flex gap-2">
        <Link href="/cart">
          <Button>장바구니로 돌아가기</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">홈으로</Button>
        </Link>
      </div>
    </div>
  )
}
