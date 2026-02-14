/**
 * ============================================================
 * BLISS BITES BAKERY — About Us Page
 * Next.js App Router | Tailwind CSS
 * ============================================================
 *
 * 📌 SEO SUGGESTIONS (add to layout.js or page-level metadata):
 *
 * export const metadata = {
 *   title: "About Us | Bliss Bites Bakery – Eggless Cakes in Kolkata",
 *   description:
 *     "Discover the story behind Bliss Bites Bakery — Kolkata's most loved
 *     destination for 100% eggless cakes, same-day delivery, custom birthday
 *     cakes, and premium designs starting under ₹1000. Freshly baked with love.",
 *   keywords: [
 *     "eggless cake in Kolkata",
 *     "same day cake delivery Kolkata",
 *     "custom cake order online",
 *     "affordable cakes under ₹1000",
 *     "birthday cake Kolkata",
 *     "eggless birthday cake",
 *     "custom cake Kolkata",
 *     "photo cake Kolkata",
 *     "anniversary cake Kolkata",
 *     "online cake order Kolkata",
 *   ],
 *   openGraph: {
 *     title: "About Bliss Bites Bakery | Eggless Cakes, Kolkata",
 *     description:
 *       "Crafting sweet moments in Kolkata since day one. 100% eggless,
 *       freshly baked, same-day delivered cakes for every occasion.",
 *     type: "website",
 *     locale: "en_IN",
 *     url: "https://www.blissbiteskakery.com/about",
 *     siteName: "Bliss Bites Bakery",
 *   },
 * };
 *
 * 📌 INTERNAL LINKING STRATEGY:
 *   /shop        → "Shop Cakes"
 *   /customize   → "Customize Cake"
 *   /contact     → "Contact Us"
 *   /orders      → "My Orders"
 *   /delivery    → "Delivery Areas"
 *
 * 📌 JSON-LD STRUCTURED DATA: Injected via <script> in page JSX below
 * ============================================================
 */

import Link from "next/link";
import Image from "next/image";

// ─── JSON-LD Structured Data ────────────────────────────────
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness", "FoodEstablishment"],
  name: "Bliss Bites Bakery",
  url: "https://www.blissbitesbakery.com",
  logo: "https://www.blissbitesbakery.com/logo.png",
  description:
    "Bliss Bites Bakery is Kolkata's premier destination for 100% eggless custom cakes — freshly baked, beautifully designed, and delivered same-day across Kolkata.",
  telephone: "+91-9123743680",
  email: "hello@blissbitesbakery.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kolkata",
    addressRegion: "West Bengal",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "22.5726",
    longitude: "88.3639",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "08:00",
    closes: "21:00",
  },
  servesCuisine: "Bakery, Cakes, Desserts",
  priceRange: "₹",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "1200",
    bestRating: "5",
  },
  sameAs: [
    "https://www.instagram.com/blissbitesbakery",
    "https://www.facebook.com/blissbitesbakery",
  ],
};

// ─── Feature Cards Data ─────────────────────────────────────
const features = [
  {
    icon: "🥚",
    title: "100% Eggless",
    desc: "Every single cake we bake is completely eggless — crafted for everyone to enjoy, without compromise on taste or texture.",
  },
  {
    icon: "🌅",
    title: "Freshly Baked Daily",
    desc: "No frozen or pre-made bases. Each cake is freshly prepared the morning of your order so you receive it at peak freshness.",
  },
  {
    icon: "🚀",
    title: "Same-Day Delivery",
    desc: "Order by noon and receive your cake the same day across Kolkata. Perfect for last-minute celebrations.",
  },
  {
    icon: "💰",
    title: "Affordable Luxury",
    desc: "Premium custom cakes starting under ₹1000. We believe everyone deserves a beautifully crafted cake for their special day.",
  },
  {
    icon: "🎨",
    title: "Custom Designs",
    desc: "From photo cakes to theme cakes, floral designs to sculpted tiers — we bring your exact vision to life.",
  },
  {
    icon: "✨",
    title: "Quality Ingredients",
    desc: "We use only food-grade, hygienically sourced ingredients. No artificial shortcuts. Just pure, wholesome goodness.",
  },
];

