import React from 'react'
import { Link } from 'react-router-dom'
import logo from "../../assets/logo.png";

// ---------------------------------------------------------------------------
// Logo
// ---------------------------------------------------------------------------
// Centralises the Glowora wordmark so it's defined once and reused in the
// Navbar, Footer, Admin sidebar and the loading screen. This is deliberately
// a small, swappable component: once a real logo image is available, only
// this file needs to change (e.g. render an <img src="/logo.svg" alt="Glowora" />)
// instead of the text wordmark below) — every place it's used updates
// automatically.
//
// Font note: uses the "Alex Brush" script typeface to match the reference
// logo style. Script fonts render thinner/smaller than serif/sans at the
// same point size, so sizes here are scaled up versus the old font-display
// wordmark to stay equally legible.
// ---------------------------------------------------------------------------

const SIZES = {
  sm: 'text-2xl sm:text-3xl',
  md: 'text-2xl sm:text-3xl md:text-4xl',
  lg: 'text-3xl sm:text-4xl md:text-5xl',
}

export default function Logo({ variant = 'dark', size = 'md', linkTo = '/', className = '' }) {
  const glowColor = variant === 'light' ? 'text-porcelain' : 'text-ink'
  const oraColor = variant === 'light' ? 'text-gold-light' : 'text-gold-dark'

  return (
  <Link
    to={linkTo}
    aria-label="Glowora - Home"
    className={`flex items-center transition-opacity hover:opacity-90 ${className}`}
  >
    <img
      src={logo}
      alt="Glowora"
      className={`
        w-auto object-contain transition-transform duration-300 hover:scale-105
        ${
          size === "sm"
            ? "h-10"
            : size === "lg"
            ? "h-16 md:h-20"
            : "h-12 md:h-14 lg:h-16"
        }
      `}
    />
  </Link>
);
}
