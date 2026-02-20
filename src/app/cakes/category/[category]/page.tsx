// app/cakes/category/[category]/page.tsx
// Next.js 15/16 compatible — async params, generateMetadata, Server Component

import { getProductsByCategory } from "@/src/lib/products";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import CategoryProductCard from "@/src/components/CategoryProductCard";

// ─── Valid categories ─────────────────────────────────────────────────────────
const VALID_CATEGORIES = [
  "birthday",
  "anniversary",
  "photo",
  "kids",
  "wedding",
] as const;

type CategorySlug = (typeof VALID_CATEGORIES)[number];

// ─── Category content map ─────────────────────────────────────────────────────
const CATEGORY_META: Record<
  CategorySlug,
  {
    label: string;
    emoji: string;
    heroTag: string;
    heroParagraph: string;
    seoParagraphs: string[];
    faqs: { q: string; a: string }[];
  }
> = {
  birthday: {
    label: "Birthday",
    emoji: "🎂",
    heroTag: "Celebrate Every Moment",
    heroParagraph:
      "Make their day unforgettable with a freshly baked eggless birthday cake delivered same day anywhere in Kolkata — Salt Lake, New Town, Dumdum, Gariahat & more. Cakes starting at just ₹500.",
    seoParagraphs: [
      "Planning a surprise party in Kolkata? Our eggless birthday cake delivery in Kolkata ensures your celebration is on time, every time. Place your order before 4 PM for guaranteed same-day delivery across Kolkata.",
      "Our birthday cakes are available in multiple tiers, flavors, and designs — from classic chocolate truffle to trendy cream-art cakes — all 100% eggless and under ₹1000. Perfect for kids, adults, office parties, and intimate celebrations.",
      "Looking for a custom birthday cake in Kolkata? Add a personal photo or message at checkout. Our edible-ink printing brings your memories to life on top of a delicious, freshly baked eggless cake.",
    ],
    faqs: [
      {
        q: "Can I order a birthday cake for same-day delivery in Kolkata?",
        a: "Yes! Order before 4:00 PM and we'll deliver your birthday cake the same day. We cover Salt Lake, New Town, Dumdum, Gariahat, Park Street, Ballygunge, and more.",
      },
      {
        q: "Are your birthday cakes 100% eggless?",
        a: "Absolutely. Every birthday cake at Bliss Bites Bakery is crafted without eggs — ideal for vegetarians, Jains, and egg-free households.",
      },
      {
        q: "What's the minimum price for a birthday cake?",
        a: "Our eggless birthday cakes start at ₹500. We have options up to ₹1000 with premium designs and flavors.",
      },
      {
        q: "Can I add a photo to a birthday cake?",
        a: "Yes! Choose any of our photo cake options and upload your image at checkout. It'll be printed with food-safe edible ink.",
      },
    ],
  },
  anniversary: {
    label: "Anniversary",
    emoji: "💕",
    heroTag: "Celebrate Your Love",
    heroParagraph:
      "Mark your special milestone with an elegant eggless anniversary cake, delivered same day to your door in Kolkata. Because every year of love deserves a perfect cake.",
    seoParagraphs: [
      "Surprise your partner with a beautifully crafted eggless anniversary cake in Kolkata — delivered right to your door. Our same-day anniversary cake delivery covers Salt Lake, New Town, Dumdum, and Gariahat.",
      "Our anniversary cakes feature elegant designs, romantic flavours like red velvet, strawberry cream, and dark chocolate ganache — all 100% eggless and starting under ₹1000.",
      "Looking for a custom anniversary cake in Kolkata with your couple's photo or names? Our personalisation options make every cake as unique as your love story.",
    ],
    faqs: [
      {
        q: "Do you offer same-day anniversary cake delivery in Kolkata?",
        a: "Yes! Order before 4 PM for same-day delivery. We deliver anniversary cakes across Salt Lake, New Town, Dumdum, Gariahat and more.",
      },
      {
        q: "Can I customise an anniversary cake with our names?",
        a: "Absolutely. Add custom names, messages, or a couple photo at checkout for a personalised touch.",
      },
      {
        q: "What flavours are available for anniversary cakes?",
        a: "Popular choices include red velvet, dark chocolate truffle, strawberry cream, and black forest — all eggless.",
      },
    ],
  },
  photo: {
    label: "Photo",
    emoji: "📸",
    heroTag: "Your Memory, On A Cake",
    heroParagraph:
      "Turn your favourite photo into a stunning edible artwork with our custom photo cake delivery in Kolkata. Same-day delivery available — order before 4 PM.",
    seoParagraphs: [
      "Our custom photo cakes in Kolkata use high-resolution food-safe edible ink to print your chosen image directly onto the cake topper. Crystal clear, vibrant, and delicious — all eggless.",
      "Whether it's a birthday, graduation, farewell, or a random Tuesday worth celebrating — a photo cake from Bliss Bites is the most personal gift you can order online in Kolkata under ₹1000.",
      "Upload your image at checkout, choose your size, and we'll bake and deliver your personalised photo cake anywhere in Kolkata the same day you order.",
    ],
    faqs: [
      {
        q: "How do I order a photo cake in Kolkata?",
        a: "Simply choose a photo cake, upload your image at checkout, and we'll handle the rest. Delivered same day before 4 PM cutoff.",
      },
      {
        q: "Is the photo printed with safe edible ink?",
        a: "Yes, we use 100% food-safe, FDA-approved edible ink and edible paper for all photo cakes.",
      },
      {
        q: "What photo resolution works best?",
        a: "For the sharpest print, we recommend a photo of at least 300 DPI or 1MB+ in size.",
      },
      {
        q: "Are photo cakes eggless?",
        a: "Yes! All our cakes — including photo cakes — are 100% eggless.",
      },
    ],
  },
  kids: {
    label: "Kids",
    emoji: "🎠",
    heroTag: "Make Their Eyes Sparkle",
    heroParagraph:
      "Delight the little ones with a fun, colourful, 100% eggless kids' cake. Same-day delivery in Kolkata — because their smile can't wait.",
    seoParagraphs: [
      "Kids' birthday cakes from Bliss Bites Bakery are specially designed to spark joy. From cartoon characters to unicorn rainbows and superhero themes — all available as eggless cakes in Kolkata.",
      "Every kids' cake is crafted with child-friendly flavours like vanilla cream, butterscotch, and strawberry — with fun fondant decorations. Eggless, safe, and under ₹1000.",
      "Same-day kids' cake delivery is available across Kolkata. Order before 4 PM and let us handle the wow factor.",
    ],
    faqs: [
      {
        q: "Are kids' cakes safe for vegetarian children?",
        a: "Yes, all our cakes are 100% eggless and suitable for vegetarians and Jain diets.",
      },
      {
        q: "Can I get a themed kids' cake (unicorn, superhero, etc.)?",
        a: "Yes! Browse our kids' cake collection and choose from themed designs, or contact us for a fully custom order.",
      },
      {
        q: "Is same-day delivery available for kids' cakes?",
        a: "Absolutely. Order before 4 PM and we'll deliver anywhere in Kolkata the same day.",
      },
    ],
  },
  wedding: {
    label: "Wedding",
    emoji: "💍",
    heroTag: "Your Dream Cake Awaits",
    heroParagraph:
      "Celebrate the most special day with an exquisite 100% eggless wedding cake. Elegant tiers, floral designs, and custom flavours — delivered in Kolkata.",
    seoParagraphs: [
      "Our eggless wedding cakes in Kolkata are crafted for couples who want elegance without compromise. From classic white fondant to floral buttercream designs — all baked fresh and eggless.",
      "We offer tiered wedding cakes, small celebration cakes, and custom designs to match your wedding theme. All priced fairly and delivered with care across Kolkata.",
      "Planning your wedding in Kolkata? Contact us early to discuss your custom wedding cake. We recommend placing wedding cake orders at least 5–7 days in advance.",
    ],
    faqs: [
      {
        q: "Do you make eggless wedding cakes in Kolkata?",
        a: "Yes! Our wedding cakes are 100% eggless, beautifully designed, and available in multiple tiers and flavours.",
      },
      {
        q: "How early should I order a wedding cake?",
        a: "We recommend ordering 5–7 days in advance for wedding cakes to ensure perfect customisation.",
      },
      {
        q: "Can I get a tasting session before ordering?",
        a: "Yes, contact us to arrange a cake tasting at our Kolkata bakery. We'd love to help you choose the perfect flavours.",
      },
    ],
  },
};

