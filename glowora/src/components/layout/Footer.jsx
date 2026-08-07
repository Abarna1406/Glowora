import React from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Linkedin, Youtube, ArrowRight } from 'lucide-react'
import { Container } from '../ui/Primitives.jsx'
import Logo from '../shared/Logo.jsx'

const columns = [
  {
    title: 'Marketplace',
    links: [
      { label: 'Shop all', to: '/shop' },
      { label: 'Salons', to: '/salons' },
      { label: 'Spas', to: '/spas' },
      { label: 'Services', to: '/services' },
      { label: 'Brands', to: '/brands' },
      { label: 'Offers', to: '/offers' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign in', to: '/login' },
      { label: 'Create an account', to: '/register' },
      { label: 'Orders', to: '/orders' },
      { label: 'Appointments', to: '/appointments' },
      { label: 'Membership', to: '/membership' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'FAQs', to: '/faqs' },
      { label: 'Admin', to: '/admin' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-porcelain">
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo variant="light" size="md" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-porcelain/55">
              One platform for beauty products and salon services — shop trusted beauty brands and book salons, spas and beauty professionals in one place.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[Instagram, Linkedin, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-full border border-porcelain/15 text-porcelain/60 transition hover:border-gold hover:text-gold">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-[11px] uppercase tracking-widest2 text-gold-light/80">{col.title}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-porcelain/60 transition hover:text-porcelain">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-xl2 border border-porcelain/10 bg-porcelain/5 p-8 md:flex md:items-center md:justify-between">
          <div>
            <p className="font-display text-xl">Get beauty tips &amp; offers in your inbox</p>
            <p className="mt-1 text-sm text-porcelain/50">New arrivals, salon offers and skincare guides — one email a month.</p>
          </div>
          <form className="mt-5 flex w-full max-w-sm items-center gap-2 md:mt-0" onSubmit={(e) => e.preventDefault()}>
            <input type="email" required placeholder="Your email" className="w-full rounded-full border border-porcelain/20 bg-transparent px-4 py-3 text-sm text-porcelain placeholder:text-porcelain/35 outline-none focus:border-gold" />
            <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold text-porcelain transition hover:bg-gold-dark">
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-porcelain/10 pt-6 font-mono text-[11px] text-porcelain/35 md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} Glowora. All rights reserved.</span>
          <div className="flex gap-5">
            <span>Privacy</span>
            <span>Terms of Service</span>
            <span>Partner With Us</span>
          </div>
        </div>
      </Container>
    </footer>
  )
}
