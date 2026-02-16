"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// ─── Types ─────────────────────────────────────────────────────────────────

type OrderItem = {
  productId?: string;
  title: string;
  category?: string;
  quantity: number;
  price: number;
  size?: string;
  flavor?: string;
  image?: string;
};

type Order = {
  id: string;
  orderNumber: string;
  userId?: string;
  user?: { id: string; phone: string; name?: string };
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
  paymentMethod: "cod";
  status: "pending" | "placed" | "baking" | "out_for_delivery" | "delivered" | "cancelled";
  createdAt: string;
};

type Toast = { id: string; message: string; type: "success" | "error" };
type DateFilter = "all" | "today" | "week" | "custom";

// ─── Constants ─────────────────────────────────────────────────────────────

const STATUS_FLOW = ["pending", "placed", "baking", "out_for_delivery", "delivered"] as const;

const STATUS_META: Record<string, { label: string; emoji: string; bg: string; text: string; ring: string; dot: string }> = {
  pending:          { label: "Pending",          emoji: "⏳", bg: "bg-gray-50",    text: "text-gray-600",    ring: "ring-gray-200",   dot: "bg-gray-400"   },
  placed:           { label: "Placed",            emoji: "📋", bg: "bg-blue-50",   text: "text-blue-700",   ring: "ring-blue-200",   dot: "bg-blue-500"   },
  baking:           { label: "Baking",            emoji: "🔥", bg: "bg-amber-50",  text: "text-amber-700",  ring: "ring-amber-200",  dot: "bg-amber-500"  },
  out_for_delivery: { label: "Out for Delivery",  emoji: "🛵", bg: "bg-violet-50", text: "text-violet-700", ring: "ring-violet-200", dot: "bg-violet-500" },
  delivered:        { label: "Delivered",         emoji: "✅", bg: "bg-emerald-50",text: "text-emerald-700",ring: "ring-emerald-200",dot: "bg-emerald-500"},
  cancelled:        { label: "Cancelled",         emoji: "✕",  bg: "bg-rose-50",   text: "text-rose-600",   ring: "ring-rose-200",   dot: "bg-rose-500"   },
};

const ALL_STATUSES = ["pending", "placed", "baking", "out_for_delivery", "delivered", "cancelled"] as const;

// ─── Helpers ────────────────────────────────────────────────────────────────

function isToday(d: string) {
  const date = new Date(d), now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
}

function isThisWeek(d: string) {
  const date = new Date(d), now = new Date();
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay()); weekStart.setHours(0,0,0,0);
  return date >= weekStart;
}

function isThisMonth(d: string) {
  const date = new Date(d), now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

function fmtCurrency(n: number) { return `₹${n.toLocaleString("en-IN")}`; }

function fmtDatetime(s: string) {
  return new Date(s).toLocaleString("en-IN", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" });
}

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d;
  });
}

function uid() { return Math.random().toString(36).slice(2); }

// ─── Image Lightbox ──────────────────────────────────────────────────────────

function ImageLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-lightbox-backdrop" />

      {/* Panel */}
      <div
        className="relative z-10 max-w-2xl w-full animate-lightbox-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close image"
          className="absolute -top-3 -right-3 z-20 w-9 h-9 rounded-full bg-white shadow-xl flex items-center justify-center text-[#8B5870] hover:text-[#E8577A] hover:scale-110 transition-all duration-150 border border-pink-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>

        {/* Image card */}
        <div className="rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-white">
          <img
            src={src}
            alt={alt}
            className="w-full max-h-[80vh] object-contain bg-gradient-to-br from-[#FFF0F3] to-[#FFF5EE]"
          />
          {/* Caption bar */}
          <div className="px-5 py-3 bg-white border-t border-pink-50 flex items-center gap-3">
            <span className="text-lg">🎂</span>
            <p className="text-sm font-black text-[#3D1A28] truncate">{alt}</p>
            <span className="ml-auto text-[10px] text-[#C49BAA] font-semibold whitespace-nowrap">Click outside to close · Esc</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Toast System ───────────────────────────────────────────────────────────

