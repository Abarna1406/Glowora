import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, Truck, BadgePercent, Users2, Smartphone, ArrowUpRight, ChevronDown, Clock, ShoppingBag, Lock, Star } from 'lucide-react'
import { Container, SectionHeading, Eyebrow, Badge, Price } from '../components/ui/Primitives.jsx'
import ProductCard from '../components/cards/ProductCard.jsx'
import BrandCard from '../components/cards/BrandCard.jsx'
import CategoryCard from '../components/cards/CategoryCard.jsx'
import VenueCard from '../components/cards/VenueCard.jsx'
import ServiceCard from '../components/cards/ServiceCard.jsx'
import salon1 from "../assets/salon-1.png"
import {
  testimonials, beautyTips, faqs, categories, brands, salons, spas, services, products
} from '../lib/data.js'

const whyUs = [
  { icon: ShieldCheck, title: 'Genuine, verified brands', text: 'Every product listed is sourced directly from the brand or an authorised distributor — no greymarket stock.' },
  { icon: BadgePercent, title: 'Fair, transparent pricing', text: 'Clear pricing and real discounts on every listing, whether you\u2019re a shopper or a professional account.' },
  { icon: Truck, title: 'Reliable delivery', text: 'Delivery windows built around real logistics, with priority shipping for Gold and Platinum members.' },
  { icon: Users2, title: 'Book, don\u2019t just browse', text: 'See real appointment availability at salons and spas near you — no back-and-forth calls.' },
]

// Static fallback or dynamically extracted from spas
// (moved inside component due to dynamic data)

const spotlightVideos = [
  { id: 1, title: 'Glazed Donut Skin Routine', badge: 'Trending', videoUrl: 'https://media.istockphoto.com/id/1330851416/video/4k-video-footage-of-an-attractive-young-woman-applying-moisturiser-against-a-studio-background.mp4?s=mp4-640x640-is&k=20&c=oN9DRsJtG1LO5P8LAPysCARNXK-sdM8kVZOEp1deFpU=' },
  { id: 2, title: 'Perfect Bridal Makeup', badge: 'Pro Class', videoUrl: 'https://media.istockphoto.com/id/2234257213/video/beautiful-woman-getting-ready-and-wearing-luxury-necklace.mp4?s=mp4-640x640-is&k=20&c=sR1lIA6yFVhlPiVUnZIelzwNJSVX9f1QITVBTkwsNDM=' },
  { id: 3, title: 'Aromatherapy Massage', badge: 'Relax', videoUrl: 'https://media.istockphoto.com/id/1165320844/video/invigorate-your-body-and-senses-at-the-spa.mp4?s=mp4-640x640-is&k=20&c=YaoY1E1Q_LJWSz7y1aoTVRZmq4IYHll5vIL1ZRR_FnM=' },
  { id: 4, title: 'Layered Haircut Tutorial', badge: 'New', videoUrl: 'https://media.istockphoto.com/id/2257858053/video/haircut-preparation-scene-stylist-arranging-wet-hair-carefully-focused-stylist-meticulously.mp4?s=mp4-640x640-is&k=20&c=Kem2DrdAmMADGMh4hhhZW-fvkMrd8JGqtdSFLKQF1z0=' },
]

