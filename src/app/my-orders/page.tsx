"use client";

import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderItem = {
  productId: string;
  title: string;
  slug: string;
  category: string;
  size: string;
  flavor: string;
  price: number;
  quantity: number;
  image?: string;
};

type Order = {
  id: string;
  orderNumber: string;
  name: string;
  phone: string;
  address: string;
  area: string;
  landmark?: string;
  pincode: string;
  deliveryDate: string;
  deliveryTime: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  totalPrice: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
};

type Toast = { id: number; message: string; type: "success" | "error" | "info" };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  pending:           { label: "Pending",          color: "text-amber-700",   bg: "bg-amber-50 border border-amber-200",   dot: "bg-amber-400" },
  baking:            { label: "Baking 🎂",        color: "text-sky-700",    bg: "bg-sky-50 border border-sky-200",       dot: "bg-sky-400" },
  out_for_delivery:  { label: "Out for Delivery", color: "text-violet-700", bg: "bg-violet-50 border border-violet-200", dot: "bg-violet-400" },
  delivered:         { label: "Delivered ✓",      color: "text-emerald-700",bg: "bg-emerald-50 border border-emerald-200",dot: "bg-emerald-400" },
};

const TIMELINE_STEPS = [
  { key: "pending",          icon: "📋", label: "Order Placed"   },
  { key: "baking",           icon: "🎂", label: "Baking"         },
  { key: "out_for_delivery", icon: "🛵", label: "Out for Delivery"},
  { key: "delivered",        icon: "🎉", label: "Delivered"      },
];

const STEP_ORDER = ["pending", "baking", "out_for_delivery", "delivered"];

function getStepIndex(status: string) {
  return STEP_ORDER.indexOf(status.toLowerCase());
}

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-rose-50 p-6 space-y-5 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-rose-100 rounded" />
          <div className="h-5 w-40 bg-rose-100 rounded" />
          <div className="h-3 w-32 bg-rose-50 rounded" />
        </div>
        <div className="h-7 w-24 bg-rose-100 rounded-full" />
      </div>
      <div className="flex gap-4 pt-4 border-t border-rose-50">
        <div className="w-16 h-16 bg-rose-100 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-rose-100 rounded" />
          <div className="h-3 w-1/2 bg-rose-50 rounded" />
        </div>
      </div>
      <div className="h-20 bg-rose-50 rounded-xl" />
    </div>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

function OrderTimeline({ status }: { status: string }) {
  const currentIdx = getStepIndex(status.toLowerCase());
  return (
    <div className="relative flex items-start justify-between px-2 py-4">
      {/* connecting line */}
      <div className="absolute top-[40px] left-6 right-6 h-0.5 bg-rose-100 z-0" />
      <div
        className="absolute top-[26px] left-6 h-0.5 bg-gradient-to-r from-[#E8577A] to-[#F7A072] z-0 transition-all duration-700"
        style={{ width: currentIdx >= 0 ? `${(currentIdx / 3) * 100}%` : "0%" }}
      />
      {TIMELINE_STEPS.map((step, idx) => {
        const done   = idx <= currentIdx;
        const active = idx === currentIdx;
        return (
          <div key={step.key} className="flex flex-col items-center gap-1.5 z-10 flex-1">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-500 shadow-sm
                ${active  ? "bg-gradient-to-br from-[#E8577A] to-[#F7A072] scale-110 shadow-md shadow-rose-200" :
                  done    ? "bg-rose-100 scale-100" :
                             "bg-white border-2 border-rose-100 opacity-50 scale-90"}`}
            >
              {step.icon}
            </div>
            <p className={`text-[11px] font-semibold text-center leading-tight
              ${active ? "text-[#E8577A]" : done ? "text-rose-400" : "text-gray-300"}`}>
              {step.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function ToastContainer({ toasts, remove }: { toasts: Toast[]; remove: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg text-sm font-medium text-white min-w-[220px] transition-all duration-300
            ${t.type === "success" ? "bg-gradient-to-r from-emerald-500 to-teal-500"
            : t.type === "error"   ? "bg-gradient-to-r from-rose-500 to-pink-500"
            :                        "bg-gradient-to-r from-[#E8577A] to-[#F7A072]"}`}
        >
          <span className="text-base">
            {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}
          </span>
          <span className="flex-1">{t.message}</span>
          <button onClick={() => remove(t.id)} className="opacity-70 hover:opacity-100 text-lg leading-none">×</button>
        </div>
      ))}
    </div>
  );
}

