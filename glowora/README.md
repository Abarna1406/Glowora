# Glowora

**One Platform for Beauty Products & Salon Services** — a premium beauty marketplace built with React, Tailwind CSS, React Router, Framer Motion and Lucide React.

## Design identity

- **Theme** — Premium Baby Pink Luxury: Primary `#EC4899`, Secondary `#F472B6`, Light Pink `#FDF2F8`, Background `#FFFFFF`, Border `#FBCFE8`, Hover `#DB2777`, Text `#1F2937`.
- **Implementation note** — the theme is applied via the same semantic Tailwind color tokens used throughout the app (`ink`, `porcelain`, `sand`, `gold`, `line`, `clay`, `moss` in `tailwind.config.js`), just remapped to the new hex values. This means the entire site was reskinned by editing one config file rather than touching every component's `className`.
- **Type** — Fraunces (display serif) + Inter (body/UI) + IBM Plex Mono (prices, SKUs, specs).

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (defaults to `http://localhost:5173`). For production:

```bash
npm run build
npm run preview
```

Copy `.env.example` to `.env` to point the frontend at your Module 1 backend (defaults to `http://localhost:5000/api`).

## What's included

### Product marketplace
- 150 products across 15 categories (Hair Care, Skin Care, Makeup, Professional Tools, Salon Equipment, Spa Essentials, Perfumes, Hair Color, Body Care, Beauty Accessories, Professional Machines, Nail Care, Massage, Wax, Facial Kits)
- 16 brands (L'Oréal Professionnel, Wella, Schwarzkopf, Lakmé, MAC, Maybelline, Minimalist, Mamaearth, Cetaphil, Sugar, Colorbar, Revlon, Philips, Vega, BaByliss PRO, Ikonic)
- Every product has price, discount, stock, rating, reviews, tags, specifications, gallery, featured/bestseller/new-arrival flags
- Filters: Category, Brand, Price, Rating, Availability, Discount
- Global search across products, salons, spas and services

### Salon & spa booking (frontend only — no backend yet)
- 25 salons and 20 spas, each with hours, staff, gallery, services/packages, and reviews
- A full front-end booking flow: pick a service/package → date → time slot → professional → payment method → confirm → booking ID + success page
- Booked time slots are shown as unavailable per venue
- An `/appointments` page (protected) showing Upcoming / Completed / Cancelled bookings

### Homepage
Hero, Featured Categories, Featured Salons, Featured Spas, Featured Products, Trending Services, Popular Beauty Packages, Best Sellers, Today's Deals, Featured Brands, Why Choose Us, Membership banner, Testimonials, Beauty Blogs, Mobile App banner, FAQ. Newsletter signup lives in the footer, visible on every page including home.

## Structure

```
src/
  components/
    layout/     Navbar, Footer, Cart/Wishlist drawers, Notification & Profile dropdowns, Public/Admin layouts
    cards/      ProductCard, BrandCard, CategoryCard, ReviewCard, VenueCard (salon/spa), ServiceCard
    ui/         Shared primitives — Price, RatingStars, Badge, SectionHeading, EmptyState, etc.
    shared/     Breadcrumb, Pagination, Modal, ProtectedRoute
  pages/        Storefront pages, salon/spa directories & profiles, services, booking flow, appointments
  pages/admin/  Admin dashboard + management tables
  context/      AuthContext (login/register/logout, JWT persisted to localStorage)
  lib/
    data.js     Full dummy dataset — categories, brands, products, salons, spas, services, etc.
    store.jsx   Cart/wishlist/theme state via React Context
    api.js      Axios instance with JWT interceptors
```

## Known limitations (explicitly out of scope for this pass)

- No backend for salons/spas/services/appointments/coupons — everything above is frontend + dummy data
- No admin CRUD screens for salons, spas, services or appointments yet (admin currently manages products/orders/customers/brands/categories/inventory/coupons/reviews/settings)
- No real order tracking/invoicing, OTP flow, or Google OAuth (Google sign-in button is UI only)
- `ProfileDropdown`'s "Sign out" is still static and the Navbar user info is still the dummy `StoreProvider` user rather than the real authenticated `AuthContext` user

## Notes

- All product/salon/spa image URLs reuse a small, verified pool of Unsplash photo IDs already present elsewhere in the project — deliberate, to avoid any risk of broken image links across 150+ generated listings.
- Cart, wishlist and dark-mode state are held in memory via `StoreProvider` (no backend wired up for those yet).
