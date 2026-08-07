// ---------------------------------------------------------------------------
// Glowora — dummy data layer (stands in for the real marketplace + booking API)
//
// All image URLs below are drawn from a small, reused pool of Unsplash photo
// IDs that are already referenced elsewhere in this project (categories,
// brand covers, avatars). Reusing a trusted pool — rather than inventing new
// photo IDs — is a deliberate choice to guarantee there are no broken image
// links across 150+ generated product entries.
// ---------------------------------------------------------------------------
import pro1 from "../assets/pro-1.jpg";
import pro2 from "../assets/pro-2.png";
import pro3 from "../assets/pro-3.jpg";
import pro4 from "../assets/pro-4.jpg";
import pro5 from "../assets/pro-5.jpg";
import pro6 from "../assets/pro-6.jpg";
import pro7 from "../assets/pro-7.jpg";
import pro8 from "../assets/pro-8.jpg";
import pro9 from "../assets/pro-9.jpg";
import pro10 from "../assets/pro-10.jpg";
import pro11 from "../assets/pro-11.jpg";
import pro12 from "../assets/pro-12.jpg";
import pro13 from "../assets/pro-13.jpg";
import pro14 from "../assets/pro-14.jpg";
import pro15 from "../assets/pro-15.jpg";
import pro16 from "../assets/pro-16.jpg";
import pro17 from "../assets/pro-17.jpg";
import pro18 from "../assets/pro-18.jpg";
import pro19 from "../assets/pro-19.jpg";
import pro20 from "../assets/pro-20.jpg";
import pro21 from "../assets/pro-21.jpg";
import pro22 from "../assets/pro-22.jpg";
import portimg1 from "../assets/port-img1.jpg";
import portimg2 from "../assets/port-img 2.jpg";
import portimg3 from "../assets/port-img 3.jpg";
import intimg1 from "../assets/int-img1.jpg";
import intimg2 from "../assets/int-img2.jpg";
import intimg3 from "../assets/int-img3.jpg";
import intimg4 from "../assets/int-img4.jpg";
import intimg5 from "../assets/int-img5.jpg";
import intimg6 from "../assets/int-img6.jpg";

const PRODUCT_IMAGES = [
  pro1,
  pro2,
  pro3,
  pro4,
  pro5,
  pro6,
  pro7,
  pro8,
  pro9,
  pro10,
  pro11,
  pro12,
  pro13,
  pro14,
  pro15,
  pro16,
  pro17,
  pro18,
  pro19,
  pro20,
  pro21,
  pro22,
  
];

const PORTRAIT_IMAGES = [
  portimg1,
  portimg2,
  portimg3,
  
]

const INTERIOR_IMAGES = [
  intimg1,
  intimg2,
  intimg3,
  intimg4,
  intimg5,
  intimg6,
];
  

const productImg = (i) => PRODUCT_IMAGES[i % PRODUCT_IMAGES.length]
const productGallery = (i) => [0, 5, 11, 17].map((offset) => productImg(i + offset))
const portrait = (i) => PORTRAIT_IMAGES[i % PORTRAIT_IMAGES.length]
const interior = (i) => INTERIOR_IMAGES[i % INTERIOR_IMAGES.length]

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------
export const categories = [
  { id: 'hair-care', name: 'Hair Care', code: 'HC', blurb: 'Shampoo, conditioner & scalp treatments', img: productImg(19) },
  { id: 'skin-care', name: 'Skin Care', code: 'SK', blurb: 'Serums, moisturisers & clinical skincare', img: productImg(13) },
  { id: 'makeup', name: 'Makeup', code: 'MU', blurb: 'Lips, eyes, face & complexion', img: productImg(4) },
  { id: 'professional-tools', name: 'Professional Tools', code: 'PT', blurb: 'Dryers, straighteners & clippers', img: productImg(16) },
  { id: 'salon-equipment', name: 'Salon Equipment', code: 'EQ', blurb: 'Chairs, stations & sterilisation', img: productImg(18) },
  { id: 'spa-essentials', name: 'Spa Essentials', code: 'SP', blurb: 'Aromatherapy, wraps & relaxation', img: productImg(14) },
  { id: 'perfumes', name: 'Perfumes', code: 'PF', blurb: 'Eau de parfum, mists & colognes', img: productImg(5) },
  { id: 'hair-color', name: 'Hair Color', code: 'HL', blurb: 'Permanent, semi-permanent & root touch-up', img: productImg(12) },
  { id: 'body-care', name: 'Body Care', code: 'BC', blurb: 'Lotions, body wash & body oils', img: productImg(3) },
  { id: 'beauty-accessories', name: 'Beauty Accessories', code: 'AC', blurb: 'Brushes, tools & organisers', img: productImg(17) },
  { id: 'professional-machines', name: 'Professional Machines', code: 'PM', blurb: 'Facial, RF & light therapy devices', img: productImg(7) },
  { id: 'nail-care', name: 'Nail Care', code: 'NL', blurb: 'Gel, builder & nail art', img: productImg(15) },
  { id: 'massage', name: 'Massage', code: 'MS', blurb: 'Massagers, guns & relaxation tools', img: productImg(9) },
  { id: 'wax', name: 'Wax', code: 'WX', blurb: 'Hard wax, strips & wax heaters', img: productImg(2) },
  { id: 'facial-kits', name: 'Facial Kits', code: 'FK', blurb: 'Complete at-home & in-salon facials', img: productImg(1) },
]

