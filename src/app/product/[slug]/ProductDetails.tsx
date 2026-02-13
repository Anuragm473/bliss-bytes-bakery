"use client";

import { useState } from "react";
import { useCartStore } from "@/src/store/cartStore";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  sizes: Record<string, number>;
  flavors: string[];
  images: string[];
  isPhotoCake: boolean;
  isCustomizable: boolean;
  isEggless: boolean;
  createdAt: Date;
};

const highlights = [
  {
    icon: "🥚",
    title: "100% Eggless",
    desc: "Every cake crafted without eggs — indulge without compromise.",
  },
  {
    icon: "🚀",
    title: "Same-Day Delivery",
    desc: "Order before 4PM for same-day delivery across Kolkata.",
  },
  {
    icon: "🌸",
    title: "Premium Ingredients",
    desc: "Finest quality fresh ingredients baked with love.",
  },
  {
    icon: "🔒",
    title: "Secure Checkout",
    desc: "100% safe & encrypted payments for your peace of mind.",
  },
];

const faqs = [
  {
    q: "Is this cake eggless?",
    a: "Yes! All cakes at Bliss Bites Bakery are 100% eggless, made with premium egg-free ingredients without any compromise on taste or texture.",
  },
  {
    q: "Do you offer same-day delivery?",
    a: "Absolutely. Place your order before 4PM and we'll deliver it the same day across Kolkata — including Salt Lake, New Town, Dumdum, and Gariahat.",
  },
  {
    q: "What areas do you deliver to?",
    a: "We deliver across Kolkata including Salt Lake, New Town, Gariahat, Dumdum, Behala, Park Street, and surrounding areas.",
  },
  {
    q: "Can I customize flavor and size?",
    a: "Yes! Choose from multiple sizes and flavors on this page. For photo cakes or further customization, use our Customize Cake tool.",
  },
  {
    q: "How should I store the cake?",
    a: "Store in a cool, dry place or refrigerate. Best consumed within 2 days. Remove from refrigerator 30 minutes before serving for optimal taste.",
  },
];

