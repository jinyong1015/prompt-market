"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart, ShoppingCart, User as UserIcon, Receipt, LogOut, Sparkles, Settings2 } from "lucide-react"
import { toast } from "sonner"

import { SignInButton, SignUpButton, useAuth, useClerk, useUser } from "@clerk/nextjs"
import { useStore } from "@/lib/store"
import { useI18n } from "@/lib/i18n"
import { buttonVariants } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { LocaleToggle } from "@/components/locale-toggle"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const router = useRouter()
  const { cart, wishlist } = useStore()
  const { t } = useI18n()

  const { isSignedIn, isLoaded } = useAuth()
  const { user: clerkUser } = useUser()
  const { signOut } = useClerk()
  const [isAdminUser, setIsAdminUser] = React.useState(false)

  React.useEffect(() => {
    if (!isSignedIn) {
      setIsAdminUser(false)
      return
    }

    let cancelled = false

    fetch("/api/admin/status")
      .then((res) => res.json())
      .then((data: { isAdmin?: boolean }) => {
        if (!cancelled) setIsAdminUser(Boolean(data.isAdmin))
      })
      .catch(() => {
        if (!cancelled) setIsAdminUser(false)
      })

    return () => {
      cancelled = true
    }
  }, [isSignedIn, clerkUser?.id])

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            Prompt<span className="text-primary">Market</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <LocaleToggle />
          <ThemeToggle />

          {!isLoaded || !isSignedIn ? (
            <>
              <SignInButton mode="redirect">
                <button
                  type="button"
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                >
                  {t("header.login")}
                </button>
              </SignInButton>
              <SignUpButton mode="redirect">
                <button type="button" className={cn(buttonVariants({ size: "sm" }))}>
                  {t("header.signup")}
                </button>
              </SignUpButton>
            </>
          ) : (
            <>
              <Link
                href="/wishlist"
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative")}
                aria-label={t("header.wishlistAria", { count: wishlist.length })}
              >
                <Heart className="size-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative")}
                aria-label={t("header.cartAria", { count: cart.length })}
              >
                <ShoppingCart className="size-5" />
                {cart.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {cart.length}
                  </span>
                )}
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger
                  className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={t("header.userMenu")}
                >
                  <Avatar className="size-8">
                    {clerkUser?.imageUrl ? (
                      <AvatarImage src={clerkUser.imageUrl} alt={clerkUser.fullName ?? "User"} />
                    ) : null}
                    <AvatarFallback className="bg-primary/15 text-primary">
                      {(clerkUser?.firstName ?? clerkUser?.fullName ?? "U").slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium sm:inline">
                    {clerkUser?.firstName ?? clerkUser?.fullName ?? "User"}
                  </span>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">
                          {clerkUser?.firstName ?? clerkUser?.fullName ?? "User"}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {clerkUser?.primaryEmailAddress?.emailAddress ?? ""}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push("/profile")}>
                      <UserIcon />
                      {t("header.profile")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/wishlist")}>
                      <Heart />
                      {t("header.wishlist")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/my-page")}>
                      <Receipt />
                      {t("header.purchases")}
                    </DropdownMenuItem>
                    {isAdminUser ? (
                      <DropdownMenuItem onClick={() => router.push("/admin/prompts")}>
                        <Settings2 />
                        {t("header.adminPrompts")}
                      </DropdownMenuItem>
                    ) : null}
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={async () => {
                        await signOut({ redirectUrl: "/" })
                        toast.success(t("toast.loggedOut"))
                      }}
                    >
                      <LogOut />
                      {t("header.logout")}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