// ---------------------------------------------------------------------------
// Brands
// ---------------------------------------------------------------------------
export const brands = [
  { id: 'loreal', name: "L'Oréal Professionnel", tagline: 'Global leader in professional hair science', origin: 'France · Est. 1909', tier: 'Platinum Partner', logo: 'LP', cover: productImg(0), story: "L'Oréal Professionnel has driven professional hair technology for over a century, from ammonia-free colour to bond-repair science used in salons on every continent." },
  { id: 'wella', name: 'Wella Professionals', tagline: 'Colour authority for stylists worldwide', origin: 'Germany · Est. 1880', tier: 'Platinum Partner', logo: 'WP', cover: productImg(1), story: 'Wella Professionals has trained generations of colourists, and its Koleston and Illumina lines remain a backbone of salon colour bars globally.' },
  { id: 'schwarzkopf', name: 'Schwarzkopf Professional', tagline: 'Precision colour & styling systems', origin: 'Germany · Est. 1898', tier: 'Gold Partner', logo: 'SP', cover: productImg(2), story: 'Schwarzkopf Professional pairs German engineering with editorial styling trends, supplying colour and care systems to salons across the region.' },
  { id: 'lakme', name: 'Lakmé Salon', tagline: "India's original professional beauty house", origin: 'India · Est. 1952', tier: 'Platinum Partner', logo: 'LK', cover: productImg(3), story: 'Lakmé built the professional salon category in India and continues to supply colour, skincare and makeup lines trusted by thousands of salons.' },
  { id: 'mac', name: 'M·A·C Cosmetics', tagline: 'Professional makeup artistry, since 1984', origin: 'Canada · Est. 1984', tier: 'Gold Partner', logo: 'MAC', cover: productImg(4), story: 'Born backstage with makeup artists, M·A·C remains the reference brand for professional-grade pigment, finish and longevity.' },
  { id: 'maybelline', name: 'Maybelline New York', tagline: 'Everyday makeup, iconic formulas', origin: 'USA · Est. 1915', tier: 'Gold Partner', logo: 'MNY', cover: productImg(5), story: 'Maybelline New York pairs mass accessibility with genuinely innovative formulas — its mascaras and foundations are makeup-kit staples.' },
  { id: 'minimalist', name: 'Minimalist', tagline: 'Transparent, single-active skincare', origin: 'India · Est. 2020', tier: 'Silver Partner', logo: 'MIN', cover: productImg(6), story: 'Minimalist publishes the exact concentration of every active on the label, building trust with dermatologists and skin-focused clinics alike.' },
  { id: 'mamaearth', name: 'Mamaearth', tagline: 'Toxin-free, natural personal care', origin: 'India · Est. 2016', tier: 'Gold Partner', logo: 'ME', cover: productImg(7), story: 'Mamaearth built one of the fastest-growing natural personal care ranges in Asia, certified toxin-free across hair, skin and body care.' },
  { id: 'cetaphil', name: 'Cetaphil', tagline: 'Dermatologist-recommended gentle skincare', origin: 'USA · Est. 1947', tier: 'Platinum Partner', logo: 'CTP', cover: productImg(8), story: 'Cetaphil has been the dermatologist-recommended standard for gentle, fragrance-conscious skincare for over seventy years.' },
  { id: 'sugar', name: 'Sugar Cosmetics', tagline: 'Bold, long-wear color cosmetics', origin: 'India · Est. 2015', tier: 'Gold Partner', logo: 'SGR', cover: productImg(9), story: 'Sugar Cosmetics built a cult following on long-wear, richly pigmented formulas designed for Indian skin tones and climate.' },
  { id: 'colorbar', name: 'Colorbar Cosmetics', tagline: 'Runway-inspired professional makeup', origin: 'India · Est. 2007', tier: 'Silver Partner', logo: 'CLB', cover: productImg(10), story: 'Colorbar works closely with makeup artists on runway-inspired seasonal collections built for both editorial and everyday wear.' },
  { id: 'revlon', name: 'Revlon Professional', tagline: 'Iconic color, salon-grade performance', origin: 'USA · Est. 1932', tier: 'Gold Partner', logo: 'RVL', cover: productImg(11), story: 'Revlon Professional has supplied salon-grade colour and styling tools since the 1930s, balancing heritage glamour with modern formulation.' },
  { id: 'philips', name: 'Philips Beauty', tagline: 'Engineering-led personal care devices', origin: 'Netherlands · Est. 1891', tier: 'Platinum Partner', logo: 'PHL', cover: productImg(12), story: 'Philips Beauty brings a century of engineering discipline to hair dryers, straighteners and grooming devices trusted in salons and at home.' },
  { id: 'vega', name: 'Vega', tagline: "India's most trusted personal care tools", origin: 'India · Est. 1984', tier: 'Gold Partner', logo: 'VGA', cover: productImg(13), story: 'Vega has manufactured personal care and salon tools for four decades, from precision trimmers to professional styling equipment.' },
  { id: 'babyliss', name: 'BaByliss PRO', tagline: 'Professional styling technology', origin: 'France · Est. 1961', tier: 'Platinum Partner', logo: 'BBP', cover: productImg(14), story: 'BaByliss PRO is a backstage and salon staple for high-heat styling tools engineered for all-day professional use.' },
  { id: 'ikonic', name: 'Ikonic Professional', tagline: 'Salon equipment & styling tools', origin: 'India · Est. 2012', tier: 'Silver Partner', logo: 'IKN', cover: productImg(15), story: 'Ikonic Professional equips Indian salons with styling tools and equipment engineered for high-volume daily professional use.' },
]

