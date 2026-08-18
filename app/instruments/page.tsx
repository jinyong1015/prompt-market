import { auth } from "@clerk/nextjs/server"
import { Suspense } from "react"

import { createServerSupabaseClient } from "@/lib/supabase/server"

async function InstrumentsData() {
  const { userId } = await auth()
  const supabase = createServerSupabaseClient()
  const { data: instruments, error } = await supabase.from("instruments").select()

  if (error) {
    return (
      <div className="space-y-3 text-sm">
        <p>Error loading instruments: {error.message}</p>
        {error.code === "PGRST205" ? (
          <p className="text-muted-foreground">
            SQL Editor에서 <code>supabase/clerk-integration.sql</code>을 실행한 뒤 새로고침하세요.
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <div className="space-y-4 text-sm">
      <p className="text-muted-foreground">
        Clerk user: {userId ?? "signed out"}
      </p>
      <pre>{JSON.stringify(instruments, null, 2)}</pre>
    </div>
  )
}

export default function InstrumentsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <Suspense fallback={<div>Loading instruments...</div>}>
        <InstrumentsData />
      </Suspense>
    </div>
  )
}