// ─── Delivery Areas ─────────────────────────────────────────
const deliveryAreas = [
  "Salt Lake",
  "New Town",
  "Dum Dum",
  "Gariahat",
  "Howrah",
  "Behala",
  "Tollygunge",
  "Park Street",
  "Ballygunge",
  "Shyambazar",
  "Alipore",
  "Jadavpur",
  "Garia",
  "Rajarhat",
  "Kasba",
  "Lake Town",
];

// ─── Testimonials ───────────────────────────────────────────
const testimonials = [
  {
    name: "Priya Chatterjee",
    location: "Salt Lake, Kolkata",
    rating: 5,
    text: "Ordered a custom photo cake for my daughter's 5th birthday and it was absolutely stunning. Delivered on time, tasted even better than it looked. Will order every year!",
    occasion: "Birthday Cake",
  },
  {
    name: "Rohit & Ananya Sen",
    location: "New Town, Kolkata",
    rating: 5,
    text: "Our 10th anniversary cake from Bliss Bites was the highlight of the evening. The rose design was exquisite and the vanilla bean flavour was divine. Thank you for making it perfect.",
    occasion: "Anniversary Cake",
  },
  {
    name: "Meghna Das",
    location: "Gariahat, Kolkata",
    rating: 5,
    text: "I needed a same-day cake for a surprise and they delivered in under 4 hours! Quality was top-notch and the packaging was beautiful. My go-to bakery in Kolkata now.",
    occasion: "Same-Day Order",
  },
];

// ─── Trust Badges ────────────────────────────────────────────
const trustBadges = [
  { icon: "🔒", title: "Secure Checkout", desc: "100% safe & encrypted" },
  { icon: "💵", title: "COD Available", desc: "Pay on delivery, no worries" },
  { icon: "📦", title: "Safe Packaging", desc: "Cake boxes built to protect" },
  { icon: "⏱️", title: "On-Time Delivery", desc: "Guaranteed delivery windows" },
];

