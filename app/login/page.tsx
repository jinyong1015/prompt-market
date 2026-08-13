"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Sparkles } from "lucide-react"
import { toast } from "sonner"

import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useStore()
  const [email, setEmail] = React.useState("creator@promptmarket.io")
  const [password, setPassword] = React.useState("password")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) {
      toast.error("이메일을 입력해주세요")
      return
    }
    login(email)
    toast.success("로그인되었습니다")
    router.push("/")
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-6 flex flex-col items-center text-center">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Sparkles className="size-5" />
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold">다시 오신 걸 환영해요</h1>
        <p className="mt-1 text-sm text-muted-foreground">Prompt Market 계정으로 로그인하세요</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>로그인</CardTitle>
          <CardDescription>데모용 계정 정보가 미리 입력되어 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">이메일</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">비밀번호</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </Field>
              <Button type="submit" className="w-full">
                로그인
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/" className="font-medium text-primary hover:underline">
          홈으로 돌아가기
        </Link>
      </p>
    </div>
  )
}
