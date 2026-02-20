import type { Metadata } from "next";
import CustomizeCakePage from "./customized";

export const metadata: Metadata = {
  title:
    "Custom Eggless Cake Order in Kolkata | Photo & Designer Cakes – Bliss Bites Bakery",
  description:
    "Order custom eggless cakes in Kolkata. Photo cakes, theme cakes, birthday & wedding cakes with same-day delivery. 100% eggless. COD available. Starting ₹500.",
  alternates: {
    canonical: "https://bliss-bites-bakery.vercel.app/customize-cake",
  },
  openGraph: {
    title: "Custom Eggless Cakes in Kolkata | Bliss Bites Bakery",
    description:
      "Design your dream cake with custom flavors, photos & themes. Same-day delivery available in Kolkata.",
    type: "website",
    locale: "en_IN",
  },
};

export default function Page() {
  return <CustomizeCakePage />;
}