export default function ProductDetails({
  product,
  relatedProducts = [],
}: {
  product: any;
  relatedProducts?: Product[];
}) {
  const sizes:any = product.sizes;
  const [selectedSize, setSelectedSize] = useState(Object.keys(sizes)[0]);
  const [selectedFlavor, setSelectedFlavor] = useState(product.flavors[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const price = sizes[selectedSize];
  const startingPrice = Math.min(...Object.values(sizes));

  const handleAddToCart = () => {
    console.log(product)
    addItem({
      productId: product.id,
      title: product.title,
      size: selectedSize,
      image:product.images[0],
      flavor: selectedFlavor,
      price,
      quantity,
    });
  };

  return (
    <>
      {/* ── JSON-LD Structured Data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org/",
              "@type": "Product",
              name: product.title,
              image: product.images,
              description: product.description,
              brand: { "@type": "Brand", name: "Bliss Bites Bakery" },
              offers: {
                "@type": "Offer",
                priceCurrency: "INR",
                price: startingPrice,
                availability: "https://schema.org/InStock",
                seller: { "@type": "Organization", name: "Bliss Bites Bakery" },
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "/" },
                { "@type": "ListItem", position: 2, name: "Cakes", item: "/cakes" },
                { "@type": "ListItem", position: 3, name: product.title },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]),
        }}
      />

      <div className="min-h-screen" style={{ background: "#FFFBF8" }}>
        {/* ══════════════════════════════════════
            STICKY MOBILE BOTTOM BAR
        ══════════════════════════════════════ */}
        <div
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex items-center justify-between px-4 py-3 border-t"
          style={{
            background: "rgba(255,251,248,0.97)",
            backdropFilter: "blur(12px)",
            borderColor: "#F5C6CB",
          }}
        >
          <div>
            <p className="text-xs" style={{ color: "#9B7B6E" }}>
              Starting from
            </p>
            <p className="text-xl font-bold" style={{ color: "#6B2D2D" }}>
              ₹{price}
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex-1 ml-4 py-3 rounded-2xl font-semibold text-white text-sm transition-transform active:scale-95"
            style={{
              background: "linear-gradient(135deg, #E8826A 0%, #C45E4A 100%)",
              boxShadow: "0 4px 20px rgba(228,120,96,0.45)",
            }}
          >
            Add to Cart — ₹{price * quantity}
          </button>
        </div>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-28 md:pb-12">
          {/* ══════════════════════════════════════
              1. BREADCRUMB
          ══════════════════════════════════════ */}
          <nav
            aria-label="Breadcrumb"
            className="text-xs flex items-center gap-1.5 mb-8"
            style={{ color: "#B8927A" }}
          >
            <Link
              href="/"
              className="hover:underline transition-opacity hover:opacity-70"
            >
              Home
            </Link>
            <span>›</span>
            <Link
              href="/cakes"
              className="hover:underline transition-opacity hover:opacity-70"
            >
              Cakes
            </Link>
            <span>›</span>
            <span style={{ color: "#6B2D2D" }} className="font-medium">
              {product.title}
            </span>
          </nav>

          {/* ══════════════════════════════════════
              2. MAIN PRODUCT SECTION
          ══════════════════════════════════════ */}
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            {/* ── LEFT: Image Gallery ── */}
            <div className="flex flex-col gap-4">
              {/* Primary Image */}
              <div
                className="relative overflow-hidden rounded-3xl group"
                style={{
                  background: "#FDE2E4",
                  boxShadow: "0 8px 40px rgba(180,100,90,0.15)",
                  aspectRatio: "1/1",
                }}
              >
                {product.images?.length ? (
                  <Image
                    src={product.images[activeImage]}
                    alt={`${product.title} - view ${activeImage + 1}`}
                    fill
                    className="object-cover rounded-3xl transition-transform duration-500 group-hover:scale-105"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div
                    className="w-full h-full flex flex-col items-center justify-center"
                    style={{ color: "#D4A0A0" }}
                  >
                    <span className="text-5xl mb-2">🎂</span>
                    <span className="text-sm">No image available</span>
                  </div>
                )}

                {/* Urgency badge */}
                <div
                  className="absolute top-4 left-4 text-white text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #E8826A, #C45E4A)",
                    boxShadow: "0 2px 12px rgba(200,80,60,0.35)",
                  }}
                >
                  ⏰ Order by 4PM for today
                </div>

                {product.isEggless && (
                  <div
                    className="absolute top-4 right-4 text-white text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{
                      background: "rgba(107,45,45,0.85)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    🥚 Eggless
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {product.images?.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {product.images.map((img:any, i:any) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      aria-label={`View image ${i + 1}`}
                      className="relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden transition-all duration-200"
                      style={{
                        border: `2.5px solid ${
                          activeImage === i ? "#C45E4A" : "#F5C6CB"
                        }`,
                        opacity: activeImage === i ? 1 : 0.65,
                        boxShadow:
                          activeImage === i
                            ? "0 2px 12px rgba(196,94,74,0.3)"
                            : "none",
                      }}
                    >
                      <Image
                        src={img}
                        alt={`${product.title} thumbnail ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT: Product Info ── */}
            <div className="flex flex-col">
              {/* Category badge */}
              <span
                className="self-start text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-widest"
                style={{
                  background: "#FDE2E4",
                  color: "#B85C5C",
                }}
              >
                {product.category}
              </span>

              <h1
                className="text-3xl sm:text-4xl font-bold leading-tight"
                style={{
                  color: "#3D1515",
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {product.title}
              </h1>

              {/* Stars (UI-ready) */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex" style={{ color: "#E8826A" }}>
                  {"★★★★★".split("").map((s, i) => (
                    <span key={i} className="text-base">
                      {s}
                    </span>
                  ))}
                </div>
                <span className="text-xs" style={{ color: "#B8927A" }}>
                  4.9 (248 reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mt-5 flex items-baseline gap-3">
                <span
                  className="text-4xl font-bold"
                  style={{ color: "#6B2D2D" }}
                >
                  ₹{price}
                </span>
                <span className="text-sm" style={{ color: "#B8927A" }}>
                  for {selectedSize}
                </span>
                {price < startingPrice + 200 && price > startingPrice && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "#FDE2E4", color: "#C45E4A" }}
                  >
                    Starting ₹{startingPrice}
                  </span>
                )}
              </div>

              <p
                className="mt-4 text-sm leading-relaxed"
                style={{ color: "#7A5C5C" }}
              >
                {product.description}
              </p>

              {/* ── Size Selector ── */}
              <div className="mt-6">
                <h2
                  className="text-sm font-semibold mb-3 uppercase tracking-widest"
                  style={{ color: "#4D2828" }}
                >
                  Select Size
                </h2>
                <div className="flex flex-wrap gap-2.5">
                  {Object.entries(sizes).map(([size, sizePrice]:any) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      aria-pressed={selectedSize === size}
                      className="relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                      style={
                        selectedSize === size
                          ? {
                              background:
                                "linear-gradient(135deg, #6B2D2D 0%, #9B4040 100%)",
                              color: "#FFF",
                              boxShadow:
                                "0 4px 16px rgba(107,45,45,0.35)",
                              transform: "translateY(-1px)",
                            }
                          : {
                              background: "#FFF5F5",
                              color: "#7A5C5C",
                              border: "1.5px solid #F5C6CB",
                            }
                      }
                    >
                      <span>{size}</span>
                      <span
                        className="ml-2 text-xs opacity-80"
                        style={{
                          color: selectedSize === size ? "#FFD8D8" : "#B8927A",
                        }}
                      >
                        ₹{sizePrice}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Flavor Selector ── */}
              <div className="mt-5">
                <h2
                  className="text-sm font-semibold mb-3 uppercase tracking-widest"
                  style={{ color: "#4D2828" }}
                >
                  Select Flavor
                </h2>
                <div className="flex flex-wrap gap-2.5">
                  {product.flavors.map((flavor:any) => (
                    <button
                      key={flavor}
                      onClick={() => setSelectedFlavor(flavor)}
                      aria-pressed={selectedFlavor === flavor}
                      className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                      style={
                        selectedFlavor === flavor
                          ? {
                              background:
                                "linear-gradient(135deg, #E8826A 0%, #C45E4A 100%)",
                              color: "#FFF",
                              boxShadow:
                                "0 4px 16px rgba(228,130,106,0.4)",
                              transform: "translateY(-1px)",
                            }
                          : {
                              background: "#FFF5F5",
                              color: "#7A5C5C",
                              border: "1.5px solid #F5C6CB",
                            }
                      }
                    >
                      {flavor}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Quantity Selector ── */}
              <div className="mt-5">
                <h2
                  className="text-sm font-semibold mb-3 uppercase tracking-widest"
                  style={{ color: "#4D2828" }}
                >
                  Quantity
                </h2>
                <div className="flex items-center gap-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                    className="w-10 h-10 rounded-l-xl flex items-center justify-center font-bold text-lg transition-colors"
                    style={{
                      background: "#FDE2E4",
                      color: "#6B2D2D",
                      border: "1.5px solid #F5C6CB",
                      borderRight: "none",
                    }}
                  >
                    −
                  </button>
                  <div
                    className="w-12 h-10 flex items-center justify-center text-sm font-semibold"
                    style={{
                      background: "#FFF5F5",
                      color: "#3D1515",
                      border: "1.5px solid #F5C6CB",
                    }}
                  >
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                    className="w-10 h-10 rounded-r-xl flex items-center justify-center font-bold text-lg transition-colors"
                    style={{
                      background: "#FDE2E4",
                      color: "#6B2D2D",
                      border: "1.5px solid #F5C6CB",
                      borderLeft: "none",
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* ── Trust Badges ── */}
              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  { icon: "🥚", label: "100% Eggless" },
                  { icon: "🚀", label: "Same-Day Delivery" },
                  { icon: "🏙️", label: "Baked in Kolkata" },
                ].map((b) => (
                  <div
                    key={b.label}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: "#FDE2E4", color: "#7A3030" }}
                  >
                    <span>{b.icon}</span>
                    <span>{b.label}</span>
                  </div>
                ))}
              </div>

              {/* ── CTAs ── */}
              <div className="mt-7 flex flex-col gap-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 rounded-2xl font-semibold text-white text-base transition-all duration-200 hover:shadow-xl active:scale-[0.98]"
                  style={{
                    background:
                      "linear-gradient(135deg, #E8826A 0%, #C45E4A 100%)",
                    boxShadow: "0 6px 28px rgba(228,130,106,0.4)",
                  }}
                >
                  🛒 Add to Cart — ₹{price * quantity}
                </button>
                <button
                  className="w-full py-4 rounded-2xl font-semibold text-base transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
                  style={{
                    background:
                      "linear-gradient(135deg, #6B2D2D 0%, #9B4040 100%)",
                    color: "#FFF5F5",
                    boxShadow: "0 6px 28px rgba(107,45,45,0.3)",
                  }}
                >
                  ⚡ Buy Now
                </button>
              </div>

              {/* ── Customization CTA ── */}
              {(product.isCustomizable || product.isPhotoCake) && (
                <Link
                  href="/customize-cake"
                  className="mt-4 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium transition-all duration-200 hover:shadow-md"
                  style={{
                    background: "#FFF0EE",
                    color: "#C45E4A",
                    border: "1.5px dashed #F5A898",
                  }}
                >
                  <span>🎨</span>
                  <span>Want to personalize this cake? Upload your photo →</span>
                </Link>
              )}
            </div>
          </div>

          {/* ══════════════════════════════════════
              3. HIGHLIGHTS GRID
          ══════════════════════════════════════ */}
          <section className="mt-20" aria-labelledby="highlights-heading">
            <h2
              id="highlights-heading"
              className="text-center text-2xl font-bold mb-8"
              style={{
                color: "#3D1515",
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Why Choose Bliss Bites?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {highlights.map((h) => (
                <div
                  key={h.title}
                  className="flex flex-col items-center text-center p-5 rounded-2xl transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                  style={{
                    background:
                      "linear-gradient(145deg, #FFFBF8 0%, #FDE2E4 100%)",
                    border: "1px solid #F5C6CB",
                  }}
                >
                  <div className="text-3xl mb-3">{h.icon}</div>
                  <h3
                    className="font-semibold text-sm mb-1"
                    style={{ color: "#3D1515" }}
                  >
                    {h.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: "#9B7B6E" }}>
                    {h.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════
              4. SEO-RICH DESCRIPTION
          ══════════════════════════════════════ */}
          <section
            className="mt-20 rounded-3xl p-8 sm:p-10"
            aria-labelledby="description-heading"
            style={{
              background: "linear-gradient(135deg, #FDE2E4 0%, #FADADD 100%)",
              border: "1px solid #F5C6CB",
            }}
          >
            <h2
              id="description-heading"
              className="text-2xl font-bold mb-5"
              style={{
                color: "#3D1515",
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              {product.title} – Eggless Cake Delivery in Kolkata
            </h2>
            <div
              className="space-y-4 text-sm leading-relaxed"
              style={{ color: "#7A4040" }}
            >
              <p>
                Looking for the perfect{" "}
                <strong>eggless cake delivery in Kolkata</strong>? Bliss Bites
                Bakery brings you freshly baked, premium-quality cakes under ₹1000
                — delivered same-day right to your doorstep. Our{" "}
                <strong>{product.title}</strong> is crafted with the finest
                ingredients, offering you a celebration-worthy taste without
                any eggs.
              </p>
              <p>
                We deliver across Kolkata including{" "}
                <strong>Salt Lake, New Town, Gariahat, Dumdum</strong>, Behala,
                Park Street, and surrounding areas. Every cake is baked fresh on
                order day — no pre-baked stock, no freezer storage.
              </p>
              <p>
                Whether you're celebrating a birthday, anniversary, or just
                craving something sweet, our <strong>{product.title}</strong>{" "}
                makes every moment special. Choose from multiple sizes and
                flavors, and get it delivered in a beautiful box — ready to
                impress.
              </p>
            </div>
          </section>

          {/* ══════════════════════════════════════
              5. RELATED PRODUCTS
          ══════════════════════════════════════ */}
          {relatedProducts.length > 0 && (
            <section className="mt-20" aria-labelledby="related-heading">
              <h2
                id="related-heading"
                className="text-2xl font-bold mb-8"
                style={{
                  color: "#3D1515",
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                You Might Also Love
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {relatedProducts.slice(0, 4).map((p) => {
                  const relSizes = p.sizes as Record<string, number>;
                  const relPrice = Math.min(...Object.values(relSizes));
                  return (
                    <Link
                      key={p.id}
                      href={`/product/${p.slug}`}
                      className="group block rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                      style={{
                        background: "#FFF5F5",
                        border: "1px solid #F5C6CB",
                      }}
                    >
                      <div className="relative aspect-square overflow-hidden">
                        {p.images?.[0] ? (
                          <Image
                            src={p.images[0]}
                            alt={p.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center text-3xl"
                            style={{ background: "#FDE2E4" }}
                          >
                            🎂
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p
                          className="font-medium text-xs leading-tight line-clamp-2"
                          style={{ color: "#3D1515" }}
                        >
                          {p.title}
                        </p>
                        <p
                          className="text-sm font-bold mt-1"
                          style={{ color: "#C45E4A" }}
                        >
                          ₹{relPrice}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* ══════════════════════════════════════
              6. FAQ ACCORDION
          ══════════════════════════════════════ */}
          <section className="mt-20" aria-labelledby="faq-heading">
            <h2
              id="faq-heading"
              className="text-2xl font-bold mb-8"
              style={{
                color: "#3D1515",
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden transition-all duration-200"
                  style={{
                    background: "#FFF5F5",
                    border: `1.5px solid ${openFaq === i ? "#E8826A" : "#F5C6CB"}`,
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                    className="w-full flex items-center justify-between p-5 text-left"
                    style={{ color: "#3D1515" }}
                  >
                    <span className="font-medium text-sm pr-4">{faq.q}</span>
                    <span
                      className="flex-shrink-0 text-lg transition-transform duration-300"
                      style={{
                        transform:
                          openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                        color: "#E8826A",
                      }}
                    >
                      +
                    </span>
                  </button>
                  {openFaq === i && (
                    <div
                      className="px-5 pb-5 text-sm leading-relaxed"
                      style={{ color: "#7A5C5C" }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════
              7. FINAL CTA BANNER
          ══════════════════════════════════════ */}
          <section
            className="mt-20 rounded-3xl p-10 sm:p-14 text-center"
            style={{
              background:
                "linear-gradient(135deg, #E8826A 0%, #C45E4A 50%, #A84040 100%)",
              boxShadow: "0 16px 60px rgba(200,80,60,0.3)",
            }}
          >
            <h2
              className="text-2xl sm:text-3xl font-bold text-white mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Order Now for Same-Day Delivery in Kolkata
            </h2>
            <p className="text-sm mb-8" style={{ color: "rgba(255,230,225,0.9)" }}>
              Place your order before 4PM and receive it today — freshly baked,
              beautifully boxed.
            </p>
            <button
              onClick={handleAddToCart}
              className="px-10 py-4 rounded-2xl font-bold text-base transition-all duration-200 hover:shadow-2xl hover:-translate-y-0.5 active:scale-[0.98]"
              style={{
                background: "#FFF5F5",
                color: "#C45E4A",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              }}
            >
              🎂 Order {product.title} — ₹{price}
            </button>
          </section>
        </main>
      </div>
    </>
  );
}