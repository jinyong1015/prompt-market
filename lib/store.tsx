"use client"

import * as React from "react"

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

interface StoreState {
  user: User | null
  cart: string[]
  wishlist: string[]
  purchases: { id: string; date: string }[]
  reviews: Record<string, Review>
}

interface StoreContextValue extends StoreState {
  login: (email: string) => void
  signup: (data: { email: string; nickname: string }) => void
  logout: () => void
  updateProfile: (data: Partial<Pick<User, "nickname" | "avatar">>) => void
  addToCart: (id: string) => boolean
  removeFromCart: (id: string) => void
  isInCart: (id: string) => boolean
  toggleWishlist: (id: string) => void
  isInWishlist: (id: string) => boolean
  removeFromWishlist: (id: string) => void
  isPurchased: (id: string) => boolean
  checkout: (ids: string[]) => void
  saveReview: (promptId: string, data: { rating: number; content: string }) => void
  getReview: (promptId: string) => Review | undefined
}

const StoreContext = React.createContext<StoreContextValue | null>(null)

const defaultUser: User = {
  email: "creator@promptmarket.io",
  nickname: "프롬프트러버",
  avatar: null,
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Prototype: user starts logged in so the full flow is explorable.
  const [user, setUser] = React.useState<User | null>(defaultUser)
  const [cart, setCart] = React.useState<string[]>([])
  const [wishlist, setWishlist] = React.useState<string[]>([])
  const [purchases, setPurchases] = React.useState<{ id: string; date: string }[]>([])
  const [reviews, setReviews] = React.useState<Record<string, Review>>({})

  const login = React.useCallback((email: string) => {
    setUser({ email, nickname: email.split("@")[0] || "사용자", avatar: null })
  }, [])

  const signup = React.useCallback((data: { email: string; nickname: string }) => {
    setUser({
      email: data.email,
      nickname: data.nickname.trim() || data.email.split("@")[0] || "사용자",
      avatar: null,
    })
  }, [])

  const logout = React.useCallback(() => {
    setUser(null)
    setCart([])
    setWishlist([])
  }, [])

  const updateProfile = React.useCallback(
    (data: Partial<Pick<User, "nickname" | "avatar">>) => {
      setUser((prev) => (prev ? { ...prev, ...data } : prev))
    },
    [],
  )

  const isPurchased = React.useCallback(
    (id: string) => purchases.some((p) => p.id === id),
    [purchases],
  )

  const isInCart = React.useCallback((id: string) => cart.includes(id), [cart])

  /** Returns false if already purchased or already in cart (no duplicate). */
  const addToCart = React.useCallback(
    (id: string) => {
      if (purchases.some((p) => p.id === id)) return false
      if (cart.includes(id)) return false
      setCart((prev) => [...prev, id])
      return true
    },
    [cart, purchases],
  )

  const removeFromCart = React.useCallback((id: string) => {
    setCart((prev) => prev.filter((c) => c !== id))
  }, [])

  const toggleWishlist = React.useCallback((id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]))
  }, [])

  const removeFromWishlist = React.useCallback((id: string) => {
    setWishlist((prev) => prev.filter((w) => w !== id))
  }, [])

  const isInWishlist = React.useCallback((id: string) => wishlist.includes(id), [wishlist])

  const checkout = React.useCallback((ids: string[]) => {
    const date = new Date().toISOString().slice(0, 10)
    const uniqueIds = [...new Set(ids)]
    setPurchases((prev) => {
      const existing = new Set(prev.map((p) => p.id))
      const next = uniqueIds.filter((id) => !existing.has(id)).map((id) => ({ id, date }))
      return [...next, ...prev]
    })
    setCart((prev) => prev.filter((c) => !uniqueIds.includes(c)))
  }, [])

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
      cart,
      wishlist,
      purchases,
      reviews,
      login,
      signup,
      logout,
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
      cart,
      wishlist,
      purchases,
      reviews,
      login,
      signup,
      logout,
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
