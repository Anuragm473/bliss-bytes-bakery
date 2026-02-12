import { getProductsByCategory } from "@/src/lib/products";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

type Props = {
  params: {
    category: string;
  };
};

const VALID_CATEGORIES = [
  "birthday",
  "anniversary",
  "photo",
  "kids",
  "wedding",
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `${params.category} Cakes in Kolkata | Eggless Same-Day Delivery`,
    description: `Order eggless ${params.category} cakes in Kolkata. Same-day delivery under ₹1000.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  if (!VALID_CATEGORIES.includes(params.category)) {
    return notFound();
  }

  const products = await getProductsByCategory(params.category);

  return (
    <>
      <main className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-[#4B2E83] capitalize">
          {params.category} Cakes in Kolkata
        </h1>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {products.map((product) => {
            const sizes = product.sizes as Record<string, number>;
            const startingPrice = Math.min(...Object.values(sizes));

            return (
              <div key={product.id} className="bg-white p-6 rounded-xl shadow">
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
