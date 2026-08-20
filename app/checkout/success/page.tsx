import { Suspense } from "react"

import { CheckoutSuccessClient } from "./success-client"

function SuccessFallback() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-xl items-center justify-center px-4">
      <p className="text-sm text-muted-foreground">결제 승인 중입니다.</p>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<SuccessFallback />}>
      <CheckoutSuccessClient />
    </Suspense>
  )
}
