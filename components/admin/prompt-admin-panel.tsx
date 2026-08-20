"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import {
  createPromptAction,
  deletePromptAction,
  togglePromptPublishedAction,
  updatePromptAction,
} from "@/lib/prompts/actions"
import { promptToFormInput, type PromptFormInput } from "@/lib/prompts/map"
import type { PromptRow } from "@/lib/supabase/database.types"
import { formatPrice, useI18n } from "@/lib/i18n"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const emptyForm: PromptFormInput = {
  id: "",
  title: "",
  price: 0,
  category: "",
  model: "",
  shortDescription: "",
  description: "",
  usage: "",
  caution: "",
  promptText: "",
  imageUrls: "",
  isPublished: true,
}

export function PromptAdminPanel({ prompts }: { prompts: PromptRow[] }) {
  const router = useRouter()
  const { t, locale } = useI18n()
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [form, setForm] = React.useState<PromptFormInput>(emptyForm)
  const [pending, setPending] = React.useState(false)

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEdit(row: PromptRow) {
    setEditingId(row.id)
    setForm(promptToFormInput(row))
    setDialogOpen(true)
  }

  function updateField<K extends keyof PromptFormInput>(key: K, value: PromptFormInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setPending(true)

    const result = editingId
      ? await updatePromptAction(editingId, form)
      : await createPromptAction(form)

    setPending(false)

    if (!result.ok) {
      toast.error(result.error)
      return
    }

    toast.success(editingId ? t("admin.updated") : t("admin.created"))
    setDialogOpen(false)
    router.refresh()
  }

  async function handleDelete(id: string) {
    if (!window.confirm(t("admin.deleteConfirm"))) return

    setPending(true)
    const result = await deletePromptAction(id)
    setPending(false)

    if (!result.ok) {
      toast.error(result.error)
      return
    }

    toast.success(t("admin.deleted"))
    router.refresh()
  }

  async function handleTogglePublished(row: PromptRow) {
    setPending(true)
    const result = await togglePromptPublishedAction(row.id, !row.is_published)
    setPending(false)

    if (!result.ok) {
      toast.error(result.error)
      return
    }

    toast.success(row.is_published ? t("admin.unpublished") : t("admin.published"))
    router.refresh()
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">{t("admin.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("admin.subtitle")}</p>
        </div>
        <Button onClick={openCreate}>
          <Plus data-icon="inline-start" />
          {t("admin.add")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("admin.listTitle", { count: prompts.length })}</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="px-2 py-3 font-medium">{t("admin.colId")}</th>
                <th className="px-2 py-3 font-medium">{t("admin.colTitle")}</th>
                <th className="px-2 py-3 font-medium">{t("admin.colPrice")}</th>
                <th className="px-2 py-3 font-medium">{t("admin.colStatus")}</th>
                <th className="px-2 py-3 font-medium">{t("admin.colActions")}</th>
              </tr>
            </thead>
            <tbody>
              {prompts.map((row) => (
                <tr key={row.id} className="border-b border-border/70">
                  <td className="px-2 py-3 font-mono text-xs">{row.id}</td>
                  <td className="px-2 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{row.title}</span>
                      <span className="text-xs text-muted-foreground">{row.category} · {row.model}</span>
                    </div>
                  </td>
                  <td className="px-2 py-3">{formatPrice(row.price, locale)}</td>
                  <td className="px-2 py-3">
                    <Badge variant={row.is_published ? "default" : "secondary"}>
                      {row.is_published ? t("admin.statusPublished") : t("admin.statusDraft")}
                    </Badge>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/prompt/${row.id}`}
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                      >
                        {t("admin.view")}
                      </Link>
                      <Button variant="outline" size="sm" onClick={() => openEdit(row)} disabled={pending}>
                        <Pencil data-icon="inline-start" />
                        {t("admin.edit")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTogglePublished(row)}
                        disabled={pending}
                      >
                        {row.is_published ? (
                          <>
                            <EyeOff data-icon="inline-start" />
                            {t("admin.unpublish")}
                          </>
                        ) : (
                          <>
                            <Eye data-icon="inline-start" />
                            {t("admin.publish")}
                          </>
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(row.id)}
                        disabled={pending}
                      >
                        <Trash2 data-icon="inline-start" />
                        {t("admin.delete")}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {prompts.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">{t("admin.empty")}</p>
          ) : null}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? t("admin.editTitle") : t("admin.createTitle")}</DialogTitle>
            <DialogDescription>{t("admin.formDesc")}</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <FieldGroup className="gap-4 py-2">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="prompt-id">{t("admin.fieldId")}</FieldLabel>
                  <Input
                    id="prompt-id"
                    value={form.id}
                    onChange={(e) => updateField("id", e.target.value)}
                    disabled={Boolean(editingId)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="prompt-price">{t("admin.fieldPrice")}</FieldLabel>
                  <Input
                    id="prompt-price"
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => updateField("price", Number(e.target.value))}
                    required
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="prompt-title">{t("admin.fieldTitle")}</FieldLabel>
                <Input
                  id="prompt-title"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  required
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="prompt-category">{t("admin.fieldCategory")}</FieldLabel>
                  <Input
                    id="prompt-category"
                    value={form.category}
                    onChange={(e) => updateField("category", e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="prompt-model">{t("admin.fieldModel")}</FieldLabel>
                  <Input
                    id="prompt-model"
                    value={form.model}
                    onChange={(e) => updateField("model", e.target.value)}
                    required
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="prompt-short">{t("admin.fieldShortDescription")}</FieldLabel>
                <Input
                  id="prompt-short"
                  value={form.shortDescription}
                  onChange={(e) => updateField("shortDescription", e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="prompt-description">{t("admin.fieldDescription")}</FieldLabel>
                <textarea
                  id="prompt-description"
                  className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  required
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="prompt-usage">{t("admin.fieldUsage")}</FieldLabel>
                  <textarea
                    id="prompt-usage"
                    className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                    value={form.usage}
                    onChange={(e) => updateField("usage", e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="prompt-caution">{t("admin.fieldCaution")}</FieldLabel>
                  <textarea
                    id="prompt-caution"
                    className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                    value={form.caution}
                    onChange={(e) => updateField("caution", e.target.value)}
                    required
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="prompt-text">{t("admin.fieldPromptText")}</FieldLabel>
                <textarea
                  id="prompt-text"
                  className="min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 font-mono text-sm"
                  value={form.promptText}
                  onChange={(e) => updateField("promptText", e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="prompt-images">{t("admin.fieldImages")}</FieldLabel>
                <textarea
                  id="prompt-images"
                  className="min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 font-mono text-sm"
                  value={form.imageUrls}
                  onChange={(e) => updateField("imageUrls", e.target.value)}
                  placeholder="/prompts/example.png"
                />
              </Field>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => updateField("isPublished", e.target.checked)}
                />
                {t("admin.fieldPublished")}
              </label>
            </FieldGroup>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                {t("admin.cancel")}
              </Button>
              <Button type="submit" disabled={pending}>
                {editingId ? t("admin.save") : t("admin.create")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
