import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import CartDrawer from './CartDrawer.jsx'
import WishlistDrawer from './WishlistDrawer.jsx'

export default function PublicLayout() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen flex-col bg-[#FFE8F0]">
      <Navbar />
      <main className="flex-1">
        {/*
          A light fade-in on every route change — no exit animation, so
          navigation never feels delayed waiting for the previous page to
          animate out. Keyed by pathname so React remounts (and therefore
          re-plays the fade) on every navigation.
        */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </main>
      <Footer />
      <CartDrawer />
      <WishlistDrawer />
    </div>
  )
}
