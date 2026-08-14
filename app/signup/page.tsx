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

export default function SignupPage() {
  const router = useRouter()
  const { signup } = useStore()
  const [nickname, setNickname] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nickname.trim()) {
      toast.error("닉네임을 입력해주세요")
      return
    }
    if (!email.trim()) {
      toast.error("이메일을 입력해주세요")
      return
    }
    if (!password) {
      toast.error("비밀번호를 입력해주세요")
      return
    }
    // Demo: password is collected in UI only; no server validation.
    signup({ email: email.trim(), nickname: nickname.trim() })
    toast.success("회원가입이 완료되었습니다")
    router.push("/")
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-6 flex flex-col items-center text-center">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Sparkles className="size-5" />
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold">계정을 만들어 보세요</h1>
        <p className="mt-1 text-sm text-muted-foreground">Prompt Market에 가입하고 프롬프트를 만나보세요</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>회원가입</CardTitle>
          <CardDescription>데모용입니다. 비밀번호는 저장·검증되지 않습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="nickname">닉네임</FieldLabel>
                <Input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="프롬프트러버"
                  autoComplete="nickname"
                />
              </Field>
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
                  autoComplete="new-password"
                />
              </Field>
              <Button type="submit" className="w-full">
                가입하기
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          로그인
        </Link>
      </p>
    </div>
  )
}
