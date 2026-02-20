import CakesPageClient from "./CakesPageClient"; // adjust path
import { getAllProducts } from "@/src/lib/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Eggless Cakes in Kolkata | Same-Day Cake Delivery Under ₹1000 – Bliss Bites Bakery",
  description:
    "Order premium 100% eggless cakes in Kolkata. Birthday cakes, photo cakes, anniversary cakes & more. Same-day delivery in Salt Lake, New Town, Dumdum & Gariahat. Starting ₹500.",
  keywords: [
    "eggless cakes Kolkata",
    "cake delivery Kolkata",
    "same day cake delivery Kolkata",
    "birthday cake Kolkata",
    "photo cake Kolkata",
    "anniversary cake Kolkata",
    "cakes under 1000 Kolkata",
    "online cake order Kolkata",
    "Bliss Bites Bakery",
  ],
  alternates: {
    canonical: "https://bliss-bites-bakery.vercel.app/cakes",
  },
  openGraph: {
    title:
      "Eggless Cakes in Kolkata | Same-Day Delivery",
    description:
      "Explore 100% eggless cakes with same-day delivery across Kolkata. Freshly baked. Affordable. Under ₹1000.",
    url: "https://bliss-bites-bakery.vercel.app/cakes",
    siteName: "Bliss Bites Bakery",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://bliss-bites-bakery.vercel.app/og-cakes.jpg",
        width: 1200,
        height: 630,
        alt: "Eggless Cakes in Kolkata – Bliss Bites Bakery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eggless Cakes in Kolkata | Same-Day Delivery",
    description:
      "Premium eggless cakes delivered across Kolkata. Starting ₹500.",
  },
};


export default async function CakesPage() {
  const products = await getAllProducts();
  return <CakesPageClient products={products} />;
}