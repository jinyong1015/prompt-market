"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Camera, Pencil } from "lucide-react"
import { toast } from "sonner"

import { useStore } from "@/lib/store"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { AuthPageSkeleton } from "@/components/auth-page-skeleton"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthLoaded, updateProfile } = useStore()
  const { t } = useI18n()

  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState("")
  const fileRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (isAuthLoaded && !user) router.replace("/sign-in")
  }, [isAuthLoaded, user, router])

  if (!isAuthLoaded || !user) return <AuthPageSkeleton />

  function startEdit() {
    setDraft(user!.nickname)
    setEditing(true)
  }

  function save() {
    if (!draft.trim()) {
      toast.error(t("toast.nicknameRequired"))
      return
    }
    updateProfile({ nickname: draft.trim() })
    setEditing(false)
    toast.success(t("toast.profileSaved"))
  }

  function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    updateProfile({ avatar: url })
    toast.success(t("toast.avatarChanged"))
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold">{t("profile.title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("profile.subtitle")}</p>

      <div className="mt-8 flex flex-col items-center">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="group relative rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={t("profile.changeAria")}
        >
          <Avatar className="size-24">
            {user.avatar && <AvatarImage src={user.avatar} alt={user.nickname} />}
            <AvatarFallback className="bg-primary/15 text-2xl text-primary">
              {user.nickname.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 rounded-full bg-foreground/50 opacity-0 transition-opacity group-hover:opacity-100">
            <Camera className="size-5 text-background" />
            <span className="text-xs font-medium text-background">{t("profile.change")}</span>
          </span>
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{t("profile.basic")}</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">{t("profile.email")}</FieldLabel>
              <Input id="email" value={user.email} disabled />
            </Field>

            <Field>
              <FieldLabel htmlFor="nickname">{t("profile.nickname")}</FieldLabel>
              {editing ? (
                <div className="flex items-center gap-2">
                  <Input
                    id="nickname"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    autoFocus
                  />
                  <Button size="sm" onClick={save}>
                    {t("profile.save")}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
                    {t("profile.cancel")}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-md border border-input px-3 py-2">
                  <span className="text-sm">{user.nickname}</span>
                  <Button size="sm" variant="ghost" onClick={startEdit}>
                    <Pencil data-icon="inline-start" />
                    {t("profile.edit")}
                  </Button>
                </div>
              )}
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  )
}
