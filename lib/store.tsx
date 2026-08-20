"use client"

import * as React from "react"
import { useAuth, useUser } from "@clerk/nextjs"

import { checkoutAction } from "@/lib/commerce/actions"
import { loadCommerceSnapshot } from "@/lib/commerce/sync"
import { useSupabaseClient } from "@/lib/supabase/client"

export interface User {
  email: string
  nickname: string
  avatar: string | null
}

export interface Review {
  rating: number
  content: string
  updatedAt: string
}

interface StoreContextValue {
  user: User | null
  isAuthLoaded: boolean
  isCommerceReady: boolean
  cart: string[]
  wishlist: string[]
  purchases: { id: string; date: string }[]
  reviews: Record<string, Review>
  refreshCommerce: () => Promise<void>
  updateProfile: (data: Partial<Pick<User, "nickname" | "avatar">>) => void
  addToCart: (id: string) => Promise<boolean>
  removeFromCart: (id: string) => Promise<void>
  isInCart: (id: string) => boolean
  toggleWishlist: (id: string) => Promise<void>
  isInWishlist: (id: string) => boolean
  removeFromWishlist: (id: string) => Promise<void>
  isPurchased: (id: string) => boolean
  checkout: (ids: string[]) => Promise<{ ok: true } | { ok: false; error: string }>
  saveReview: (promptId: string, data: { rating: number; content: string }) => void
  getReview: (promptId: string) => Review | undefined
}

const StoreContext = React.createContext<StoreContextValue | null>(null)

function clerkToUser(
  clerkUser: NonNullable<ReturnType<typeof useUser>["user"]>,
): User {
  return {
    email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
    nickname:
      clerkUser.firstName ??
      clerkUser.fullName ??
      clerkUser.username ??
      clerkUser.primaryEmailAddress?.emailAddress?.split("@")[0] ??
      "User",
    avatar: clerkUser.imageUrl ?? null,
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth()
  const { user: clerkUser } = useUser()
  const supabase = useSupabaseClient()

  const [profileOverrides, setProfileOverrides] = React.useState<
    Partial<Pick<User, "nickname" | "avatar">>
  >({})
  const [cart, setCart] = React.useState<string[]>([])
  const [wishlist, setWishlist] = React.useState<string[]>([])
  const [purchases, setPurchases] = React.useState<{ id: string; date: string }[]>([])
  const [reviews, setReviews] = React.useState<Record<string, Review>>({})
  const [isCommerceReady, setIsCommerceReady] = React.useState(false)

  const user = React.useMemo(() => {
    if (!isSignedIn || !clerkUser) return null
    return { ...clerkToUser(clerkUser), ...profileOverrides }
  }, [isSignedIn, clerkUser, profileOverrides])

  const refreshCommerce = React.useCallback(async () => {
    if (!isSignedIn) {
      setCart([])
      setWishlist([])
      setPurchases([])
      setIsCommerceReady(true)
      return
    }

    setIsCommerceReady(false)
    const snapshot = await loadCommerceSnapshot(supabase)
    setCart(snapshot.cart)
    setWishlist(snapshot.wishlist)
    setPurchases(snapshot.purchases)
    setIsCommerceReady(true)
  }, [isSignedIn, supabase])

  React.useEffect(() => {
    if (!isLoaded) return
    void refreshCommerce()
  }, [isLoaded, isSignedIn, clerkUser?.id, refreshCommerce])

  const requireUserId = React.useCallback(() => {
    if (!clerkUser?.id) throw new Error("Login required")
    return clerkUser.id
  }, [clerkUser?.id])

  const isPurchased = React.useCallback(
    (id: string) => purchases.some((purchase) => purchase.id === id),
    [purchases],
  )

  const isInCart = React.useCallback((id: string) => cart.includes(id), [cart])
  const isInWishlist = React.useCallback((id: string) => wishlist.includes(id), [wishlist])

  const addToCart = React.useCallback(
    async (id: string) => {
      if (!isSignedIn) return false
      if (isPurchased(id) || isInCart(id)) return false

      const userId = requireUserId()
      const { error } = await supabase.from("carts").insert({ user_id: userId, prompt_id: id })

      if (error) {
        if (error.code !== "23505") console.error("[addToCart]", error.message)
        return false
      }

      setCart((prev) => [...prev, id])
      return true
    },
    [isSignedIn, isPurchased, isInCart, requireUserId, supabase],
  )

  const removeFromCart = React.useCallback(
    async (id: string) => {
      if (!isSignedIn) return

      const { error } = await supabase.from("carts").delete().eq("prompt_id", id)
      if (error) {
        console.error("[removeFromCart]", error.message)
        return
      }

      setCart((prev) => prev.filter((item) => item !== id))
    },
    [isSignedIn, supabase],
  )

  const toggleWishlist = React.useCallback(
    async (id: string) => {
      if (!isSignedIn) return

      const userId = requireUserId()

      if (isInWishlist(id)) {
        const { error } = await supabase.from("wishlists").delete().eq("prompt_id", id)
        if (error) {
          console.error("[toggleWishlist/remove]", error.message)
          return
        }
        setWishlist((prev) => prev.filter((item) => item !== id))
        return
      }

      const { error } = await supabase.from("wishlists").insert({ user_id: userId, prompt_id: id })
      if (error) {
        if (error.code !== "23505") console.error("[toggleWishlist/add]", error.message)
        return
      }

      setWishlist((prev) => [...prev, id])
    },
    [isSignedIn, isInWishlist, requireUserId, supabase],
  )

  const removeFromWishlist = React.useCallback(
    async (id: string) => {
      if (!isSignedIn) return

      const { error } = await supabase.from("wishlists").delete().eq("prompt_id", id)
      if (error) {
        console.error("[removeFromWishlist]", error.message)
        return
      }

      setWishlist((prev) => prev.filter((item) => item !== id))
    },
    [isSignedIn, supabase],
  )

  const checkout = React.useCallback(async (ids: string[]) => {
    const result = await checkoutAction(ids)
    if (result.ok) {
      await refreshCommerce()
    }
    return result
  }, [refreshCommerce])

  const updateProfile = React.useCallback(
    (data: Partial<Pick<User, "nickname" | "avatar">>) => {
      setProfileOverrides((prev) => ({ ...prev, ...data }))
    },
    [],
  )

  const saveReview = React.useCallback((promptId: string, data: { rating: number; content: string }) => {
    setReviews((prev) => ({
      ...prev,
      [promptId]: {
        rating: data.rating,
        content: data.content.trim(),
        updatedAt: new Date().toISOString().slice(0, 10),
      },
    }))
  }, [])

  const getReview = React.useCallback((promptId: string) => reviews[promptId], [reviews])

  const value = React.useMemo(
    () => ({
      user,
      isAuthLoaded: isLoaded,
      isCommerceReady,
      cart,
      wishlist,
      purchases,
      reviews,
      refreshCommerce,
      updateProfile,
      addToCart,
      removeFromCart,
      isInCart,
      toggleWishlist,
      isInWishlist,
      removeFromWishlist,
      isPurchased,
      checkout,
      saveReview,
      getReview,
    }),
    [
      user,
      isLoaded,
      isCommerceReady,
      cart,
      wishlist,
      purchases,
      reviews,
      refreshCommerce,
      updateProfile,
      addToCart,
      removeFromCart,
      isInCart,
      toggleWishlist,
      isInWishlist,
      removeFromWishlist,
      isPurchased,
      checkout,
      saveReview,
      getReview,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = React.useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}
