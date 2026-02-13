"use client";

import { useCartStore } from "@/src/store/cartStore";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import type { Metadata } from "next";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CartItem {
  id: string;
  title: string;
  image: string;
  size: string;
  flavor: string;
  customMessage?: string;
  price: number;
  quantity: number;
  category: string;
}

interface RelatedProduct {
  id: string;
  title: string;
  image: string;
  price: number;
  slug: string;
}

// ─── SEO Metadata (export from page.tsx if using App Router) ──────────────────
// export const metadata: Metadata = {
//   title: "Your Cart | Bliss Bites Bakery – Eggless Cakes Kolkata",
//   description:
//     "Review your eggless cake order from Bliss Bites Bakery. Same-day cake delivery in Kolkata. Custom cakes, fresh daily. Secure checkout.",
//   keywords: [
//     "eggless cake order Kolkata",
//     "same day cake delivery",
//     "custom cake checkout",
//     "Bliss Bites Bakery cart",
//   ],
//   openGraph: {
//     title: "Your Cart | Bliss Bites Bakery",
//     description: "Your eggless cakes are ready to be ordered!",
//     type: "website",
//   },
// };

// ─── Structured Data ──────────────────────────────────────────────────────────
function CartStructuredData({ items }: { items: CartItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://blissbitsbakery.com" },
          { "@type": "ListItem", position: 2, name: "Cakes", item: "https://blissbitsbakery.com/cakes" },
          { "@type": "ListItem", position: 3, name: "Cart", item: "https://blissbitsbakery.com/cart" },
        ],
      },
      {
        "@type": "ItemList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.title,
          item: {
            "@type": "Product",
            name: item.title,
            offers: { "@type": "Offer", price: item.price, priceCurrency: "INR" },
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Trust Badge Component ────────────────────────────────────────────────────
function TrustBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-pink-100 shadow-sm">
      <span className="text-lg">{icon}</span>
      <span className="text-xs font-semibold text-[#8B3A52] whitespace-nowrap">{label}</span>
    </div>
  );
}

// ─── Delivery Timer Countdown ─────────────────────────────────────────────────
function DeliveryCountdown() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calcTimeLeft = () => {
      const now = new Date();
      const cutoff = new Date();
      cutoff.setHours(16, 0, 0, 0); // 4 PM cutoff
      if (now >= cutoff) cutoff.setDate(cutoff.getDate() + 1);
      const diff = cutoff.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };
    calcTimeLeft();
    const id = setInterval(calcTimeLeft, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E8577A]/10 to-[#F7A072]/10 border border-[#E8577A]/30 rounded-full px-4 py-2">
      <span className="w-2 h-2 bg-[#E8577A] rounded-full animate-pulse" />
      <span className="text-sm font-semibold text-[#8B3A52]">
        Order for same-day delivery in: <span className="font-bold text-[#E8577A]">{timeLeft}</span>
      </span>
    </div>
  );
}

