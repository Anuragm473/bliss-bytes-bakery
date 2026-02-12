"use client";

import { useState } from "react";

const CATEGORIES = [
  "birthday",
  "anniversary",
  "photo",
  "kids",
  "wedding",
];

const AVAILABLE_FLAVORS = [
  "Chocolate",
  "Vanilla",
  "Butterscotch",
  "Red Velvet",
  "Pineapple",
];

export default function AdminProducts() {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    description: "",
    price500: "",
    price1kg: "",
    flavors: [] as string[],
    isCustomizable: false,
    isPhotoCake: false,
  });

  const handleImageUpload = async (file: File) => {
    setLoading(true);

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formDataUpload,
    });

    const data = await res.json();
    setImageUrl(data.secure_url);

    setLoading(false);
  };

  const handleFlavorToggle = (flavor: string) => {
    setFormData((prev) => {
      const exists = prev.flavors.includes(flavor);
      return {
        ...prev,
        flavors: exists
          ? prev.flavors.filter((f) => f !== flavor)
          : [...prev.flavors, flavor],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageUrl) {
      alert("Please upload an image");
      return;
    }

    if (formData.flavors.length === 0) {
      alert("Select at least one flavor");
      return;
    }

    setLoading(true);

    const productData = {
      title: formData.title,
      slug: formData.slug,
      category: formData.category,
      description: formData.description,
      sizes: {
        "500g": Number(formData.price500),
        "1kg": Number(formData.price1kg),
      },
      flavors: formData.flavors,
      images: [imageUrl],
      isCustomizable: formData.isCustomizable,
      isPhotoCake: formData.isPhotoCake,
    };

    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (res.ok) {
      alert("Product Created Successfully");
      setFormData({
        title: "",
        slug: "",
        category: "",
        description: "",
        price500: "",
        price1kg: "",
        flavors: [],
        isCustomizable: false,
        isPhotoCake: false,
      });
      setImageUrl(null);
    } else {
      alert("Failed to create product");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-10">
      <h1 className="text-3xl font-bold text-[#4B2E83] mb-10">
        Add New Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow">
        {/* TITLE */}
        <input
          placeholder="Product Title"
          className="w-full border p-3 rounded"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          required
        />

        {/* SLUG */}
        <input
          placeholder="Slug (example: chocolate-cake-kolkata)"
          className="w-full border p-3 rounded"
          value={formData.slug}
          onChange={(e) =>
            setFormData({ ...formData, slug: e.target.value })
          }
          required
        />

        {/* CATEGORY DROPDOWN */}
        <select
          className="w-full border p-3 rounded"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          required
        >
          <option value="">Select Category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* DESCRIPTION */}
        <textarea
          placeholder="Product Description"
          className="w-full border p-3 rounded"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />

        {/* SIZE PRICING */}
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="500g Price"
            className="border p-3 rounded"
            value={formData.price500}
            onChange={(e) =>
              setFormData({ ...formData, price500: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="1kg Price"
            className="border p-3 rounded"
            value={formData.price1kg}
            onChange={(e) =>
              setFormData({ ...formData, price1kg: e.target.value })
            }
            required
          />
        </div>

        {/* FLAVOR MULTI SELECT */}
        <div>
          <h3 className="font-semibold mb-3">Select Flavors</h3>
          <div className="flex flex-wrap gap-3">
            {AVAILABLE_FLAVORS.map((flavor) => (
              <button
                type="button"
                key={flavor}
                onClick={() => handleFlavorToggle(flavor)}
                className={`px-4 py-2 rounded border ${
                  formData.flavors.includes(flavor)
                    ? "bg-[#4B2E83] text-white"
                    : "border-gray-300"
                }`}
              >
                {flavor}
              </button>
            ))}
          </div>
        </div>

        {/* IMAGE UPLOAD */}
        <div>
          <label className="block mb-2 font-medium">Upload Image</label>
          <input
            type="file"
            onChange={(e) =>
              e.target.files &&
              handleImageUpload(e.target.files[0])
            }
          />
          {loading && <p className="text-sm mt-2">Uploading...</p>}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="mt-4 h-40 rounded"
            />
          )}
        </div>

        {/* CHECKBOXES */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isCustomizable}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isCustomizable: e.target.checked,
                })
              }
            />
            Customizable
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isPhotoCake}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isPhotoCake: e.target.checked,
                })
              }
            />
            Photo Cake
          </label>
        </div>

        {/* SUBMIT */}
        <button
          disabled={loading}
          className="w-full bg-[#4B2E83] text-white py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