// ---------------------------------------------------------------------------
// Products — generated across all 15 categories × 10 SKUs each = 150 products
// ---------------------------------------------------------------------------
const PRODUCT_NAMES = {
  'hair-care': ['Anti-Frizz Smoothing Shampoo', 'Deep Repair Hair Mask', 'Bond-Building Conditioner', 'Scalp Detox Clarifying Shampoo', 'Keratin Smooth Shampoo', 'Volumising Root Boost Shampoo', 'Argan Oil Nourishing Conditioner', 'Color-Safe Sulfate-Free Shampoo', 'Intense Hydration Hair Mask', 'Damage Repair Leave-In Cream'],
  'skin-care': ['Vitamin C Brightening Serum', 'Hyaluronic Acid Moisturiser', 'Niacinamide Pore Refining Serum', 'Retinol Night Cream', 'Salicylic Acid Acne Gel', 'Ceramide Barrier Repair Cream', 'SPF 50 Sunscreen Gel', 'Under-Eye Brightening Cream', 'Charcoal Detox Face Wash', 'Rose Water Hydrating Toner'],
  'makeup': ['Matte Liquid Lipstick', 'Full Coverage Foundation', 'Waterproof Kajal Pencil', 'Long-Wear Eyeliner', 'HD Compact Powder', 'Blush Duo Palette', '12-Shade Eyeshadow Palette', 'Lip & Cheek Tint', 'Volumising Mascara', 'Full Coverage Concealer Stick'],
  'professional-tools': ['Ceramic Hair Straightener', 'Titanium Curling Wand', 'Professional Hair Dryer', 'Cordless Hair Clipper', 'Rotating Hot Air Brush', 'Precision Eyebrow Trimmer', 'Professional Cutting Scissors', 'Ionic Straightening Brush', 'Detangling Hair Brush', 'Barber Trimmer Kit'],
  'salon-equipment': ['Hydraulic Styling Chair', 'Salon Shampoo Station', 'LED Facial Steamer', 'Manicure Table', 'Pedicure Spa Chair', 'Rolling Trolley Cart', 'Salon Mirror Station', 'UV Sterilizer Cabinet', 'Hair Wash Basin Unit', 'Adjustable Salon Stool'],
  'spa-essentials': ['Aromatherapy Massage Oil Set', 'Hot Stone Massage Kit', 'Spa Bathrobe', 'Bamboo Spa Towel Set', 'Relaxation Candle Set', 'Detox Body Wrap Kit', 'Essential Oil Diffuser', 'Herbal Bath Salts', 'Spa Headband Set', 'Cucumber Eye Mask Pack'],
  'perfumes': ['Floral Eau de Parfum', 'Citrus Fresh Cologne', 'Oud Intense Perfume', 'Rose Musk Body Mist', 'Vanilla Amber Perfume', 'Ocean Breeze Cologne', 'Jasmine Bloom Eau de Toilette', 'Sandalwood Signature Perfume', 'Lavender Calm Body Mist', 'Classic Woody Perfume'],
  'hair-color': ['Permanent Hair Colour Crème', 'Ammonia-Free Hair Dye', 'Semi-Permanent Colour Gloss', 'Root Touch-Up Spray', 'Highlighting Bleach Powder', 'Henna-Based Hair Colour', 'Fashion Pastel Hair Colour', 'Grey Coverage Hair Colour', 'Colour Protecting Developer', 'Hair Colour Shine Serum'],
  'body-care': ['Shea Butter Body Lotion', 'Coconut Milk Body Wash', 'Exfoliating Body Scrub', 'Cocoa Butter Body Cream', 'Brightening Body Lotion', 'Aloe Vera Soothing Gel', 'Body Firming Cream', 'Vitamin E Body Oil', 'Repairing Foot Cream', 'Intensive Care Hand Cream'],
  'beauty-accessories': ['Makeup Brush Set', 'Silicone Beauty Blender', 'Reusable Makeup Remover Pads', 'Hair Styling Clips Set', 'Cosmetic Organiser Box', 'Travel Makeup Pouch', 'Jade Face Roller', 'Gua Sha Facial Tool', 'Eyelash Curler', 'LED Makeup Mirror'],
  'professional-machines': ['Microdermabrasion Machine', 'Ultrasonic Facial Machine', 'LED Light Therapy Device', 'RF Skin Tightening Machine', 'IPL Hair Removal Device', 'Ozone Facial Steamer', 'High-Frequency Skin Machine', 'Galvanic Facial Machine', 'Cavitation Body Sculpting Machine', 'Microcurrent Facial Toner'],
  'nail-care': ['Gel Nail Polish Set', 'Nail Art Kit', 'Cuticle Oil Pen', 'Nail Strengthener Base Coat', 'Professional UV Nail Lamp', 'Acrylic Nail Powder Kit', 'Gentle Nail Polish Remover', 'Glossy Top Coat', 'Nail Extension Tips Set', 'French Manicure Kit'],
  'massage': ['Electric Massage Gun', 'Handheld Body Massager', 'Shiatsu Neck Massager', 'Foot Massager Machine', 'Massage Roller Stick', 'Vibrating Massage Cushion', 'Scalp Massager Tool', 'Percussion Massage Device', 'Cordless Massage Wand', 'Full Body Massage Mat'],
  'wax': ['Roll-On Wax Cartridge', 'Chocolate Hard Wax Beans', 'Honey Wax Strips', 'Fruit Wax Pellets', 'Professional Wax Heater', 'Brazilian Wax Kit', 'Sensitive Skin Wax Strips', 'Rica Wax Beans', 'Waxing Spatula Set', 'After-Wax Soothing Gel'],
  'facial-kits': ['Gold Facial Kit', 'Diamond Glow Facial Kit', 'Fruit Facial Kit', 'Anti-Ageing Facial Kit', 'Charcoal Detox Facial Kit', 'Pearl Radiance Facial Kit', 'Bridal Glow Facial Kit', 'Vitamin C Facial Kit', 'Herbal Facial Kit', "Men's Facial Kit"],
}

