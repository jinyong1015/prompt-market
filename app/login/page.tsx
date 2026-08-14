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

export default function LoginPage() {
  const router = useRouter()
  const { login } = useStore()
  const { t } = useI18n()
  const [email, setEmail] = React.useState("creator@promptmarket.io")
  const [password, setPassword] = React.useState("password")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) {
      toast.error(t("toast.emailRequired"))
      return
    }
    login(email)
    toast.success(t("toast.loggedIn"))
    router.push("/")
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-6 flex flex-col items-center text-center">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Sparkles className="size-5" />
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold">{t("login.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("login.subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("login.cardTitle")}</CardTitle>
          <CardDescription>{t("login.cardDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">{t("login.email")}</FieldLabel>
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
                <FieldLabel htmlFor="password">{t("login.password")}</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </Field>
              <Button type="submit" className="w-full">
                {t("login.submit")}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("login.noAccount")}{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          {t("login.goSignup")}
        </Link>
      </p>
    </div>
  )
}
