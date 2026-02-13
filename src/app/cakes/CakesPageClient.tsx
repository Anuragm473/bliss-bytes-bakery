"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo, useEffect, useRef } from "react";

// ─── Static metadata export (Server-side) ────────────────────────────────────
// NOTE: Because we added client-side filtering via "use client",
// move metadata to a parent layout or a separate generateMetadata export.
// Paste the block below into your layout.tsx or a separate page wrapper.
//

// ─── Structured data helpers ──────────────────────────────────────────────────
const BreadcrumbSchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://blissbitesbackery.in" },
          { "@type": "ListItem", position: 2, name: "Cakes", item: "https://blissbitesbackery.in/cakes" },
        ],
      }),
    }}
  />
);

const ItemListSchema = ({ products }: { products: any[] }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Eggless Cakes in Kolkata",
        itemListElement: products.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `https://blissbitesbackery.in/product/${p.slug}`,
          name: p.title,
        })),
      }),
    }}
  />
);

// ─── Trust strip items ────────────────────────────────────────────────────────
const TRUST = [
  { icon: "🥚", label: "100% Eggless", sub: "Always & forever" },
  { icon: "🚀", label: "Same-Day Delivery", sub: "Order before 4 PM" },
  { icon: "🍰", label: "Freshly Baked", sub: "Made to order" },
  { icon: "🔒", label: "Secure Checkout", sub: "100% safe payments" },
];

// ─── FAQ data ─────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Do you offer same-day cake delivery in Kolkata?",
    a: "Yes! Place your order before 4:00 PM and we'll deliver your cake the same day. We cover Salt Lake, New Town, Dumdum, Gariahat, and many more areas.",
  },
  {
    q: "Are all your cakes 100% eggless?",
    a: "Absolutely. Every single cake at Bliss Bites Bakery is crafted without eggs — perfect for vegetarians and those with egg allergies.",
  },
  {
    q: "What is the minimum price for a cake?",
    a: "Our cakes start at just ₹500 and go up to ₹1000, making premium eggless cakes affordable for everyone in Kolkata.",
  },
  {
    q: "Can I order a custom photo cake in Kolkata?",
    a: "Yes! Our photo cakes are printed with food-safe edible ink. Upload your photo at checkout and we'll bake your memories into a cake.",
  },
  {
    q: "Which areas do you deliver to in Kolkata?",
    a: "We deliver across Kolkata including Salt Lake, New Town, Dumdum, Gariahat, Park Street, Ballygunge, and more. Enter your pincode at checkout to confirm.",
  },
];

// ─── Categories ───────────────────────────────────────────────────────────────
const CATEGORIES = ["All", "Birthday", "Photo", "Anniversary", "Kids", "Wedding"];

// ─── Types ────────────────────────────────────────────────────────────────────
type Product = {
  id: string;
  title: string;
  slug: string;
  category: string;
  flavors?: string[];
  images?: string[];
  sizes: Record<string, number>;
  createdAt?: string | Date;
};