const TRUST = [
  { icon: "🥚", label: "100% Eggless" },
  { icon: "🚀", label: "Same-Day Delivery" },
  { icon: "🍰", label: "Freshly Baked" },
  { icon: "🔒", label: "Secure Checkout" },
];

// ─── Types ────────────────────────────────────────────────────────────────────
type Props = {
  params: Promise<{ category: string }>;
};

type Product = {
  id: string;
  title: string;
  slug: string;
  category: string;
  flavors?: string[];
  images?: string[];
  sizes: Record<string, number>;
};

// ─── generateMetadata ─────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORY_META[category as CategorySlug];
  if (!meta) return {};

  const baseUrl = "https://bliss-bites-bakery.vercel.app";

  return {
    title: `Eggless ${meta.label} Cakes in Kolkata | Same-Day Delivery Under ₹1000`,
    description: `Order 100% eggless ${meta.label.toLowerCase()} cakes in Kolkata with same-day delivery. Freshly baked. Delivered in Salt Lake, New Town, Dumdum & Gariahat. Starting ₹500.`,
    keywords: [
      `${meta.label.toLowerCase()} cake Kolkata`,
      `eggless ${meta.label.toLowerCase()} cake Kolkata`,
      `${meta.label.toLowerCase()} cake delivery Kolkata`,
      `same day ${meta.label.toLowerCase()} cake Kolkata`,
      `${meta.label.toLowerCase()} cakes under 1000`,
      "Bliss Bites Bakery Kolkata",
    ],
    alternates: {
      canonical: `${baseUrl}/cakes/category/${category}`,
    },
    openGraph: {
      title: `Eggless ${meta.label} Cakes in Kolkata | Bliss Bites`,
      description: `Premium eggless ${meta.label.toLowerCase()} cakes delivered across Kolkata. Same-day delivery available.`,
      url: `${baseUrl}/cakes/category/${category}`,
      siteName: "Bliss Bites Bakery",
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Eggless ${meta.label} Cakes in Kolkata`,
      description: `Same-day delivery available across Kolkata. Starting ₹500.`,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  // 404 for unknown categories
  if (!VALID_CATEGORIES.includes(category as CategorySlug)) {
    return notFound();
  }

  const cat = category as CategorySlug;
  const meta = CATEGORY_META[cat];
  const products = (await getProductsByCategory(category)) as Product[];

  const otherCategories = VALID_CATEGORIES.filter((c) => c !== cat);

  // Structured data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://blissbitesbackery.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Cakes",
        item: "https://blissbitesbackery.in/cakes",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${meta.label} Cakes`,
        item: `https://blissbitesbackery.in/cakes/category/${cat}`,
      },
    ],
  };

 const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: `Eggless ${meta.label} Cakes in Kolkata`,
  itemListElement: products.map((p, i) => {
    const sizes = p.sizes as Record<string, number>;
    const price = Math.min(...Object.values(sizes));

    return {
      "@type": "ListItem",
      position: i + 1,
      url: `https://bliss-bites-bakery.vercel.app/product/${p.slug}`,
      item: {
        "@type": "Product",
        name: p.title,
        image: p.images?.[0],
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: price,
          availability: "https://schema.org/InStock",
        },
      },
    };
  }),
};


  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Bakery",
      name: "Bliss Bites Bakery",
      telephone: "+91 9123743680",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kolkata",
        addressRegion: "West Bengal",
        addressCountry: "IN",
      },
      areaServed: "Kolkata",
      priceRange: "₹500-₹1000",
      url: "https://bliss-bites-bakery.vercel.app",
    }),
  }}
