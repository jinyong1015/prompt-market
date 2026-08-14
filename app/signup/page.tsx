"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Sparkles } from "lucide-react"
import { toast } from "sonner"

import { useStore } from "@/lib/store"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"

export default function SignupPage() {
  const router = useRouter()
  const { signup } = useStore()
  const { t } = useI18n()
  const [nickname, setNickname] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nickname.trim()) {
      toast.error(t("toast.nicknameRequired"))
      return
    }
    if (!email.trim()) {
      toast.error(t("toast.emailRequired"))
      return
    }
    if (!password) {
      toast.error(t("toast.passwordRequired"))
      return
    }
    signup({ email: email.trim(), nickname: nickname.trim() })
    toast.success(t("toast.signedUp"))
    router.push("/")
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-6 flex flex-col items-center text-center">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Sparkles className="size-5" />
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold">{t("signup.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("signup.subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("signup.cardTitle")}</CardTitle>
          <CardDescription>{t("signup.cardDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="nickname">{t("signup.nickname")}</FieldLabel>
                <Input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder={t("signup.nicknamePlaceholder")}
                  autoComplete="nickname"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">{t("signup.email")}</FieldLabel>
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
                <FieldLabel htmlFor="password">{t("signup.password")}</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </Field>
              <Button type="submit" className="w-full">
                {t("signup.submit")}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("signup.hasAccount")}{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          {t("signup.goLogin")}
        </Link>
      </p>
    </div>
  )
}