const CATEGORY_BRAND_MAP = {
  'hair-care': ['wella', 'schwarzkopf', 'loreal', 'lakme', 'mamaearth'],
  'skin-care': ['minimalist', 'mamaearth', 'cetaphil', 'lakme', 'loreal'],
  'makeup': ['mac', 'maybelline', 'colorbar', 'sugar', 'revlon', 'lakme'],
  'professional-tools': ['philips', 'babyliss', 'ikonic', 'vega'],
  'salon-equipment': ['ikonic', 'babyliss', 'philips', 'vega'],
  'spa-essentials': ['mamaearth', 'minimalist', 'lakme'],
  'perfumes': ['revlon', 'colorbar', 'lakme', 'sugar'],
  'hair-color': ['loreal', 'schwarzkopf', 'wella', 'lakme'],
  'body-care': ['mamaearth', 'cetaphil', 'minimalist', 'lakme'],
  'beauty-accessories': ['sugar', 'colorbar', 'vega', 'ikonic'],
  'professional-machines': ['philips', 'babyliss', 'ikonic', 'vega'],
  'nail-care': ['sugar', 'colorbar', 'maybelline', 'revlon'],
  'massage': ['philips', 'vega', 'babyliss'],
  'wax': ['ikonic', 'vega', 'mamaearth'],
  'facial-kits': ['lakme', 'mamaearth', 'minimalist', 'cetaphil'],
}

const CATEGORY_PRICE_RANGE = {
  'hair-care': [249, 1499],
  'skin-care': [299, 2499],
  'makeup': [199, 1899],
  'professional-tools': [999, 6999],
  'salon-equipment': [2999, 24999],
  'spa-essentials': [399, 2999],
  'perfumes': [599, 4999],
  'hair-color': [199, 1299],
  'body-care': [199, 1199],
  'beauty-accessories': [149, 1499],
  'professional-machines': [3999, 34999],
  'nail-care': [149, 1799],
  'massage': [899, 7999],
  'wax': [149, 2499],
  'facial-kits': [299, 1999],
}

const COUNTRIES = ['India', 'France', 'Germany', 'USA', 'South Korea']
const DISCOUNTS = [0, 10, 15, 20, 0, 25, 30, 12, 0, 35]

function brandName(id) {
  return brands.find((b) => b.id === id)?.name || id
}

