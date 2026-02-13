// app/page.tsx  (or pages/index.tsx)
// Replace mock data with your real getFeaturedProducts() call

import Link from "next/link";
import Image from "next/image"; // ← separate component
import { getFeaturedProducts } from "@/src/lib/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Same-Day Eggless Cake Delivery in Kolkata | Bliss bites Bakery",
  description: "Order premium eggless custom cakes under ₹1000 in Kolkata. Same-day delivery in Salt Lake, New Town, Dumdum & more.",
};

const CATEGORIES = [
  {
    name: "Birthday Cakes",
    href: "/birthday-cakes",
    emoji: "🎂",
    desc: "Make every birthday magical",
  },
  {
    name: "Photo Cakes",
    href: "/photo-cakes",
    emoji: "📸",
    desc: "Your memories, beautifully frosted",
  },
  {
    name: "Anniversary Cakes",
    href: "/anniversary-cakes",
    emoji: "💝",
    desc: "Celebrate your love story",
  },
  {
    name: "Under ₹1000",
    href: "/budget-cakes",
    emoji: "✨",
    desc: "Premium taste, gentle price",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya S.",
    area: "Salt Lake",
    stars: 5,
    text: "Absolutely stunning cake for my daughter's birthday! Delivered on time and tasted heavenly. Best eggless cake in Kolkata!",
  },
  {
    name: "Rahul M.",
    area: "New Town",
    stars: 5,
    text: "Ordered a photo cake for our anniversary — the quality was exceptional. Will definitely order again from Bliss bites!",
  },
  {
    name: "Ananya B.",
    area: "Gariahat",
    stars: 5,
    text: "Under ₹1000 and it looked like a luxury patisserie cake. My guests couldn't believe it was completely eggless!",
  },
];

const FAQS = [
  {
    q: "Do you offer same-day delivery in Kolkata?",
    a: "Yes! Order before 4:00 PM for same-day delivery across Salt Lake, New Town, Dumdum, Gariahat, and nearby areas.",
  },
  {
    q: "Are all your cakes 100% eggless?",
    a: "Absolutely. Every single cake at Bliss bites Bakery is freshly baked without eggs — perfect for vegetarians and those with egg allergies.",
  },
  {
    q: "Which areas do you deliver to?",
    a: "We deliver across Kolkata including Salt Lake, New Town, Rajarhat, Dumdum, Gariahat, Ballygunge, Howrah, and surrounding localities.",
  },
  {
    q: "Can I fully customize my cake?",
    a: "Yes! Choose your size (500g–3kg), flavor, design, message, and even upload a photo. Use our Customize Cake page for a fully personalized experience.",
  },
  {
    q: "What is your price range?",
    a: "Our cakes start at ₹499 and most premium designs are under ₹1000. We believe luxury shouldn't cost a fortune.",
  },
];

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-[#f4a261] text-sm">
          ★
        </span>
      ))}
    </div>
  );
}

type Product = {
  id: string;
  slug: string;
  title: string;
  category: string;
  flavors: string[];
  sizes: Record<string, number>;
  images: string[];
};

