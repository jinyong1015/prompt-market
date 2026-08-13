"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Camera, Pencil } from "lucide-react"
import { toast } from "sonner"

import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { AuthPageSkeleton } from "@/components/auth-page-skeleton"

export default function ProfilePage() {
  const router = useRouter()
  const { user, updateProfile } = useStore()

  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState("")
  const fileRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (!user) router.replace("/login")
  }, [user, router])

  if (!user) return <AuthPageSkeleton />

  function startEdit() {
    setDraft(user!.nickname)
    setEditing(true)
  }

  function save() {
    if (!draft.trim()) {
      toast.error("닉네임을 입력해주세요")
      return
    }
    updateProfile({ nickname: draft.trim() })
    setEditing(false)
    toast.success("프로필이 저장되었습니다")
  }

  function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    updateProfile({ avatar: url })
    toast.success("프로필 이미지가 변경되었습니다")
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold">프로필 관리</h1>
      <p className="mt-1 text-sm text-muted-foreground">닉네임과 프로필 이미지를 수정하세요.</p>

      <div className="mt-8 flex flex-col items-center">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="group relative rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="프로필 이미지 변경"
        >
          <Avatar className="size-24">
            {user.avatar && <AvatarImage src={user.avatar} alt={user.nickname} />}
            <AvatarFallback className="bg-primary/15 text-2xl text-primary">
              {user.nickname.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 rounded-full bg-foreground/50 opacity-0 transition-opacity group-hover:opacity-100">
            <Camera className="size-5 text-background" />
            <span className="text-xs font-medium text-background">변경</span>
          </span>
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">이메일</FieldLabel>
              <Input id="email" value={user.email} disabled />
            </Field>

            <Field>
              <FieldLabel htmlFor="nickname">닉네임</FieldLabel>
              {editing ? (
                <div className="flex items-center gap-2">
                  <Input
                    id="nickname"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    autoFocus
                  />
                  <Button size="sm" onClick={save}>
                    저장
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
                    취소
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-md border border-input px-3 py-2">
                  <span className="text-sm">{user.nickname}</span>
                  <Button size="sm" variant="ghost" onClick={startEdit}>
                    <Pencil data-icon="inline-start" />
                    수정
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
