import Navbar from "@/src/components/Navbar";
import Link from "next/link";
import { getFeaturedProducts } from "@/src/lib/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Same-Day Eggless Cake Delivery in Kolkata | Bliss Bytes Bakery",
  description:
    "Order premium eggless custom cakes under ₹1000 in Kolkata. Same-day delivery available in Salt Lake, New Town, Gariahat & more.",
};

export default async function Home() {
  const products = await getFeaturedProducts();

  return (
    <>

      <main className="px-6 py-16 max-w-7xl mx-auto">

        {/* HERO SECTION */}
        <section className="grid md:grid-cols-2 items-center gap-12">
          <div>
            <h1 className="text-5xl font-bold text-[#4B2E83] leading-tight">
              Same-Day Eggless Cake Delivery in Kolkata
            </h1>

            <p className="mt-6 text-lg text-gray-600">
              Budget-friendly custom cakes under ₹1000.
              Freshly baked. 100% Eggless. Delivered across Kolkata.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/cakes"
                className="bg-[#4B2E83] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90"
              >
                Shop Cakes
              </Link>

              <Link
                href="/customize-cake"
                className="border-2 border-[#4B2E83] text-[#4B2E83] px-6 py-3 rounded-lg font-semibold"
              >
                Customize Cake
              </Link>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              Serving Salt Lake, New Town, Dumdum, Gariahat & nearby areas.
            </p>
          </div>

          <div className="bg-white h-96 rounded-2xl shadow-xl flex items-center justify-center">
            <p className="text-gray-400">Premium Cake Image</p>
          </div>
        </section>

        {/* CATEGORY SECTION */}
        <section className="mt-24">
          <h2 className="text-3xl font-bold text-center text-[#4B2E83]">
            Explore Cake Categories
          </h2>

          <div className="grid md:grid-cols-4 gap-6 mt-10">
            {[
              { name: "Birthday Cakes", link: "/birthday-cakes-kolkata" },
              { name: "Photo Cakes", link: "/photo-cakes-kolkata" },
              { name: "Anniversary Cakes", link: "/anniversary-cakes-kolkata" },
              { name: "Cakes Under ₹1000", link: "/cakes-under-1000-kolkata" },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={cat.link}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg text-center font-semibold"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="mt-24">
          <h2 className="text-3xl font-bold text-center text-[#4B2E83]">
            Popular Eggless Cakes in Kolkata
          </h2>

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

                  <h3 className="mt-4 text-xl font-semibold">
                    {product.title}
                  </h3>

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
        </section>

        {/* TRUST SECTION */}
        <section className="mt-24 bg-[#FFF8F0] p-12 rounded-2xl">
          <h2 className="text-3xl font-bold text-center text-[#4B2E83]">
            Why Choose Bliss Bytes Bakery?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mt-10 text-center">
            <div>
              <h3 className="font-semibold text-lg">100% Eggless</h3>
              <p className="mt-2 text-gray-600">
                All cakes are freshly baked and completely eggless.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">Same-Day Delivery</h3>
              <p className="mt-2 text-gray-600">
                Order before 4PM for same-day delivery in Kolkata.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">Budget-Friendly</h3>
              <p className="mt-2 text-gray-600">
                Premium-looking cakes under ₹1000.
              </p>
            </div>
          </div>
        </section>

        {/* LOCAL SEO SECTION */}
        <section className="mt-24">
          <h2 className="text-3xl font-bold text-[#4B2E83]">
            Eggless Cake Delivery Across Kolkata
          </h2>

          <p className="mt-6 text-gray-700 leading-relaxed">
            Bliss Bytes Bakery offers same-day eggless cake delivery in Salt Lake, New Town,
            Dumdum, Gariahat, Howrah, and nearby areas. Whether you're looking for a birthday cake,
            photo cake, anniversary cake, or budget-friendly cake under ₹1000 in Kolkata,
            we deliver fresh and beautifully designed cakes right to your doorstep.
          </p>

          <p className="mt-4 text-gray-700 leading-relaxed">
            Our custom cake builder allows you to personalize flavors, size, and design,
            making us one of the most affordable and reliable eggless bakeries in Kolkata.
          </p>
        </section>

        {/* CTA SECTION */}
        <section className="mt-24 bg-[#4B2E83] text-white p-12 rounded-2xl text-center">
          <h2 className="text-3xl font-bold">
            Order Your Custom Cake Today
          </h2>
          <p className="mt-4">
            Freshly baked. Beautifully crafted. Delivered on time.
          </p>
          <Link
            href="/cakes"
            className="inline-block mt-6 bg-[#FF6B6B] px-8 py-3 rounded-lg font-semibold"
          >
            Order Now
          </Link>
        </section>
      </main>
    </>
  );
}
