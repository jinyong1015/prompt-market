"use client"

import * as React from "react"

export type User = {
  email: string
  nickname: string
  avatar: string | null
}

type StoreState = {
  user: User | null
  cart: string[]
  purchases: { id: string; date: string }[]
}

type StoreContextValue = StoreState & {
  login: (email: string) => void
  logout: () => void
  updateProfile: (data: Partial<Pick<User, "nickname" | "avatar">>) => void
  addToCart: (id: string) => void
  removeFromCart: (id: string) => void
  isInCart: (id: string) => boolean
  isPurchased: (id: string) => boolean
  checkout: (ids: string[]) => void
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
  const [purchases, setPurchases] = React.useState<{ id: string; date: string }[]>([])

  const login = React.useCallback((email: string) => {
    setUser({ email, nickname: email.split("@")[0] || "사용자", avatar: null })
  }, [])

  const logout = React.useCallback(() => {
    setUser(null)
    setCart([])
  }, [])

  const updateProfile = React.useCallback(
    (data: Partial<Pick<User, "nickname" | "avatar">>) => {
      setUser((prev) => (prev ? { ...prev, ...data } : prev))
    },
    [],
  )

  const addToCart = React.useCallback((id: string) => {
    setCart((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  const removeFromCart = React.useCallback((id: string) => {
    setCart((prev) => prev.filter((c) => c !== id))
  }, [])

  const isInCart = React.useCallback((id: string) => cart.includes(id), [cart])

  const isPurchased = React.useCallback(
    (id: string) => purchases.some((p) => p.id === id),
    [purchases],
  )

  const checkout = React.useCallback((ids: string[]) => {
    const date = new Date().toISOString().slice(0, 10)
    setPurchases((prev) => {
      const existing = new Set(prev.map((p) => p.id))
      const next = ids.filter((id) => !existing.has(id)).map((id) => ({ id, date }))
      return [...next, ...prev]
    })
    setCart((prev) => prev.filter((c) => !ids.includes(c)))
  }, [])

  const value = React.useMemo(
    () => ({
      user,
      cart,
      purchases,
      login,
      logout,
      updateProfile,
      addToCart,
      removeFromCart,
      isInCart,
      isPurchased,
      checkout,
    }),
    [user, cart, purchases, login, logout, updateProfile, addToCart, removeFromCart, isInCart, isPurchased, checkout],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = React.useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}
