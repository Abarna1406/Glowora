import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { products as ALL_PRODUCTS } from './data.js'
import { useAuth } from '../context/AuthContext.jsx'

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const { user: authUser } = useAuth()
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('glowora_cart')
    return saved ? JSON.parse(saved) : []
  })
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('glowora_wishlist')
    return saved ? JSON.parse(saved) : []
  })
  const [dark, setDark] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [user, setUser] = useState({
    name: 'Radhika Menon',
    business: 'Lumen Studio & Spa',
    role: 'Owner / Senior Colourist',
    tier: 'Gold',
    email: 'radhika@lumenstudio.in',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200',
  })

  // Save cart and wishlist to localStorage when they change
  useEffect(() => {
    localStorage.setItem('glowora_cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem('glowora_wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  // Clear cart and wishlist when user logs out
  useEffect(() => {
    if (!authUser) {
      setCart([])
      setWishlist([])
    } else {
      setUser((prev) => ({ ...prev, name: authUser.name, email: authUser.email }))
    }
  }, [authUser])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const addToCart = (productId, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === productId)
      if (existing) return prev.map((c) => (c.productId === productId ? { ...c, qty: c.qty + qty } : c))
      return [...prev, { productId, qty }]
    })
    setCartOpen(true)
  }
  const removeFromCart = (productId) => setCart((prev) => prev.filter((c) => c.productId !== productId))
  const clearCart = () => setCart([])
  const updateQty = (productId, qty) =>
    setCart((prev) => prev.map((c) => (c.productId === productId ? { ...c, qty: Math.max(1, qty) } : c)))

  const toggleWishlist = (productId) =>
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))

  const cartDetailed = useMemo(
    () =>
      cart
        .map((c) => ({ ...c, product: ALL_PRODUCTS.find((p) => p.id === c.productId) }))
        .filter((c) => c.product),
    [cart],
  )
  const wishlistDetailed = useMemo(
    () => wishlist.map((id) => ALL_PRODUCTS.find((p) => p.id === id)).filter(Boolean),
    [wishlist],
  )
  const cartCount = cartDetailed.reduce((sum, c) => sum + c.qty, 0)
  const cartSubtotal = cartDetailed.reduce((sum, c) => sum + c.qty * c.product.price, 0)

  const value = {
    cart: cartDetailed,
    cartCount,
    cartSubtotal,
    addToCart,
    removeFromCart,
    clearCart,
    updateQty,
    wishlist: wishlistDetailed,
    wishlistIds: wishlist,
    toggleWishlist,
    dark,
    setDark,
    cartOpen,
    setCartOpen,
    wishlistOpen,
    setWishlistOpen,
    user,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
