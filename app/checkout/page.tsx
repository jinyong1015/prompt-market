import { Suspense } from "react"

import { CheckoutPageClient } from "./checkout-client"

function CheckoutFallback() {
  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-2xl items-center justify-center px-4">
      <p className="text-sm text-muted-foreground">결제 페이지를 불러오는 중...</p>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutPageClient />
    </Suspense>
  )
}
