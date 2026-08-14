"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart, ShoppingCart, User as UserIcon, Receipt, LogOut, Sparkles } from "lucide-react"
import { toast } from "sonner"

import { useStore } from "@/lib/store"
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
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const router = useRouter()
  const { user, cart, wishlist, logout } = useStore()

  function handleLogout() {
    logout()
    toast.success("로그아웃되었습니다")
    router.push("/")
  }

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

        <nav className="flex items-center gap-2">
          {!user ? (
            <>
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                로그인
              </Link>
              <Link href="/signup" className={cn(buttonVariants({ size: "sm" }))}>
                회원가입
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/wishlist"
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative")}
                aria-label={`찜 내역, ${wishlist.length}개`}
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
                aria-label={`장바구니, ${cart.length}개 담김`}
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
                  aria-label="사용자 메뉴"
                >
                  <Avatar className="size-8">
                    {user.avatar && <AvatarImage src={user.avatar} alt={user.nickname} />}
                    <AvatarFallback className="bg-primary/15 text-primary">
                      {user.nickname.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium sm:inline">{user.nickname}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{user.nickname}</span>
                        <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push("/profile")}>
                      <UserIcon />
                      프로필 관리
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/wishlist")}>
                      <Heart />
                      찜 내역
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/my-page")}>
                      <Receipt />
                      구매 내역
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                      <LogOut />
                      로그아웃
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
