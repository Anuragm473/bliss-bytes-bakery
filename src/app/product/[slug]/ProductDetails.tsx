"use client";

import { useState } from "react";
import { useCartStore } from "@/src/store/cartStore";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: string;
  title: string;
  description: string;
  sizes: any;
  flavors: string[];
  images: string[];
  isPhotoCake: boolean;
};

export default function ProductDetails({ product }: { product: Product }) {
  const sizes = product.sizes as Record<string, number>;

  const [selectedSize, setSelectedSize] = useState(
    Object.keys(sizes)[0]
  );

  const [selectedFlavor, setSelectedFlavor] = useState(
    product.flavors[0]
  );

  const addItem = useCartStore((state) => state.addItem);

  const price = sizes[selectedSize];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/">Home</Link> /{" "}
        <Link href="/cakes">Cakes</Link> /{" "}
        <span className="text-gray-700">{product.title}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-16">
        {/* PRODUCT IMAGE */}
        <div className="bg-white p-6 rounded-2xl shadow">
          {product.images?.length ? (
            <Image
              src={product.images[0]}
              alt={product.title}
              width={600}
              height={600}
              className="rounded-xl object-cover"
              priority
            />
          ) : (
            <div className="h-96 flex items-center justify-center bg-gray-100 rounded-xl">
              No Image
            </div>
          )}
        </div>

        {/* PRODUCT INFO */}
        <div>
          <h1 className="text-4xl font-bold text-[#4B2E83]">
            {product.title}
          </h1>

          <p className="mt-6 text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {/* Size Selector */}
          <div className="mt-10">
            <h2 className="font-semibold mb-3">Select Size</h2>
            <div className="flex gap-4 flex-wrap">
              {Object.keys(sizes).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-5 py-2 rounded-lg border ${
                    selectedSize === size
                      ? "bg-[#4B2E83] text-white"
                      : "border-gray-300"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Flavor Selector */}
          <div className="mt-8">
            <h2 className="font-semibold mb-3">Select Flavor</h2>
            <div className="flex gap-4 flex-wrap">
              {product.flavors.map((flavor) => (
                <button
                  key={flavor}
                  onClick={() => setSelectedFlavor(flavor)}
                  className={`px-5 py-2 rounded-lg border ${
                    selectedFlavor === flavor
                      ? "bg-[#FF6B6B] text-white"
                      : "border-gray-300"
                  }`}
                >
                  {flavor}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="mt-10 text-3xl font-bold text-[#4B2E83]">
            ₹{price}
          </div>

          {/* Trust Signals */}
          <ul className="mt-6 text-sm text-gray-600 space-y-2">
            <li>✔ 100% Eggless</li>
            <li>✔ Same-Day Delivery Available</li>
            <li>✔ Freshly Baked in Kolkata</li>
          </ul>

          {/* CTA */}
          <button
            onClick={() =>
              addItem({
                productId: product.id,
                title: product.title,
                size: selectedSize,
                flavor: selectedFlavor,
                price,
                quantity: 1,
              })
            }
            className="mt-8 w-full bg-[#4B2E83] text-white py-3 rounded-lg font-semibold hover:opacity-90"
          >
            Add to Cart
          </button>

          {product.isPhotoCake && (
            <Link
              href="/customize-cake"
              className="block mt-4 text-center text-[#FF6B6B] font-medium"
            >
              Want to upload a custom image?
            </Link>
          )}
        </div>
      </div>

      {/* SEO Content Section */}
      <section className="mt-24">
        <h2 className="text-2xl font-bold text-[#4B2E83]">
          {product.title} – Eggless Cake Delivery in Kolkata
        </h2>

        <p className="mt-4 text-gray-700 leading-relaxed">
          Looking for premium eggless cake delivery in Kolkata?
          Bliss Bytes Bakery offers freshly baked cakes under ₹1000
          with same-day delivery across Salt Lake, New Town,
          Gariahat, Dumdum and nearby areas.
        </p>
      </section>
    </div>
  );
}