// ─── Cart Item Card ───────────────────────────────────────────────────────────
function CartItemCard({
  item,
  index,
  onRemove,
  onIncrease,
  onDecrease,
}: {
  item: CartItem;
  index: number;
  onRemove: (i: number) => void;
  onIncrease: (i: number) => void;
  onDecrease: (i: number) => void;
}) {
  console.log(item)
  const [removing, setRemoving] = useState(false);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => onRemove(index), 350);
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-pink-50 p-5 flex gap-4 transition-all duration-350 ${
        removing ? "opacity-0 scale-95 -translate-x-4" : "opacity-100 scale-100 translate-x-0"
      }`}
      style={{ transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)" }}
    >
      {/* Product Image */}
      <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-pink-50">
        {item.image ? (
          <Image src={item.image} alt={item.title} fill className="object-cover" sizes="96px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🎂</div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-[#3D1A28] text-base leading-tight truncate">{item.title}</h3>
        <div className="flex flex-wrap gap-2 mt-1">
          <span className="text-xs bg-pink-50 text-[#8B3A52] px-2 py-0.5 rounded-full font-medium">
            {item.size}
          </span>
          <span className="text-xs bg-peach-50 bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full font-medium">
            {item.flavor}
          </span>
        </div>
        {item.customMessage && (
          <p className="text-xs text-gray-500 mt-1 italic truncate">
            ✉️ "{item.customMessage}"
          </p>
        )}

        {/* Qty + Price Row */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDecrease(index)}
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
              className="w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 text-[#E8577A] font-bold text-lg flex items-center justify-center transition-colors disabled:opacity-40"
            >
              −
            </button>
            <span className="w-6 text-center font-bold text-[#3D1A28]">{item.quantity}</span>
            <button
              onClick={() => onIncrease(index)}
              aria-label="Increase quantity"
              className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E8577A] to-[#F7A072] text-white font-bold text-lg flex items-center justify-center transition-transform hover:scale-105"
            >
              +
            </button>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">₹{item.price} each</p>
            <p className="font-bold text-[#E8577A] text-lg">₹{item.price * item.quantity}</p>
          </div>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={handleRemove}
        aria-label={`Remove ${item.title} from cart`}
        className="self-start text-gray-300 hover:text-[#E8577A] transition-colors text-xl leading-none"
      >
        ×
      </button>
    </div>
  );
}

// ─── Order Summary Card ───────────────────────────────────────────────────────
function OrderSummary({
  subtotal,
  itemCount,
}: {
  subtotal: number;
  itemCount: number;
}) {
  const delivery = subtotal >= 500 ? 0 : 80;
  const tax = Math.round(subtotal * 0.05);
  const grand = subtotal + delivery + tax;
  const freeDeliveryLeft = 500 - subtotal;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-pink-50 p-6 space-y-4">
      <h2 className="font-bold text-[#3D1A28] text-lg">Order Summary</h2>

      {/* Free delivery progress */}
      {delivery > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-gray-500">
            Add <span className="font-semibold text-[#E8577A]">₹{freeDeliveryLeft}</span> more for FREE delivery
          </p>
          <div className="h-1.5 bg-pink-50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#E8577A] to-[#F7A072] rounded-full transition-all duration-500"
              style={{ width: `${Math.min((subtotal / 500) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({itemCount} items)</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Delivery</span>
          {delivery === 0 ? (
            <span className="text-green-600 font-semibold">FREE</span>
          ) : (
            <span>₹{delivery}</span>
          )}
        </div>
        <div className="flex justify-between text-gray-600">
          <span>GST (5%)</span>
          <span>₹{tax}</span>
        </div>
        <div className="h-px bg-pink-50" />
        <div className="flex justify-between font-bold text-[#3D1A28] text-base">
          <span>Grand Total</span>
          <span className="text-[#E8577A]">₹{grand}</span>
        </div>
      </div>

      {/* Savings badge */}
      {grand < 1000 && (
        <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-center gap-2">
          <span className="text-green-500 text-lg">🏷️</span>
          <p className="text-xs text-green-700 font-medium">
            You're saving on delivery! Orders under ₹1,000 qualify for special offers.
          </p>
        </div>
      )}

      {/* Slot notice */}
      <div className="flex items-center gap-2 text-xs text-[#8B3A52]">
        <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse flex-shrink-0" />
        Only 4 delivery slots left today
      </div>

      <Link
        href="/checkout"
        aria-label="Proceed to Secure Checkout"
        className={`block w-full text-center py-3.5 rounded-xl font-bold text-white text-sm transition-all duration-200 ${
          itemCount === 0
            ? "bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none"
            : "bg-gradient-to-r from-[#E8577A] to-[#F7A072] hover:shadow-lg hover:shadow-pink-200 hover:-translate-y-0.5"
        }`}
      >
        Proceed to Checkout →
      </Link>

      {/* Trust row */}
      <div className="flex items-center justify-center gap-3 pt-1">
        <span className="text-xs text-gray-400 flex items-center gap-1">🔒 Secure</span>
        <span className="text-gray-200">|</span>
        <span className="text-xs text-gray-400 flex items-center gap-1">💳 COD Available</span>
      </div>
    </div>
  );
}

// ─── Empty Cart State ─────────────────────────────────────────────────────────
function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
      <div className="w-28 h-28 bg-gradient-to-br from-pink-50 to-orange-50 rounded-full flex items-center justify-center text-5xl shadow-inner">
        🛒
      </div>
      <div>
        <h2 className="text-2xl font-bold text-[#3D1A28] mb-2">Your cart is empty</h2>
        <p className="text-gray-500 text-sm max-w-xs">
          Looks like you haven't added any cakes yet. Explore our freshly baked collection!
        </p>
      </div>
      <Link
        href="/cakes"
        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E8577A] to-[#F7A072] text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-pink-200 hover:-translate-y-0.5 transition-all"
      >
        🎂 Browse Cakes
      </Link>
    </div>
  );
}

// ─── Upsell Product Card ──────────────────────────────────────────────────────
function UpsellCard({ product }: { product: RelatedProduct }) {
  const { addItem } = useCartStore() as any;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-pink-50 overflow-hidden group">
      <div className="relative h-44 bg-pink-50">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🍰</div>
        )}
      </div>
      <div className="p-4">
        <h4 className="font-bold text-[#3D1A28] text-sm leading-tight">{product.title}</h4>
        <p className="text-[#E8577A] font-bold mt-1">₹{product.price}</p>
        <Link
          href={`/cakes/${product.slug}`}
          className="mt-3 block w-full text-center py-2 rounded-lg border border-[#E8577A] text-[#E8577A] text-xs font-semibold hover:bg-gradient-to-r hover:from-[#E8577A] hover:to-[#F7A072] hover:text-white hover:border-transparent transition-all duration-200"
        >
          View Cake
        </Link>
      </div>
    </div>
  );
}

