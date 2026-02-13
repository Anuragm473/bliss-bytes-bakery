import CakesPageClient from "./CakesPageClient"; // adjust path
import { getAllProducts } from "@/src/lib/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eggless Cakes in Kolkata | Same-Day Delivery | Bliss Bites Bakery",
  description:
    "Order premium eggless cakes in Kolkata. Birthday cakes, photo cakes, anniversary cakes & more. Same-day delivery in Salt Lake, New Town, Dumdum, Gariahat. Starting ₹500.",
  alternates: { canonical: "https://blissbitesbackery.in/cakes" },
};

export default async function CakesPage() {
  const products = await getAllProducts();
  return <CakesPageClient products={products} />;
}