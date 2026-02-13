"use client";

import { useEffect, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

const CATEGORIES = ["birthday", "anniversary", "photo", "kids", "wedding"] as const;
const AVAILABLE_FLAVORS = ["Chocolate", "Vanilla", "Butterscotch", "Red Velvet", "Pineapple"];

type Category = (typeof CATEGORIES)[number];

type Product = {
  id: string;
  title: string;
  slug: string;
  category: Category;
  description: string;
  sizes: Record<string, number>;
  flavors: string[];
  images: string[];
  isCustomizable: boolean;
  isPhotoCake: boolean;
  createdAt?: string;
};

type NewProduct = Omit<Product, "id" | "slug">;

const EMPTY_PRODUCT: NewProduct = {
  title: "",
  category: "birthday",
  description: "",
  sizes: { "500g": 0, "1kg": 0 },
  flavors: [],
  images: [],
  isCustomizable: false,
  isPhotoCake: false,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Badge({ label, color }: { label: string; color: string }) {
  const colorMap: Record<string, string> = {
    pink: "bg-pink-100 text-pink-700 border-pink-200",
    peach: "bg-orange-100 text-orange-700 border-orange-200",
    rose: "bg-rose-100 text-rose-700 border-rose-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    lavender: "bg-violet-100 text-violet-700 border-violet-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${
        colorMap[color] ?? colorMap.pink
      }`}
    >
      {label}
    </span>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: number;
  color: string;
}) {
  const bg: Record<string, string> = {
    pink: "from-pink-400 to-rose-400",
    peach: "from-orange-300 to-amber-400",
    rose: "from-rose-400 to-pink-500",
    lavender: "from-purple-400 to-violet-400",
  };
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-pink-50 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bg[color]} flex items-center justify-center text-xl shadow-sm shrink-0`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{label}</p>
        <p className="text-2xl font-extrabold text-[#3D1A28]">{value}</p>
      </div>
    </div>
  );
}

function CategoryPill({
  cat,
  active,
  onClick,
}: {
  cat: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 capitalize whitespace-nowrap
        ${
          active
            ? "bg-gradient-to-r from-[#E8577A] to-[#F7A072] text-white border-transparent shadow-sm"
            : "bg-white text-gray-500 border-pink-100 hover:border-pink-300 hover:text-pink-600"
        }`}
    >
      {cat}
    </button>
  );
}

// ─── Product Form (shared between Add & Edit) ─────────────────────────────────

function ProductForm({
  data,
  onChange,
}: {
  data: NewProduct;
  onChange: (updated: NewProduct) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const toggleFlavor = (flavor: string) => {
    const exists = data.flavors.includes(flavor);
    onChange({
      ...data,
      flavors: exists
        ? data.flavors.filter((f) => f !== flavor)
        : [...data.flavors, flavor],
    });
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const result = await res.json();

      onChange({
        ...data,
        images: [result.secure_url],
      });
    } catch (err) {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    onChange({
      ...data,
      images: [],
    });
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
          Cake Name
        </label>
        <input
          className="w-full border border-pink-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
          placeholder="e.g. Rose Petal Dream Cake"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
          Category
        </label>
        <select
          className="w-full border border-pink-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm bg-white"
          value={data.category}
          onChange={(e) =>
            onChange({ ...data, category: e.target.value as Category })
          }
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
          Description
        </label>
        <textarea
          className="w-full border border-pink-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm resize-none"
          rows={3}
          placeholder="Describe this beautiful cake..."
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
        />
      </div>

      {/* Sizes / Prices */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
          Prices
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(["500g", "1kg"] as const).map((size) => (
            <div key={size}>
              <p className="text-xs text-gray-500 mb-1 font-medium">{size}</p>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  className="w-full border border-pink-100 pl-7 pr-3 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
                  value={data.sizes[size] ?? 0}
                  min={0}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      sizes: { ...data.sizes, [size]: Number(e.target.value) },
                    })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flavors */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
          Flavors
        </label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_FLAVORS.map((flavor) => (
            <button
              key={flavor}
              type="button"
              onClick={() => toggleFlavor(flavor)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200
                ${
                  data.flavors.includes(flavor)
                    ? "bg-gradient-to-r from-[#E8577A] to-[#F7A072] text-white border-transparent shadow-sm"
                    : "bg-pink-50 text-gray-600 border-pink-100 hover:border-pink-300"
                }`}
            >
              {flavor}
            </button>
          ))}
        </div>
      </div>

      {/* Toggle Flags */}
      <div className="flex flex-wrap gap-5">
        {(["isCustomizable", "isPhotoCake"] as const).map((flag) => (
          <label
            key={flag}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={data[flag]}
                onChange={(e) => onChange({ ...data, [flag]: e.target.checked })}
              />
              <div
                className={`w-10 h-5 rounded-full transition-colors duration-200 ${
                  data[flag]
                    ? "bg-gradient-to-r from-[#E8577A] to-[#F7A072]"
                    : "bg-gray-200"
                }`}
              />
              <div
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                  data[flag] ? "translate-x-5" : ""
                }`}
              />
            </div>
            <span className="text-sm text-gray-600 font-medium">
              {flag === "isCustomizable" ? "Customizable" : "Photo Cake"}
            </span>
          </label>
        ))}
      </div>
       <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
          Cake Image
        </label>

        {data.images?.[0] ? (
          <div className="relative group">
            <img
              src={data.images[0]}
              alt="Cake Preview"
              className="w-full h-48 object-cover rounded-xl border border-pink-100"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 text-xs rounded-full text-red-500 font-semibold shadow"
            >
              Remove
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-pink-200 rounded-xl cursor-pointer hover:border-pink-400 transition-colors text-sm text-gray-400">
            {uploading ? "Uploading..." : "Click to Upload Image"}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) =>
                e.target.files && handleImageUpload(e.target.files[0])
              }
            />
          </label>
)}
</div>
    </div>
  );
}

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────

function DeleteModal({
  product,
  onConfirm,
  onCancel,
}: {
  product: Product;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 admin-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center admin-slide-up">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
          🗑️
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Cake?</h3>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          <strong className="text-gray-700">"{product.title}"</strong> will be
          permanently removed from your catalogue. This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Product Card ──────────────────────────────────────────────────────────────

function ProductCard({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const placeholderGrad: Record<string, string> = {
    birthday: "from-pink-200 to-rose-200",
    anniversary: "from-red-200 to-pink-200",
    photo: "from-orange-200 to-amber-200",
    kids: "from-purple-200 to-pink-200",
    wedding: "from-rose-200 to-fuchsia-200",
  };
  const catEmoji: Record<string, string> = {
    birthday: "🎂",
    anniversary: "💍",
    photo: "📸",
    kids: "🧁",
    wedding: "💒",
  };

  const grad = placeholderGrad[product.category] ?? "from-pink-100 to-rose-100";
  const emoji = catEmoji[product.category] ?? "🎂";
  const price = Object.values(product.sizes)[0] ?? 0;

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-pink-50 overflow-hidden group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      {/* Image */}
      <div
        className={`relative h-44 bg-gradient-to-br ${grad} flex items-center justify-center overflow-hidden`}
      >
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="text-5xl opacity-60 group-hover:scale-110 transition-transform duration-300">
            {emoji}
          </span>
        )}
        {/* Category badge */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-semibold capitalize text-gray-600 shadow-sm border border-white">
          {product.category}
        </span>
        {/* Prices */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/30 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex gap-2">
            {Object.entries(product.sizes).map(([size, price]) => (
              <span key={size} className="text-xs font-bold text-white bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5">
                {size}: ₹{price}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-gray-800 text-sm leading-snug line-clamp-2 flex-1">
            {product.title}
          </h3>
          <p className="text-[#E8577A] font-extrabold text-sm whitespace-nowrap shrink-0">
            ₹{price}+
          </p>
        </div>

        {/* Flavors */}
        {product.flavors?.length > 0 && (
          <p className="text-xs text-gray-400 mb-3 line-clamp-1">
            🍫 {product.flavors.join(" · ")}
          </p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4 min-h-5">
          {product.isPhotoCake && <Badge label="📸 Photo" color="peach" />}
          {product.isCustomizable && <Badge label="✏️ Custom" color="pink" />}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            aria-label={`Edit ${product.title}`}
            className="flex-1 py-2 rounded-xl bg-[#FDE2E4] text-[#C94070] text-xs font-bold hover:bg-pink-200 transition-colors"
          >
            ✏️ Edit
          </button>
          <button
            onClick={onDelete}
            aria-label={`Delete ${product.title}`}
            className="flex-1 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition-colors"
          >
            🗑 Delete
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-pink-50 overflow-hidden animate-pulse">
      <div className="h-44 bg-gradient-to-br from-pink-50 to-rose-50" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-pink-50 rounded-lg w-3/4" />
        <div className="h-3 bg-pink-50 rounded-lg w-1/2" />
        <div className="flex gap-2 mt-2">
          <div className="h-5 w-14 bg-pink-50 rounded-full" />
          <div className="h-5 w-14 bg-pink-50 rounded-full" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="flex-1 h-8 bg-pink-50 rounded-xl" />
          <div className="flex-1 h-8 bg-pink-50 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<string>("all");
  const [sortNewest, setSortNewest] = useState(true);

  // Modals
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const [newProductData, setNewProductData] = useState<NewProduct>(EMPTY_PRODUCT);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  // ── Data ─────────────────────────────────────────────────────────────────────

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProducts(data);
    } catch {
      setError("Could not load products. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ── CRUD ─────────────────────────────────────────────────────────────────────

  const handleAdd = async () => {
    if (!newProductData.title.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProductData),
      });
      if (!res.ok) throw new Error("Failed to add");
      setAddingProduct(false);
      setNewProductData(EMPTY_PRODUCT);
      await fetchProducts();
    } catch {
      setError("Failed to add product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingProduct) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });
      if (!res.ok) throw new Error("Failed to update");
      setEditingProduct(null);
      await fetchProducts();
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    try {
      const res = await fetch(`/api/products/${deletingProduct.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setDeletingProduct(null);
      await fetchProducts();
    } catch {
      setError("Failed to delete product. Please try again.");
    }
  };

  // ── Derived ───────────────────────────────────────────────────────────────────

  const filtered = products
    .filter(
      (p) =>
        (filterCat === "all" || p.category === filterCat) &&
        p.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      const diff =
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sortNewest ? diff : -diff;
    });

  const stats = {
    total: products.length,
    categories: new Set(products.map((p) => p.category)).size,
    photoCakes: products.filter((p) => p.isPhotoCake).length,
    customizable: products.filter((p) => p.isCustomizable).length,
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');

        body { font-family: 'DM Sans', sans-serif; }
        .admin-display { font-family: 'DM Serif Display', serif; }

        @keyframes adminFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes adminSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .admin-fade-in  { animation: adminFadeIn  0.25s ease-out both; }
        .admin-slide-up { animation: adminSlideUp 0.3s  ease-out both; }

        .s1 { animation-delay: 0.05s; }
        .s2 { animation-delay: 0.1s;  }
        .s3 { animation-delay: 0.15s; }
        .s4 { animation-delay: 0.2s;  }

        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-[#FFF5F7] via-[#FFFBF8] to-[#FFF0EC]">

        {/* ═══ Sticky Header ══════════════════════════════════════════════════════ */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-pink-100/60 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-16 flex items-center justify-between gap-4">

              {/* Logo */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-9 h-9 bg-gradient-to-br from-[#E8577A] to-[#F7A072] rounded-xl flex items-center justify-center text-lg shadow-sm">
                  🎂
                </div>
                <div className="hidden sm:block">
                  <h1 className="admin-display text-base font-bold text-[#3D1A28] leading-none">
                    BakeryCo
                  </h1>
                  <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">
                    Admin
                  </p>
                </div>
              </div>

              {/* Search (desktop) */}
              <div className="flex-1 max-w-sm hidden sm:block">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                    />
                  </svg>
                  <input
                    aria-label="Search cakes"
                    className="w-full pl-9 pr-8 py-2.5 bg-pink-50/60 rounded-xl text-sm border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-200 placeholder-gray-400"
                    placeholder="Search cakes…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button
                      aria-label="Clear search"
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Refresh + Add */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={fetchProducts}
                  aria-label="Refresh products"
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-pink-100 bg-white text-gray-500 hover:border-pink-300 transition-colors hidden sm:flex"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    setNewProductData(EMPTY_PRODUCT);
                    setAddingProduct(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#E8577A] to-[#F7A072] text-white text-sm font-bold rounded-xl shadow-sm hover:shadow-md hover:opacity-95 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="hidden sm:inline">Add Cake</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* ── Page Title ────────────────────────────────────────────────────── */}
          <div className="mb-8 admin-fade-in">
            <h2 className="admin-display text-3xl sm:text-4xl text-[#3D1A28] mb-1">
              Product Catalogue
            </h2>
            <p className="text-gray-500 text-sm">
              Manage your cake collection, flavours, prices, and availability.
            </p>
          </div>

          {/* ── Error Banner ─────────────────────────────────────────────────── */}
          {error && (
            <div
              role="alert"
              className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 admin-fade-in"
            >
              <span aria-hidden="true">⚠️</span>
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                aria-label="Dismiss error"
                className="ml-auto text-red-400 hover:text-red-600 text-xl leading-none"
              >
                ×
              </button>
            </div>
          )}

          {/* ── Stats ─────────────────────────────────────────────────────────── */}
          <section aria-label="Dashboard statistics" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="admin-fade-in s1"><StatCard icon="🎂" label="Total Cakes"   value={stats.total}        color="pink"     /></div>
            <div className="admin-fade-in s2"><StatCard icon="🏷️" label="Categories"   value={stats.categories}   color="peach"    /></div>
            <div className="admin-fade-in s3"><StatCard icon="📸" label="Photo Cakes"  value={stats.photoCakes}   color="rose"     /></div>
            <div className="admin-fade-in s4"><StatCard icon="✏️" label="Customizable" value={stats.customizable} color="lavender" /></div>
          </section>

          {/* ── Filters ───────────────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            {/* Mobile search */}
            <div className="sm:hidden relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                aria-label="Search cakes"
                className="w-full pl-9 pr-8 py-2.5 bg-white rounded-xl text-sm border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-200 placeholder-gray-400 shadow-sm"
                placeholder="Search cakes…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Category pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" role="group" aria-label="Filter by category">
              <CategoryPill cat="All" active={filterCat === "all"} onClick={() => setFilterCat("all")} />
              {CATEGORIES.map((cat) => (
                <CategoryPill key={cat} cat={cat} active={filterCat === cat} onClick={() => setFilterCat(cat)} />
              ))}
            </div>

            {/* Sort */}
            <button
              onClick={() => setSortNewest(!sortNewest)}
              className="flex items-center gap-1.5 text-sm text-gray-500 font-medium px-3 py-2 rounded-xl border border-pink-100 bg-white hover:border-pink-300 transition-colors shrink-0"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              {sortNewest ? "Newest First" : "Oldest First"}
            </button>
          </div>

          {/* ── Count ─────────────────────────────────────────────────────────── */}
          {!loading && (
            <p className="text-xs text-gray-400 font-medium mb-5">
              Showing{" "}
              <span className="text-[#E8577A] font-bold">{filtered.length}</span>{" "}
              of {products.length} products
              {(search || filterCat !== "all") && (
                <button
                  onClick={() => { setSearch(""); setFilterCat("all"); }}
                  className="ml-2 text-pink-400 hover:text-pink-600 underline"
                >
                  Clear filters
                </button>
              )}
            </p>
          )}

          {/* ── Grid ─────────────────────────────────────────────────────────── */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-7xl mb-5 opacity-20">🎂</div>
              <p className="text-gray-400 font-bold text-xl">No cakes found</p>
              <p className="text-gray-300 text-sm mt-1">Try adjusting your search or filters</p>
              <button
                onClick={() => { setSearch(""); setFilterCat("all"); }}
                className="mt-4 px-4 py-2 text-sm rounded-xl bg-pink-50 text-pink-500 font-semibold hover:bg-pink-100 transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((product, i) => (
                <div
                  key={product.id}
                  className="admin-fade-in"
                  style={{ animationDelay: `${Math.min(i * 0.04, 0.3)}s` }}
                >
                  <ProductCard
                    product={product}
                    onEdit={() => setEditingProduct({ ...product })}
                    onDelete={() => setDeletingProduct(product)}
                  />
                </div>
              ))}
            </div>
          )}
        </main>

        {/* ═══ Edit Modal ══════════════════════════════════════════════════════════ */}
        {editingProduct && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Edit cake"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 admin-fade-in"
          >
            <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl admin-slide-up max-h-[92vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-pink-50 shrink-0">
                <div>
                  <h2 className="admin-display text-xl text-[#3D1A28]">Edit Cake</h2>
                  <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{editingProduct.title}</p>
                </div>
                <button
                  onClick={() => setEditingProduct(null)}
                  aria-label="Close edit modal"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors text-lg"
                >
                  ×
                </button>
              </div>

              {/* Form */}
              <div className="overflow-y-auto flex-1 px-6 py-5">
                <ProductForm
                  data={editingProduct}
                  onChange={(u) => setEditingProduct({ ...editingProduct, ...u })}
                />
              </div>

              {/* Footer */}
              <div className="flex gap-3 px-6 py-5 border-t border-pink-50 shrink-0">
                <button
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#E8577A] to-[#F7A072] text-white font-bold text-sm shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ Add Modal ════════════════════════════════════════════════════════════ */}
        {addingProduct && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Add new cake"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 admin-fade-in"
          >
            <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl admin-slide-up max-h-[92vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-pink-50 shrink-0">
                <div>
                  <h2 className="admin-display text-xl text-[#3D1A28]">New Cake</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Add a product to your catalogue</p>
                </div>
                <button
                  onClick={() => setAddingProduct(false)}
                  aria-label="Close add modal"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors text-lg"
                >
                  ×
                </button>
              </div>

              {/* Form */}
              <div className="overflow-y-auto flex-1 px-6 py-5">
                <ProductForm data={newProductData} onChange={setNewProductData} />
              </div>

              {/* Footer */}
              <div className="flex gap-3 px-6 py-5 border-t border-pink-50 shrink-0">
                <button
                  onClick={() => setAddingProduct(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={saving || !newProductData.title.trim()}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#E8577A] to-[#F7A072] text-white font-bold text-sm shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {saving ? "Adding…" : "Add Cake 🎂"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ Delete Confirmation ══════════════════════════════════════════════════ */}
        {deletingProduct && (
          <DeleteModal
            product={deletingProduct}
            onConfirm={handleDelete}
            onCancel={() => setDeletingProduct(null)}
          />
        )}
      </div>
    </>
  );
}