// ─── Phone Modal ──────────────────────────────────────────────────────────────

function PhoneModal({ onSave }: { onSave: (phone: string) => void }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = () => {
    if (!/^[6-9]\d{9}$/.test(input)) {
      setError("Please enter a valid 10-digit Indian mobile number");
      return;
    }
    onSave(input);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FFF5F7]/80 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl shadow-rose-100 w-full max-w-md p-8 space-y-6 border border-rose-50 relative overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-rose-100 to-peach-100 rounded-full opacity-40 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-tr from-amber-100 to-rose-100 rounded-full opacity-30 blur-xl" />

        {/* icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFF0F3] to-[#FFE4EC] flex items-center justify-center text-4xl shadow-inner">
            🎂
          </div>
        </div>

        <div className="text-center space-y-1">
          <h2 className="font-bold text-2xl text-[#3D1A28] tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Track Your Orders
          </h2>
          <p className="text-sm text-gray-400">Enter your phone number to view all your sweet orders</p>
        </div>

        <div className="space-y-2">
          <div
            className={`flex items-center border-2 rounded-2xl px-4 py-3 gap-3 transition-all duration-200
              ${focused ? "border-[#E8577A] bg-rose-50/30" : "border-rose-100 bg-white"}`}
          >
            <span className="text-[#E8577A] font-bold text-sm">+91</span>
            <div className="w-px h-5 bg-rose-200" />
            <input
              type="tel"
              maxLength={10}
              placeholder="Enter 10-digit mobile number"
              value={input}
              onChange={(e) => { setInput(e.target.value.replace(/\D/g, "")); setError(""); }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              aria-label="Mobile phone number"
              className="flex-1 outline-none text-[#3D1A28] text-sm placeholder-gray-300 bg-transparent"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            />
            {input.length === 10 && <span className="text-emerald-400 text-lg">✓</span>}
          </div>
          {error && <p className="text-xs text-rose-500 font-medium pl-2" role="alert">{error}</p>}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3.5 rounded-2xl font-bold text-white text-sm tracking-wide
            bg-gradient-to-r from-[#E8577A] to-[#F7A072]
            hover:from-[#D94870] hover:to-[#F09060]
            active:scale-[0.98] transition-all duration-200 shadow-md shadow-rose-200"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          View My Orders →
        </button>

        <p className="text-center text-xs text-gray-300">
          We only use your number to fetch your orders. No spam, ever. 🍰
        </p>
      </div>
    </div>
  );
}

// ─── Order Card ───────────────────────────────────────────────────────────────

function OrderCard({
  order,
  onCancel,
  onReorder,
}: {
  order: Order;
  onCancel: (id: string) => void;
  onReorder: (slug: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[order.status.toLowerCase()] || STATUS_CONFIG["pending"];
  const isPending = order.status.toLowerCase() === "pending";

  return (
    <article
      className="bg-white rounded-3xl shadow-sm border border-rose-50 overflow-hidden
        hover:shadow-lg hover:shadow-rose-100/60 transition-all duration-300 hover:-translate-y-0.5"
      aria-label={`Order ${order.orderNumber}`}
    >
      {/* Card Header */}
      <div className="p-6 space-y-5">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div className="space-y-0.5">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Order Number</p>
            <p className="font-bold text-xl text-[#3D1A28]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {order.orderNumber}
            </p>
            <p className="text-xs text-gray-400">Placed on {fmt(order.createdAt)}</p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${cfg.bg} ${cfg.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
            {cfg.label}
          </div>
        </div>

        {/* Timeline */}
        <OrderTimeline status={order.status} />

        {/* Items preview */}
        <div className="space-y-3">
          {(expanded ? order.items : order.items.slice(0, 2)).map((item, idx) => (
            <div key={idx} className="flex gap-4 py-3 border-t border-rose-50 first:border-t-0">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-rose-50 to-peach-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  🎂
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#3D1A28] text-sm truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {item.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {item.size} · {item.flavor}
                </p>
                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
              </div>
              <p className="font-bold text-[#E8577A] text-sm flex-shrink-0">
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </p>
            </div>
          ))}
          {order.items.length > 2 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-semibold text-[#E8577A] hover:text-[#D94870] transition-colors"
            >
              {expanded ? "Show less ↑" : `+${order.items.length - 2} more items ↓`}
            </button>
          )}
        </div>

        {/* Delivery Info */}
        <div className="bg-[#FFF5F7] rounded-2xl p-4 space-y-2 text-sm" aria-label="Delivery information">
          <p className="font-semibold text-[#3D1A28] text-xs uppercase tracking-widest mb-2">
            📦 Delivery Details
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-400">Delivery Date</p>
              <p className="font-medium text-[#3D1A28] text-xs">{fmt(order.deliveryDate)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Delivery Time</p>
              <p className="font-medium text-[#3D1A28] text-xs">{order.deliveryTime}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400">Address</p>
            <p className="font-medium text-[#3D1A28] text-xs leading-relaxed">
              {order.address}, {order.area}
              {order.landmark && `, near ${order.landmark}`}, {order.pincode}
            </p>
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-2 text-sm">
          {[
            { label: "Subtotal",     value: order.subtotal    },
            { label: "Delivery Fee", value: order.deliveryFee },
            { label: "Tax",          value: order.tax         },
          ].map((row) => (
            <div key={row.label} className="flex justify-between text-gray-500">
              <span>{row.label}</span>
              <span>₹{row.value.toLocaleString("en-IN")}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-base text-[#3D1A28] border-t border-rose-100 pt-2">
            <span>Grand Total</span>
            <span className="text-[#E8577A] text-lg">₹{order.totalPrice.toLocaleString("en-IN")}</span>
          </div>
          <p className="text-xs text-gray-400 font-medium">
            Payment: {order.paymentMethod.toUpperCase()}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-1">
          {order.items[0]?.slug && (
            <button
              onClick={() => onReorder(order.items[0].slug)}
              className="flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs font-bold
                bg-gradient-to-r from-[#E8577A] to-[#F7A072] text-white
                hover:from-[#D94870] hover:to-[#F09060] transition-all duration-200 active:scale-[0.98]"
            >
              🔁 Reorder
            </button>
          )}
          {isPending && (
            <button
              onClick={() => onCancel(order.id)}
              className="flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs font-bold
                border-2 border-rose-200 text-rose-400
                hover:bg-rose-50 transition-all duration-200 active:scale-[0.98]"
            >
              ✕ Cancel Order
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-5 text-center">
      <div className="text-7xl animate-bounce">🎂</div>
      <h3 className="font-bold text-2xl text-[#3D1A28]" style={{ fontFamily: "'Poppins', sans-serif" }}>
        No orders yet!
      </h3>
      <p className="text-gray-400 text-sm max-w-xs">
        Looks like you haven't ordered any delicious cakes yet. Start your sweet journey today!
      </p>
      <Link
        href="/products"
        className="mt-2 px-6 py-3 rounded-2xl font-bold text-white text-sm
          bg-gradient-to-r from-[#E8577A] to-[#F7A072]
          hover:from-[#D94870] hover:to-[#F09060]
          transition-all duration-200 shadow-md shadow-rose-200"
      >
        Browse Our Cakes 🍰
      </Link>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MyOrdersPage() {
  const [orders, setOrders]           = useState<Order[]>([]);
  const [phone, setPhone]             = useState<string | null>(null);
  const [loading, setLoading]         = useState(false);
  const [toasts, setToasts]           = useState<Toast[]>([]);
  const [mounted, setMounted]         = useState(false);

  // Prevent SSR mismatch for localStorage
  useEffect(() => {
    setMounted(true);
    const storedPhone = localStorage.getItem("userPhone");
    if (storedPhone) {
      setPhone(storedPhone);
      fetchOrders(storedPhone);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fetchOrders = async (phoneNumber: string) => {
    setLoading(true);
    try {
      const res  = await fetch(`/api/orders/by-phone?phone=${phoneNumber}`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      addToast("Could not load orders. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePhone = (newPhone: string) => {
    localStorage.setItem("userPhone", newPhone);
    setPhone(newPhone);
    fetchOrders(newPhone);
    addToast("Phone number saved! Fetching your orders...", "success");
  };

  const handleCancel = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (!res.ok) throw new Error();
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o))
      );
      addToast("Order cancelled successfully.", "success");
    } catch {
      addToast("Could not cancel order. Please contact support.", "error");
    }
  };

  const handleReorder = (slug: string) => {
    window.location.href = `/products/${slug}`;
  };

  const handleChangePhone = () => {
    localStorage.removeItem("userPhone");
    setPhone(null);
    setOrders([]);
  };

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "My Orders – Bliss Bites Bakery",
    "description": "Track your cake orders, delivery status, and details at Bliss Bites Bakery.",
    "url": "https://blissbiteskol.in/my-orders",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home",      "item": "https://blissbiteskol.in" },
        { "@type": "ListItem", "position": 2, "name": "My Orders", "item": "https://blissbiteskol.in/my-orders" },
      ],
    },
  };

  if (!mounted) return null;

  return (
    <>
      <Head>
        <title>My Orders | Bliss Bites Bakery Kolkata</title>
        <meta name="description" content="Track your cake orders, delivery status, and details at Bliss Bites Bakery." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      {/* Phone Modal */}
      {!phone && <PhoneModal onSave={handleSavePhone} />}

      {/* Toast */}
      <ToastContainer toasts={toasts} remove={removeToast} />

      <div className="min-h-screen bg-[#FFF5F7]" style={{ fontFamily: "'Poppins', sans-serif" }}>

        {/* ── Sticky Header ── */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-50 shadow-sm shadow-rose-50">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            {/* <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🎂</span>
              <span className="font-bold text-[#3D1A28] text-lg tracking-tight">Bliss Bites</span>
            </Link>
            <h1 className="font-bold text-[#3D1A28] text-lg tracking-tight hidden sm:block">
              My Orders
            </h1> */}
            {phone && (
              <button
                onClick={handleChangePhone}
                className="text-xs font-semibold text-[#E8577A] hover:text-[#D94870] transition-colors
                  px-3 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50"
              >
                Change Phone
              </button>
            )}
          </div>
        </header>

        {/* ── Main Content ── */}
        <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">

          {/* Page heading */}
          {phone && (
            <div className="space-y-1">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Orders for</p>
              <div className="flex items-center gap-3">
                <h2 className="font-extrabold text-3xl text-[#3D1A28] tracking-tight">My Orders</h2>
                <span className="text-sm font-semibold text-[#E8577A] bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                  +91 {phone}
                </span>
              </div>
              {!loading && (
                <p className="text-sm text-gray-400">
                  {orders.length === 0
                    ? "No orders placed yet"
                    : `${orders.length} order${orders.length === 1 ? "" : "s"} found`}
                </p>
              )}
            </div>
          )}

          {/* Loading Skeletons */}
          {loading && (
            <div className="space-y-6">
              {[1, 2].map((n) => <SkeletonCard key={n} />)}
            </div>
          )}

          {/* Orders List */}
          {!loading && orders.length > 0 && (
            <div className="space-y-6">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onCancel={handleCancel}
                  onReorder={handleReorder}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && phone && orders.length === 0 && <EmptyState />}

          {/* ── Need Help Section ── */}
          {phone && !loading && (
            <section
              className="bg-white rounded-3xl border border-rose-50 shadow-sm p-6 flex flex-col sm:flex-row items-center gap-5"
              aria-label="Customer support"
            >
              <div className="w-14 h-14 flex-shrink-0 rounded-full bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center text-3xl shadow-inner">
                💬
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-[#3D1A28] text-base">Need Help with Your Order?</h3>
                <p className="text-sm text-gray-400 mt-0.5">
                  Our team is available 24/7 to assist you with any queries about your orders.
                </p>
              </div>
              <a
                href="https://wa.me/919000000000?text=Hi%2C%20I%20need%20help%20with%20my%20order%20at%20Bliss%20Bites%20Bakery"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-white text-sm
                  bg-gradient-to-r from-emerald-500 to-teal-500
                  hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-sm shadow-emerald-200"
                aria-label="Chat on WhatsApp"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.557 4.124 1.527 5.855L0 24l6.335-1.505A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.368l-.36-.214-3.727.885.9-3.637-.235-.374A9.818 9.818 0 1112 21.818z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </section>
          )}
        </main>
      </div>
    </>
  );
}