// ════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ════════════════════════════════════════════════════════════
export default function AboutPage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <main
        className="bg-[#FFFBF8] text-[#2D1B0E] overflow-x-hidden"
        role="main"
      >
        {/* ══════════════════════════════════════════
            SECTION 1 — HERO
        ══════════════════════════════════════════ */}
        <section
          aria-label="Hero Section"
          className="relative min-h-[92vh] flex items-center justify-center overflow-hidden"
        >
          {/* Gradient Background */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-br from-[#FFF0EA] via-[#FDE8E8] to-[#F9D7E7]"
          />

          {/* Decorative Blobs */}
          <div
            aria-hidden="true"
            className="absolute top-[-80px] right-[-80px] w-[420px] h-[420px] rounded-full bg-[#F7A072]/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-[-60px] left-[-60px] w-[360px] h-[360px] rounded-full bg-[#E8577A]/15 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/4 w-[200px] h-[200px] rounded-full bg-[#F7A072]/10 blur-2xl"
          />

          {/* Content */}
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            {/* Eyebrow tag */}
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-[#F7A072]/40 text-[#C44569] text-sm font-semibold tracking-widest uppercase px-5 py-2 rounded-full mb-8 shadow-sm">
              <span>🎂</span>
              <span>Kolkata's Favourite Eggless Bakery</span>
            </div>

            {/* H1 — Only one on the entire page */}
            <h1 className="font-['Playfair_Display',Georgia,serif] text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1A0A05] leading-[1.1] tracking-tight mb-6">
              Crafting{" "}
              <span className="relative inline-block">
                <span className="text-[#E8577A]">Sweet Moments</span>
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-[#F7A072] to-[#E8577A] rounded-full"
                />
              </span>{" "}
              in Kolkata
            </h1>

            <p className="text-lg sm:text-xl text-[#5C3D2E]/80 max-w-2xl mx-auto leading-relaxed mb-10 font-['Lora',Georgia,serif]">
              Freshly baked, 100% eggless cakes delivered to your door — same
              day, across Kolkata. Custom designs, premium taste, and
              celebrations that begin with the very first bite.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-[#E8577A] to-[#C44569] text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-[#E8577A]/30 hover:shadow-xl hover:shadow-[#E8577A]/40 hover:-translate-y-0.5 transition-all duration-200 text-base"
                aria-label="Shop our cakes"
              >
                <span>🛍️</span>
                Shop Cakes
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>

              <Link
                href="/customize"
                className="group inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border-2 border-[#F7A072] text-[#C44569] font-bold px-8 py-4 rounded-2xl hover:bg-[#FFF0EA] hover:border-[#E8577A] hover:-translate-y-0.5 transition-all duration-200 text-base shadow-md"
                aria-label="Customize your cake"
              >
                <span>🎨</span>
                Customize Cake
              </Link>
            </div>

            {/* Social proof micro-bar */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-[#5C3D2E]/70">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-base">★★★★★</span>
                <span>
                  <strong className="text-[#1A0A05]">4.9/5</strong> from 1,200+
                  happy customers
                </span>
              </div>
              <span
                aria-hidden="true"
                className="hidden sm:block w-px h-5 bg-[#D4A090]/50"
              />
              <div className="flex items-center gap-2">
                <span>🚚</span>
                <span>Same-day delivery across Kolkata</span>
              </div>
              <span
                aria-hidden="true"
                className="hidden sm:block w-px h-5 bg-[#D4A090]/50"
              />
              <div className="flex items-center gap-2">
                <span>🥚</span>
                <span>100% Eggless, always</span>
              </div>
            </div>
          </div>

          {/* Bottom fade */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FFFBF8] to-transparent"
          />
        </section>

        {/* ══════════════════════════════════════════
            SECTION 2 — OUR STORY
        ══════════════════════════════════════════ */}
        <section
          aria-labelledby="our-story-heading"
          className="py-24 px-6"
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Image Side */}
              <div className="relative order-2 lg:order-1">
                <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-gradient-to-br from-[#FDE8E8] to-[#F9D7E7] shadow-2xl shadow-[#E8577A]/15">
                  <Image
                    src="/images/about-story.jpg"
                    alt="Bliss Bites Bakery — our bakers crafting fresh eggless cakes in Kolkata"
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A0A05]/30 to-transparent" />
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl px-6 py-4 border border-[#F7A072]/30">
                  <div className="text-3xl font-['Playfair_Display',Georgia,serif] font-bold text-[#E8577A]">
                    5+
                  </div>
                  <div className="text-xs text-[#5C3D2E]/70 font-medium mt-0.5">
                    Years of Baking Joy
                  </div>
                </div>

                {/* Second badge */}
                <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-xl px-5 py-4 border border-[#F7A072]/30">
                  <div className="text-2xl font-['Playfair_Display',Georgia,serif] font-bold text-[#F7A072]">
                    10K+
                  </div>
                  <div className="text-xs text-[#5C3D2E]/70 font-medium mt-0.5">
                    Cakes Delivered
                  </div>
                </div>
              </div>

              {/* Text Side */}
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 bg-[#FDE8E8] text-[#C44569] text-sm font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
                  <span>🎂</span> Our Story
                </div>

                <h2
                  id="our-story-heading"
                  className="font-['Playfair_Display',Georgia,serif] text-4xl lg:text-5xl font-bold text-[#1A0A05] leading-tight mb-6"
                >
                  Born from a Love of{" "}
                  <span className="text-[#E8577A]">Baking & Belonging</span>
                </h2>

                <div className="space-y-5 text-[#5C3D2E]/85 leading-relaxed font-['Lora',Georgia,serif] text-[1.05rem]">
                  <p>
                    Bliss Bites Bakery started not in a commercial kitchen, but
                    in a small home in South Kolkata — with a vintage oven, a
                    family recipe book, and the conviction that truly
                    exceptional cakes should be accessible to everyone.
                  </p>
                  <p>
                    We noticed that families across Kolkata were searching for
                    cakes that were completely eggless — whether for religious
                    reasons, dietary choices, or allergies — but without having
                    to compromise on the richness, softness, or beauty that
                    marks a truly special cake. So we made it our mission.
                  </p>
                  <p>
                    Every recipe was tested dozens of times. Every design was
                    refined until it felt right. And every cake that left our
                    kitchen was one we'd be proud to serve at our own table.
                    That standard hasn't changed — it's only grown stronger as
                    more Kolkata families have welcomed Bliss Bites into their
                    celebrations.
                  </p>
                  <p>
                    Today, we bake hundreds of cakes each month — from intimate
                    birthday celebrations in Gariahat to grand wedding tiers in
                    New Town — and each one carries the same love, attention,
                    and freshness that started us on this journey.
                  </p>
                </div>

                <div className="mt-10 pt-8 border-t border-[#F7A072]/30 flex gap-10">
                  <div>
                    <div className="font-['Playfair_Display',Georgia,serif] text-3xl font-bold text-[#E8577A]">
                      1,200+
                    </div>
                    <div className="text-sm text-[#5C3D2E]/60 mt-1">
                      5-Star Reviews
                    </div>
                  </div>
                  <div>
                    <div className="font-['Playfair_Display',Georgia,serif] text-3xl font-bold text-[#E8577A]">
                      ₹499
                    </div>
                    <div className="text-sm text-[#5C3D2E]/60 mt-1">
                      Starting Price
                    </div>
                  </div>
                  <div>
                    <div className="font-['Playfair_Display',Georgia,serif] text-3xl font-bold text-[#E8577A]">
                      0%
                    </div>
                    <div className="text-sm text-[#5C3D2E]/60 mt-1">
                      Egg Content
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 3 — WHAT MAKES US SPECIAL
        ══════════════════════════════════════════ */}
        <section
          aria-labelledby="features-heading"
          className="py-24 px-6 bg-gradient-to-b from-[#FFF5F0] to-[#FFFBF8]"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-[#FDE8E8] text-[#C44569] text-sm font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
                <span>🌸</span> Why Choose Us
              </div>
              <h2
                id="features-heading"
                className="font-['Playfair_Display',Georgia,serif] text-4xl lg:text-5xl font-bold text-[#1A0A05] mb-4"
              >
                What Makes Bliss Bites{" "}
                <span className="text-[#E8577A]">Different</span>
              </h2>
              <p className="text-[#5C3D2E]/70 max-w-xl mx-auto font-['Lora',Georgia,serif] text-lg">
                Six commitments we make to every customer — and have kept since
                the very first cake we baked.
              </p>
            </div>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              role="list"
            >
              {features.map((feature, idx) => (
                <article
                  key={idx}
                  role="listitem"
                  className="group relative bg-white/80 backdrop-blur-sm border border-[#F7A072]/20 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-[#F7A072]/15 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  {/* Hover glow */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-br from-[#FDE8E8]/0 to-[#FDE8E8]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
                  />

                  <div className="relative">
                    <div className="text-4xl mb-5" aria-hidden="true">
                      {feature.icon}
                    </div>
                    <h3 className="font-['Playfair_Display',Georgia,serif] text-xl font-bold text-[#1A0A05] mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-[#5C3D2E]/70 leading-relaxed text-[0.95rem]">
                      {feature.desc}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 4 — DELIVERY COVERAGE
        ══════════════════════════════════════════ */}
        <section
          aria-labelledby="delivery-heading"
          className="py-24 px-6"
        >
          <div className="max-w-6xl mx-auto">
            <div className="relative bg-gradient-to-br from-[#E8577A] to-[#C44569] rounded-[2.5rem] overflow-hidden p-12 lg:p-16 text-white">
              {/* Decorative circles */}
              <div
                aria-hidden="true"
                className="absolute top-[-60px] right-[-60px] w-80 h-80 rounded-full bg-white/10"
              />
              <div
                aria-hidden="true"
                className="absolute bottom-[-80px] left-[-40px] w-64 h-64 rounded-full bg-white/5"
              />

              <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white/90 text-sm font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
                    <span>🚚</span> Same-Day Delivery
                  </div>
                  <h2
                    id="delivery-heading"
                    className="font-['Playfair_Display',Georgia,serif] text-4xl font-bold leading-tight mb-5"
                  >
                    We Deliver Happiness Across Kolkata
                  </h2>
                  <p className="text-white/80 leading-relaxed text-lg font-['Lora',Georgia,serif] mb-6">
                    Order by <strong className="text-white">12:00 noon</strong>{" "}
                    and your cake arrives the same day. We cover major
                    neighbourhoods across Kolkata with careful, temperature-safe
                    packaging so your cake arrives looking exactly as it left
                    our kitchen.
                  </p>
                  <p className="text-white/80 leading-relaxed text-sm mb-8">
                    Live outside our standard zone? Contact us on WhatsApp — we
                    accommodate most requests with advance notice.
                  </p>
                  <Link
                    href="/delivery"
                    className="inline-flex items-center gap-2 bg-white text-[#C44569] font-bold px-7 py-3.5 rounded-2xl hover:bg-[#FFF0EA] transition-colors duration-200 shadow-lg"
                    aria-label="Check delivery areas in detail"
                  >
                    Check Your Area
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>

                <div>
                  <h3 className="font-['Playfair_Display',Georgia,serif] text-2xl font-bold mb-6 text-white/95">
                    We Currently Deliver To
                  </h3>
                  <div
                    className="flex flex-wrap gap-2.5"
                    role="list"
                    aria-label="Delivery areas in Kolkata"
                  >
                    {deliveryAreas.map((area) => (
                      <span
                        key={area}
                        role="listitem"
                        className="bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium px-4 py-1.5 rounded-full hover:bg-white/30 transition-colors cursor-default"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                  <p className="text-white/60 text-xs mt-5">
                    * And many more areas. Delivery slots may vary by distance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 5 — CUSTOMER LOVE
        ══════════════════════════════════════════ */}
        <section
          aria-labelledby="testimonials-heading"
          className="py-24 px-6 bg-[#FFF5F0]"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-[#FDE8E8] text-[#C44569] text-sm font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
                <span>⭐</span> Customer Love
              </div>
              <h2
                id="testimonials-heading"
                className="font-['Playfair_Display',Georgia,serif] text-4xl lg:text-5xl font-bold text-[#1A0A05] mb-4"
              >
                1,200+ Families Trust Bliss Bites
              </h2>
              <div className="flex items-center justify-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-7 h-7 text-[#F7A072]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-[#5C3D2E]/70 font-['Lora',Georgia,serif] text-lg">
                Rated <strong className="text-[#1A0A05]">4.9 out of 5</strong>{" "}
                — because happy customers are the only metric that matters.
              </p>
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              role="list"
            >
              {testimonials.map((t, idx) => (
                <blockquote
                  key={idx}
                  role="listitem"
                  className="group bg-white rounded-3xl p-8 shadow-sm border border-[#F7A072]/20 hover:shadow-lg hover:shadow-[#F7A072]/10 hover:-translate-y-0.5 transition-all duration-300"
                >
                  {/* Rating stars */}
                  <div className="flex gap-0.5 mb-4" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-[#F7A072]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-[#5C3D2E]/80 leading-relaxed font-['Lora',Georgia,serif] text-[0.95rem] mb-6">
                    &ldquo;{t.text}&rdquo;
                  </p>

                  {/* Author */}
                  <footer className="flex items-center gap-3 pt-5 border-t border-[#F7A072]/20">
                    <div
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F7A072] to-[#E8577A] flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      aria-hidden="true"
                    >
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-[#1A0A05] text-sm">
                        {t.name}
                      </div>
                      <div className="text-[#5C3D2E]/50 text-xs">
                        {t.location}
                      </div>
                    </div>
                    <span className="ml-auto bg-[#FDE8E8] text-[#C44569] text-xs font-medium px-3 py-1 rounded-full">
                      {t.occasion}
                    </span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 6 — BEHIND THE SCENES
        ══════════════════════════════════════════ */}
        <section
          aria-labelledby="bts-heading"
          className="py-24 px-6"
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Text Side */}
              <div>
                <div className="inline-flex items-center gap-2 bg-[#FDE8E8] text-[#C44569] text-sm font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
                  <span>🎨</span> Behind The Scenes
                </div>
                <h2
                  id="bts-heading"
                  className="font-['Playfair_Display',Georgia,serif] text-4xl lg:text-5xl font-bold text-[#1A0A05] leading-tight mb-6"
                >
                  Every Cake is a{" "}
                  <span className="text-[#E8577A]">Work of Art</span>
                </h2>

                <div className="space-y-6 text-[#5C3D2E]/80 leading-relaxed font-['Lora',Georgia,serif]">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-[#FDE8E8] flex items-center justify-center text-lg">
                      🌾
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A0A05] mb-1 font-sans">
                        Premium Sourced Ingredients
                      </h3>
                      <p className="text-sm">
                        We use high-quality flour, natural fruit purées, fresh
                        dairy, and preservative-free flavour extracts — sourced
                        from trusted suppliers every single week.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-[#FDE8E8] flex items-center justify-center text-lg">
                      🧼
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A0A05] mb-1 font-sans">
                        FSSAI-Compliant Kitchen
                      </h3>
                      <p className="text-sm">
                        Our baking space is cleaned and sanitised before every
                        production run. All our bakers follow strict hygiene
                        protocols — gloves, hair nets, food-safe aprons.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-[#FDE8E8] flex items-center justify-center text-lg">
                      ⏰
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A0A05] mb-1 font-sans">
                        Baked Fresh Every Morning
                      </h3>
                      <p className="text-sm">
                        We begin baking at 6 AM daily. No pre-baked bases, no
                        frozen layers. When your cake arrives, it's at its
                        absolute freshest.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-[#FDE8E8] flex items-center justify-center text-lg">
                      🎁
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A0A05] mb-1 font-sans">
                        Thoughtful Packaging
                      </h3>
                      <p className="text-sm">
                        Each cake is packed in a structurally reinforced box
                        with inserts to prevent sliding, topped with a ribbon
                        and a personalised message card.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Grid Side */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative rounded-2xl overflow-hidden aspect-square bg-gradient-to-br from-[#FDE8E8] to-[#F9D7E7] shadow-lg">
                  <Image
                    src="/images/baking-process-1.jpg"
                    alt="Baker decorating a custom eggless cake at Bliss Bites Bakery Kolkata"
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="relative rounded-2xl overflow-hidden aspect-square bg-gradient-to-br from-[#F9D7E7] to-[#FDE8E8] shadow-lg mt-8">
                  <Image
                    src="/images/baking-process-2.jpg"
                    alt="Fresh eggless cake layers cooling in Bliss Bites Bakery"
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="relative rounded-2xl overflow-hidden aspect-square bg-gradient-to-br from-[#F7D4C0] to-[#FDE8E8] shadow-lg -mt-8">
                  <Image
                    src="/images/baking-process-3.jpg"
                    alt="Hygienic packaging of custom birthday cakes for delivery in Kolkata"
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="relative rounded-2xl overflow-hidden aspect-square bg-gradient-to-br from-[#FDE8E8] to-[#F7D4C0] shadow-lg">
                  <Image
                    src="/images/baking-process-4.jpg"
                    alt="Finished custom photo cake ready for same-day delivery in Kolkata"
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 7 — TRUST & ASSURANCE
        ══════════════════════════════════════════ */}
        <section
          aria-labelledby="trust-heading"
          className="py-20 px-6 bg-[#FFF5F0]"
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2
                id="trust-heading"
                className="font-['Playfair_Display',Georgia,serif] text-4xl font-bold text-[#1A0A05] mb-3"
              >
                Order with <span className="text-[#E8577A]">Complete Confidence</span>
              </h2>
              <p className="text-[#5C3D2E]/70 font-['Lora',Georgia,serif]">
                Your trust means everything to us. Here's what we guarantee
                with every order.
              </p>
            </div>

            <div
              className="grid grid-cols-2 lg:grid-cols-4 gap-5"
              role="list"
            >
              {trustBadges.map((badge, idx) => (
                <div
                  key={idx}
                  role="listitem"
                  className="bg-white rounded-3xl p-6 text-center shadow-sm border border-[#F7A072]/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="text-3xl mb-3" aria-hidden="true">
                    {badge.icon}
                  </div>
                  <h3 className="font-bold text-[#1A0A05] text-sm mb-1">
                    {badge.title}
                  </h3>
                  <p className="text-[#5C3D2E]/60 text-xs">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 8 — CALL TO ACTION
        ══════════════════════════════════════════ */}
        <section
          aria-labelledby="cta-heading"
          className="py-24 px-6"
        >
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gradient-to-br from-[#FFFBF8] to-[#FFF0EA] border border-[#F7A072]/30 rounded-[3rem] overflow-hidden p-12 lg:p-16 text-center shadow-2xl shadow-[#F7A072]/10">
              {/* Decorative blobs */}
              <div
                aria-hidden="true"
                className="absolute top-[-40px] right-[-40px] w-52 h-52 rounded-full bg-[#F7A072]/15 blur-2xl"
              />
              <div
                aria-hidden="true"
                className="absolute bottom-[-40px] left-[-40px] w-44 h-44 rounded-full bg-[#E8577A]/10 blur-2xl"
              />

              <div className="relative z-10">
                <div className="text-5xl mb-6" aria-hidden="true">
                  🎂
                </div>
                <h2
                  id="cta-heading"
                  className="font-['Playfair_Display',Georgia,serif] text-4xl lg:text-5xl font-bold text-[#1A0A05] leading-tight mb-5"
                >
                  Your Next Celebration{" "}
                  <span className="text-[#E8577A]">Deserves the Best</span>
                </h2>
                <p className="text-[#5C3D2E]/75 font-['Lora',Georgia,serif] text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                  Whether it's a birthday, anniversary, wedding, or just a
                  Tuesday that calls for cake — Bliss Bites is here. Order
                  online in minutes, get same-day delivery in Kolkata, and make
                  someone's day unforgettable.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                  <Link
                    href="/shop"
                    className="group inline-flex items-center gap-2 bg-gradient-to-r from-[#E8577A] to-[#C44569] text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-[#E8577A]/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                    aria-label="Order a cake online from Bliss Bites Bakery"
                  >
                    <span>🍰</span>
                    Order a Cake Now
                  </Link>
                  <Link
                    href="/customize"
                    className="group inline-flex items-center gap-2 bg-white border-2 border-[#F7A072] text-[#C44569] font-bold px-8 py-4 rounded-2xl hover:bg-[#FFF0EA] hover:-translate-y-0.5 transition-all duration-200 shadow-md"
                    aria-label="Customize your own cake design"
                  >
                    <span>🎨</span>
                    Customize Your Design
                  </Link>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-[#5C3D2E]/60">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 hover:text-[#E8577A] transition-colors"
                    aria-label="Contact us for bulk cake orders"
                  >
                    <span>📞</span>
                    Bulk Orders? Contact Us
                  </Link>
                  <span aria-hidden="true" className="hidden sm:block">•</span>
                  <a
                    href="https://wa.me/919123743680"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-[#E8577A] transition-colors"
                    aria-label="Chat with us on WhatsApp for cake orders"
                  >
                    <span>💬</span>
                    WhatsApp Support
                  </a>
                  <span aria-hidden="true" className="hidden sm:block">•</span>
                  <Link
                    href="/orders"
                    className="inline-flex items-center gap-1.5 hover:text-[#E8577A] transition-colors"
                    aria-label="Track your cake order"
                  >
                    <span>📦</span>
                    Track My Order
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}