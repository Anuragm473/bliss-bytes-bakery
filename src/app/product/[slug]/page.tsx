import { getProductBySlug, getRelatedProducts } from "@/src/lib/products";
import { notFound } from "next/navigation";
import ProductDetails from "./ProductDetails";
import type { Metadata } from "next";

// ─── Types ───────────────────────────────────────────────────────────────────

type Props = {
  params: Promise<{ slug: string }>;
};

// ─── Metadata (SEO) ──────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Bliss Bites Bakery",
      description: "The cake you're looking for doesn't exist.",
    };
  }

  const sizes = product.sizes as Record<string, number>;
  const startingPrice = Math.min(...Object.values(sizes));
  const primaryImage = product.images?.[0] ?? "";

  const title = `${product.title} | Eggless Cake Delivery in Kolkata – Bliss Bites Bakery`;
  const description = `Order ${product.title} online from Bliss Bites Bakery, Kolkata. 100% Eggless, starting ₹${startingPrice}. Same-day delivery to Salt Lake, New Town, Gariahat & Dumdum.`;
  const canonicalUrl = `https://www.blissbiteskol.com/product/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Bliss Bites Bakery",
      locale: "en_IN",
      type: "website",
      images: primaryImage
        ? [
            {
              url: primaryImage,
              width: 800,
              height: 800,
              alt: `${product.title} – Eggless Cake Delivery in Kolkata`,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: primaryImage ? [primaryImage] : [],
    },
    keywords: [
      product.title,
      "eggless cake Kolkata",
      "cake delivery Kolkata",
      "same day cake delivery Kolkata",
      "eggless cake delivery",
      "online cake order Kolkata",
      "Salt Lake cake delivery",
      "New Town cake delivery",
      "Gariahat cake",
      "Dumdum cake",
      "custom cake Kolkata",
      product.category,
      "Bliss Bites Bakery",
    ],
  };
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  if (!slug) return notFound();

  // Fetch product + related products in parallel
  const [product, relatedProducts] = await Promise.all([
    getProductBySlug(slug),
    getRelatedProducts(slug), // fetches from same category, excludes current
  ]);

  if (!product) return notFound();

  return (
    <ProductDetails
      product={product}
      relatedProducts={relatedProducts ?? []}
    />
  );
}