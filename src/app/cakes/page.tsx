import Link from "next/link";
import { getAllProducts } from "@/src/lib/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eggless Cakes in Kolkata | Same-Day Cake Delivery",
  description:
    "Browse all eggless cakes in Kolkata. Birthday cakes, photo cakes, anniversary cakes & more. Same-day delivery available.",
};

export default async function CakesPage() {
  const products = await getAllProducts();

  return (
    <>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-[#4B2E83]">
          Eggless Cakes in Kolkata
        </h1>

        <p className="mt-6 text-gray-600 max-w-3xl">
          Explore our collection of premium-looking eggless cakes under ₹1000.
          Same-day cake delivery available across Kolkata including Salt Lake,
          New Town, Dumdum and Gariahat.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {products.map((product) => {
            const sizes = product.sizes as Record<string, number>;
            const startingPrice = Math.min(...Object.values(sizes));

            return (
              <div
                key={product.id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Cake Image</p>
                </div>

                <h2 className="mt-4 text-xl font-semibold">
                  {product.title}
                </h2>

                <p className="mt-2 text-[#4B2E83] font-bold">
                  Starting from ₹{startingPrice}
                </p>

                <Link
                  href={`/product/${product.slug}`}
                  className="block mt-6 bg-[#FF6B6B] text-white text-center py-2 rounded-lg"
                >
                  View Details
                </Link>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
