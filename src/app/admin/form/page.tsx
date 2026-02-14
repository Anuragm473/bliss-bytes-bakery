"use client";

import { useState, useEffect, useCallback } from "react";

const GoogleFontsLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');
    * { box-sizing: border-box; }
    body { margin: 0; }
    .font-playfair { font-family: 'Playfair Display', serif; }
    .font-dm { font-family: 'DM Sans', sans-serif; }
  `}</style>
);

type EnquiryStatus = "new" | "contacted" | "converted" | "closed";

interface Enquiry {
  _id: string;
  name?: string | null;
  phone: string;
  email?: string | null;
  occasion?: string | null;
  budget?: string | null;
  deliveryDate?: string | null;
  message?: string | null;
  imageUrl?: string | null;
  status: EnquiryStatus;
  createdAt: string;
}

const STATUS_CONFIG: Record<
  EnquiryStatus,
  { label: string; color: string; bg: string; border: string; tw: string }
> = {
  new: {
    label: "New",
    color: "#3B82F6",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    tw: "bg-blue-50 text-blue-500 border border-blue-200",
  },
  contacted: {
    label: "Contacted",
    color: "#F59E0B",
    bg: "#FFFBEB",
    border: "#FDE68A",
    tw: "bg-amber-50 text-amber-500 border border-amber-200",
  },
  converted: {
    label: "Converted",
    color: "#10B981",
    bg: "#ECFDF5",
    border: "#A7F3D0",
    tw: "bg-emerald-50 text-emerald-500 border border-emerald-200",
  },
  closed: {
    label: "Closed",
    color: "#6B7280",
    bg: "#F9FAFB",
    border: "#E5E7EB",
    tw: "bg-gray-50 text-gray-500 border border-gray-200",
  },
};

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#F9E6E6] shadow-sm animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-3.5 bg-[#F5E6E6] rounded-lg mb-3"
          style={{ width: i === 1 ? "60%" : i === 4 ? "40%" : "80%" }}
        />
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: EnquiryStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.new;
  return (
    <span
      className={`inline-block rounded-full px-3 py-0.5 font-dm text-xs font-semibold ${cfg.tw}`}
    >
      {cfg.label}
    </span>
  );
}

interface ModalProps {
  enquiry: Enquiry | null;
  onClose: () => void;
  onUpdate: (id: string, status: EnquiryStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function Modal({ enquiry, onClose, onUpdate, onDelete }: ModalProps) {
  const [updating, setUpdating] = useState(false);

  const handleStatus = async (status: EnquiryStatus) => {
    setUpdating(true);
    await onUpdate(enquiry!._id, status);
    setUpdating(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this enquiry permanently?")) return;
    setUpdating(true);
    await onDelete(enquiry!._id);
    onClose();
  };

  if (!enquiry) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Enquiry details"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-[#FDE8EE] border-none rounded-full w-8 h-8 cursor-pointer font-bold text-[#E8577A] text-base hover:bg-[#FBCFE8] transition-colors"
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="flex items-center gap-3 mb-6">
          <h2 className="font-playfair text-2xl text-[#1A1A1A] m-0">
            {enquiry.name ?? "Anonymous"}
          </h2>
          <StatusBadge status={enquiry.status} />
        </div>

        <div className="grid grid-cols-2 gap-x-6">
          {(
            [
              ["Phone", <a href={`tel:${enquiry.phone}`} className="text-[#E8577A] no-underline">{enquiry.phone}</a>],
              ["Email", enquiry.email ?? "—"],
              ["Occasion", enquiry.occasion ?? "—"],
              ["Budget", enquiry.budget ?? "—"],
              ["Delivery Date", enquiry.deliveryDate ? new Date(enquiry.deliveryDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"],
              ["Submitted", new Date(enquiry.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })],
            ] as [string, React.ReactNode][]
          ).map(([label, value]) => (
            <div key={label}>
              <span className="font-dm text-[11px] font-semibold text-[#E8577A] uppercase tracking-widest block mb-1">
                {label}
              </span>
              <p className="font-dm text-sm text-[#2D2D2D] mb-5">{value}</p>
            </div>
          ))}
        </div>

        {enquiry.message && (
          <>
            <span className="font-dm text-[11px] font-semibold text-[#E8577A] uppercase tracking-widest block mb-1">
              Design Description
            </span>
            <p className="font-dm text-sm text-[#2D2D2D] bg-[#FFFBF8] border border-[#F9E6E6] rounded-xl p-3.5 leading-relaxed mb-5">
              {enquiry.message}
            </p>
          </>
        )}

        {enquiry.imageUrl && (
          <>
            <span className="font-dm text-[11px] font-semibold text-[#E8577A] uppercase tracking-widest block mb-1">
              Reference Image
            </span>
            <img
              src={enquiry.imageUrl}
              alt="Customer reference"
              className="w-full max-h-72 object-contain rounded-2xl border border-[#F9E6E6] mb-5"
            />
          </>
        )}

        <div className="flex flex-wrap gap-2.5 border-t border-[#F9E6E6] pt-5 mt-1">
          {(Object.entries(STATUS_CONFIG) as [EnquiryStatus, typeof STATUS_CONFIG[EnquiryStatus]][])
            .filter(([k]) => k !== enquiry.status)
            .map(([status, cfg]) => (
              <button
                key={status}
                onClick={() => handleStatus(status)}
                disabled={updating}
                className="rounded-xl px-4 py-2 font-dm font-semibold text-sm cursor-pointer disabled:opacity-50 transition-opacity"
                style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
              >
                Mark {cfg.label}
              </button>
            ))}
          <button
            onClick={handleDelete}
            disabled={updating}
            className="ml-auto bg-red-100 text-red-500 border border-red-200 rounded-xl px-4 py-2 font-dm font-semibold text-sm cursor-pointer disabled:opacity-50 transition-opacity"
          >
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  );
}

interface EnquiryCardProps {
  enquiry: Enquiry;
  onSelect: (enquiry: Enquiry) => void;
  onUpdate: (id: string, status: EnquiryStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function EnquiryCard({ enquiry, onSelect, onUpdate, onDelete }: EnquiryCardProps) {
  const [updating, setUpdating] = useState(false);

  const handleStatus = async (e: React.MouseEvent, status: EnquiryStatus) => {
    e.stopPropagation();
    setUpdating(true);
    await onUpdate(enquiry._id, status);
    setUpdating(false);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this enquiry?")) return;
    setUpdating(true);
    await onDelete(enquiry._id);
    setUpdating(false);
  };

  const infoRows: [string, string][] = [
    ["🎉", enquiry.occasion ?? "—"],
    ["💰", enquiry.budget ?? "—"],
    ["📅", enquiry.deliveryDate ? new Date(enquiry.deliveryDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"],
    ["🕐", new Date(enquiry.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })],
  ];

  return (
    <div
      className={`bg-white rounded-2xl p-[22px] border border-[#F9E6E6] shadow-sm cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(232,87,122,0.12)] ${updating ? "opacity-60" : ""}`}
      onClick={() => onSelect(enquiry)}
      role="article"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect(enquiry)}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-playfair text-[17px] text-[#1A1A1A] m-0 mb-1">
            {enquiry.name ?? "Anonymous"}
          </h3>
          <a
            href={`tel:${enquiry.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="font-dm text-sm text-[#E8577A] font-semibold no-underline"
          >
            {enquiry.phone}
          </a>
        </div>
        <StatusBadge status={enquiry.status} />
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-3">
        {infoRows.map(([icon, val]) => (
          <div key={icon} className="flex items-center gap-1.5 font-dm text-xs text-gray-500">
            <span>{icon}</span> {val}
          </div>
        ))}
      </div>

      {enquiry.message && (
        <p className="font-dm text-[13px] text-gray-400 m-0 mb-3 leading-relaxed line-clamp-2">
          {enquiry.message}
        </p>
      )}

      {enquiry.imageUrl && (
        <img
          src={enquiry.imageUrl}
          alt="Reference"
          className="w-full h-20 object-cover rounded-xl mb-3"
        />
      )}

      <div
        className="flex gap-2 flex-wrap border-t border-[#FDE8E8] pt-3"
        onClick={(e) => e.stopPropagation()}
      >
        {enquiry.status === "new" && (
          <button
            onClick={(e) => handleStatus(e, "contacted")}
            disabled={updating}
            className="bg-amber-50 text-amber-500 border border-amber-200 rounded-lg px-3 py-1 font-dm text-xs font-semibold cursor-pointer disabled:opacity-50"
          >
            ✓ Contacted
          </button>
        )}
        {enquiry.status === "contacted" && (
          <button
            onClick={(e) => handleStatus(e, "converted")}
            disabled={updating}
            className="bg-emerald-50 text-emerald-500 border border-emerald-200 rounded-lg px-3 py-1 font-dm text-xs font-semibold cursor-pointer disabled:opacity-50"
          >
            ✓ Converted
          </button>
        )}
        {enquiry.status !== "closed" && (
          <button
            onClick={(e) => handleStatus(e, "closed")}
            disabled={updating}
            className="bg-gray-50 text-gray-500 border border-gray-200 rounded-lg px-3 py-1 font-dm text-xs font-semibold cursor-pointer disabled:opacity-50"
          >
            Close
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={updating}
          className="ml-auto bg-red-100 text-red-400 border border-red-200 rounded-lg px-3 py-1 font-dm text-xs font-semibold cursor-pointer disabled:opacity-50"
        >
          🗑
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<EnquiryStatus | "">("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/customize-cake");
      const data = await res.json();
      setEnquiries(data.data ?? []);
    } catch {
      console.error("Failed to fetch enquiries");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const handleUpdate = async (id: string, status: EnquiryStatus) => {
    setEnquiries((prev) =>
      prev.map((e) => (e._id === id ? { ...e, status } : e))
    );
    if (selected?._id === id) setSelected((prev) => prev ? { ...prev, status } : null);
    try {
      await fetch(`/api/customize-cake/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } catch {
      fetchEnquiries();
    }
  };

  const handleDelete = async (id: string) => {
    setEnquiries((prev) => prev.filter((e) => e._id !== id));
    try {
      await fetch(`/api/customize-cake/${id}`, { method: "DELETE" });
    } catch {
      fetchEnquiries();
    }
  };

  const filtered = enquiries
    .filter(
      (e) =>
        (!filterStatus || e.status === filterStatus) &&
        (!search ||
          e.phone?.includes(search) ||
          e.name?.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  const stats = {
    total: enquiries.length,
    newCount: enquiries.filter((e) => e.status === "new").length,
    contacted: enquiries.filter((e) => e.status === "contacted").length,
    converted: enquiries.filter((e) => e.status === "converted").length,
  };

  const statCards = [
    { label: "Total Enquiries", val: stats.total, icon: "📋", color: "text-[#E8577A]" },
    { label: "New", val: stats.newCount, icon: "🔵", color: "text-blue-500" },
    { label: "Contacted", val: stats.contacted, icon: "🟡", color: "text-amber-500" },
    { label: "Converted", val: stats.converted, icon: "🟢", color: "text-emerald-500" },
  ];

  const inputCls =
    "border-[1.5px] border-[#F2D0D0] bg-[#FFFBF8] px-4 py-2.5 rounded-xl font-dm text-sm text-[#2D2D2D] outline-none focus:border-[#E8577A] transition-colors";

  return (
    <>
      <GoogleFontsLoader />

      {/* Decorative BG */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-16 -right-16 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(247,160,114,0.12)_0%,transparent_70%)]" />
      </div>

      <div className="min-h-screen bg-[#FFFBF8] relative z-[1]">

        {/* HEADER */}
        <header className="bg-white border-b border-[#F9E6E6] px-6 py-[18px] sticky top-0 z-[100] shadow-[0_2px_16px_rgba(232,87,122,0.06)]">
          <div className="max-w-[1400px] mx-auto flex justify-between items-center flex-wrap gap-3">
            <div>
              <h1 className="font-playfair text-[22px] text-[#1A1A1A] m-0">
                Custom Cake Enquiries
              </h1>
              <p className="font-dm text-[13px] text-gray-400 mt-0.5 mb-0">
                Bliss Bites Bakery · Admin Dashboard
              </p>
            </div>
            <button
              onClick={fetchEnquiries}
              className="bg-gradient-to-br from-[#E8577A] to-[#F7A072] text-white border-none rounded-xl px-5 py-2.5 font-dm font-semibold text-sm cursor-pointer hover:opacity-90 transition-opacity"
              aria-label="Refresh data"
            >
              ↻ Refresh
            </button>
          </div>
        </header>

        <main className="max-w-[1400px] mx-auto px-6 pt-6 pb-16">

          {/* STATS */}
          <section
            aria-label="Summary statistics"
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7"
          >
            {statCards.map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-[18px] p-5 border border-[#F9E6E6] shadow-sm"
              >
                <div className="font-dm text-xs text-gray-400 mb-1.5 font-medium">
                  {s.icon} {s.label}
                </div>
                <div className={`font-playfair text-[32px] font-bold ${s.color}`}>
                  {s.val}
                </div>
              </div>
            ))}
          </section>

          {/* FILTERS */}
          <div className="bg-white rounded-[18px] px-[22px] py-[18px] border border-[#F9E6E6] mb-6 flex flex-wrap gap-3 items-center">
            <input
              placeholder="Search by name or phone..."
              className={`${inputCls} flex-1 min-w-40`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search enquiries"
            />
            <select
              className={`${inputCls} cursor-pointer`}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as EnquiryStatus | "")}
              aria-label="Filter by status"
            >
              <option value="">All statuses</option>
              {(Object.entries(STATUS_CONFIG) as [EnquiryStatus, typeof STATUS_CONFIG[EnquiryStatus]][]).map(
                ([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                )
              )}
            </select>
            <select
              className={`${inputCls} cursor-pointer`}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
              aria-label="Sort order"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
            <span className="font-dm text-[13px] text-gray-400 ml-auto">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* GRID */}
          {loading ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
              {Array(6).fill(0).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 px-6">
              <div className="text-6xl mb-4">🎂</div>
              <h3 className="font-playfair text-[22px] text-[#1A1A1A] m-0 mb-2">
                {enquiries.length === 0 ? "No enquiries yet" : "No results found"}
              </h3>
              <p className="font-dm text-sm text-gray-400">
                {enquiries.length === 0
                  ? "Custom cake requests will appear here."
                  : "Try adjusting your search or filters."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
              {filtered.map((e) => (
                <EnquiryCard
                  key={e._id}
                  enquiry={e}
                  onSelect={setSelected}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {selected && (
        <Modal
          enquiry={selected}
          onClose={() => setSelected(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}