/>


      <div
        className="min-h-screen"
        style={{ fontFamily: "'Poppins', sans-serif", background: "#FFFBF8" }}
      >
        {/* ══════════════════════════════════════════════════
            HERO SECTION
        ══════════════════════════════════════════════════ */}
        <section
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
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-25 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, #FADADD 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-0 -left-16 w-72 h-72 rounded-full opacity-20 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, #FFD6A5 0%, transparent 70%)",
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb */}
            <nav
              className="mb-6 text-sm"
              aria-label="Breadcrumb"
              style={{ color: "#C06C84" }}
            >
              <ol className="flex items-center gap-2 flex-wrap">
                <li>
                  <Link href="/" className="hover:underline">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/cakes" className="hover:underline">
                    Cakes
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li
                  className="font-semibold capitalize"
                  style={{ color: "#A0395A" }}
                >
                  {meta.label} Cakes
                </li>
              </ol>
            </nav>

            {/* Badge */}
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5 tracking-wide"
              style={{ background: "#FADADD", color: "#A0395A" }}
            >
              {meta.emoji} {meta.heroTag}
            </span>

            {/* H1 */}
            <h1
              className="font-extrabold leading-tight"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.25rem)",
                color: "#3D1A2C",
                maxWidth: "760px",
                lineHeight: 1.15,
              }}
            >
              Eggless{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #E8577A, #F7A072)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {meta.label} Cakes
              </span>{" "}
              in Kolkata
            </h1>

            <p
              className="mt-5 max-w-2xl leading-relaxed"
              style={{
                color: "#6B3048",
                fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
              }}
            >
              {meta.heroParagraph}
            </p>

            {/* Urgency note */}
            <div
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold"
              style={{ background: "#FDE2E4", color: "#A0395A" }}
            >
              ⏰ Order before 4:00 PM for same-day delivery
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap justify-center gap-6">
              {TRUST.map((t) => (
                <div key={t.label} className="flex items-center gap-2">
                  <span className="text-xl">{t.icon}</span>
                  <span
                    className="text-xs font-bold"
                    style={{ color: "#A0395A" }}
                  >
                    {t.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            PRODUCT GRID
        ══════════════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2
            className="text-xl font-extrabold mb-7"
            style={{ color: "#3D1A2C" }}
          >
            {products.length} Eggless {meta.label} Cakes Available
          </h2>

          {products.length === 0 ? (
            <div
              className="text-center py-24 rounded-3xl"
              style={{ background: "#FFF5F7" }}
            >
              <p className="text-4xl mb-3">{meta.emoji}</p>
              <p className="font-bold text-lg" style={{ color: "#A0395A" }}>
                No {meta.label.toLowerCase()} cakes available right now
              </p>
              <p className="text-sm mt-1 mb-6" style={{ color: "#C06C84" }}>
                Check back soon or browse our full collection.
              </p>
              <Link
                href="/cakes"
                className="inline-block px-6 py-3 rounded-2xl text-sm font-bold text-white"
                style={{
                  background: "linear-gradient(90deg, #E8577A, #F7A072)",
                }}
              >
                Browse All Cakes
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <CategoryProductCard
                  key={product.id}
                  product={product}
                  meta={meta}
                />
              ))}
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════════════
            SEO CONTENT BLOCK
        ══════════════════════════════════════════════════ */}
        <section
          className="py-16"
          style={{
            background: "linear-gradient(180deg, #FFF5F7 0%, #FFFBF8 100%)",
          }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl font-extrabold mb-6"
              style={{ color: "#3D1A2C" }}
            >
              {meta.label} Cake Delivery in Kolkata — Bliss Bites Bakery
            </h2>
            <p>
Browse our full{" "}
<Link href="/cakes" className="font-semibold underline">
eggless cake collection in Kolkata
</Link>{" "}
or design your own on our{" "}
<Link href="/customize-cake" className="font-semibold underline">
custom cake order page
</Link>.
</p>


            <div
              className="space-y-5 leading-relaxed"
              style={{ color: "#6B3048", fontSize: "0.95rem" }}
            >
              {meta.seoParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            RELATED CATEGORIES
        ══════════════════════════════════════════════════ */}
        <section className="py-12" style={{ background: "#FFFBF8" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3
              className="text-sm font-bold uppercase tracking-wider mb-5"
              style={{ color: "#A0395A" }}
            >
              Explore More Categories
            </h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/cakes"
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
                style={{
                  background: "#FDE2E4",
                  color: "#A0395A",
                  border: "1px solid #FADADD",
                }}
              >
                All Cakes
              </Link>
              {otherCategories.map((c) => (
                <Link
                  key={c}
                  href={`/cakes/category/${c}`}
                  className="px-5 py-2 rounded-full text-sm font-semibold transition-all capitalize"
                  style={{
                    background: "#FDE2E4",
                    color: "#A0395A",
                    border: "1px solid #FADADD",
                  }}
                >
                  {CATEGORY_META[c].emoji} {CATEGORY_META[c].label} Cakes
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            FAQ SECTION (Server-rendered accordion)
            Note: For interactive accordion, wrap in a Client Component
        ══════════════════════════════════════════════════ */}
        <section
          className="py-16"
          style={{
            background: "linear-gradient(180deg, #FFFBF8 0%, #FFF5F7 100%)",
          }}
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl font-extrabold mb-2 text-center"
              style={{ color: "#3D1A2C" }}
            >
              FAQ — {meta.label} Cakes in Kolkata
            </h2>
            <p
              className="text-center text-sm mb-8"
              style={{ color: "#C06C84" }}
            >
              Common questions about our eggless {meta.label.toLowerCase()}{" "}
              cakes
            </p>

            <div className="space-y-3">
              {meta.faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group rounded-2xl overflow-hidden"
                  style={{ border: "1px solid #FADADD", background: "#FFFBF8" }}
                >
                  <summary
                    className="flex justify-between items-center px-5 py-4 cursor-pointer list-none font-semibold text-sm"
                    style={{ color: "#3D1A2C" }}
                  >
                    <span className="pr-4">{faq.q}</span>
                    <span
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{
                        background: "linear-gradient(90deg, #E8577A, #F7A072)",
                      }}
                    >
                      +
                    </span>
                  </summary>
                  <div
                    className="px-5 pb-4 text-sm leading-relaxed"
                    style={{ color: "#6B3048", borderTop: "1px solid #FADADD" }}
                  >
                    <p className="pt-3">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
        <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: meta.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a,
        },
      })),
    }),
  }}
/>


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
          <div>
            <p className="text-xs font-bold" style={{ color: "#A0395A" }}>
              ⏰ Order by 4 PM
            </p>
            <p className="text-xs" style={{ color: "#C06C84" }}>
              Same-day delivery
            </p>
          </div>
          <Link
            href={`/cakes/category/${cat}`}
            className="flex-1 text-center text-sm font-bold py-2.5 rounded-2xl"
            style={{
              background: "linear-gradient(90deg, #E8577A, #F7A072)",
              color: "#fff",
            }}
          >
            Order {meta.label} Cake →
          </Link>
        </div>

        {/* Bottom padding for sticky bar on mobile */}
        <div className="sm:hidden h-20" />
      </div>
    </>
  );
}