function makeProduct(catIndex, nameIndex) {
  const category = categories[catIndex]
  const names = PRODUCT_NAMES[category.id]
  const name = names[nameIndex]
  const brandPool = CATEGORY_BRAND_MAP[category.id]
  const brandId = brandPool[nameIndex % brandPool.length]
  const globalIndex = catIndex * 10 + nameIndex

  const [minPrice, maxPrice] = CATEGORY_PRICE_RANGE[category.id]
  const priceStep = (maxPrice - minPrice) / 10
  const price = Math.round((minPrice + priceStep * nameIndex + (globalIndex % 7) * 11) / 10) * 10

  const discount = DISCOUNTS[globalIndex % DISCOUNTS.length]
  const mrp = discount > 0 ? Math.round((price / (1 - discount / 100)) / 10) * 10 : price

  const rating = Math.min(5, 3.7 + ((globalIndex * 13) % 13) / 10).toFixed(1)
  const reviews = 18 + ((globalIndex * 17) % 480)
  const stock = (globalIndex * 23) % 140
  const inStock = globalIndex % 23 !== 0

  const id = `glw-${1000 + globalIndex}`
  const sku = `GLW-${category.code}-${1000 + globalIndex}`

  return {
    id,
    sku,
    name,
    brandId,
    brand: brandName(brandId),
    categoryId: category.id,
    category: category.name,
    price,
    mrp,
    discount,
    professionalOnly: globalIndex % 4 !== 0,
    unit: nameIndex % 3 === 0 ? '200 ml' : nameIndex % 3 === 1 ? '100 ml' : '1 unit',
    rating: Number(rating),
    reviews,
    stock,
    inStock,
    moq: [1, 1, 1, 2, 3][globalIndex % 5],
    featured: globalIndex % 9 === 0,
    bestseller: globalIndex % 7 === 0,
    newArrival: globalIndex % 11 === 0,
    tags: [category.name, brandName(brandId), discount > 0 ? 'On Sale' : 'Everyday Essential'],
    specifications: {
      'Suitable For': ['All Types', 'Oily', 'Dry', 'Sensitive', 'Combination'][globalIndex % 5],
      'Net Quantity': nameIndex % 3 === 0 ? '200 ml' : nameIndex % 3 === 1 ? '100 ml' : '1 unit',
      'Shelf Life': '24 months',
      'Country of Origin': COUNTRIES[globalIndex % COUNTRIES.length],
    },
    img: productImg(globalIndex),
    gallery: productGallery(globalIndex),
    description: `A professional-grade ${category.name.toLowerCase()} formulation from ${brandName(brandId)}, developed for consistent, salon-quality results. Suitable for both in-salon service and personal use.`,
    benefits: [
      'Dermatologically tested formulation',
      'Consistent, batch-tested quality',
      'Suitable for regular professional use',
      'Backed by verified customer reviews',
    ],
    ingredients: 'Aqua, Cetearyl Alcohol, Glycerin, Panthenol, Niacinamide, Tocopherol, Citric Acid, Parfum.',
    usage: 'Apply as directed on packaging. Patch test recommended before first use. Store in a cool, dry place away from direct sunlight.',
  }
}

export const products = categories.flatMap((category, catIndex) =>
  Array.from({ length: 10 }, (_, nameIndex) => makeProduct(catIndex, nameIndex)),
)

// Attach a derived listing count to each category now that products exist.
categories.forEach((c) => {
  c.count = products.filter((p) => p.categoryId === c.id).length
})

// Attach a derived SKU count to each brand now that products exist.
brands.forEach((b) => {
  b.products = products.filter((p) => p.brandId === b.id).length
})

export const featuredProducts = products.filter((p) => p.featured).slice(0, 8)
export const trendingProducts = [...products].filter((p) => p.rating >= 4.4).slice(0, 8)
export const newArrivalProducts = products.filter((p) => p.newArrival).slice(0, 8)
export const bestSellerProducts = products.filter((p) => p.bestseller).slice(0, 8)
export const todaysDeals = products.filter((p) => p.discount >= 20).slice(0, 8)

// ---------------------------------------------------------------------------
// Services (booking catalogue shared by salons & spas)
// ---------------------------------------------------------------------------
export const services = [
  { id: 'hair-cut', name: 'Hair Cut', category: 'Hair', duration: '30 min', priceFrom: 299 },
  { id: 'hair-spa', name: 'Hair Spa', category: 'Hair', duration: '45 min', priceFrom: 799 },
  { id: 'hair-coloring', name: 'Hair Colouring', category: 'Hair', duration: '90 min', priceFrom: 1499 },
  { id: 'hair-smoothening', name: 'Hair Smoothening', category: 'Hair', duration: '120 min', priceFrom: 2999 },
  { id: 'keratin', name: 'Keratin Treatment', category: 'Hair', duration: '150 min', priceFrom: 3999 },
  { id: 'facial', name: 'Facial', category: 'Skin', duration: '60 min', priceFrom: 999 },
  { id: 'cleanup', name: 'Cleanup', category: 'Skin', duration: '30 min', priceFrom: 499 },
  { id: 'threading', name: 'Threading', category: 'Skin', duration: '15 min', priceFrom: 99 },
  { id: 'waxing', name: 'Waxing (Full Body)', category: 'Skin', duration: '75 min', priceFrom: 1299 },
  { id: 'manicure', name: 'Manicure', category: 'Nails', duration: '40 min', priceFrom: 499 },
  { id: 'pedicure', name: 'Pedicure', category: 'Nails', duration: '45 min', priceFrom: 599 },
  { id: 'nail-extension', name: 'Nail Extension', category: 'Nails', duration: '90 min', priceFrom: 1499 },
  { id: 'bridal-makeup', name: 'Bridal Makeup', category: 'Makeup', duration: '150 min', priceFrom: 8999 },
  { id: 'party-makeup', name: 'Party Makeup', category: 'Makeup', duration: '60 min', priceFrom: 1999 },
  { id: 'massage', name: 'Full Body Massage', category: 'Spa', duration: '60 min', priceFrom: 1499 },
  { id: 'body-spa', name: 'Body Spa', category: 'Spa', duration: '90 min', priceFrom: 2499 },
  { id: 'head-massage', name: 'Head Massage', category: 'Spa', duration: '30 min', priceFrom: 499 },
  { id: 'beard-grooming', name: 'Beard Grooming', category: "Men's Grooming", duration: '25 min', priceFrom: 299 },
  { id: 'skin-consultation', name: 'Skin Consultation', category: 'Skin', duration: '30 min', priceFrom: 0 },
]