// ─── Main Cart Page ───────────────────────────────────────────────────────────
export default function CartPage() {
  const { items, removeItem, increaseQuantity, decreaseQuantity, getTotal } = useCartStore();
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);

  const subtotal = getTotal();
  const totalItems = items.reduce((acc: number, i: CartItem) => acc + i.quantity, 0);

  // Fetch related products from first item's category
  useEffect(() => {
    const firstCategory = items[0]?.category;
    if (!firstCategory) return;

    fetch(`/api/products/related?category=${firstCategory}&limit=3`)
      .then((r) => r.json())
      .then((data) => setRelatedProducts(data.products || []))
      .catch(() => {});
  }, [items]);

  return (
    <>
      <CartStructuredData items={items} />

      {/* ── Page Background ── */}
      <div className="min-h-screen bg-[#FFFBF8]" style={{ fontFamily: "'Poppins', sans-serif" }}>
        {/* ── Header Banner ── */}
        <div className="bg-gradient-to-r from-[#E8577A] to-[#F7A072] text-white text-center text-xs py-2 font-medium tracking-wide">
          🎂 Same-day delivery available for orders placed before 4 PM • 100% Eggless
        </div>

        <main className="max-w-6xl mx-auto px-4 py-10">
          {/* ── Page Header ── */}
          <div className="mb-8">
            <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#E8577A] transition-colors">Home</Link>
              <span>/</span>
              <Link href="/cakes" className="hover:text-[#E8577A] transition-colors">Cakes</Link>
              <span>/</span>
              <span className="text-[#E8577A] font-medium">Cart</span>
            </nav>

            <h1 className="text-3xl md:text-4xl font-extrabold text-[#3D1A28] mb-2">
              Your Cake Cart 🛒
            </h1>
            <p className="text-gray-500 text-sm mb-4">
              Review your order and proceed to secure checkout
            </p>

            {/* Countdown */}
            <DeliveryCountdown />

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              <TrustBadge icon="🥚" label="100% Eggless" />
              <TrustBadge icon="⚡" label="Same-Day Delivery" />
              <TrustBadge icon="🔒" label="Secure Checkout" />
              <TrustBadge icon="🔥" label="Freshly Baked" />
            </div>
          </div>

          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* ── Cart Items Column ── */}
              <div className="lg:col-span-2 space-y-4">
                <p className="text-sm text-gray-500 font-medium">
                  {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
                </p>

                {items.map((item: CartItem, index: number) => (
                  <CartItemCard
                    key={`${item.id}-${index}`}
                    item={item}
                    index={index}
                    onRemove={removeItem}
                    onIncrease={increaseQuantity}
                    onDecrease={decreaseQuantity}
                  />
                ))}

                {/* ── Continue Shopping ── */}
                <Link
                  href="/cakes"
                  className="inline-flex items-center gap-2 text-sm text-[#E8577A] font-semibold hover:underline"
                >
                  ← Continue Shopping
                </Link>
              </div>

              {/* ── Order Summary Column (Sticky on Desktop) ── */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-24">
                  <OrderSummary subtotal={subtotal} itemCount={totalItems} />
                </div>
              </div>
            </div>
          )}

          {/* ── Upsell Section ── */}
          {relatedProducts.length > 0 && (
            <section className="mt-16" aria-label="Related products">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-pink-100" />
                <h2 className="text-lg font-bold text-[#3D1A28] whitespace-nowrap">
                  🍰 You May Also Like
                </h2>
                <div className="h-px flex-1 bg-pink-100" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProducts.map((p) => (
                  <UpsellCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </main>

        {/* ── Mobile Bottom Sticky Bar ── */}
        {items.length > 0 && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-pink-100 shadow-2xl p-4 z-50">
            <div className="flex items-center justify-between max-w-md mx-auto">
              <div>
                <p className="text-xs text-gray-500">{totalItems} items</p>
                <p className="font-bold text-[#3D1A28] text-lg">₹{subtotal}</p>
              </div>
              <Link
                href="/checkout"
                className="bg-gradient-to-r from-[#E8577A] to-[#F7A072] text-white px-8 py-3 rounded-xl font-bold text-sm hover:shadow-lg transition-all active:scale-95"
              >
                Checkout →
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}