export default function Landing() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(0)

  // Use local data instead of API
  const data = {
    categories: categories,
    brands: brands,
    salons: salons,
    spas: spas,
    services: services,
    featuredProducts: products.filter(p => p.featured),
    bestSellerProducts: products.filter(p => p.bestseller),
    todaysDeals: products.filter(p => p.discount > 0),
  }

  const { featuredProducts, bestSellerProducts, todaysDeals } = data;

  const uniquePackages = Array.from(
    new Map(spas.flatMap((s) => s.packages || []).map((p) => [p.name, p])).values(),
  ).slice(0, 4)

  const handleServiceSelect = (service) => {
    const firstMatch = salons.find((s) => s.serviceIds.includes(service.id))
    navigate(firstMatch ? `/book/${firstMatch.id}?service=${service.id}` : '/salons')
  }

  return (
    <div>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden border-b border-line min-h-[600px] flex items-center bg-rose-50/50">
        <Container className="relative grid grid-cols-1 items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.1fr_0.9fr] z-10">
           <div>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="mb-4 inline-block font-mono text-[10px] font-bold uppercase tracking-widest text-pink-500">The Premium Beauty Marketplace</p>
              <h1 className="font-display text-[2.8rem] leading-[1.05] text-ink sm:text-5xl lg:text-[4.2rem]">
                Book top salons, <br />
                <span className="italic text-pink-500">shop</span> premium <br />
                beauty brands.
              </h1>
              <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-ink/70">
                Glowora brings the finest salons, spas, and professional-grade beauty products into a single, luxurious platform. Book your next appointment or shop your favorite brands effortlessly.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link to="/salons" className="rounded-full bg-gradient-to-r from-pink-400 to-pink-500 px-7 py-3.5 text-[15px] font-medium text-white shadow-lg shadow-pink-500/30 hover:opacity-90 transition flex items-center gap-2">
                  Book an Appointment <ArrowRight size={16} />
                </Link>
                <Link to="/shop" className="rounded-full border border-pink-300 px-7 py-3.5 text-[15px] font-medium text-pink-600 transition hover:bg-pink-50 flex items-center gap-2">
                  Shop Now <ShoppingBag size={16} />
                </Link>
              </div>
              <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4 font-mono text-[11px] font-medium text-ink/60">
                <div className="flex items-center gap-1.5 rounded-full border border-pink-200/60 bg-white/60 px-3.5 py-1.5"><ShieldCheck size={14} className="text-pink-500" /> Verified Businesses</div>
                <div className="flex items-center gap-1.5 rounded-full border border-pink-200/60 bg-white/60 px-3.5 py-1.5"><Lock size={14} className="text-pink-500" /> Secure Payments</div>
                <div className="flex items-center gap-1.5 rounded-full border border-pink-200/60 bg-white/60 px-3.5 py-1.5"><Star size={14} className="text-pink-500" /> Top Brands</div>
                <div className="flex items-center gap-1.5 rounded-full border border-pink-200/60 bg-white/60 px-3.5 py-1.5"><BadgePercent size={14} className="text-pink-500" /> Best Prices</div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">
              <img
                src={salon1}
                alt="Premium beauty salon marketplace"
                className="h-[420px] w-full object-cover md:h-[520px]"
                loading="eager"
                fetchpriority="high"
                decoding="async"
              />
              {/* Verified overlay */}
              <div className="absolute right-6 top-6 rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur-sm">
                <p className="font-mono text-[9px] uppercase tracking-wider text-ink/40">Verified Business</p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-white"><ShieldCheck size={10} /></div>
                  <p className="font-display text-sm font-bold text-ink">Lumen Studio</p>
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-white"><ShieldCheck size={10} /></div>
                </div>
              </div>
              
              {/* Pagination overlay */}
              <div className="absolute bottom-6 left-6 flex items-center gap-2">
                <div className="h-1.5 w-6 rounded-full bg-pink-500" />
                <div className="h-1.5 w-2 rounded-full bg-white" />
                <div className="h-1.5 w-2 rounded-full bg-white" />
                <div className="h-1.5 w-4 rounded-full bg-white" />
              </div>
              <div className="absolute bottom-6 right-6 flex gap-2">
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow hover:bg-pink-50 transition"><ArrowRight size={16} className="rotate-180" /></button>
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow hover:bg-pink-50 transition"><ArrowRight size={16} /></button>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ---------------- ANIMATED PROMO BANNERS ---------------- */}
      <section className="bg-sand-light/30 py-8 md:py-12 border-b border-line">
        <Container>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            {/* Promo Banner 1 */}
            <Link to="/offers" className="group relative overflow-hidden rounded-2xl bg-ink p-8 text-porcelain shadow-xl transition-transform hover:-translate-y-1 border border-gold/20">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800')] opacity-10 mix-blend-overlay bg-cover bg-center" />
              <div className="absolute -right-10 -top-10 h-40 w-40 animate-pulse rounded-full bg-gold/10 blur-3xl" />
              <div className="relative z-10 flex h-full flex-col justify-center">
                <span className="mb-2 inline-block rounded-full bg-gold/20 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest backdrop-blur-md w-fit text-gold-light">
                  Festival Special
                </span>
                <h3 className="font-display text-4xl font-bold leading-tight drop-shadow-sm">
                  Buy 1 Get 1 <br />
                  <span className="text-gold animate-pulse inline-block">FREE</span>
                </h3>
                <p className="mt-3 max-w-[200px] text-sm font-medium text-porcelain/70">On all premium skincare serums this week.</p>
                <div className="mt-6 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-gold-dark group-hover:text-gold transition-colors">
                  Shop Offers <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400" className="absolute -bottom-8 -right-8 h-48 w-48 object-cover rounded-full border-4 border-ink shadow-2xl transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6" alt="Serum" />
            </Link>

            {/* Promo Banner 2 */}
            <Link to="/categories" className="group relative overflow-hidden rounded-2xl bg-sand p-8 text-ink shadow-xl transition-transform hover:-translate-y-1 border border-line">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800')] opacity-20 mix-blend-overlay bg-cover bg-center" />
              <div className="absolute -bottom-10 -left-10 h-40 w-40 animate-pulse rounded-full bg-gold/20 blur-3xl" />
              <div className="relative z-10 flex h-full flex-col justify-center">
                <span className="mb-2 inline-block rounded-full bg-white/60 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest backdrop-blur-md w-fit text-ink">
                  Salon Exclusives
                </span>
                <h3 className="font-display text-4xl font-bold leading-tight drop-shadow-sm">
                  Flat 50% <br />
                  <span className="text-gold-dark">OFF</span>
                </h3>
                <p className="mt-3 max-w-[200px] text-sm font-medium text-ink/70">Hair styling & spa equipment bundles.</p>
                <div className="mt-6 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-ink/60 group-hover:text-ink transition-colors">
                  View Bundles <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <img src="https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=400" className="absolute -bottom-4 -right-4 h-40 w-40 object-cover rounded-2xl border-4 border-white shadow-2xl transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3" alt="Equipment" />
            </Link>

          </div>
        </Container>
      </section>

      {/* ---------------- TRUSTED BRANDS MARQUEE ---------------- */}
      <section className="border-b border-line bg-ink py-6">
        <div className="flex overflow-hidden">
          <div className="flex shrink-0 animate-marquee items-center gap-16 pr-16">
            {[...brands, ...brands].map((b, i) => (
              <span key={i} className="font-display text-xl italic text-porcelain/50 whitespace-nowrap">
                {b.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SPOTLIGHT VIDEOS ---------------- */}
      <section className="py-20 md:py-28 bg-sand-light border-b border-line">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end mb-10">
            <SectionHeading eyebrow="Glowora Spotlight" title="Discover in motion" sub="Watch how top salons and leading brands use professional beauty products." />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {spotlightVideos.map((video) => (
              <div key={video.id} className="relative h-80 rounded-2xl overflow-hidden group border border-line shadow-sm cursor-pointer">
                <video
                  src={video.videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 z-10 text-porcelain">
                  <span className="mb-1 inline-block rounded bg-gold px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-ink">{video.badge}</span>
                  <p className="font-display text-lg leading-tight">{video.title}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- FEATURED CATEGORIES ---------------- */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="Shop By Category" title="Fifteen categories, one beauty marketplace" sub="From everyday skincare to professional salon equipment — everything organised the way you actually shop." />
            <Link to="/categories" className="btn-ghost shrink-0">
              Browse all categories <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.slice(0, 8).map((c, i) => (
              <CategoryCard key={c.id} category={c} index={i} />
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- FEATURED SALONS ---------------- */}
      <section className="border-t border-line bg-sand-light/60 py-20 md:py-28">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="Book A Salon" title="Featured salons near you" sub="Certified salons offering hair, skin, nail and grooming services with real-time appointment availability." />
            <Link to="/salons" className="btn-ghost shrink-0">
              Browse all salons <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {salons.slice(0, 3).map((s, i) => <VenueCard key={s.id} venue={s} basePath="/salons" index={i} />)}
          </div>
        </Container>
      </section>

      {/* ---------------- FEATURED SPAS ---------------- */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="Book A Spa" title="Featured spas &amp; wellness retreats" sub="Luxury spas offering therapeutic massage, body treatments and thermal rituals." />
            <Link to="/spas" className="btn-ghost shrink-0">
              Browse all spas <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {spas.slice(0, 3).map((s, i) => <VenueCard key={s.id} venue={s} basePath="/spas" index={i} />)}
          </div>
        </Container>
      </section>

      {/* ---------------- FEATURED PRODUCTS ---------------- */}
      <section className="border-t border-line bg-sand-light/60 py-20 md:py-28">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="Curated This Season" title="Featured products" sub="A rotating edit of new formulations and everyday essentials, refreshed weekly." />
            <Link to="/shop" className="btn-ghost shrink-0">
              Shop the full catalogue <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {featuredProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- TRENDING SERVICES ---------------- */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="Popular Right Now" title="Trending services" sub="The services booked most often across Glowora salons and spas this month." />
            <Link to="/services" className="btn-ghost shrink-0">
              Browse all services <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {services.slice(0, 8).map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} onSelect={handleServiceSelect} />
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- POPULAR BEAUTY PACKAGES ---------------- */}
      <section className="border-t border-line bg-ink py-20 text-porcelain md:py-28">
        <Container>
          <SectionHeading eyebrow="Spa Favourites" title="Popular beauty packages" sub="Multi-treatment spa packages booked most often — bundled for a full relaxation ritual." />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {uniquePackages.map((pkg) => (
              <Link key={pkg.name} to="/spas" className="rounded-xl2 bg-porcelain p-6 text-ink transition hover:-translate-y-1">
                <p className="font-display text-lg">{pkg.name}</p>
                <p className="mt-2 flex items-center gap-1.5 font-mono text-xs text-ink/50"><Clock size={12} /> {pkg.duration}</p>
                <div className="mt-4 border-t border-line pt-4">
                  <Price price={pkg.price} size="sm" />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- BEST SELLERS ---------------- */}
      <section className="py-20 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="Most Loved"
            title="Best sellers"
            sub="Ranked by verified purchase volume across every Glowora account."
          />
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {bestSellerProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- TODAY'S DEALS ---------------- */}
      <section className="border-t border-line bg-sand-light/60 py-20 md:py-28">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="Limited Time" title="Today's deals" sub="The steepest discounts on the marketplace right now — refreshed daily." />
            <Link to="/offers" className="btn-ghost shrink-0">
              View all offers <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {todaysDeals.map((p, i) => (
              <div key={p.id} className="relative">
                <span className="absolute left-3 top-3 z-10"><Badge tone="clay">{p.discount}% OFF</Badge></span>
                <ProductCard product={p} index={i} />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- FEATURED BRANDS ---------------- */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="The Registry" title="Featured brands" sub="Trusted beauty houses stocked and verified on Glowora." />
            <Link to="/brands" className="btn-ghost shrink-0">
              Browse all brands <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {brands.slice(0, 6).map((b, i) => <BrandCard key={b.id} brand={b} index={i} />)}
          </div>
        </Container>
      </section>

      {/* ---------------- WHY CHOOSE US ---------------- */}
      <section className="border-t border-line py-20 md:py-28">
        <Container>
          <SectionHeading eyebrow="Why Glowora" title="Built for how beauty is actually bought" align="center" />
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl2 border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((w) => (
              <div key={w.title} className="bg-white p-8">
                <w.icon size={22} className="text-gold-dark" />
                <h3 className="mt-5 font-display text-lg text-ink">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/55">{w.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- MEMBERSHIP BANNER ---------------- */}
      <section className="py-20 md:py-28">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>Professional Membership</Eyebrow>
            <h2 className="font-display text-3xl leading-[1.1] text-ink md:text-[2.75rem]">
              Gold and Platinum accounts book &amp; ship first, always.
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink/60">
              Membership isn’t just a discount club — it’s priority appointment slots, priority shipping and early access to the brands and salons you already love.
            </p>
            <Link to="/membership" className="btn-primary mt-8">
              Compare membership tiers <ArrowRight size={15} />
            </Link>
          </div>
          <div className="overflow-hidden rounded-xl2 border border-line">
            <img src="https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=1200" alt="Glowora professional membership" className="h-80 w-full object-cover md:h-96" loading="lazy" decoding="async" />
          </div>
        </Container>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <section className="border-t border-line bg-sand-light/60 py-20 md:py-28">
        <Container>
          <SectionHeading eyebrow="From Our Community" title="What Glowora members say" align="center" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.id} className="rounded-xl2 border border-line bg-white p-7">
                <p className="font-display text-lg italic leading-snug text-ink">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" loading="lazy" decoding="async" />
                  <div>
                    <p className="text-sm font-medium text-ink">{t.name}</p>
                    <p className="font-mono text-[11px] text-ink/40">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- BEAUTY BLOGS / TIPS ---------------- */}
      <section className="py-20 md:py-28">
        <Container>
          <SectionHeading eyebrow="Glowora Journal" title="Beauty tips worth reading" sub="Practical, professional advice from our category leads — no fluff." />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {beautyTips.slice(0, 6).map((tip) => (
              <div key={tip.id} className="overflow-hidden rounded-xl2 border border-line bg-white">
                <img src={tip.image} alt={tip.title} className="h-40 w-full object-cover" loading="lazy" decoding="async" />
                <div className="p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest2 text-gold-dark">{tip.category} · {tip.readTime}</p>
                  <p className="mt-2 font-display text-base text-ink">{tip.title}</p>
                  <p className="mt-2 text-xs leading-relaxed text-ink/55">{tip.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- MOBILE APP BANNER ---------------- */}
      <section className="py-20 md:py-28">
        <Container className="overflow-hidden rounded-xl2 bg-ink-fade px-8 py-16 text-porcelain md:px-16">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div>
              <Eyebrow>On The Go</Eyebrow>
              <h2 className="font-display text-3xl leading-tight md:text-4xl">Shop and book, right from your phone</h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-porcelain/60">
                The Glowora app keeps your orders, appointments and wishlist in your pocket — reorder a serum or rebook your stylist in seconds.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button className="flex items-center gap-2 rounded-full bg-porcelain px-6 py-3 text-sm font-medium text-ink">
                  <Smartphone size={16} /> App Store
                </button>
                <button className="flex items-center gap-2 rounded-full border border-porcelain/30 px-6 py-3 text-sm font-medium text-porcelain">
                  <Smartphone size={16} /> Google Play
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="h-72 w-48 rounded-[2rem] border-4 border-porcelain/20 bg-porcelain/5 backdrop-blur-sm" />
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="border-t border-line py-20 md:py-28">
        <Container>
          <SectionHeading eyebrow="Questions" title="Frequently asked" align="center" />
          <div className="mx-auto max-w-2xl divide-y divide-line border-y border-line">
            {faqs.map((f, i) => (
              <div key={f.q}>
                <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 py-5 text-left">
                  <span className="font-display text-lg text-ink">{f.q}</span>
                  <ChevronDown size={16} className={`shrink-0 text-ink/40 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && <p className="pb-5 text-sm leading-relaxed text-ink/60">{f.a}</p>}
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/faqs" className="btn-ghost">More questions? Visit our FAQ page <ArrowUpRight size={14} /></Link>
          </div>
        </Container>
      </section>
    </div>
  )
}
