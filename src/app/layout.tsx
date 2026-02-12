import Navbar from "../components/Navbar";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bliss bites Bakery | Same-Day Eggless Cake Delivery in Kolkata",
  description:
    "Order budget-friendly eggless custom cakes in Kolkata. Same-day delivery available. Cakes under ₹1000.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#FFF8F0] text-gray-900">
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
