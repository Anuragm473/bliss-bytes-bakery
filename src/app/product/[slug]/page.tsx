import { getProductBySlug } from "@/src/lib/products";
import { notFound } from "next/navigation";
import ProductDetails from "./ProductDetails";
import type { Metadata } from "next";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Bliss Bytes Bakery",
    };
  }

  const sizes = product.sizes as Record<string, number>;
  const startingPrice = Math.min(...Object.values(sizes));

  return {
    title: `${product.title} | Eggless Cake Delivery in Kolkata`,
    description: `${product.title} available in Kolkata starting from ₹${startingPrice}. Same-day delivery available.`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;   // 🔥 IMPORTANT FIX

  if (!slug) return notFound();

  const product = await getProductBySlug(slug);

  if (!product) return notFound();

  return <ProductDetails product={product} />;
}
