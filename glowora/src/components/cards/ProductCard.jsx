import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { Price, RatingStars, Badge } from '../ui/Primitives.jsx'
import { useStore } from '../../lib/store.jsx'

const fallbackVideos = [
  "https://cdn.coverr.co/videos/coverr-skincare-routine-2639/1080p.mp4",
  "https://cdn.coverr.co/videos/coverr-woman-applying-makeup-4545/1080p.mp4",
  "https://cdn.coverr.co/videos/coverr-getting-a-haircut-2635/1080p.mp4",
  "https://cdn.coverr.co/videos/coverr-applying-face-cream-4546/1080p.mp4",
  "https://cdn.coverr.co/videos/coverr-hair-stylist-at-work-2637/1080p.mp4"
];

export default function ProductCard({ product, index = 0 }) {
  const { addToCart, toggleWishlist, wishlistIds } = useStore()
  const inWishlist = wishlistIds.includes(product.id)
  
  // Pick a video based on product ID to ensure variety across products
  const videoSrc = product.videoUrl || fallbackVideos[product.id.charCodeAt(product.id.length - 1) % fallbackVideos.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
      className="group relative"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-xl2 bg-sand-light h-64">
          <img
            src={product.img}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out md:group-hover:scale-[1.06]"
            loading="lazy" decoding="async" />
          {/* Continuous Animated Video Overlay */}
          {(product.videoUrl || product.isAnimated) && (
            <video
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 md:group-hover:scale-105"
            />
          )}
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
            <span className="rounded-full bg-porcelain/90 px-2.5 py-1 font-mono text-[10px] tracking-wide text-ink/60 backdrop-blur">
              {product.sku}
            </span>
            {product.professionalOnly && (
              <span className="flex items-center gap-1 rounded-full bg-ink/85 px-2.5 py-1 text-[10px] text-porcelain backdrop-blur">
                <ShieldCheck size={11} /> Pro
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault()
              toggleWishlist(product.id)
            }}
            aria-label="Toggle wishlist"
            className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-porcelain/95 text-ink opacity-0 shadow-card backdrop-blur transition-all duration-300 md:group-hover:opacity-100"
          >
            <Heart size={15} className={inWishlist ? 'fill-clay text-clay' : ''} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
              addToCart(product.id, product.moq || 1)
            }}
            className="absolute inset-x-3 bottom-3 flex translate-y-14 items-center justify-center gap-2 rounded-full bg-ink py-2.5 text-xs font-medium text-porcelain opacity-0 transition-all duration-300 md:group-hover:translate-y-0 md:group-hover:opacity-100 hover:bg-gold hover:text-ink"
          >
            <ShoppingBag size={13} /> Add MOQ {product.moq}
          </button>
        </div>

        <div className="mt-4 flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[9px] sm:text-[10px] md:text-xs uppercase tracking-widest2 text-ink/50">{product.brand}</p>
            <h3 className="mt-1 truncate font-sans text-sm font-medium sm:text-base md:text-[17px] text-ink">{product.name}</h3>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <Price price={product.price} mrp={product.mrp} />
          <RatingStars rating={product.rating} compact />
        </div>
        {!product.inStock && (
          <div className="mt-2">
            <Badge tone="clay">Out of stock</Badge>
          </div>
        )}
      </Link>
    </motion.div>
  )
}
