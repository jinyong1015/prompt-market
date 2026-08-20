import { Suspense } from "react"

import { CheckoutFailClient } from "./fail-client"

function FailFallback() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-xl items-center justify-center px-4">
      <p className="text-sm text-muted-foreground">결제 결과를 불러오는 중...</p>
    </div>
  )
}

export default function CheckoutFailPage() {
  return (
    <Suspense fallback={<FailFallback />}>
      <CheckoutFailClient />
    </Suspense>
  )
}
