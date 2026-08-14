"use client"

import * as React from "react"

export interface User {
  email: string
  nickname: string
  avatar: string | null
}

export interface CartItem {
  id: string
  quantity: number
}

interface StoreState {
  user: User | null
  cart: CartItem[]
  wishlist: string[]
  purchases: { id: string; date: string }[]
}

interface StoreContextValue extends StoreState {
  login: (email: string) => void
  signup: (data: { email: string; nickname: string }) => void
  logout: () => void
  updateProfile: (data: Partial<Pick<User, "nickname" | "avatar">>) => void
  addToCart: (id: string, quantity?: number) => void
  removeFromCart: (id: string) => void
  setCartQuantity: (id: string, quantity: number) => void
  getCartQuantity: (id: string) => number
  isInCart: (id: string) => boolean
  cartCount: number
  toggleWishlist: (id: string) => void
  isInWishlist: (id: string) => boolean
  removeFromWishlist: (id: string) => void
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
  const [cart, setCart] = React.useState<CartItem[]>([])
  const [wishlist, setWishlist] = React.useState<string[]>([])
  const [purchases, setPurchases] = React.useState<{ id: string; date: string }[]>([])

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

  const addToCart = React.useCallback((id: string, quantity = 1) => {
    const delta = Math.max(1, quantity)
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id)
      if (existing) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item,
        )
      }
      return [...prev, { id, quantity: delta }]
    })
  }, [])

  const removeFromCart = React.useCallback((id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const setCartQuantity = React.useCallback((id: string, quantity: number) => {
    if (quantity < 1) {
      setCart((prev) => prev.filter((item) => item.id !== id))
      return
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id)
      if (!existing) return [...prev, { id, quantity }]
      return prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    })
  }, [])

  const getCartQuantity = React.useCallback(
    (id: string) => cart.find((item) => item.id === id)?.quantity ?? 0,
    [cart],
  )

  const isInCart = React.useCallback((id: string) => cart.some((item) => item.id === id), [cart])

  const cartCount = React.useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  )

  const toggleWishlist = React.useCallback((id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]))
  }, [])

  const removeFromWishlist = React.useCallback((id: string) => {
    setWishlist((prev) => prev.filter((w) => w !== id))
  }, [])

  const isInWishlist = React.useCallback((id: string) => wishlist.includes(id), [wishlist])

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
    setCart((prev) => prev.filter((item) => !ids.includes(item.id)))
  }, [])

  const value = React.useMemo(
    () => ({
      user,
      cart,
      wishlist,
      purchases,
      login,
      signup,
      logout,
      updateProfile,
      addToCart,
      removeFromCart,
      setCartQuantity,
      getCartQuantity,
      isInCart,
      cartCount,
      toggleWishlist,
      isInWishlist,
      removeFromWishlist,
      isPurchased,
      checkout,
    }),
    [
      user,
      cart,
      wishlist,
      purchases,
      login,
      signup,
      logout,
      updateProfile,
      addToCart,
      removeFromCart,
      setCartQuantity,
      getCartQuantity,
      isInCart,
      cartCount,
      toggleWishlist,
      isInWishlist,
      removeFromWishlist,
      isPurchased,
      checkout,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = React.useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}