// ─────────────────────────────────────────────────────────────────────────────
// CLIENT PAGE COMPONENT
// NOTE: Wrap this in a Server Component that fetches `products` and passes
// them as props, then export the server component as the default page export.
// ─────────────────────────────────────────────────────────────────────────────
export default function CakesPageClient({ products }: { products: any[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let list = [...products];

    if (activeCategory !== "All") {
      list = list.filter(
        (p) => p.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }

    list = list.filter((p:any) => {
      const sizeValues = Object.values(p.sizes as Record<string, number>);
const min = Math.min(...sizeValues);
      return min <= maxPrice;
    });

    if (sortBy === "low-high") {
      list.sort((a: any, b: any) => {
  const aSizes = Object.values(a.sizes as Record<string, number>).map(Number);
  const bSizes = Object.values(b.sizes as Record<string, number>).map(Number);

  const aMin = aSizes.length ? Math.min(...aSizes) : 0;
  const bMin = bSizes.length ? Math.min(...bSizes) : 0;

  return aMin - bMin;
});
    } else if (sortBy === "newest") {
      list.sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime()
      );
    }

    return list;
  }, [products, activeCategory, sortBy, maxPrice, search]);

  return (
    <>
      {/* ── Structured Data ── */}
      <BreadcrumbSchema />
      <ItemListSchema products={filtered} />

      <div
        className="min-h-screen font-sans"
        style={{ fontFamily: "'Poppins', sans-serif", background: "#FFFBF8" }}
      >
        {/* ══════════════════════════════════════════════════
            HERO SECTION
        ══════════════════════════════════════════════════ */}
        <section
          ref={heroRef}
          className="relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #FFF0F3 0%, #FFE4E8 40%, #FADADD 70%, #FCEABB 100%)",
            paddingTop: "clamp(48px, 8vw, 96px)",
            paddingBottom: "clamp(40px, 6vw, 80px)",
          }}
        >
          {/* Decorative blobs */}
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-30 pointer-events-none"
            style={{
              background: "radial-gradient(circle, #FADADD 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-0 -left-16 w-64 h-64 rounded-full opacity-20 pointer-events-none"
            style={{
              background: "radial-gradient(circle, #FFD6A5 0%, transparent 70%)",
            }}
          />

          {/* Breadcrumb */}
          <nav
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-sm"
            aria-label="Breadcrumb"
            style={{ color: "#C06C84" }}
          >
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-semibold" style={{ color: "#A0395A" }}>
                Cakes
              </li>
            </ol>
          </nav>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Badge */}
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5 tracking-wide"
              style={{ background: "#FADADD", color: "#A0395A" }}
            >
              🎂 Bliss Bites Bakery — Kolkata's #1 Eggless Bakery
            </span>

            <h1
              className="font-extrabold leading-tight"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                color: "#3D1A2C",
                maxWidth: "780px",
                lineHeight: 1.15,
              }}
            >
              Eggless Cakes in{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #E8577A, #F7A072)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Kolkata
              </span>
            </h1>

            <p
              className="mt-5 leading-relaxed max-w-2xl"
              style={{ color: "#6B3048", fontSize: "clamp(0.95rem, 2vw, 1.1rem)" }}
            >
              Discover our handcrafted collection of{" "}
              <strong>100% eggless cakes</strong> — perfect for every occasion.
              We offer <strong>same-day cake delivery</strong> across{" "}
              <Link href="/cakes?area=salt-lake" className="underline underline-offset-2 hover:text-pink-700">
                Salt Lake
              </Link>
              ,{" "}
              <Link href="/cakes?area=new-town" className="underline underline-offset-2 hover:text-pink-700">
                New Town
              </Link>
              ,{" "}
              <Link href="/cakes?area=dumdum" className="underline underline-offset-2 hover:text-pink-700">
                Dumdum
              </Link>{" "}
              &{" "}
              <Link href="/cakes?area=gariahat" className="underline underline-offset-2 hover:text-pink-700">
                Gariahat
              </Link>
              . All{" "}
              <strong>cakes under ₹1000</strong> — freshly baked and delivered
              to your doorstep with love.
            </p>

            {/* Hero CTA stats */}
            <div className="mt-8 flex flex-wrap gap-6">
              {[
                { value: "500+", label: "Happy Customers" },
                { value: "₹500", label: "Cakes Starting" },
                { value: "4 PM", label: "Order Cutoff" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div
                    className="text-2xl font-extrabold"
                    style={{ color: "#E8577A" }}
                  >
                    {s.value}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "#9B4060" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            TRUST STRIP
        ══════════════════════════════════════════════════ */}
        <section
          className="border-y"
          style={{ borderColor: "#FADADD", background: "#FFF5F7" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {TRUST.map((t) => (
                <div
                  key={t.label}
                  className="flex items-center gap-3 py-2 px-3 rounded-2xl"
                  style={{ background: "#FDE2E4" }}
                >
                  <span className="text-2xl">{t.icon}</span>
                  <div>
                    <div
                      className="text-xs font-bold"
                      style={{ color: "#A0395A" }}
                    >
                      {t.label}
                    </div>
                    <div className="text-xs" style={{ color: "#C06C84" }}>
                      {t.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            FILTER BAR
        ══════════════════════════════════════════════════ */}
        <section
          className="sticky top-0 z-30 shadow-sm"
          style={{
            background: "rgba(255,251,248,0.95)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid #FADADD",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* Category pills */}
            <div className="flex flex-wrap gap-2 mb-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200"
                  style={
                    activeCategory === cat
                      ? {
                          background: "linear-gradient(90deg,#E8577A,#F7A072)",
                          color: "#fff",
                          boxShadow: "0 2px 12px rgba(232,87,122,0.35)",
                          transform: "translateY(-1px)",
                        }
                      : {
                          background: "#FDE2E4",
                          color: "#A0395A",
                        }
                  }
                >
                  {cat === "All" ? "All Cakes" : `${cat} Cakes`}
                </button>
              ))}
            </div>

            {/* Search + Sort + Price row */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none">
                  🔍
                </span>
                <input
                  type="search"
                  placeholder="Search cakes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none border focus:ring-2"
                  style={{
                    borderColor: "#FADADD",
                    background: "#FFF5F7",
                    color: "#3D1A2C",
                  }}
                />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-xl text-sm font-medium border outline-none cursor-pointer"
                style={{
                  borderColor: "#FADADD",
                  background: "#FFF5F7",
                  color: "#6B3048",
                }}
              >
                <option value="default">Sort: Featured</option>
                <option value="low-high">Price: Low to High</option>
                <option value="newest">Newest First</option>
              </select>

              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold whitespace-nowrap" style={{ color: "#A0395A" }}>
                  Max ₹{maxPrice}
                </span>
                <input
                  type="range"
                  min={500}
                  max={1000}
                  step={50}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-28 accent-pink-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            PRODUCT GRID
        ══════════════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Result count */}
          <p className="mb-6 text-sm font-medium" style={{ color: "#9B4060" }}>
            Showing{" "}
            <span className="font-bold" style={{ color: "#E8577A" }}>
              {filtered.length}
            </span>{" "}
            {activeCategory !== "All" ? activeCategory.toLowerCase() : ""} cakes
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🎂</p>
              <p className="font-semibold text-lg" style={{ color: "#A0395A" }}>
                No cakes found
              </p>
              <p className="text-sm mt-1" style={{ color: "#C06C84" }}>
                Try adjusting your filters or search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product) => {
                const sizes = product.sizes as Record<string, number>;
                const startingPrice = Math.min(...Object.values(sizes));
                const imgSrc =
                  product.images?.[0] ?? "/placeholder-cake.jpg";
                const firstFlavors = product.flavors?.slice(0, 2) ?? [];

                return (
                  <article
                    key={product.id}
                    className="group relative rounded-3xl overflow-hidden flex flex-col"
                    style={{
                      background:
                        "linear-gradient(145deg, #FFFFFF 0%, #FFF5F7 100%)",
                      boxShadow: "0 2px 16px rgba(200,80,110,0.08)",
                      transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform =
                        "translateY(-6px)";
                      (e.currentTarget as HTMLElement).style.boxShadow =
                        "0 12px 40px rgba(200,80,110,0.18)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform =
                        "translateY(0)";
                      (e.currentTarget as HTMLElement).style.boxShadow =
                        "0 2px 16px rgba(200,80,110,0.08)";
                    }}
                  >
                    {/* Image */}
                    <div
                      className="relative overflow-hidden"
                      style={{ aspectRatio: "4/3", background: "#FDE2E4" }}
                    >
                      <Image
                        src={imgSrc}
                        alt={`${product.title} - Eggless Cake Kolkata`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      {/* Category badge */}
                      {product.category && (
                        <span
                          className="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full capitalize"
                          style={{
                            background: "rgba(255,255,255,0.92)",
                            color: "#E8577A",
                            backdropFilter: "blur(4px)",
                          }}
                        >
                          {product.category}
                        </span>
                      )}
                    </div>

                    {/* Card body */}
                    <div className="p-5 flex flex-col flex-1">
                      <h2
                        className="font-bold text-base leading-snug"
                        style={{ color: "#3D1A2C" }}
                      >
                        {product.title}
                      </h2>

                      {/* Flavors */}
                      {firstFlavors.length > 0 && (
                        <p
                          className="mt-1 text-xs"
                          style={{ color: "#C06C84" }}
                        >
                          {firstFlavors.join(" · ")}
                        </p>
                      )}

                      {/* Price */}
                      <div className="mt-3 flex items-baseline gap-1">
                        <span
                          className="text-lg font-extrabold"
                          style={{ color: "#E8577A" }}
                        >
                          ₹{startingPrice}
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: "#C06C84" }}
                        >
                          onwards
                        </span>
                      </div>

                      {/* Spacer */}
                      <div className="flex-1" />

                      {/* CTA */}
                      <Link
                        href={`/product/${product.slug}`}
                        className="mt-4 block text-center font-bold text-sm py-3 rounded-2xl transition-all duration-200"
                        style={{
                          background:
                            "linear-gradient(90deg, #E8577A 0%, #F7A072 100%)",
                          color: "#fff",
                          boxShadow: "0 4px 14px rgba(232,87,122,0.3)",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.boxShadow =
                            "0 6px 20px rgba(232,87,122,0.45)";
                          (e.currentTarget as HTMLElement).style.transform =
                            "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.boxShadow =
                            "0 4px 14px rgba(232,87,122,0.3)";
                          (e.currentTarget as HTMLElement).style.transform =
                            "translateY(0)";
                        }}
                      >
                        View Details →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════════════
            LOCAL SEO CONTENT SECTION
        ══════════════════════════════════════════════════ */}
        <section
          className="py-16"
          style={{ background: "linear-gradient(180deg, #FFF5F7 0%, #FFFBF8 100%)" }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl font-extrabold mb-6"
              style={{ color: "#3D1A2C" }}
            >
              Eggless Cake Delivery in Kolkata — Why Bliss Bites?
            </h2>

            <div
              className="space-y-5 leading-relaxed"
              style={{ color: "#6B3048", fontSize: "0.95rem" }}
            >
              <p>
                At <strong>Bliss Bites Bakery</strong>, we specialise in{" "}
                <strong>eggless cake delivery in Kolkata</strong> — serving
                happiness to homes across Salt Lake, New Town, Dumdum, Gariahat,
                Park Street, and Ballygunge. Every cake is crafted fresh without
                eggs, making them ideal for vegetarians, Jains, and anyone who
                loves a guilt-free indulgence.
              </p>

              <p>
                Planning a surprise? Our{" "}
                <strong>birthday cake delivery in Kolkata</strong> gets your
                order to the door in hours. From classic chocolate truffle to
                exotic mango cream, all our cakes are priced{" "}
                <strong>under ₹1000</strong> — premium quality without the
                premium price tag. Order before 4 PM for guaranteed same-day
                delivery.
              </p>

              <p>
                Looking for something extra personal? Our{" "}
                <Link
                  href="/cakes/category/photo"
                  className="font-semibold underline underline-offset-2"
                  style={{ color: "#E8577A" }}
                >
                  custom photo cake in Kolkata
                </Link>{" "}
                lets you print any photo with food-safe edible ink — perfect for
                birthdays, anniversaries, and graduations. Explore our{" "}
                <Link
                  href="/cakes/category/anniversary"
                  className="font-semibold underline underline-offset-2"
                  style={{ color: "#E8577A" }}
                >
                  anniversary cakes
                </Link>
                ,{" "}
                <Link
                  href="/cakes/category/kids"
                  className="font-semibold underline underline-offset-2"
                  style={{ color: "#E8577A" }}
                >
                  kids' cakes
                </Link>
                , and{" "}
                <Link
                  href="/cakes/category/wedding"
                  className="font-semibold underline underline-offset-2"
                  style={{ color: "#E8577A" }}
                >
                  wedding cakes
                </Link>{" "}
                — all 100% eggless.
              </p>
            </div>

            {/* Category quick links */}
            <div className="mt-10">
              <h3
                className="text-sm font-bold uppercase tracking-wider mb-4"
                style={{ color: "#A0395A" }}
              >
                Browse By Category
              </h3>
              <div className="flex flex-wrap gap-3">
                {["Birthday", "Photo", "Anniversary", "Kids", "Wedding"].map(
                  (cat) => (
                    <Link
                      key={cat}
                      href={`/cakes/category/${cat.toLowerCase()}`}
                      className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
                      style={{
                        background: "#FDE2E4",
                        color: "#A0395A",
                        border: "1px solid #FADADD",
                      }}
                    >
                      {cat} Cakes →
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            FAQ SECTION
        ══════════════════════════════════════════════════ */}
        <section className="py-16" style={{ background: "#FFFBF8" }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl font-extrabold mb-2 text-center"
              style={{ color: "#3D1A2C" }}
            >
              Frequently Asked Questions
            </h2>
            <p
              className="text-center text-sm mb-8"
              style={{ color: "#C06C84" }}
            >
              Everything you need to know about ordering from Bliss Bites Bakery
            </p>

            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    border: "1px solid #FADADD",
                    background: openFaq === i ? "#FFF5F7" : "#FFFBF8",
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex justify-between items-center px-5 py-4 text-left"
                  >
                    <span
                      className="font-semibold text-sm pr-4"
                      style={{ color: "#3D1A2C" }}
                    >
                      {faq.q}
                    </span>
                    <span
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold transition-transform"
                      style={{
                        background:
                          "linear-gradient(90deg, #E8577A, #F7A072)",
                        transform: openFaq === i ? "rotate(45deg)" : "none",
                      }}
                    >
                      +
                    </span>
                  </button>
                  {openFaq === i && (
                    <div
                      className="px-5 pb-4 text-sm leading-relaxed"
                      style={{ color: "#6B3048" }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            MOBILE STICKY BOTTOM BAR
        ══════════════════════════════════════════════════ */}
        <div
          className="sm:hidden fixed bottom-0 left-0 right-0 z-50 px-4 py-3 flex items-center gap-3"
          style={{
            background: "rgba(255,251,248,0.97)",
            backdropFilter: "blur(12px)",
            borderTop: "1px solid #FADADD",
            boxShadow: "0 -4px 20px rgba(200,80,110,0.1)",
          }}
        >
          <span
            className="text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: "#FDE2E4", color: "#A0395A" }}
          >
            ⏰ Order before 4 PM
          </span>
          <Link
            href="/cakes/category/birthday"
            className="flex-1 text-center text-sm font-bold py-2.5 rounded-2xl"
            style={{
              background: "linear-gradient(90deg, #E8577A, #F7A072)",
              color: "#fff",
            }}
          >
            Order Now →
          </Link>
        </div>

        {/* Bottom padding for sticky bar */}
        <div className="sm:hidden h-20" />
      </div>
    </>
  );
}
