import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Search, Heart, ShoppingBag, Bell, User, Menu, X, ChevronDown, Moon, Sun } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { categories, brands } from '../../lib/data.js'
import { useStore } from '../../lib/store.jsx'
import NotificationDropdown from './NotificationDropdown.jsx'
import ProfileDropdown from './ProfileDropdown.jsx'
import Logo from '../shared/Logo.jsx'





const navLinks = [
  { label: 'Shop', to: '/shop' },
  { label: 'Salons', to: '/salons' },
  { label: 'Spas', to: '/spas' },
  { label: 'Services', to: '/services' },
  { label: 'Brands', to: '/brands' },
  { label: 'Membership', to: '/membership' },
  { label: 'Offers', to: '/offers' },
]

export default function Navbar() {
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { cartCount, wishlist, setCartOpen, dark, setDark } = useStore()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 border-b border-line bg-porcelain/90 backdrop-blur-md transition-shadow duration-300 ${scrolled ? 'shadow-card' : ''}`}>
      <div className="hidden items-center justify-between border-b border-line/70 px-6 py-1.5 font-mono text-[11px] text-ink/50 md:flex lg:px-16">
        <span>Verified professional trade marketplace · GST invoicing on every order</span>
        <div className="flex items-center gap-5">
          <Link to="/about" className="hover:text-ink">About</Link>
          <Link to="/contact" className="hover:text-ink">Contact</Link>
          <Link to="/faqs" className="hover:text-ink">FAQs</Link>
          <button onClick={() => setDark((d) => !d)} className="flex items-center gap-1 hover:text-ink" aria-label="Toggle dark mode">
            {dark ? <Sun size={12} /> : <Moon size={12} />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-4 lg:px-16">
        <div className="flex items-center gap-8 xl:gap-10">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>
          <Logo />

          <nav className="hidden items-center gap-5 lg:flex xl:gap-7">
            <div
              className="relative"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <button className="flex items-center gap-1 text-[14px] font-medium text-ink/80 hover:text-ink">
                Categories <ChevronDown size={14} />
              </button>
              <AnimatePresence>
                {megaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-1/2 top-full w-[min(820px,92vw)] -translate-x-1/2 pt-4"
                  >
                    <div className="grid max-h-[420px] grid-cols-4 gap-x-8 gap-y-5 overflow-y-auto rounded-xl2 border border-line bg-white p-7 shadow-soft">
                      {categories.map((c, i) => (
                        <Link key={c.id} to={`/category/${c.id}`} className="group flex items-start gap-3">
                          <span className="font-mono text-[10px] text-gold-dark">{String(i + 1).padStart(2, '0')}</span>
                          <div>
                            <p className="text-sm font-medium text-ink group-hover:text-gold-dark">{c.name}</p>
                            <p className="mt-0.5 text-xs text-ink/45">{c.count} listings</p>
                          </div>
                        </Link>
                      ))}
                      <div className="col-span-4 mt-2 flex items-center justify-between border-t border-line pt-4">
                        <p className="font-mono text-[11px] text-ink/40">Featured houses: {brands.slice(0, 3).map((b) => b.name).join(' · ')}</p>
                        <Link to="/brands" className="font-mono text-[11px] text-gold-dark hover:underline">View all brands →</Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className="group relative py-1 text-[14px] font-medium"
              >
                {({ isActive }) => (
                  <>
                    <span className={`transition-colors ${isActive ? 'text-ink' : 'text-ink/70 group-hover:text-ink'}`}>
                      {l.label}
                    </span>
                    <span
                      className={`pointer-events-none absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-300 ease-out ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <Link to="/search" className="flex h-10 w-10 items-center justify-center rounded-full text-ink/70 hover:bg-sand-light hover:text-ink" aria-label="Search">
            <Search size={18} />
          </Link>
          <Link to="/wishlist" className="relative hidden h-10 w-10 items-center justify-center rounded-full text-ink/70 hover:bg-sand-light hover:text-ink sm:flex" aria-label="Wishlist">
            <Heart size={18} />
            {wishlist.length > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold font-mono text-[9px] text-ink">
                {wishlist.length}
              </span>
            )}
          </Link>
          <div className="relative">
            <button onClick={() => setNotifOpen((v) => !v)} className="hidden h-10 w-10 items-center justify-center rounded-full text-ink/70 hover:bg-sand-light hover:text-ink sm:flex" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <NotificationDropdown open={notifOpen} onClose={() => setNotifOpen(false)} />
          </div>
          <button onClick={() => setCartOpen(true)} className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink/70 hover:bg-sand-light hover:text-ink" aria-label="Cart">
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold font-mono text-[9px] text-ink">
                {cartCount}
              </span>
            )}
          </button>
          <div className="relative">
            <button onClick={() => setProfileOpen((v) => !v)} className="ml-1 flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 text-ink/70 hover:border-gold hover:text-ink" aria-label="Account">
              <User size={16} />
            </button>
            <ProfileDropdown open={profileOpen} onClose={() => setProfileOpen(false)} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed inset-y-0 left-0 z-[60] w-80 max-w-[85%] bg-porcelain p-6 shadow-soft"
          >
            <div className="flex items-center justify-between">
              <Logo size="sm" />
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={20} /></button>
            </div>
            <div className="mt-8 flex flex-col gap-1">
              {[{ label: 'Shop', to: '/shop' }, ...navLinks.slice(1), { label: 'Categories', to: '/categories' }].map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="border-b border-line py-3 text-sm font-medium text-ink">
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