// ---------------------------------------------------------------------------
// Salons — 25 listings
// ---------------------------------------------------------------------------
const CITIES = ['Chennai', 'Mumbai', 'Bengaluru', 'Delhi', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad']
const SALON_NAME_PARTS = ['Lumen', 'Studio Aura', 'Belline', 'The Glow Room', 'Verve', 'Blush & Blade', 'Studio Noir', 'Radiance', 'The Style Loft', 'Elan', 'Studio 21', 'Cascade', 'Enrich', 'Bloom Bar', 'Muse', 'Velvet Chair', 'Aria', 'The Parlour', 'Salt & Silk', 'North Studio', 'Halo', 'Studio Verve', 'The Grooming Co', 'Petal & Pin', 'Studio Lumière']
const STAFF_NAMES = ['Ananya Rao', 'Karan Mehta', 'Sofia D\u2019Souza', 'Rahul Nair', 'Priya Sharma', 'Vikram Iyer', 'Meera Kapoor', 'Arjun Singh']
const STAFF_ROLES = ['Senior Stylist', 'Colour Specialist', 'Makeup Artist', 'Spa Therapist', 'Nail Technician', 'Salon Manager']
export const TIME_SLOTS = {
  Morning: ['9:00 AM', '9:45 AM', '10:30 AM', '11:15 AM'],
  Afternoon: ['12:30 PM', '1:15 PM', '2:00 PM', '3:30 PM'],
  Evening: ['5:00 PM', '5:45 PM', '6:30 PM', '7:15 PM', '8:00 PM'],
}

function makeStaff(seed, count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `staff-${seed}-${i}`,
    name: STAFF_NAMES[(seed + i) % STAFF_NAMES.length],
    role: STAFF_ROLES[(seed + i * 2) % STAFF_ROLES.length],
    avatar: portrait(seed + i),
  }))
}

function bookedSlots(seed) {
  // Deterministically "pre-books" a couple of slots per salon so the booking
  // page has something real to show as unavailable.
  const all = [...TIME_SLOTS.Morning, ...TIME_SLOTS.Afternoon, ...TIME_SLOTS.Evening]
  return [all[seed % all.length], all[(seed * 3) % all.length]]
}

export const salons = Array.from({ length: 25 }, (_, i) => {
  const city = CITIES[i % CITIES.length]
  const name = SALON_NAME_PARTS[i]
  const serviceIds = services.filter((s) => s.category !== 'Spa').map((s) => s.id).filter((_, idx) => idx % 2 === i % 2 || idx % 3 === 0)
  return {
    id: `salon-${i + 1}`,
    name,
    type: 'Salon',
    city,
    area: ['MG Road', 'Anna Nagar', 'Bandra West', 'Koramangala', 'Banjara Hills', 'Camp Area', 'Park Street', 'Navrangpura'][i % 8],
    address: `${12 + i}, ${['MG Road', 'Anna Nagar 2nd Ave', 'Bandra West', 'Koramangala 5th Block', 'Banjara Hills Rd 12', 'Camp Area', 'Park Street', 'Navrangpura'][i % 8]}, ${city}`,
    phone: `+91 98${(100000000 + i * 137).toString().slice(0, 8)}`,
    email: `hello@${name.toLowerCase().replace(/[^a-z]/g, '')}.glowora.com`,
    coverImage: interior(i),
    logo: name.split(' ').map((w) => w[0]).join('').slice(0, 3).toUpperCase(),
    description: `${name} is a full-service salon in ${city} offering hair, skin, nail and grooming services from certified professionals.`,
    openingHours: 'Mon–Sun · 9:00 AM – 8:30 PM',
    rating: Number((4.1 + ((i * 7) % 9) / 10).toFixed(1)),
    reviews: 32 + ((i * 19) % 260),
    priceRange: ['₹₹', '₹₹', '₹₹₹', '₹₹₹₹'][i % 4],
    serviceIds: serviceIds.length ? serviceIds : [services[0].id, services[1].id],
    staff: makeStaff(i, 3 + (i % 3)),
    gallery: [interior(i), interior(i + 1), interior(i + 2), interior(i + 3)],
    bookedSlots: bookedSlots(i),
  }
})