function ToastContainer({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold backdrop-blur-md border transition-all duration-300 animate-slide-up
            ${t.type === "success"
              ? "bg-emerald-50/95 text-emerald-700 border-emerald-200"
              : "bg-rose-50/95 text-rose-700 border-rose-200"}`}
        >
          <span>{t.type === "success" ? "✅" : "❌"}</span>
          {t.message}
          <button onClick={() => dismiss(t.id)} className="ml-2 opacity-50 hover:opacity-100 text-xs">✕</button>
        </div>
      ))}
    </div>
  );
}

// ─── Status Badge ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const m = STATUS_META[status] ?? { label: status, emoji: "•", bg: "bg-gray-50", text: "text-gray-600", ring: "ring-gray-200", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ring-1 ${m.bg} ${m.text} ${m.ring}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

// ─── KPI Card ───────────────────────────────────────────────────────────────

function KPICard({ label, value, icon, from, to, sub }: { label: string; value: string | number; icon: string; from: string; to: string; sub?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl p-5 shadow-sm border border-white/70 bg-gradient-to-br ${from} ${to} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`}>
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
      <div className="absolute -bottom-8 -left-4 w-20 h-20 rounded-full bg-white/5" />
      <div className="relative">
        <span className="text-3xl leading-none">{icon}</span>
        <p className="mt-3 text-2xl font-black tracking-tight text-[#3D1A28]">{value}</p>
        <p className="text-[10px] font-bold text-[#8B5870] uppercase tracking-widest mt-0.5">{label}</p>
        {sub && <p className="text-xs text-[#C49BAA] mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Order Timeline ──────────────────────────────────────────────────────────

function OrderTimeline({ status }: { status: string }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-rose-50 rounded-xl border border-rose-100">
        <span className="text-lg">✕</span>
        <span className="text-sm font-semibold text-rose-600">Order Cancelled</span>
      </div>
    );
  }
  const currentIdx = STATUS_FLOW.indexOf(status as typeof STATUS_FLOW[number]);
  return (
    <div className="relative">
      <div className="flex items-start gap-0">
        {STATUS_FLOW.map((step, i) => {
          const m = STATUS_META[step];
          const done = i <= currentIdx;
          const active = i === currentIdx;
          return (
            <div key={step} className="flex-1 flex flex-col items-center">
              <div className="flex items-center w-full">
                <div className={`relative w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 transition-all duration-300 ring-2
                  ${active ? "ring-[#E8577A] bg-gradient-to-br from-[#E8577A] to-[#F7A072] shadow-lg scale-110" :
                    done ? "ring-emerald-300 bg-emerald-100" : "ring-gray-200 bg-gray-50"}`}>
                  {active ? m.emoji : done ? "✓" : <span className="text-gray-300 text-xs">○</span>}
                </div>
                {i < STATUS_FLOW.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 rounded transition-colors duration-300 ${i < currentIdx ? "bg-emerald-300" : "bg-gray-200"}`} />
                )}
              </div>
              <p className={`text-[10px] font-semibold mt-1.5 text-center leading-tight
                ${active ? "text-[#E8577A]" : done ? "text-emerald-600" : "text-gray-400"}`}>
                {m.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Skeleton ───────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white/70 rounded-2xl border border-pink-50 p-5 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-pink-100" />
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-pink-100 rounded w-1/3" />
          <div className="h-2.5 bg-pink-50 rounded w-1/4" />
        </div>
        <div className="h-6 w-20 bg-pink-100 rounded-full" />
        <div className="h-5 w-16 bg-pink-50 rounded" />
      </div>
    </div>
  );
}

// ─── Analytics Bar Chart ─────────────────────────────────────────────────────

function AnalyticsPanel({ orders }: { orders: Order[] }) {
  const days = getLast7Days();
  const chartData = days.map(d => {
    const label = d.toLocaleDateString("en-IN", { weekday: "short" });
    const revenue = orders
      .filter(o => o.status !== "cancelled")
      .filter(o => {
        const od = new Date(o.createdAt);
        return od.getDate() === d.getDate() && od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
      })
      .reduce((s, o) => s + o.totalPrice, 0);
    return { label, revenue };
  });

  const revenueToday = orders.filter(o => isToday(o.createdAt) && o.status !== "cancelled").reduce((s, o) => s + o.totalPrice, 0);
  const revenueWeek  = orders.filter(o => isThisWeek(o.createdAt) && o.status !== "cancelled").reduce((s, o) => s + o.totalPrice, 0);
  const revenueMonth = orders.filter(o => isThisMonth(o.createdAt) && o.status !== "cancelled").reduce((s, o) => s + o.totalPrice, 0);

  return (
    <section className="bg-white/70 backdrop-blur-sm rounded-3xl border border-pink-50 shadow-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-base font-black text-[#3D1A28] tracking-tight">Revenue Analytics</h2>
          <p className="text-xs text-[#C49BAA] mt-0.5">Based on non-cancelled orders</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Today", value: revenueToday, icon: "☀️" },
            { label: "This Week", value: revenueWeek, icon: "📅" },
            { label: "This Month", value: revenueMonth, icon: "📆" },
          ].map(s => (
            <div key={s.label} className="text-center px-4 py-2 rounded-2xl bg-gradient-to-br from-[#FDE8EE]/60 to-[#FDDDC8]/50 border border-pink-100">
              <p className="text-[10px] text-[#C49BAA] font-bold uppercase tracking-widest">{s.icon} {s.label}</p>
              <p className="text-sm font-black text-[#3D1A28]">{fmtCurrency(s.value)}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#FDE8EE" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#C49BAA", fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#C49BAA" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} width={48} />
            <Tooltip
              contentStyle={{ background: "rgba(255,245,248,0.95)", border: "1px solid #FDE8EE", borderRadius: 16, fontSize: 12, fontWeight: 700, color: "#3D1A28", boxShadow: "0 4px 24px rgba(232,87,122,0.1)" }}
              formatter={(v: number) => [fmtCurrency(v), "Revenue"]}
              cursor={{ fill: "rgba(247,160,114,0.08)", radius: 8 }}
            />
            <Bar dataKey="revenue" radius={[8, 8, 0, 0]} fill="url(#barGrad)" />
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E8577A" />
                <stop offset="100%" stopColor="#F7A072" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

export default function AdminOrdersDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [view, setView] = useState<"table" | "cards">("table");
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [sortNewest, setSortNewest] = useState(true);

  // ── Toast helpers ─────────────────────────────────────────────────────────

  const addToast = useCallback((message: string, type: Toast["type"]) => {
    const id = uid();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  const dismissToast = useCallback((id: string) => setToasts(t => t.filter(x => x.id !== id)), []);

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data: Order[] = await res.json();
      setOrders(data);
    } catch {
      addToast("Failed to load orders. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // ── Update Status ─────────────────────────────────────────────────────────

  const updateStatus = useCallback(async (id: string, status: string) => {
    setUpdatingId(id);
    const prev = orders.find(o => o.id === id)?.status;
    setOrders(arr => arr.map(o => o.id === id ? { ...o, status: status as Order["status"] } : o));
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      addToast(`Status updated to "${STATUS_META[status]?.label}"`, "success");
    } catch {
      setOrders(arr => arr.map(o => o.id === id ? { ...o, status: (prev ?? "pending") as Order["status"] } : o));
      addToast("Failed to update status.", "error");
    } finally {
      setUpdatingId(null);
    }
  }, [orders, addToast]);

  // ── Stats ─────────────────────────────────────────────────────────────────

  const stats = useMemo(() => ({
    total: orders.length,
    today: orders.filter(o => isToday(o.createdAt)).length,
    revenue: orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.totalPrice, 0),
    pending: orders.filter(o => o.status === "pending" || o.status === "placed" || o.status === "baking").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  }), [orders]);

  // ── Filtered Orders ───────────────────────────────────────────────────────

  const filteredOrders = useMemo(() => {
    let r = [...orders];

    if (filterStatus !== "all") r = r.filter(o => o.status === filterStatus);

    if (dateFilter === "today") r = r.filter(o => isToday(o.createdAt));
    else if (dateFilter === "week") r = r.filter(o => isThisWeek(o.createdAt));
    else if (dateFilter === "custom" && customStart && customEnd) {
      const s = new Date(customStart), e = new Date(customEnd); e.setHours(23,59,59);
      r = r.filter(o => { const d = new Date(o.createdAt); return d >= s && d <= e; });
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(o =>
        o.name.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        o.orderNumber.toLowerCase().includes(q)
      );
    }

    r.sort((a, b) => {
      const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sortNewest ? diff : -diff;
    });

    return r;
  }, [orders, filterStatus, dateFilter, customStart, customEnd, search, sortNewest]);

  // ── Loading ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF0F3] via-[#FFF5EE] to-[#FFF0E8] p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-16 bg-white/70 rounded-3xl animate-pulse" />
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {Array(6).fill(0).map((_, i) => <div key={i} className="h-28 bg-white/60 rounded-3xl animate-pulse" style={{ animationDelay: `${i*80}ms` }} />)}
          </div>
          <div className="h-20 bg-white/70 rounded-2xl animate-pulse" />
          {Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @keyframes slide-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.25s ease-out both; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.2s ease-out both; }
        @keyframes lightbox-backdrop { from { opacity: 0; } to { opacity: 1; } }
        .animate-lightbox-backdrop { animation: lightbox-backdrop 0.2s ease-out both; }
        @keyframes lightbox-in { from { opacity: 0; transform: scale(0.88) translateY(16px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-lightbox-in { animation: lightbox-in 0.25s cubic-bezier(0.34,1.56,0.64,1) both; }
      `}</style>

      <ToastContainer toasts={toasts} dismiss={dismissToast} />

      {/* ── Image Lightbox ──────────────────────────────────────────────── */}
      {lightboxImage && (
        <ImageLightbox
          src={lightboxImage.src}
          alt={lightboxImage.alt}
          onClose={() => setLightboxImage(null)}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-[#FFF0F3] via-[#FFF5EE] to-[#FFF0E8]" style={{ fontFamily: "'Nunito', 'system-ui', sans-serif" }}>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <header className="bg-white/85 backdrop-blur-md border-b border-pink-100/80 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F7A072] to-[#E8577A] flex items-center justify-center shadow-md">
                <span className="text-xl leading-none">🧁</span>
              </div>
              <div>
                <h1 className="text-lg font-black text-[#3D1A28] leading-tight tracking-tight">Orders Dashboard</h1>
                <p className="text-[10px] text-[#C49BAA] font-semibold uppercase tracking-widest hidden sm:block">Bliss Bites Bakery</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* View toggle */}
              <div className="hidden sm:flex items-center bg-pink-50 rounded-xl p-1 border border-pink-100">
                {(["table", "cards"] as const).map(v => (
                  <button key={v} onClick={() => setView(v)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${view === v ? "bg-white text-[#E8577A] shadow-sm" : "text-[#C49BAA] hover:text-[#8B5870]"}`}>
                    {v === "table" ? "⊞ Table" : "☰ Cards"}
                  </button>
                ))}
              </div>

              <button onClick={fetchOrders} aria-label="Refresh"
                className="p-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-[#E8577A] transition-colors border border-pink-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                </svg>
              </button>

              <Link href="/admin/products"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#E8577A] to-[#F7A072] text-white text-xs font-bold shadow-md hover:shadow-lg hover:opacity-95 transition-all">
                🧁 Products
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>

              <Link href="/admin/form"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#8B5870] to-[#C49BAA] text-white text-xs font-bold shadow-md hover:shadow-lg hover:opacity-95 transition-all">
                📝 Form
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">

          {/* ── KPI Cards ────────────────────────────────────────────────── */}
          <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <KPICard label="Total Orders"   value={stats.total}                icon="📦" from="from-[#FDE8EE]" to="to-[#FFF5F7]" />
            <KPICard label="Today's Orders" value={stats.today}                icon="🗓️" from="from-[#FFF5EE]" to="to-[#FFEEE8]" />
            <KPICard label="Total Revenue"  value={fmtCurrency(stats.revenue)} icon="💰" from="from-[#FFFBEA]" to="to-[#FFF5EE]" />
            <KPICard label="In Progress"    value={stats.pending}              icon="⏳" from="from-[#F3F0FF]" to="to-[#FFF0FF]" />
            <KPICard label="Delivered"      value={stats.delivered}            icon="✅" from="from-[#ECFDF5]" to="to-[#F0FFF8]" />
            <KPICard label="Cancelled"      value={stats.cancelled}            icon="✕"  from="from-[#FFF1F2]" to="to-[#FFF5F5]" />
          </section>

          {/* ── Analytics ────────────────────────────────────────────────── */}
          <AnalyticsPanel orders={orders} />

          {/* ── Filters ──────────────────────────────────────────────────── */}
          <section className="sticky top-[65px] z-40 bg-white/85 backdrop-blur-md rounded-3xl border border-pink-100 shadow-sm px-5 py-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#C49BAA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input type="search" placeholder="Search name, phone, order #…" value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-pink-100 bg-pink-50/50 text-[#3D1A28] placeholder-[#C49BAA] focus:outline-none focus:ring-2 focus:ring-[#E8577A]/25 transition" />
              </div>

              {/* Date filter */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(["all", "today", "week", "custom"] as DateFilter[]).map(df => (
                  <button key={df} onClick={() => setDateFilter(df)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${dateFilter === df ? "bg-[#3D1A28] text-white shadow-md" : "bg-pink-50 text-[#8B5870] hover:bg-pink-100 border border-pink-100"}`}>
                    {df === "all" ? "📅 All" : df === "today" ? "☀️ Today" : df === "week" ? "🗓 Week" : "🔧 Custom"}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <button onClick={() => setSortNewest(v => !v)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-pink-50 text-[#8B5870] hover:bg-pink-100 border border-pink-100 transition-colors whitespace-nowrap">
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-3.5 h-3.5 transition-transform ${sortNewest ? "" : "rotate-180"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
                {sortNewest ? "Newest" : "Oldest"}
              </button>

              <span className="self-center text-xs text-[#C49BAA] ml-auto hidden sm:block font-semibold">
                {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Custom date range */}
            {dateFilter === "custom" && (
              <div className="flex items-center gap-3 flex-wrap animate-fade-in">
                <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-pink-100 bg-pink-50/50 text-[#3D1A28] focus:outline-none focus:ring-2 focus:ring-[#E8577A]/25" />
                <span className="text-[#C49BAA] text-xs font-bold">→</span>
                <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-pink-100 bg-pink-50/50 text-[#3D1A28] focus:outline-none focus:ring-2 focus:ring-[#E8577A]/25" />
              </div>
            )}

            {/* Status pills */}
            <div className="flex items-center gap-2 flex-wrap" role="group">
              <button onClick={() => setFilterStatus("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filterStatus === "all" ? "bg-gradient-to-r from-[#E8577A] to-[#F7A072] text-white shadow-md" : "bg-pink-50 text-[#8B5870] hover:bg-pink-100 border border-pink-100"}`}>
                All
              </button>
              {ALL_STATUSES.map(s => {
                const m = STATUS_META[s];
                return (
                  <button key={s} onClick={() => setFilterStatus(s)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold ring-1 transition-all ${filterStatus === s ? `${m.bg} ${m.text} ${m.ring} shadow-md scale-105` : "bg-pink-50/70 text-[#8B5870] ring-pink-100 hover:bg-pink-100"}`}>
                    {m.emoji} {m.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── Empty State ───────────────────────────────────────────────── */}
          {filteredOrders.length === 0 && (
            <div className="text-center py-24">
              <p className="text-7xl mb-4 opacity-60">🍰</p>
              <p className="text-[#8B5870] font-black text-lg">No orders found</p>
              <p className="text-sm text-[#C49BAA] mt-1.5">Try adjusting filters or clearing your search.</p>
            </div>
          )}

          {/* ── TABLE VIEW ───────────────────────────────────────────────── */}
          {filteredOrders.length > 0 && view === "table" && (
            <section className="bg-white/75 backdrop-blur-sm rounded-3xl border border-pink-50 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-pink-50 bg-gradient-to-r from-[#FFF0F3]/80 to-[#FFF5EE]/80">
                      {["Order #", "Customer", "Delivery", "Items", "Total", "Payment", "Status", "Actions"].map(h => (
                        <th key={h} className="px-4 py-3.5 text-left text-[10px] font-black text-[#8B5870] uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-50/80">
                    {filteredOrders.map((order, idx) => {
                      const isExpanded = expandedId === order.id;
                      const isUpdating = updatingId === order.id;
                      return (
                        <>
                          <tr key={order.id}
                            className={`hover:bg-pink-50/30 transition-colors cursor-pointer ${isExpanded ? "bg-pink-50/40" : ""}`}
                            style={{ animationDelay: `${idx * 30}ms` }}
                            onClick={() => setExpandedId(isExpanded ? null : order.id)}>
                            <td className="px-4 py-3.5">
                              <code className="text-xs font-black text-[#E8577A] bg-pink-50 px-2 py-0.5 rounded-lg">{order.orderNumber}</code>
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FDE8EE] to-[#FDDDC8] flex items-center justify-center flex-shrink-0 border border-pink-100">
                                  <span className="text-xs font-black text-[#E8577A]">{order.name.charAt(0).toUpperCase()}</span>
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-[#3D1A28] leading-tight">{order.name}</p>
                                  <p className="text-[10px] text-[#C49BAA]">{order.phone}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <p className="text-xs font-bold text-[#3D1A28]">📅 {order.deliveryDate}</p>
                              <p className="text-[10px] text-[#C49BAA]">⏰ {order.deliveryTime}</p>
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-1.5">
                                {/* Show up to 3 item thumbnails */}
                                <div className="flex -space-x-2">
                                  {order.items.slice(0, 3).map((item, i) => (
                                    <div key={i}
                                      className="w-8 h-8 rounded-lg overflow-hidden border-2 border-white bg-gradient-to-br from-[#FDE8EE] to-[#FDDDC8] flex-shrink-0 shadow-sm cursor-zoom-in hover:scale-110 hover:z-10 transition-transform duration-150"
                                      style={{ zIndex: 3 - i }}
                                      title={item.title}
                                      onClick={e => { e.stopPropagation(); item.image && setLightboxImage({ src: item.image, alt: item.title }); }}>
                                      {item.image ? (
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                      ) : (
                                        <span className="w-full h-full flex items-center justify-center text-sm">🎂</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                <span className="text-xs font-bold text-[#8B5870]">
                                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="text-sm font-black text-[#E8577A]">{fmtCurrency(order.totalPrice)}</span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-50 text-gray-600 ring-1 ring-gray-200 text-[10px] font-bold">💵 COD</span>
                            </td>
                            <td className="px-4 py-3.5">
                              <StatusBadge status={order.status} />
                            </td>
                            <td className="px-4 py-3.5">
                              <button
                                className={`w-7 h-7 flex items-center justify-center rounded-xl bg-pink-50 hover:bg-pink-100 text-[#C49BAA] transition-all border border-pink-100 ${isExpanded ? "rotate-180 text-[#E8577A] bg-pink-100" : ""}`}
                                aria-expanded={isExpanded} aria-label="Expand order">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                              </button>
                            </td>
                          </tr>

                          {/* Expanded Row */}
                          {isExpanded && (
                            <tr key={`exp-${order.id}`}>
                              <td colSpan={8} className="px-4 pb-5 pt-4 bg-gradient-to-r from-[#FFF5F7]/80 to-[#FFF5EE]/80 border-b border-pink-100 animate-fade-in">
                                <ExpandedDetails order={order} isUpdating={isUpdating} updateStatus={updateStatus} onImageClick={(src, alt) => setLightboxImage({ src, alt })} />
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ── CARDS VIEW ───────────────────────────────────────────────── */}
          {filteredOrders.length > 0 && view === "cards" && (
            <section className="space-y-3">
              {filteredOrders.map((order, idx) => {
                const isExpanded = expandedId === order.id;
                const isUpdating = updatingId === order.id;
                return (
                  <article key={order.id}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-50 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                    style={{ animationDelay: `${idx * 40}ms` }}>
                    <div className="px-5 py-4 cursor-pointer select-none"
                      onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      role="button" tabIndex={0} aria-expanded={isExpanded}
                      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setExpandedId(isExpanded ? null : order.id); }}}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FDE8EE] to-[#FDDDC8] flex items-center justify-center flex-shrink-0 border border-pink-100">
                            <span className="text-sm font-black text-[#E8577A]">{order.name.charAt(0).toUpperCase()}</span>
                          </div>
                          {/* First item image preview */}
                          {order.items[0]?.image && (
                            <div
                              className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 border border-pink-100 shadow-sm cursor-zoom-in hover:scale-110 transition-transform duration-150"
                              onClick={e => { e.stopPropagation(); setLightboxImage({ src: order.items[0].image!, alt: order.items[0].title }); }}
                              title="Click to enlarge"
                            >
                              <img src={order.items[0].image} alt={order.items[0].title} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h2 className="text-sm font-black text-[#3D1A28]">{order.name}</h2>
                              <code className="text-[10px] font-bold text-[#E8577A] bg-pink-50 px-1.5 py-0.5 rounded-lg">{order.orderNumber}</code>
                            </div>
                            <p className="text-xs text-[#C49BAA]">{order.phone} · 📅 {order.deliveryDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <StatusBadge status={order.status} />
                          <span className="text-sm font-black text-[#E8577A]">{fmtCurrency(order.totalPrice)}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 text-[#C49BAA] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m6 9 6 6 6-6"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-pink-50 px-5 pb-5 pt-4 animate-fade-in">
                        <ExpandedDetails order={order} isUpdating={isUpdating} updateStatus={updateStatus} onImageClick={(src, alt) => setLightboxImage({ src, alt })} />
                      </div>
                    )}
                  </article>
                );
              })}
            </section>
          )}
        </main>
      </div>
    </>
  );
}

// ─── Expanded Details ────────────────────────────────────────────────────────

function ExpandedDetails({
  order,
  isUpdating,
  updateStatus,
  onImageClick,
}: {
  order: Order;
  isUpdating: boolean;
  updateStatus: (id: string, status: string) => void;
  onImageClick: (src: string, alt: string) => void;
}) {
  return (
    <div className="space-y-5">
      {/* Timeline */}
      <div>
        <p className="text-[10px] font-black text-[#8B5870] uppercase tracking-widest mb-3">Order Timeline</p>
        <OrderTimeline status={order.status} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Delivery Info */}
        <InfoBox title="Delivery Info" icon="🚚">
          <InfoRow icon="📅" label="Date" value={order.deliveryDate} />
          <InfoRow icon="⏰" label="Time" value={order.deliveryTime} />
          <InfoRow icon="💳" label="Payment" value="Cash on Delivery" />
        </InfoBox>

        {/* Address */}
        <InfoBox title="Delivery Address" icon="📍">
          <p className="text-sm text-[#3D1A28] font-medium">{order.address}, {order.area}</p>
          {order.landmark && <p className="text-xs text-[#8B5870] mt-1">Near: {order.landmark}</p>}
          <p className="text-xs text-[#C49BAA] mt-1">PIN: {order.pincode}</p>
        </InfoBox>

        {/* Pricing */}
        <InfoBox title="Pricing Breakdown" icon="💰">
          <div className="space-y-1.5 text-sm">
            {[
              { label: "Subtotal", value: order.subtotal },
              { label: "Delivery", value: order.deliveryFee },
              { label: "Tax", value: order.tax },
            ].map(r => (
              <div key={r.label} className="flex justify-between text-[#8B5870]">
                <span>{r.label}</span><span>{fmtCurrency(r.value)}</span>
              </div>
            ))}
            <div className="flex justify-between font-black text-[#3D1A28] text-base border-t border-pink-100 pt-2 mt-1">
              <span>Total</span>
              <span className="text-[#E8577A]">{fmtCurrency(order.totalPrice)}</span>
            </div>
          </div>
        </InfoBox>
      </div>

      {/* Items */}
      <div>
        <p className="text-[10px] font-black text-[#8B5870] uppercase tracking-widest mb-3">
          Ordered Items ({order.items.length})
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {order.items.map((item, i) => (
            <div key={i}
              className="flex gap-3 p-3 rounded-2xl border border-pink-100 bg-white/60 hover:bg-white/90 hover:shadow-md transition-all duration-200 group">
              {/* Product Image */}
              <div
                className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-pink-100 bg-gradient-to-br from-[#FDE8EE] to-[#FDDDC8] cursor-zoom-in"
                onClick={() => item.image && onImageClick(item.image, item.title)}
                title="Click to enlarge"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={e => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                      (e.currentTarget.parentElement as HTMLElement).innerHTML = '<span class="w-full h-full flex items-center justify-center text-2xl">🎂</span>';
                    }}
                  />
                ) : (
                  <span className="w-full h-full flex items-center justify-center text-2xl">🎂</span>
                )}
              </div>

              {/* Item Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-black text-[#3D1A28] leading-tight line-clamp-2">{item.title}</p>
                  <span className="text-sm font-black text-[#E8577A] flex-shrink-0">
                    {fmtCurrency(item.price * item.quantity)}
                  </span>
                </div>

                {/* Tags row */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {item.quantity > 1 && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-lg bg-[#E8577A]/10 text-[#E8577A] text-[10px] font-bold">
                      ×{item.quantity}
                    </span>
                  )}
                  {item.category && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-lg bg-pink-50 text-[#C49BAA] text-[10px] font-bold border border-pink-100 capitalize">
                      {item.category}
                    </span>
                  )}
                  {item.size && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-lg bg-amber-50 text-amber-600 text-[10px] font-bold border border-amber-100">
                      ⚖️ {item.size}
                    </span>
                  )}
                  {item.flavor && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-lg bg-violet-50 text-violet-600 text-[10px] font-bold border border-violet-100">
                      ✨ {item.flavor}
                    </span>
                  )}
                </div>

                {/* Unit price */}
                <p className="text-[10px] text-[#C49BAA] mt-1 font-medium">
                  {fmtCurrency(item.price)} each
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Info */}
      {order.user && (
        <div>
          <p className="text-[10px] font-black text-[#8B5870] uppercase tracking-widest mb-2">Account Info</p>
          <div className="flex items-center gap-3 px-4 py-3 bg-violet-50/60 rounded-xl border border-violet-100">
            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-black text-sm">
              {(order.user.name ?? order.user.phone).charAt(0).toUpperCase()}
            </div>
            <div>
              {order.user.name && <p className="text-sm font-bold text-[#3D1A28]">{order.user.name}</p>}
              <p className="text-xs text-[#8B5870]">{order.user.phone}</p>
            </div>
            <span className="ml-auto text-[10px] bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-bold ring-1 ring-violet-200">Registered</span>
          </div>
        </div>
      )}

      {/* Status Update */}
      <div>
        <p className="text-[10px] font-black text-[#8B5870] uppercase tracking-widest mb-3">Update Status</p>
        <div className="flex flex-wrap gap-2">
          {ALL_STATUSES.map(s => {
            const m = STATUS_META[s];
            const isActive = order.status === s;
            return (
              <button key={s}
                onClick={() => !isActive && updateStatus(order.id, s)}
                disabled={isUpdating || isActive}
                aria-pressed={isActive}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 disabled:cursor-default
                  ${isActive
                    ? "bg-gradient-to-r from-[#E8577A] to-[#F7A072] text-white shadow-lg scale-105 ring-2 ring-[#E8577A]/30"
                    : `${m.bg} ${m.text} ring-1 ${m.ring} hover:scale-105 hover:shadow-md`}
                  ${isUpdating && !isActive ? "opacity-40" : ""}`}>
                <span>{m.emoji}</span> {m.label}
                {isActive && <span className="ml-0.5 text-white/70 text-[10px]">✓</span>}
              </button>
            );
          })}
          {isUpdating && (
            <span className="self-center text-xs text-[#C49BAA] animate-pulse font-semibold">Saving…</span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 pt-3 border-t border-pink-50">
        <p className="text-[10px] text-[#C49BAA] font-semibold">
          Order ID: <code className="font-mono text-[#8B5870]">{order.id}</code>
        </p>
        <p className="text-[10px] text-[#C49BAA] font-semibold">
          Placed: {fmtDatetime(order.createdAt)}
        </p>
      </div>
    </div>
  );
}

// ─── InfoBox / InfoRow ────────────────────────────────────────────────────────

function InfoBox({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-pink-50/50 rounded-2xl p-4 space-y-2 border border-pink-100/60">
      <h3 className="text-[10px] font-black text-[#8B5870] uppercase tracking-widest flex items-center gap-1.5">
        <span>{icon}</span> {title}
      </h3>
      {children}
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex gap-2 text-xs">
      <span>{icon}</span>
      <span className="text-[#8B5870] flex-shrink-0">{label}:</span>
      <span className="text-[#3D1A28] font-bold">{value}</span>
    </div>
  );
}
