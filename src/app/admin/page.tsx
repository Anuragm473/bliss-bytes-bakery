"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderItem = {
  title: string;
  quantity: number;
  price: number;
  size?: string;
  flavor?: string;
};

type Order = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  area: string;
  landmark?: string;
  pincode: string;
  deliveryDate: string;
  deliveryTime: string;
  instructions?: string;
  freeCandle: boolean;
  subtotal: number;
  delivery: number;
  tax: number;
  totalPrice: number;
  orderStatus: string;
  createdAt: string;
  items: OrderItem[];
};

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  "PLACED",
  "BAKING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
] as const;

const STATUS_META: Record<
  string,
  { label: string; emoji: string; bg: string; text: string; ring: string }
> = {
  PLACED: {
    label: "Placed",
    emoji: "📋",
    bg: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-200",
  },
  BAKING: {
    label: "Baking",
    emoji: "🔥",
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    emoji: "🛵",
    bg: "bg-violet-50",
    text: "text-violet-700",
    ring: "ring-violet-200",
  },
  DELIVERED: {
    label: "Delivered",
    emoji: "✅",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
  },
  CANCELLED: {
    label: "Cancelled",
    emoji: "✕",
    bg: "bg-rose-50",
    text: "text-rose-600",
    ring: "ring-rose-200",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isToday(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: string;
  accent: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 shadow-sm border border-white/60 backdrop-blur-sm bg-white/70 hover:shadow-md transition-shadow duration-200`}
    >
      <div
        className={`absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-10 ${accent}`}
      />
      <span className="text-2xl leading-none">{icon}</span>
      <p className="mt-3 text-2xl font-bold text-[#3D1A28] tracking-tight">
        {value}
      </p>
      <p className="text-xs font-medium text-[#8B5870] uppercase tracking-widest mt-0.5">
        {label}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? {
    label: status,
    emoji: "•",
    bg: "bg-gray-50",
    text: "text-gray-600",
    ring: "ring-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${meta.bg} ${meta.text} ${meta.ring}`}
    >
      <span>{meta.emoji}</span>
      {meta.label}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [sortNewest, setSortNewest] = useState(true);

  // Expanded cards
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // ── Data fetching ──────────────────────────────────────────────────────────

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data: Order[] = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ── Update status ──────────────────────────────────────────────────────────

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      // Optimistic update
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, orderStatus: status } : o))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Derived stats ──────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const todaysOrders = orders.filter((o) => isToday(o.createdAt)).length;
    const totalRevenue = orders
      .filter((o) => o.orderStatus !== "CANCELLED")
      .reduce((sum, o) => sum + o.totalPrice, 0);
    const pendingOrders = orders.filter(
      (o) => o.orderStatus === "PLACED" || o.orderStatus === "BAKING"
    ).length;
    return { totalOrders, todaysOrders, totalRevenue, pendingOrders };
  }, [orders]);

  // ── Filtered & sorted orders ───────────────────────────────────────────────

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (filterStatus !== "ALL") {
      result = result.filter((o) => o.orderStatus === filterStatus);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.phone.toLowerCase().includes(q) ||
          (o.email ?? "").toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      const diff =
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sortNewest ? diff : -diff;
    });

    return result;
  }, [orders, filterStatus, search, sortNewest]);

  // ── Loading skeleton ───────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-5xl animate-bounce">🧁</div>
          <p className="text-[#8B5870] font-semibold text-sm tracking-widest uppercase">
            Loading orders…
          </p>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF0F3] via-[#FFF5EE] to-[#FFF0E8] font-[system-ui,sans-serif]">
      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-100/80 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F7A072] to-[#E8577A] flex items-center justify-center shadow-md">
              <span className="text-lg leading-none">🧁</span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[#3D1A28] leading-tight tracking-tight">
                Orders Dashboard
              </h1>
              <p className="text-xs text-[#8B5870] hidden sm:block">
                Manage all bakery orders in one place
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={fetchOrders}
              aria-label="Refresh orders"
              className="p-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-[#E8577A] transition-colors duration-150 border border-pink-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
            </button>

            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#E8577A] to-[#F7A072] text-white text-sm font-semibold shadow-md hover:shadow-lg hover:opacity-95 transition-all duration-150"
            >
              Manage Products
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ── Stats ───────────────────────────────────────────────────────── */}
        <section aria-label="Order statistics">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Orders"
              value={stats.totalOrders}
              icon="📦"
              accent="bg-pink-400"
            />
            <StatCard
              label="Today's Orders"
              value={stats.todaysOrders}
              icon="🗓️"
              accent="bg-peach-400"
            />
            <StatCard
              label="Total Revenue"
              value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`}
              icon="💰"
              accent="bg-amber-400"
            />
            <StatCard
              label="Pending Orders"
              value={stats.pendingOrders}
              icon="⏳"
              accent="bg-violet-400"
            />
          </div>
        </section>

        {/* ── Filters (Sticky) ─────────────────────────────────────────────── */}
        <section
          aria-label="Filter and search orders"
          className="sticky top-[73px] z-40 bg-white/80 backdrop-blur-md rounded-2xl border border-pink-100 shadow-sm px-4 py-3"
        >
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C49BAA]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="search"
                placeholder="Search by name, phone or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search orders"
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-pink-100 bg-pink-50/50 text-[#3D1A28] placeholder-[#C49BAA] focus:outline-none focus:ring-2 focus:ring-[#E8577A]/30 transition"
              />
            </div>

            {/* Status filter pills */}
            <div
              className="flex items-center gap-2 flex-wrap"
              role="group"
              aria-label="Filter by status"
            >
              {["ALL", ...STATUS_OPTIONS].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  aria-pressed={filterStatus === s}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    filterStatus === s
                      ? "bg-gradient-to-r from-[#E8577A] to-[#F7A072] text-white shadow-md"
                      : "bg-pink-50 text-[#8B5870] hover:bg-pink-100 border border-pink-100"
                  }`}
                >
                  {s === "ALL"
                    ? "All"
                    : STATUS_META[s]?.label ?? s}
                </button>
              ))}
            </div>

            {/* Sort toggle */}
            <button
              onClick={() => setSortNewest((v) => !v)}
              aria-label={`Sort by ${sortNewest ? "oldest" : "newest"} first`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-pink-50 text-[#8B5870] hover:bg-pink-100 border border-pink-100 transition-colors duration-150 whitespace-nowrap"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  sortNewest ? "" : "rotate-180"
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
              {sortNewest ? "Newest first" : "Oldest first"}
            </button>

            {/* Results count */}
            <span className="self-center text-xs text-[#C49BAA] whitespace-nowrap ml-auto hidden sm:inline">
              {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
            </span>
          </div>
        </section>

        {/* ── Orders List ──────────────────────────────────────────────────── */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🍰</p>
            <p className="text-[#8B5870] font-semibold">No orders found.</p>
            <p className="text-sm text-[#C49BAA] mt-1">
              Try adjusting your filters or search query.
            </p>
          </div>
        ) : (
          <section
            aria-label="Orders list"
            className="space-y-4"
          >
            {filteredOrders.map((order) => {
              const isExpanded = expandedId === order.id;
              const isUpdating = updatingId === order.id;

              return (
                <article
                  key={order.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-50 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  {/* ── Card Header ─────────────────────────────────────── */}
                  <div
                    className="px-5 py-4 cursor-pointer select-none"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : order.id)
                    }
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                    aria-controls={`order-details-${order.id}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setExpandedId(isExpanded ? null : order.id);
                      }
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 sm:justify-between">
                      {/* Left: customer info */}
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FDE8EE] to-[#FDDDC8] flex items-center justify-center flex-shrink-0 border border-pink-100">
                          <span className="text-base font-bold text-[#E8577A]">
                            {order.name.charAt(0).toUpperCase()}
                          </span>
                        </div>

                        <div>
                          <h2 className="text-sm font-bold text-[#3D1A28] leading-tight">
                            {order.name}
                          </h2>
                          <p className="text-xs text-[#8B5870]">
                            {order.phone}
                            {order.email ? ` · ${order.email}` : ""}
                          </p>
                        </div>
                      </div>

                      {/* Right: status + total + expand chevron */}
                      <div className="flex items-center gap-3 sm:gap-4 pl-13 sm:pl-0">
                        <StatusBadge status={order.orderStatus} />

                        <span className="text-sm font-bold text-[#3D1A28]">
                          ₹{order.totalPrice.toLocaleString("en-IN")}
                        </span>

                        <div className="hidden sm:flex flex-col items-end text-xs text-[#C49BAA]">
                          <span>📅 {order.deliveryDate}</span>
                          <span>⏰ {order.deliveryTime}</span>
                        </div>

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`w-4 h-4 text-[#C49BAA] transition-transform duration-200 flex-shrink-0 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* ── Expanded Details ─────────────────────────────────── */}
                  {isExpanded && (
                    <div
                      id={`order-details-${order.id}`}
                      className="border-t border-pink-50 px-5 pb-5 pt-4 space-y-5"
                    >
                      {/* Info Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Delivery Details */}
                        <div className="bg-pink-50/50 rounded-xl p-4 space-y-1.5">
                          <h3 className="text-xs font-bold text-[#8B5870] uppercase tracking-widest mb-2">
                            Delivery Info
                          </h3>
                          <InfoRow icon="📅" label="Date" value={order.deliveryDate} />
                          <InfoRow icon="⏰" label="Time" value={order.deliveryTime} />
                          <InfoRow
                            icon="🕯️"
                            label="Free Candle"
                            value={order.freeCandle ? "Yes" : "No"}
                          />
                          {order.instructions && (
                            <InfoRow
                              icon="📝"
                              label="Notes"
                              value={order.instructions}
                            />
                          )}
                        </div>

                        {/* Address */}
                        <div className="bg-peach-50/50 bg-[#FFF5EE] rounded-xl p-4 space-y-1.5">
                          <h3 className="text-xs font-bold text-[#8B5870] uppercase tracking-widest mb-2">
                            Address
                          </h3>
                          <p className="text-sm text-[#3D1A28]">
                            {order.address}, {order.area}
                          </p>
                          {order.landmark && (
                            <p className="text-xs text-[#8B5870]">
                              Near: {order.landmark}
                            </p>
                          )}
                          <p className="text-xs text-[#8B5870]">
                            PIN: {order.pincode}
                          </p>
                        </div>

                        {/* Pricing */}
                        <div className="bg-gradient-to-br from-[#FDE8EE]/60 to-[#FDDDC8]/40 rounded-xl p-4">
                          <h3 className="text-xs font-bold text-[#8B5870] uppercase tracking-widest mb-3">
                            Pricing
                          </h3>
                          <div className="space-y-1.5 text-sm">
                            <div className="flex justify-between text-[#8B5870]">
                              <span>Subtotal</span>
                              <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex justify-between text-[#8B5870]">
                              <span>Delivery</span>
                              <span>₹{order.delivery.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex justify-between text-[#8B5870]">
                              <span>Tax</span>
                              <span>₹{order.tax.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex justify-between font-bold text-[#3D1A28] text-base border-t border-pink-100 pt-2 mt-2">
                              <span>Total</span>
                              <span className="text-[#E8577A]">
                                ₹{order.totalPrice.toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Ordered Items */}
                      <div>
                        <h3 className="text-xs font-bold text-[#8B5870] uppercase tracking-widest mb-3">
                          Ordered Items
                        </h3>
                        <div className="rounded-xl border border-pink-100 overflow-hidden">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className={`flex justify-between items-start px-4 py-3 text-sm ${
                                idx !== order.items.length - 1
                                  ? "border-b border-pink-50"
                                  : ""
                              }`}
                            >
                              <div>
                                <span className="font-medium text-[#3D1A28]">
                                  {item.title}
                                </span>
                                <span className="text-[#8B5870]">
                                  {" "}× {item.quantity}
                                </span>
                                {(item.size || item.flavor) && (
                                  <p className="text-xs text-[#C49BAA] mt-0.5">
                                    {[item.size, item.flavor]
                                      .filter(Boolean)
                                      .join(" · ")}
                                  </p>
                                )}
                              </div>
                              <span className="font-semibold text-[#3D1A28] flex-shrink-0 ml-4">
                                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Status Update */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <p className="text-xs font-bold text-[#8B5870] uppercase tracking-widest flex-shrink-0">
                          Update Status:
                        </p>

                        <div
                          className="flex flex-wrap gap-2"
                          role="group"
                          aria-label="Order status options"
                        >
                          {STATUS_OPTIONS.map((status) => {
                            const meta = STATUS_META[status];
                            const isActive = order.orderStatus === status;
                            return (
                              <button
                                key={status}
                                onClick={() =>
                                  !isActive && updateStatus(order.id, status)
                                }
                                disabled={isUpdating || isActive}
                                aria-pressed={isActive}
                                aria-label={`Set status to ${meta.label}`}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 disabled:cursor-default ${
                                  isActive
                                    ? "bg-gradient-to-r from-[#E8577A] to-[#F7A072] text-white shadow-md scale-105"
                                    : "bg-pink-50 text-[#8B5870] hover:bg-pink-100 hover:text-[#3D1A28] border border-pink-100"
                                } ${isUpdating && !isActive ? "opacity-50" : ""}`}
                              >
                                <span>{meta.emoji}</span>
                                {meta.label}
                              </button>
                            );
                          })}

                          {isUpdating && (
                            <span className="self-center text-xs text-[#C49BAA] animate-pulse">
                              Saving…
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 pt-2 border-t border-pink-50">
                        <p className="text-xs text-[#C49BAA]">
                          Order ID:{" "}
                          <code className="font-mono">{order.id}</code>
                        </p>
                        <p className="text-xs text-[#C49BAA]">
                          Placed on: {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}

// ─── Small helper ──────────────────────────────────────────────────────────────

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-2 text-xs">
      <span>{icon}</span>
      <span className="text-[#8B5870] flex-shrink-0">{label}:</span>
      <span className="text-[#3D1A28] font-medium">{value}</span>
    </div>
  );
}