function ProductCard({ product,index }: { product: Product,index:number }) {
  const startingPrice = Math.min(...Object.values(product.sizes));

  const gradients = [
    "from-[#fde2e4] to-[#fad4c0]",
    "from-[#f8d7da] to-[#fceabb]",
    "from-[#e8d5f5] to-[#fde2e4]",
    "from-[#d4f0f0] to-[#fde2e4]",
  ];
  const grad = gradients[index % gradients.length];

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden shadow-sm
                    hover:shadow-[0_20px_60px_rgba(244,162,97,0.2)]
                    hover:-translate-y-2 transition-all duration-300 cursor-pointer"
    >
      {/* Image / placeholder */}
      <div
        className={`relative h-52 bg-gradient-to-br ${grad} flex items-center justify-center overflow-hidden`}
      >
        {product.images?.length ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover"
          />
        ) : (
          <span className="text-6xl group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-400">
            🎂
          </span>
        )}
        <span
          className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm
                         text-[#c1440e] text-[10px] font-bold uppercase tracking-wider
                         px-3 py-1 rounded-full"
        >
          {product.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-serif text-[17px] font-bold text-[#2d1b0e] leading-snug mb-2">
          {product.title}
        </h3>
        <p className="text-[12px] text-[#a07860] mb-4 leading-relaxed">
          {product.flavors?.slice(0, 3).join(" · ")}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="block text-[10.5px] text-[#b8977a] font-medium">
              Starting from
            </span>
            <span className="font-serif text-[22px] font-bold text-[#c1440e]">
              ₹{startingPrice}
            </span>
          </div>
          <Link
            href={`/product/${product.slug}`}
            className="bg-gradient-to-r from-[#e76f3b] to-[#f4a261]
                       group-hover:from-[#c1440e] group-hover:to-[#e76f3b]
                       text-white text-[13px] font-bold px-5 py-2.5 rounded-full
                       transition-all duration-300 shadow-sm hover:shadow-md"
          >
            View →
          </Link>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  // Using details/summary for zero-JS accordion (works great in Next.js)
  return (
    <details
      className="group border-[1.5px] border-[#f3e8df] rounded-2xl overflow-hidden
                 open:border-[#f4a261] open:bg-[#fffbf8] transition-all duration-200"
    >
      <summary
        className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer
                          list-none font-serif text-[16px] font-semibold text-[#2d1b0e] leading-snug
                          hover:text-[#c1440e] transition-colors duration-200"
      >
        {q}
        <span
          className="text-[#e76f3b] text-xl font-light flex-shrink-0
                         group-open:rotate-45 transition-transform duration-250"
        >
          +
        </span>
      </summary>
      <p className="px-6 pb-5 pt-0 text-[14.5px] text-[#7a5c4e] leading-relaxed m-0">
        {a}
      </p>
    </details>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default async function HomePage() {
  const products = await getFeaturedProducts(6); // ← uncomment for real data

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        body         { font-family: 'Lato', sans-serif; background: #fffbf8; }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0);    }
          50%       { transform: translateY(-14px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .animate-fade-up-1 { animation: fadeUp 0.7s 0.05s ease both; }
        .animate-fade-up-2 { animation: fadeUp 0.7s 0.18s ease both; }
        .animate-fade-up-3 { animation: fadeUp 0.7s 0.32s ease both; }
        .animate-fade-up-4 { animation: fadeUp 0.7s 0.46s ease both; }
        .animate-float     { animation: floatUp 4s ease-in-out infinite; }
        .shimmer-text {
          background: linear-gradient(135deg, #c1440e 0%, #e76f3b 45%, #f4a261 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        details > summary::-webkit-details-marker { display: none; }
      `}</style>

      <main className="bg-[#fffbf8]">
        {/* ════════════════════════════════════════════════
            HERO
        ════════════════════════════════════════════════ */}
        <section
          className="max-w-[1200px] mx-auto px-6
                            grid md:grid-cols-2 gap-14 items-center
                            pt-20 pb-24 md:pt-24 md:pb-28"
        >
          {/* Left */}
          <div>
            {/* Eyebrow */}
            <div
              className="animate-fade-up-1 inline-flex items-center gap-2
                            bg-gradient-to-r from-[#fde2e4] to-[#fad4c0]
                            rounded-full px-4 py-1.5 mb-7"
            >
              <span className="text-sm">🎀</span>
              <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#c1440e]">
                100% Eggless · Kolkata
              </span>
            </div>

            <h1
              className="animate-fade-up-2 font-serif text-[clamp(34px,4.5vw,56px)]
                           font-extrabold text-[#2d1b0e] leading-[1.13] tracking-tight mb-6"
            >
              Same‑Day Eggless{" "}
              <span className="shimmer-text">Cake Delivery</span> in Kolkata
            </h1>

            <p className="animate-fade-up-3 text-[17px] text-[#7a5c4e] leading-[1.75] mb-9 max-w-md">
              Premium custom cakes crafted with love — under ₹1000. Freshly
              baked, beautifully decorated, and delivered to your door.
            </p>

            <div className="animate-fade-up-3 flex flex-wrap gap-4">
              <Link
                href="/cakes"
                className="bg-gradient-to-r from-[#c1440e] via-[#e76f3b] to-[#f4a261]
                           text-white text-[15px] font-bold px-8 py-3.5 rounded-full
                           shadow-[0_6px_24px_rgba(193,68,14,0.28)]
                           hover:-translate-y-1 hover:shadow-[0_10px_32px_rgba(193,68,14,0.35)]
                           transition-all duration-300"
              >
                Shop Cakes 🎂
              </Link>
              <Link
                href="/customize-cake"
                className="border-2 border-[#e76f3b] text-[#c1440e] text-[15px] font-bold
                           px-7 py-3.5 rounded-full
                           hover:bg-[#fde2e4] hover:-translate-y-1
                           transition-all duration-300"
              >
                Customize Cake ✏️
              </Link>
            </div>

            <p
              className="animate-fade-up-4 mt-7 flex items-center gap-2
                          text-[13px] text-[#b8977a] font-medium"
            >
              <span>📍</span>
              Salt Lake · New Town · Dumdum · Gariahat · Howrah
            </p>
          </div>

          {/* Right – decorative cake display */}
          <div className="relative h-[420px] md:h-[460px] flex items-center justify-center">
            {/* Soft blob background */}
            <div
              className="absolute inset-0 rounded-[40%_60%_55%_45%/45%_55%_45%_55%]
                            bg-gradient-radial from-[#fde2e4] via-[#fad4c0] to-transparent
                            opacity-80"
            />

            {/* Floating dots */}
            {[
              "top-[8%]  left-[12%]  w-4 h-4 bg-[#f4a261]  delay-0",
              "top-[14%] right-[10%] w-3 h-3 bg-[#fde2e4]  delay-700",
              "bottom-[18%] left-[8%]  w-5 h-5 bg-[#fadadd]  delay-1200",
              "bottom-[10%] right-[15%] w-3.5 h-3.5 bg-[#f4a261] delay-300",
              "top-[42%] left-[4%]  w-2.5 h-2.5 bg-[#fad4c0] delay-1600",
            ].map((cls, i) => (
              <div
                key={i}
                className={`absolute rounded-full opacity-75 animate-float ${cls}`}
              />
            ))}

            {/* Card */}
            <div
              className="relative z-10 bg-white/70 backdrop-blur-xl
                            rounded-[28px] px-12 py-10 text-center
                            shadow-[0_24px_80px_rgba(244,162,97,0.2),0_0_0_1px_rgba(244,162,97,0.1)]"
            >
              <span className="text-[96px] leading-none block animate-float">
                🎂
              </span>
              <p className="mt-4 font-serif text-[18px] font-semibold text-[#2d1b0e]">
                Freshly Baked Daily
              </p>
              <span
                className="inline-block mt-3 bg-gradient-to-r from-[#fde2e4] to-[#fad4c0]
                               rounded-full px-5 py-1.5 text-[13px] font-bold text-[#c1440e]"
              >
                Same‑Day Delivery ✓
              </span>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            TRUST BADGES
        ════════════════════════════════════════════════ */}
        <section className="bg-gradient-to-r from-[#2d1b0e] to-[#4a2c1a] py-6">
          <div
            className="max-w-[1200px] mx-auto px-6
                          flex flex-wrap justify-center gap-x-14 gap-y-4"
          >
            {[
              { icon: "🥚", label: "100% Eggless" },
              { icon: "⚡", label: "Same‑Day Delivery" },
              { icon: "💰", label: "Under ₹1000" },
              { icon: "🔥", label: "Freshly Baked" },
              { icon: "🔒", label: "Secure Payment" },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 text-[#fde2e4]
                           hover:-translate-y-1 transition-transform duration-200"
              >
                <span className="text-lg">{icon}</span>
                <span className="text-[12px] font-bold uppercase tracking-[0.9px]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            CATEGORY GRID
        ════════════════════════════════════════════════ */}
        <section className="max-w-[1200px] mx-auto px-6 py-24">
          <div className="text-center mb-14">
            <h2 className="font-serif text-[clamp(26px,3.5vw,40px)] font-bold text-[#2d1b0e] mb-4">
              What Are You{" "}
              <em className="text-[#c1440e] not-italic font-serif italic">
                Celebrating?
              </em>
            </h2>
            <p className="text-[#7a5c4e] text-[16px]">
              Every occasion deserves a perfectly crafted cake
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {CATEGORIES.map(({ name, href, emoji, desc }) => (
              <Link
                key={href}
                href={href}
                className="group bg-white rounded-2xl p-8 text-center
                           border-2 border-[#f3e8df]
                           hover:border-[#f4a261] hover:-translate-y-2
                           hover:shadow-[0_16px_48px_rgba(244,162,97,0.18)]
                           transition-all duration-300 no-underline block"
              >
                <span
                  className="text-5xl block mb-4
                                 group-hover:scale-125 group-hover:-rotate-6
                                 transition-transform duration-300"
                >
                  {emoji}
                </span>
                <h3 className="font-serif text-[16px] font-bold text-[#2d1b0e] mb-2">
                  {name}
                </h3>
                <p className="text-[12px] text-[#b8977a]">{desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            FEATURED PRODUCTS
        ════════════════════════════════════════════════ */}
        <section className="bg-gradient-to-b from-[#fff0e8] to-[#fffbf8] py-24 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-14">
              <p className="text-[11px] font-bold uppercase tracking-[2.5px] text-[#e76f3b] mb-3">
                Our Bestsellers
              </p>
              <h2 className="font-serif text-[clamp(26px,3.5vw,40px)] font-bold text-[#2d1b0e] mb-4">
                Popular Eggless Cakes in Kolkata
              </h2>
              <p className="text-[#7a5c4e] text-[16px] max-w-md mx-auto">
                Handcrafted with premium ingredients, designed to make your
                celebration unforgettable
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {products?.map((product,index) => (
  <ProductCard key={product.id} product={product} index={index}/>
))}

            </div>

            <div className="text-center mt-14">
              <Link
                href="/cakes"
                className="inline-block bg-gradient-to-r from-[#c1440e] to-[#e76f3b]
                           text-white text-[15px] font-bold px-10 py-4 rounded-full
                           shadow-[0_6px_24px_rgba(193,68,14,0.22)]
                           hover:-translate-y-1 hover:shadow-[0_10px_32px_rgba(193,68,14,0.3)]
                           transition-all duration-300"
              >
                View All Cakes →
              </Link>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            WHY CHOOSE US
        ════════════════════════════════════════════════ */}
        <section className="max-w-[1200px] mx-auto px-6 py-24">
          <div className="text-center mb-14">
            <h2 className="font-serif text-[clamp(26px,3.5vw,40px)] font-bold text-[#2d1b0e]">
              Why Kolkata Trusts{" "}
              <em className="text-[#c1440e] not-italic font-serif italic">
                Bliss bites
              </em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🥚",
                title: "100% Eggless, Always",
                desc: "Every cake we bake is completely free from eggs — perfect for vegetarians, vegans, and those with allergies, without any compromise on taste.",
                bg: "bg-[#fde2e4]",
              },
              {
                icon: "⚡",
                title: "Same-Day Delivery",
                desc: "Order before 4:00 PM and we'll deliver fresh to your doorstep the very same day. Serving all major Kolkata localities.",
                bg: "bg-[#fad4c0]",
              },
              {
                icon: "💎",
                title: "Affordable Luxury",
                desc: "Premium-quality custom cakes under ₹1000. Because your celebrations deserve the best — at a price that makes you smile.",
                bg: "bg-[#fadadd]",
              },
            ].map(({ icon, title, desc, bg }) => (
              <div key={title} className={`${bg} rounded-3xl p-10`}>
                <span className="text-4xl block mb-5">{icon}</span>
                <h3 className="font-serif text-[20px] font-bold text-[#2d1b0e] mb-3">
                  {title}
                </h3>
                <p className="text-[14.5px] text-[#7a5c4e] leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            LOCAL SEO CONTENT
        ════════════════════════════════════════════════ */}
        <section className="bg-[#f9f0e8] border-y border-[#f3e8df] py-20 px-6">
          <div className="max-w-[780px] mx-auto">
            <h2 className="font-serif text-[clamp(24px,3vw,34px)] font-bold text-[#2d1b0e] mb-7">
              Eggless Cake Delivery Across Kolkata
            </h2>
            <p className="text-[15.5px] text-[#5c3d2e] leading-[1.85] mb-5">
              Looking for reliable eggless cake delivery in Kolkata? Bliss bites
              Bakery offers fresh birthday cakes, anniversary cakes, photo cakes
              and fully custom creations — all under ₹1000, with same-day
              delivery. We proudly serve{" "}
              <strong className="text-[#c1440e]">
                Salt Lake, New Town, Rajarhat, Dumdum, Gariahat, Howrah
              </strong>{" "}
              and all major localities across the city.
            </p>
            <p className="text-[15.5px] text-[#5c3d2e] leading-[1.85] mb-5">
              Order your custom eggless cake online in minutes. Choose your
              preferred size (500g to 3kg), pick from over 15 delicious flavors,
              add a custom message or photo, and leave the rest to us. Our team
              ensures every cake is baked fresh and delivered in premium
              packaging.
            </p>
            <p className="text-[15.5px] text-[#5c3d2e] leading-[1.85]">
              Whether you're celebrating a birthday in New Town, an anniversary
              in Gariahat, or surprising someone in Dumdum — Bliss bites Bakery
              is Kolkata's most loved destination for premium eggless cakes.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            TESTIMONIALS
        ════════════════════════════════════════════════ */}
        <section className="max-w-[1200px] mx-auto px-6 py-24">
          <div className="text-center mb-14">
            <h2 className="font-serif text-[clamp(26px,3.5vw,40px)] font-bold text-[#2d1b0e] mb-4">
              What Our Customers Say
            </h2>
            <p className="text-[#7a5c4e] text-[16px]">
              Real reviews from real celebrations in Kolkata
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, area, stars, text }) => (
              <div
                key={name}
                className="bg-white rounded-2xl p-8 border-2 border-[#f3e8df]
                           hover:border-[#f4a261] hover:-translate-y-1
                           hover:shadow-[0_12px_40px_rgba(244,162,97,0.15)]
                           transition-all duration-300"
              >
                <span className="block text-5xl leading-none text-[#fde2e4] font-serif mb-5">
                  "
                </span>
                <Stars count={stars} />
                <p className="text-[14.5px] text-[#5c3d2e] leading-[1.75] mt-3 mb-5 italic">
                  {text}
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex-shrink-0
                                  bg-gradient-to-br from-[#fde2e4] to-[#f4a261]
                                  flex items-center justify-center
                                  font-serif text-[16px] font-bold text-[#c1440e]"
                  >
                    {name[0]}
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#2d1b0e] leading-none mb-0.5">
                      {name}
                    </p>
                    <p className="text-[12px] text-[#b8977a]">
                      {area}, Kolkata
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            FAQ
        ════════════════════════════════════════════════ */}
        <section className="bg-gradient-to-b from-[#fff0e8] to-[#fffbf8] py-24 px-6">
          <div className="max-w-[760px] mx-auto">
            <div className="text-center mb-14">
              <h2 className="font-serif text-[clamp(26px,3.5vw,40px)] font-bold text-[#2d1b0e] mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-[#7a5c4e] text-[16px]">
                Everything you need to know about our cakes
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {FAQS.map((faq) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            FINAL CTA
        ════════════════════════════════════════════════ */}
        <section className="px-6 pb-24 pt-4">
          <div
            className="max-w-[940px] mx-auto
                          bg-gradient-to-br from-[#2d1b0e] via-[#5c2d18] to-[#8b3a1a]
                          rounded-[32px] px-8 py-20 text-center relative overflow-hidden"
          >
            {/* Decorative circles */}
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#f4a261] opacity-[0.07]" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-[#f4a261] opacity-[0.05]" />

            <div className="relative z-10">
              <p className="text-[11px] font-bold uppercase tracking-[2.5px] text-[#f4a261] mb-4">
                Ready to Order?
              </p>
              <h2
                className="font-serif text-[clamp(28px,4vw,48px)] font-extrabold text-[#fffbf8]
                             leading-[1.18] tracking-tight mb-5"
              >
                Order Your Custom Cake Today
              </h2>
              <p className="text-[#e8c5a0] text-[16px] mb-10 leading-relaxed">
                Freshly baked. Beautifully crafted. Delivered on time.
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/cakes"
                  className="bg-gradient-to-r from-[#e76f3b] to-[#f4a261]
                             text-white text-[16px] font-bold px-10 py-4 rounded-full
                             shadow-[0_8px_32px_rgba(244,162,97,0.3)]
                             hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(244,162,97,0.38)]
                             transition-all duration-300"
                >
                  Order Now 🎂
                </Link>
                <Link
                  href="/customize-cake"
                  className="bg-white/10 border-2 border-white/25 text-[#fffbf8]
                             text-[16px] font-bold px-8 py-4 rounded-full
                             backdrop-blur-sm
                             hover:bg-white/20 hover:-translate-y-1
                             transition-all duration-300"
                >
                  Customize →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            FOOTER
        ════════════════════════════════════════════════ */}
        <footer className="bg-[#2d1b0e] text-[#e8c5a0] py-12 px-6 text-center">
          <p className="font-serif text-[24px] font-bold text-[#fffbf8] mb-1">
            Bliss bites Bakery
          </p>
          <p className="text-[13px] text-[#b8977a] mb-6">
            Premium Eggless Cakes · Same‑Day Delivery · Kolkata
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-7">
            {[
              "Cakes",
              "Customize",
              "Same-Day Delivery",
              "About",
              "Contact",
            ].map((l) => (
              <Link
                key={l}
                href={`/${l.toLowerCase().replace(/ /g, "-")}`}
                className="text-[13px] text-[#b8977a] hover:text-[#f4a261]
                           transition-colors duration-200 no-underline"
              >
                {l}
              </Link>
            ))}
          </div>
          <p className="text-[12px] text-[#7a5c4e]">
            © {new Date().getFullYear()} Bliss bites Bakery. All rights
            reserved.
          </p>
        </footer>
      </main>
    </>
  );
}
