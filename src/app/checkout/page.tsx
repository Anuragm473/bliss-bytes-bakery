"use client";

import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/src/store/cartStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";

// ─── SEO Metadata (export from page.tsx in App Router) ───────────────────────
// export const metadata: Metadata = {
//   title: "Secure Checkout | Bliss Bites Bakery Kolkata",
//   description:
//     "Securely order eggless cakes in Kolkata with same-day delivery. Custom cakes, midnight delivery, and COD available. Fresh daily.",
//   keywords: ["eggless cake Kolkata", "online cake order", "same day cake delivery Kolkata"],
// };

// ─── Structured Data ──────────────────────────────────────────────────────────
function CheckoutStructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Bliss Bites Bakery",
        url: "https://blissbitsbakery.com",
        telephone: "+91-XXXXXXXXXX",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Kolkata",
          addressCountry: "IN",
        },
      },
      {
        "@type": "WebPage",
        "@id": "https://blissbitsbakery.com/checkout",
        name: "Secure Checkout | Bliss Bites Bakery",
        description: "Checkout page for eggless cake orders in Kolkata",
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

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormState {
  name: string;
  phone: string;
  email?: string;
  address: string;
  area: string;
  landmark: string;
  pincode: string;
  deliveryDate: string;
  deliveryTime: string;
  instructions: string;
  freeCandle: boolean;
}

interface FormErrors {
  [key: string]: string;
}

// ─── Delivery Options Config ──────────────────────────────────────────────────

// ─── Trust Badge ──────────────────────────────────────────────────────────────
function TrustBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/70 backdrop-blur-sm rounded-full border border-pink-100 shadow-sm">
      <span className="text-base">{icon}</span>
      <span className="text-xs font-semibold text-[#8B3A52] whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}

// ─── Input Field ─────────────────────────────────────────────────────────────
function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  value,
  onChange,
  error,
  children,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-[#3D1A28]"
      >
        {label}
        {required && <span className="text-[#E8577A] ml-0.5">*</span>}
      </label>
      {children ?? (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all placeholder-gray-300 bg-white ${
            error
              ? "border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-400"
              : "border-pink-100 focus:ring-2 focus:ring-pink-100 focus:border-[#E8577A]"
          }`}
        />
      )}
      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          className="text-xs text-red-500 flex items-center gap-1"
        >
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

// ─── Delivery Countdown ───────────────────────────────────────────────────────
function DeliveryCountdown() {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const cutoff = new Date();
      cutoff.setHours(16, 0, 0, 0);
      if (now >= cutoff) cutoff.setDate(cutoff.getDate() + 1);
      const diff = cutoff.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 text-xs bg-orange-50 border border-orange-100 rounded-full px-3 py-1.5">
      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
      <span className="text-orange-700 font-medium">
        Same-day delivery closes in <strong>{timeLeft}</strong>
      </span>
    </div>
  );
}

// ─── Order Summary Card ───────────────────────────────────────────────────────
function OrderSummaryCard() {
  const { items, getTotal } = useCartStore();
  const subtotal = getTotal();
  const baseDelivery = subtotal >= 500 ? 0 : 80;
  const delivery = baseDelivery;
  const tax = Math.round(subtotal * 0.05);
  const grand = subtotal + delivery + tax;
  const totalQty = items.reduce((acc: number, i: any) => acc + i.quantity, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-pink-50 overflow-hidden">
      <div className="bg-gradient-to-r from-[#E8577A]/10 to-[#F7A072]/10 px-5 py-4 border-b border-pink-50">
        <h2 className="font-bold text-[#3D1A28] text-base">Order Summary</h2>
        <p className="text-xs text-gray-500">
          {totalQty} item{totalQty !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="p-5 space-y-3">
        {/* Items */}
        {items.map((item: any, i: number) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-pink-50 flex-shrink-0">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl">
                  🎂
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#3D1A28] leading-tight truncate">
                {item.title}
              </p>
              <p className="text-xs text-gray-400">
                {item.size} · {item.flavor}
              </p>
              <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
            </div>
            <p className="text-xs font-bold text-[#E8577A] flex-shrink-0">
              ₹{item.price * item.quantity}
            </p>
          </div>
        ))}

        <div className="h-px bg-pink-50 my-1" />

        {/* Pricing */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
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
          <div className="bg-green-50 border border-green-100 rounded-xl p-2.5 flex items-center gap-2">
            <span className="text-green-500">🏷️</span>
            <p className="text-xs text-green-700 font-medium">
              You qualify for special offers!
            </p>
          </div>
        )}

        {/* Conversion nudges */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="bg-pink-50 rounded-xl p-2.5 text-center">
            <p className="text-lg">⭐</p>
            <p className="text-xs font-bold text-[#3D1A28]">4.9 Rating</p>
            <p className="text-xs text-gray-400">1,200+ reviews</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-2.5 text-center">
            <p className="text-lg">🔥</p>
            <p className="text-xs font-bold text-[#3D1A28]">200+ orders</p>
            <p className="text-xs text-gray-400">today alone</p>
          </div>
        </div>

        {/* Freshly baked badge */}
        <div className="flex items-center gap-2 text-xs text-[#8B3A52] bg-pink-50/60 rounded-xl p-2.5">
          <span>🍰</span>
          <span className="font-medium">
            Baked fresh on the day of your delivery
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Form Validation ──────────────────────────────────────────────────────────
function validateForm(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.name.trim()) errors.name = "Full name is required";
  if (!/^[6-9]\d{9}$/.test(form.phone))
    errors.phone = "Enter a valid 10-digit Indian mobile number";

  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Enter a valid email";

  if (!form.address.trim()) errors.address = "Delivery address is required";
  if (!form.area.trim()) errors.area = "Area / locality is required";
  if (!/^\d{6}$/.test(form.pincode))
    errors.pincode = "Enter a valid 6-digit pincode";

  if (!form.deliveryDate) errors.deliveryDate = "Delivery date is required";

  if (!form.deliveryTime.trim())
    errors.deliveryTime = "Delivery time is required";

  return errors;
}

// ─── Main Checkout Page ───────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    address: "",
    area: "",
    landmark: "",
    pincode: "",
    deliveryDate: "",
    deliveryTime: "",
    instructions: "",
    freeCandle: false,
  });

  const todayStr = new Date().toISOString().split("T")[0];

  const set = (key: keyof FormState) => (val: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const touch = (key: string) =>
    setTouched((prev) => ({ ...prev, [key]: true }));

  const visibleErrors: FormErrors = {};
  Object.keys(errors).forEach((k) => {
    if (touched[k]) visibleErrors[k] = errors[k];
  });

  // Live-validate
  useEffect(() => {
    setErrors(validateForm(form));
  }, [form]);

  const isValid = Object.keys(errors).length === 0 && items.length > 0;

  const subtotal = getTotal();
  const delivery = subtotal >= 500 ? 0 : 80;
  const tax = Math.round(subtotal * 0.05);
  const grand = subtotal + delivery + tax;
  const baseDelivery = subtotal >= 500 ? 0 : 80;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Touch all fields to show errors
    const allTouched: Record<string, boolean> = {};
    Object.keys(form).forEach((k) => {
      allTouched[k] = true;
    });
    setTouched(allTouched);

    if (!isValid) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          address: form.address,
          area: form.area,
          landmark: form.landmark,
          pincode: form.pincode,
          deliveryDate: form.deliveryDate,
          deliveryTime: form.deliveryTime,
          instructions: form.instructions,
          freeCandle: form.freeCandle,
          items,
          subtotal,
          delivery,
          tax,
          totalPrice: grand,
        }),
      });

      if (!res.ok) throw new Error("Order failed");
      const data = await res.json();
      clearCart();
      router.push(`/success?orderId=${data.orderId}`);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <CheckoutStructuredData />

      <div
        className="min-h-screen bg-[#FFFBF8]"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {/* ── Top Banner ── */}
        <div className="bg-gradient-to-r from-[#E8577A] to-[#F7A072] text-white text-center text-xs py-2 font-medium">
          🔒 100% Secure Checkout · Same-Day Delivery Available · COD Accepted
        </div>

        <main className="max-w-6xl mx-auto px-4 py-10 pb-32 lg:pb-10">
          {/* ── Checkout Header ── */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#3D1A28] mb-2 flex items-center gap-3">
              🔒 Secure Checkout
            </h1>
            <DeliveryCountdown />
            <div className="flex flex-wrap gap-2 mt-4">
              <TrustBadge icon="🔒" label="SSL Secured" />
              <TrustBadge icon="🥚" label="100% Eggless" />
              <TrustBadge icon="⚡" label="Same-Day Delivery" />
              <TrustBadge icon="💳" label="Secure Payment" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* ── Left: Form ── */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="lg:col-span-3 space-y-6"
              aria-label="Checkout form"
            >
              {/* ━━ Billing Details ━━ */}
              <section className="bg-white rounded-2xl shadow-sm border border-pink-50 p-6 space-y-5">
                <h2 className="font-bold text-[#3D1A28] text-base flex items-center gap-2">
                  <span className="w-6 h-6 bg-gradient-to-br from-[#E8577A] to-[#F7A072] text-white text-xs rounded-full flex items-center justify-center font-bold">
                    1
                  </span>
                  Billing Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Full Name"
                    name="name"
                    required
                    placeholder="Priya Sharma"
                    value={form.name}
                    onChange={(v) => {
                      set("name")(v);
                      touch("name");
                    }}
                    error={visibleErrors.name}
                  />
                  <Field
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={form.phone}
                    onChange={(v) => {
                      set("phone")(v);
                      touch("phone");
                    }}
                    error={visibleErrors.phone}
                  />
                </div>

                <Field
                  label="Delivery Address"
                  name="address"
                  required
                  placeholder="Flat / House No., Street, Building"
                  value={form.address}
                  onChange={(v) => {
                    set("address")(v);
                    touch("address");
                  }}
                  error={visibleErrors.address}
                >
                  <textarea
                    id="address"
                    name="address"
                    rows={2}
                    required
                    placeholder="Flat / House No., Street, Building"
                    value={form.address}
                    onChange={(e) => {
                      set("address")(e.target.value);
                      touch("address");
                    }}
                    aria-invalid={!!visibleErrors.address}
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all placeholder-gray-300 bg-white resize-none ${
                      visibleErrors.address
                        ? "border-red-300 focus:ring-2 focus:ring-red-200"
                        : "border-pink-100 focus:ring-2 focus:ring-pink-100 focus:border-[#E8577A]"
                    }`}
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field
                    label="Area / Locality"
                    name="area"
                    required
                    placeholder="Salt Lake, Dumdum…"
                    value={form.area}
                    onChange={(v) => {
                      set("area")(v);
                      touch("area");
                    }}
                    error={visibleErrors.area}
                  />
                  <Field
                    label="Landmark"
                    name="landmark"
                    placeholder="Near metro, school…"
                    value={form.landmark}
                    onChange={(v) => set("landmark")(v)}
                  />
                  <Field
                    label="Pincode"
                    name="pincode"
                    required
                    placeholder="700001"
                    value={form.pincode}
                    onChange={(v) => {
                      set("pincode")(v);
                      touch("pincode");
                    }}
                    error={visibleErrors.pincode}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Delivery Date"
                    name="deliveryDate"
                    type="date"
                    required
                    value={form.deliveryDate}
                    onChange={(v) => {
                      set("deliveryDate")(v);
                      touch("deliveryDate");
                    }}
                    error={visibleErrors.deliveryDate}
                  >
                    <input
                      id="deliveryDate"
                      name="deliveryDate"
                      type="date"
                      required
                      min={todayStr}
                      value={form.deliveryDate}
                      onChange={(e) => {
                        set("deliveryDate")(e.target.value);
                        touch("deliveryDate");
                      }}
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all bg-white ${
                        visibleErrors.deliveryDate
                          ? "border-red-300 focus:ring-2 focus:ring-red-200"
                          : "border-pink-100 focus:ring-2 focus:ring-pink-100 focus:border-[#E8577A]"
                      }`}
                    />
                  </Field>

                  <Field
                    label="Preferred Delivery Time"
                    name="deliveryTime"
                    required
                    placeholder="e.g. 5:30 PM"
                    value={form.deliveryTime}
                    onChange={(v) => {
                      set("deliveryTime")(v);
                      touch("deliveryTime");
                    }}
                    error={visibleErrors.deliveryTime}
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="instructions"
                    className="block text-sm font-semibold text-[#3D1A28]"
                  >
                    Special Instructions
                  </label>
                  <textarea
                    id="instructions"
                    name="instructions"
                    rows={2}
                    placeholder="Any special requests, allergies, or cake messages…"
                    value={form.instructions}
                    onChange={(e) => set("instructions")(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-pink-100 focus:ring-2 focus:ring-pink-100 focus:border-[#E8577A] text-sm outline-none transition-all placeholder-gray-300 bg-white resize-none"
                  />
                </div>

                {/* Free Candle Toggle */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    role="checkbox"
                    aria-checked={form.freeCandle}
                    tabIndex={0}
                    onClick={() => set("freeCandle")(!form.freeCandle)}
                    onKeyDown={(e) =>
                      e.key === " " && set("freeCandle")(!form.freeCandle)
                    }
                    className={`w-11 h-6 rounded-full transition-all duration-200 relative flex-shrink-0 ${
                      form.freeCandle
                        ? "bg-gradient-to-r from-[#E8577A] to-[#F7A072]"
                        : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                        form.freeCandle ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#3D1A28]">
                      🕯️ Add free birthday candle
                    </p>
                    <p className="text-xs text-gray-400">
                      Complimentary with every order
                    </p>
                  </div>
                </label>
              </section>

              {/* ━━ Delivery Options ━━ */}

              {/* ━━ Payment Method ━━ */}
              <section className="bg-white rounded-2xl shadow-sm border border-pink-50 p-6">
                <h2 className="font-bold text-[#3D1A28] text-base flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 bg-gradient-to-br from-[#E8577A] to-[#F7A072] text-white text-xs rounded-full flex items-center justify-center font-bold">
                    2
                  </span>
                  Payment Method
                </h2>

                <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-[#E8577A] bg-pink-50/50">
                  <span className="text-2xl">💵</span>
                  <div>
                    <p className="text-sm font-semibold text-[#3D1A28]">
                      Cash on Delivery (COD)
                    </p>
                    <p className="text-xs text-gray-400">
                      Pay when your cake is delivered
                    </p>
                  </div>
                </div>
              </section>

              {/* ━━ Place Order Button (desktop) ━━ */}
              <button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                aria-label="Place your order"
                className={`hidden lg:flex w-full items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-base transition-all duration-200 ${
                  isSubmitting || items.length === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#E8577A] to-[#F7A072] hover:shadow-xl hover:shadow-pink-200 hover:-translate-y-0.5 active:scale-98"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Placing Order…
                  </>
                ) : (
                  <>🎂 Place Order · ₹{grand}</>
                )}
              </button>

              {/* Security footer */}
              <div className="text-center space-y-2">
                <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                  🔒 Your payment information is encrypted and secure
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                  <a
                    href="/privacy"
                    className="hover:text-[#E8577A] transition-colors"
                  >
                    Privacy Policy
                  </a>
                  <span>·</span>
                  <a
                    href="/refunds"
                    className="hover:text-[#E8577A] transition-colors"
                  >
                    Refund Policy
                  </a>
                  <span>·</span>
                  <a
                    href="/terms"
                    className="hover:text-[#E8577A] transition-colors"
                  >
                    Terms
                  </a>
                </div>
              </div>
            </form>

            {/* ── Right: Order Summary (Sticky) ── */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-24">
                <OrderSummaryCard />
              </div>
            </div>
          </div>
        </main>

        {/* ── Mobile Bottom Bar ── */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-pink-100 shadow-2xl p-4 z-50">
          <div className="flex items-center justify-between max-w-md mx-auto gap-4">
            <div>
              <p className="text-xs text-gray-500">
                {items.length} item{items.length !== 1 ? "s" : ""}
              </p>
              <p className="font-bold text-[#3D1A28]">₹{grand}</p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || items.length === 0}
              className={`flex-1 py-3 rounded-xl font-bold text-white text-sm transition-all ${
                isSubmitting || items.length === 0
                  ? "bg-gray-200 text-gray-400"
                  : "bg-gradient-to-r from-[#E8577A] to-[#F7A072] active:scale-95"
              }`}
            >
              {isSubmitting ? "Placing…" : "Place Order →"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
