"use client"

import { SignUp } from "@clerk/nextjs"

export default function SignupPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-md flex-col justify-center px-4 py-12">
      <SignUp />
    </div>
  )
}