// ---------------------------------------------------------------------------
// Spas — 20 listings (with packages instead of à la carte services)
// ---------------------------------------------------------------------------
const SPA_NAME_PARTS = ['Nord Therme', 'Serene Springs', 'The Wellness Room', 'Aqua Bliss', 'Lotus Retreat', 'Zenith Spa', 'Tranquil Waters', 'The Hideaway Spa', 'Amaya Wellness', 'Stone & Steam', 'Elemental Spa', 'The Sanctuary', 'Willow Spa', 'Cocoon Wellness', 'Aura Retreat', 'The Still Room', 'Onsen House', 'Petal Spa', 'North Star Wellness', 'The Quiet Spa']

export const spas = Array.from({ length: 20 }, (_, i) => {
  const city = CITIES[i % CITIES.length]
  const name = SPA_NAME_PARTS[i]
  return {
    id: `spa-${i + 1}`,
    name,
    type: 'Spa',
    city,
    area: ['MG Road', 'Anna Nagar', 'Bandra West', 'Koramangala', 'Banjara Hills', 'Camp Area', 'Park Street', 'Navrangpura'][i % 8],
    address: `${5 + i}, ${['Lakeview Road', 'Palm Avenue', 'Marine Drive Ext', 'Church Street', 'Jubilee Hills Rd 9', 'FC Road', 'Rashbehari Ave', 'CG Road'][i % 8]}, ${city}`,
    phone: `+91 99${(100000000 + i * 211).toString().slice(0, 8)}`,
    email: `relax@${name.toLowerCase().replace(/[^a-z]/g, '')}.glowora.com`,
    coverImage: interior((i + 2) % INTERIOR_IMAGES.length),
    logo: name.split(' ').map((w) => w[0]).join('').slice(0, 3).toUpperCase(),
    description: `${name} is a luxury wellness retreat in ${city} specialising in therapeutic massage, body treatments and thermal rituals.`,
    openingHours: 'Mon–Sun · 10:00 AM – 9:00 PM',
    rating: Number((4.3 + ((i * 5) % 7) / 10).toFixed(1)),
    reviews: 28 + ((i * 23) % 220),
    priceRange: ['₹₹₹', '₹₹₹₹'][i % 2],
    packages: [
      { name: 'Signature Relax Ritual', duration: '90 min', price: 2999 + (i % 5) * 300 },
      { name: 'Hot Stone Therapy', duration: '75 min', price: 2499 + (i % 4) * 250 },
      { name: 'Detox Body Wrap & Scrub', duration: '120 min', price: 3999 + (i % 3) * 400 },
      { name: 'Couples Wellness Package', duration: '90 min', price: 5999 + (i % 4) * 500 },
    ],
    staff: makeStaff(i + 40, 2 + (i % 3)),
    gallery: [interior(i + 1), interior(i + 2), interior(i + 3), interior(i + 4)],
    bookedSlots: bookedSlots(i + 12),
  }
})

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------
export const testimonials = [
  { id: 1, name: 'Alina Cho', role: 'Owner, Studio Alina — Seoul', quote: 'Booking my clients\u2019 salon slots and reordering our back-bar products now happens in the same app. It has genuinely saved us hours every week.', avatar: portrait(0) },
  { id: 2, name: 'Marco Belline', role: 'Creative Director, Belline Hair — Milan', quote: 'Glowora is the only place I\u2019ve found every colour brand I use, with real availability for appointments instead of guesswork.', avatar: portrait(1) },
  { id: 3, name: 'Priya Nair', role: 'Founder, Skin Clinic Priya — Bengaluru', quote: 'The membership tier paid for itself in the first month. Priority booking slots alone are worth it for a clinic our size.', avatar: portrait(2) },
]

// ---------------------------------------------------------------------------
// Membership tiers
// ---------------------------------------------------------------------------
export const membershipTiers = [
  {
    id: 'silver', name: 'Silver', price: 0, period: 'Free for every member',
    perks: ['Standard pricing on all products', 'Standard 5–7 day shipping', 'Book any salon or spa', 'Email support'],
  },
  {
    id: 'gold', name: 'Gold', price: 4999, period: '/ year, billed annually',
    perks: ['Everything in Silver', 'Priority 2–3 day shipping', 'Priority appointment slots', 'Early access to new brand launches', 'Quarterly beauty box delivered'],
    featured: true,
  },
  {
    id: 'platinum', name: 'Platinum', price: 12999, period: '/ year, billed annually',
    perks: ['Everything in Gold', 'Next-day metro shipping', 'Same-day appointment booking', 'Dedicated account manager', 'Annual loyalty rebate', 'Invitation to the Glowora beauty summit'],
  },
]

// ---------------------------------------------------------------------------
// Orders / appointments / coupons / faqs / notifications
// ---------------------------------------------------------------------------
export const orders = [
  { id: 'ORD-88213', date: '2026-07-18', status: 'In Transit', items: 6, total: 18420, eta: '2026-07-31' },
  { id: 'ORD-88109', date: '2026-07-05', status: 'Delivered', items: 3, total: 7290, eta: '2026-07-09' },
  { id: 'ORD-87942', date: '2026-06-22', status: 'Delivered', items: 12, total: 41200, eta: '2026-06-27' },
  { id: 'ORD-87810', date: '2026-06-11', status: 'Cancelled', items: 2, total: 5100, eta: '—' },
]

