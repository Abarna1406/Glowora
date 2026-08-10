import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Search, Heart, ShoppingBag, Bell, User, Menu, X, Moon, Sun } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { categories, brands, salons, spas } from '../../lib/data.js'
import { useStore } from '../../lib/store.jsx'
import NotificationDropdown from './NotificationDropdown.jsx'
import ProfileDropdown from './ProfileDropdown.jsx'
import Logo from '../shared/Logo.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const navLinks = [
  { label: 'Brands', to: '/brands' },
  { label: 'Membership', to: '/membership' },
  { label: 'Offers', to: '/offers' },
]

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { cartCount, wishlist, setCartOpen, dark, setDark } = useStore()
  const { isAuthenticated } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

    <>
      <header className={`sticky top-0 z-50 border-b border-pink-200 bg-[#FFE8F0]/95 backdrop-blur-md transition-shadow duration-300 ${scrolled ? 'shadow-card' : ''}`}>
        <div className="hidden items-center justify-between border-b border-pink-200 px-6 py-1.5 font-sans text-xs text-ink font-medium md:flex lg:px-16">
          <span>Verified professional trade marketplace · GST invoicing on every order</span>
          <div className="flex items-center gap-5">
            <Link to="/about" className="hover:text-ink-soft">About</Link>
            <Link to="/contact" className="hover:text-ink-soft">Contact</Link>
            <Link to="/faqs" className="hover:text-ink-soft">FAQs</Link>
            <button onClick={() => setDark((d) => !d)} className="flex items-center gap-1 hover:text-ink-soft" aria-label="Toggle dark mode">
              {dark ? <Sun size={12} /> : <Moon size={12} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 lg:px-16">
          <div className="flex items-center gap-8 xl:gap-10">
            <button className="lg:hidden text-ink" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <Menu size={22} />
            </button>
            <Logo size="lg" />

            <nav className="hidden items-center gap-5 lg:flex xl:gap-7">
              {/* Categories */}
              <div
                className="relative"
                onMouseEnter={() => setActiveMenu('categories')}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button onClick={() => navigate('/categories')} className="flex items-center gap-1 text-[15px] font-semibold text-ink hover:text-ink-soft py-1">
                  Categories
                </button>
                <AnimatePresence>
                  {activeMenu === 'categories' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-1/2 top-full w-[min(820px,92vw)] -translate-x-1/2 pt-4"
                    >
                      <div className="grid max-h-[420px] grid-cols-4 gap-x-8 gap-y-5 overflow-y-auto rounded-xl2 border border-line bg-white p-7 shadow-soft">
                        {categories.map((c, i) => (
                          <Link key={c.id} to={`/category/${c.id}`} onClick={() => setActiveMenu(null)} className="group flex items-start gap-3">
                            <span className="font-mono text-[10px] font-bold text-gold-dark">{String(i + 1).padStart(2, '0')}</span>
                            <div>
                              <p className="text-sm font-bold text-ink group-hover:text-gold-dark">{c.name}</p>
                              <p className="mt-0.5 text-xs font-medium text-ink/60">{c.count} listings</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Shop */}
              <div
                className="relative"
                onMouseEnter={() => setActiveMenu('shop')}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button onClick={() => navigate('/shop')} className="flex items-center gap-1 text-[15px] font-semibold text-ink hover:text-ink-soft py-1">
                  Shop
                </button>
                <AnimatePresence>
                  {activeMenu === 'shop' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-1/2 top-full w-[min(820px,92vw)] -translate-x-1/2 pt-4"
                    >
                      <div className="grid max-h-[420px] grid-cols-4 gap-x-8 gap-y-5 overflow-y-auto rounded-xl2 border border-line bg-white p-7 shadow-soft">
                        {brands.slice(0, 16).map((b, i) => (
                          <Link key={b.id} to={`/brands/${b.id}`} onClick={() => setActiveMenu(null)} className="group flex items-center gap-3">
                            <img src={b.cover} alt={b.name} className="h-10 w-10 rounded-full object-cover border border-line group-hover:border-gold" />
                            <div>
                              <p className="text-sm font-bold text-ink group-hover:text-gold-dark">{b.name}</p>
                            </div>
                          </Link>
                        ))}
                        <div className="col-span-4 mt-2 flex items-center justify-between border-t border-line pt-4">
                          <Link to="/brands" className="font-mono text-[11px] font-bold text-gold-dark hover:underline">View all brands →</Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Salons */}
              <div
                className="relative"
                onMouseEnter={() => setActiveMenu('salons')}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button onClick={() => navigate('/salons')} className="flex items-center gap-1 text-[15px] font-semibold text-ink hover:text-ink-soft py-1">
                  Salon
                </button>
                <AnimatePresence>
                  {activeMenu === 'salons' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-1/2 top-full w-[min(820px,92vw)] -translate-x-1/2 pt-4"
                    >
                      <div className="grid max-h-[420px] grid-cols-3 gap-x-8 gap-y-5 overflow-y-auto rounded-xl2 border border-line bg-white p-7 shadow-soft">
                        {salons.slice(0, 9).map((s, i) => (
                          <Link key={s.id} to={`/salons/${s.id}`} onClick={() => setActiveMenu(null)} className="group flex items-center gap-3">
                            <img src={s.coverImage} alt={s.name} className="h-12 w-12 rounded-lg object-cover border border-line group-hover:border-gold" />
                            <div>
                              <p className="text-sm font-bold text-ink group-hover:text-gold-dark">{s.name}</p>
                              <p className="text-xs font-medium text-ink/60">{s.area}, {s.city}</p>
                            </div>
                          </Link>
                        ))}
                        <div className="col-span-3 mt-2 flex items-center justify-between border-t border-line pt-4">
                          <Link to="/salons" className="font-mono text-[11px] font-bold text-gold-dark hover:underline">View all salons →</Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Spas */}
              <div
                className="relative"
                onMouseEnter={() => setActiveMenu('spas')}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button onClick={() => navigate('/spas')} className="flex items-center gap-1 text-[15px] font-semibold text-ink hover:text-ink-soft py-1">
                  Spa
                </button>
                <AnimatePresence>
                  {activeMenu === 'spas' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-1/2 top-full w-[min(820px,92vw)] -translate-x-1/2 pt-4"
                    >
                      <div className="grid max-h-[420px] grid-cols-3 gap-x-8 gap-y-5 overflow-y-auto rounded-xl2 border border-line bg-white p-7 shadow-soft">
                        {spas.slice(0, 9).map((s, i) => (
                          <Link key={s.id} to={`/spas/${s.id}`} onClick={() => setActiveMenu(null)} className="group flex items-center gap-3">
                            <img src={s.coverImage} alt={s.name} className="h-12 w-12 rounded-lg object-cover border border-line group-hover:border-gold" />
                            <div>
                              <p className="text-sm font-bold text-ink group-hover:text-gold-dark">{s.name}</p>
                              <p className="text-xs font-medium text-ink/60">{s.area}, {s.city}</p>
                            </div>
                          </Link>
                        ))}
                        <div className="col-span-3 mt-2 flex items-center justify-between border-t border-line pt-4">
                          <Link to="/spas" className="font-mono text-[11px] font-bold text-gold-dark hover:underline">View all spas →</Link>
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
                  className="group relative py-1 text-[15px] font-semibold"
                >
                  {({ isActive }) => (
                    <>
                      <span className={`transition-colors ${isActive ? 'text-ink' : 'text-ink hover:text-ink-soft'}`}>
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
            <Link to="/search" className="flex h-10 w-10 items-center justify-center rounded-full text-ink font-semibold hover:bg-pink-100 hover:text-ink" aria-label="Search">
              <Search size={18} strokeWidth={2.5} />
            </Link>
            <Link to="/wishlist" className="relative hidden h-10 w-10 items-center justify-center rounded-full text-ink font-semibold hover:bg-pink-100 hover:text-ink sm:flex" aria-label="Wishlist">
              <Heart size={18} strokeWidth={2.5} />
              {wishlist.length > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold font-mono text-[9px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <div className="relative">
              <button onClick={() => setNotifOpen((v) => !v)} className="hidden h-10 w-10 items-center justify-center rounded-full text-ink font-semibold hover:bg-pink-100 hover:text-ink sm:flex" aria-label="Notifications">
                <Bell size={18} strokeWidth={2.5} />
              </button>
              <NotificationDropdown open={notifOpen} onClose={() => setNotifOpen(false)} />
            </div>
            <button onClick={() => setCartOpen(true)} className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink font-semibold hover:bg-pink-100 hover:text-ink" aria-label="Cart">
              <ShoppingBag size={18} strokeWidth={2.5} />
              {cartCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold font-mono text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
            <div className="relative">
              {isAuthenticated ? (
                <>
                  <button onClick={() => setProfileOpen((v) => !v)} className="ml-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink/20 text-ink font-semibold hover:border-ink hover:text-ink" aria-label="Account">
                    <User size={16} strokeWidth={2.5} />
                  </button>
                  <ProfileDropdown open={profileOpen} onClose={() => setProfileOpen(false)} />
                </>
              ) : (
                <Link to="/login" className="ml-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink/20 text-ink font-semibold hover:border-ink hover:text-ink" aria-label="Sign In">
                  <User size={16} strokeWidth={2.5} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[100] bg-ink/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-[110] w-80 max-w-[85%] bg-white p-6 shadow-soft overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <Logo size="sm" />
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="text-ink"><X size={20} strokeWidth={2.5} /></button>
              </div>
              <div className="mt-8 flex flex-col gap-1">
                {[{ label: 'Categories', to: '/categories' }, { label: 'Shop', to: '/shop' }, { label: 'Salon', to: '/salons' }, { label: 'Spa', to: '/spas' }, ...navLinks].map((l) => (
                  <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="border-b border-line py-3 text-sm font-bold text-ink">
                    {l.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
}
