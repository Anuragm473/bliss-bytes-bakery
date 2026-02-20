import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import FloatingWhatsApp from "../components/FloatingWhatsApp";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bliss-bites-bakery.vercel.app"),

  title: {
    default:
      "Bliss Bites Bakery | Eggless Cake Delivery in Kolkata | Custom Cakes",
    template: "%s | Bliss Bites Bakery Kolkata",
  },

  description:
    "Order premium eggless cakes in Kolkata. Custom birthday cakes, photo cakes, anniversary cakes & same-day delivery in Kolkata. Fresh, hygienic & made with love by Bliss Bites Bakery.",

  keywords: [
    "eggless cake kolkata",
    "cake delivery kolkata",
    "birthday cake kolkata",
    "custom cake kolkata",
    "photo cake kolkata",
    "anniversary cake kolkata",
    "designer cake kolkata",
    "same day cake delivery kolkata",
    "home bakery kolkata",
    "premium bakery kolkata",
  ],

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://bliss-bites-bakery.vercel.app",
    siteName: "Bliss Bites Bakery",
    title: "Bliss Bites Bakery | Eggless Cake Delivery in Kolkata",
    description:
      "Premium eggless cakes, custom theme cakes & same-day delivery in Kolkata.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Bliss Bites Bakery - Premium Eggless Cakes Kolkata",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Bliss Bites Bakery | Cake Delivery in Kolkata",
    description:
      "Custom eggless cakes, birthday cakes & same-day delivery in Kolkata.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://bliss-bites-bakery.vercel.app",
  },

  category: "Food & Bakery",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Navbar />
        {children}
        <FloatingWhatsApp />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Bakery",
              name: "Bliss Bites Bakery",
              image: "https://bliss-bites-bakery.vercel.app/logo.png",
              url: "https://bliss-bites-bakery.vercel.app",
              telephone: "+919123743680",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Kolkata",
                addressRegion: "West Bengal",
                addressCountry: "IN",
              },
              areaServed: "Kolkata",
              servesCuisine: "Bakery",
              priceRange: "₹₹",
            }),
          }}
        />
      </body>
    </html>
  );
}