export const orderTimeline = [
  { label: 'Order placed', done: true, date: 'Jul 18, 10:12' },
  { label: 'Verified & packed', done: true, date: 'Jul 19, 14:40' },
  { label: 'Dispatched', done: true, date: 'Jul 20, 09:05' },
  { label: 'Out for delivery', done: false, date: 'Expected Jul 31' },
  { label: 'Delivered', done: false, date: 'Pending' },
]

export const appointments = [
  { id: 'APT-51042', salonName: 'Lumen', service: 'Hair Colouring', date: '2026-08-04', time: '2:00 PM', professional: 'Ananya Rao', status: 'Upcoming', total: 1499 },
  { id: 'APT-50811', salonName: 'Nord Therme', service: 'Hot Stone Therapy', date: '2026-07-20', time: '11:15 AM', professional: 'Priya Sharma', status: 'Completed', total: 2499 },
  { id: 'APT-50602', salonName: 'Studio Aura', service: 'Bridal Makeup', date: '2026-07-02', time: '9:00 AM', professional: 'Sofia D\u2019Souza', status: 'Completed', total: 8999 },
  { id: 'APT-50310', salonName: 'Belline', service: 'Hair Spa', date: '2026-06-14', time: '5:45 PM', professional: 'Karan Mehta', status: 'Cancelled', total: 799 },
]

export const coupons = [
  { code: 'GLOW10', desc: '10% off your first order', min: '₹999 minimum', expires: 'Aug 31, 2026' },
  { code: 'GOLDSHIP', desc: 'Free priority shipping for Gold & Platinum members', min: 'No minimum', expires: 'Ongoing' },
  { code: 'FESTAL25', desc: '25% off Skin Care category, festival collection', min: '₹1,500 minimum', expires: 'Aug 15, 2026' },
  { code: 'SPADAY20', desc: '20% off any spa package booking', min: 'No minimum', expires: 'Aug 20, 2026' },
]

export const faqs = [
  { q: 'What can I do on Glowora?', a: 'Glowora lets you shop beauty products from trusted brands and book appointments at salons and spas — all from one account.' },
  { q: 'How do I book a salon or spa appointment?', a: 'Open a salon or spa profile, choose a service or package, pick an available date and time slot, then confirm your booking to receive a booking ID.' },
  { q: 'Can I reschedule or cancel an appointment?', a: 'Yes — upcoming appointments can be rescheduled or cancelled from the Appointments page in your account, subject to each salon\u2019s cancellation window.' },
  { q: 'What is the minimum order for free shipping?', a: 'Orders above ₹1,500 ship free. Gold and Platinum members get free priority shipping on every order regardless of value.' },
  { q: 'How long does account verification take?', a: 'Most accounts are ready to use immediately after registration. Professional (Salon/Spa/Beautician) accounts get access to trade pricing right away.' },
]

export const notifications = [
  { id: 1, title: 'Order ORD-88213 has shipped', time: '2h ago', unread: true },
  { id: 2, title: 'Your appointment at Lumen is confirmed for Aug 4', time: '5h ago', unread: true },
  { id: 3, title: 'Your Gold membership renews in 14 days', time: '3d ago', unread: false },
  { id: 4, title: 'Price drop on Vitamin C Brightening Serum', time: '6d ago', unread: false },
]

export const trendingSearches = ['Vitamin C serum', 'Hair colour', 'Bridal makeup', 'Hot stone massage', 'Gel nail polish']

// ---------------------------------------------------------------------------
// Beauty tips / blog
// ---------------------------------------------------------------------------
export const beautyTips = [
  { id: 'tip-1', title: 'How to layer skincare actives without irritation', excerpt: 'Vitamin C, retinol and niacinamide can all work together — if you sequence them correctly.', category: 'Skin Care', readTime: '4 min read', image: productImg(13) },
  { id: 'tip-2', title: 'The right way to section hair before colouring', excerpt: 'Even colour application starts with the right sectioning technique — here\u2019s the professional method.', category: 'Hair Color', readTime: '5 min read', image: productImg(12) },
  { id: 'tip-3', title: '5 signs your facial is actually working', excerpt: 'Not all glow is equal. Here\u2019s what a genuinely effective facial should feel like during and after.', category: 'Facial Kits', readTime: '3 min read', image: productImg(1) },
  { id: 'tip-4', title: 'Choosing a hair straightener that won\u2019t damage your hair', excerpt: 'Ceramic vs titanium vs tourmaline — what the plates are actually doing to your hair.', category: 'Professional Tools', readTime: '4 min read', image: productImg(16) },
  { id: 'tip-5', title: 'A realistic bridal beauty timeline', excerpt: 'From the six-month facial plan to day-of touch-ups — what to actually book, and when.', category: 'Makeup', readTime: '6 min read', image: productImg(4) },
  { id: 'tip-6', title: 'Why your massage therapist asks about pressure', excerpt: 'Deep tissue isn\u2019t always better. Here\u2019s how to communicate what your body actually needs.', category: 'Massage', readTime: '3 min read', image: productImg(9) },
]
