"use client";

import Link from "next/link";
import Image from "next/image";

type Product = {
  id: string;
  title: string;
  slug: string;
  category: string;
  flavors?: string[];
  images?: string[];
  sizes: Record<string, number>;
};

type Props = {
  product: Product;
  meta: {
    label: string;
    emoji: string;
  };
};

export default function CategoryProductCard({ product, meta }: Props) {
  const sizes = product.sizes || {};
  const startingPrice =
    Object.values(sizes).length > 0 ? Math.min(...Object.values(sizes)) : 0;

  const imgSrc = product.images?.[0] || "/placeholder-cake.jpg";
  const firstFlavors = product.flavors?.slice(0, 2) || [];

  return (
    <article
      key={product.id}
      className="group rounded-3xl overflow-hidden flex flex-col"
      style={{
        background: "linear-gradient(145deg, #FFFFFF 0%, #FFF5F7 100%)",
        boxShadow: "0 2px 16px rgba(200,80,110,0.08)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 14px 40px rgba(200,80,110,0.18)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 2px 16px rgba(200,80,110,0.08)";
      }}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: "4/3", background: "#FDE2E4" }}
      >
        <Image
          src={imgSrc}
          alt={`${product.title} — Eggless ${meta.label} Cake Kolkata`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Category badge */}
        <span
          className="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full capitalize"
          style={{
            background: "rgba(255,255,255,0.92)",
            color: "#E8577A",
            backdropFilter: "blur(4px)",
          }}
        >
          {meta.emoji} {meta.label}
        </span>
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col flex-1">
        <h2
          className="font-bold text-base leading-snug"
          style={{ color: "#3D1A2C" }}
        >
          {product.title}
        </h2>

        {firstFlavors.length > 0 && (
          <p className="mt-1 text-xs" style={{ color: "#C06C84" }}>
            {firstFlavors.join(" · ")}
          </p>
        )}

        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-lg font-extrabold" style={{ color: "#E8577A" }}>
            ₹{startingPrice}
          </span>
          <span className="text-xs" style={{ color: "#C06C84" }}>
            onwards
          </span>
        </div>

        {/* Under ₹1000 badge */}
        {startingPrice <= 1000 && (
          <span
            className="mt-2 inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full w-fit"
            style={{ background: "#FDE2E4", color: "#A0395A" }}
          >
            Under ₹1000
          </span>
        )}

        <div className="flex-1" />

        {/* Action buttons */}
        <div className="mt-4 flex flex-col gap-2">
          <Link
            href={`/product/${product.slug}`}
            className="block text-center font-bold text-sm py-3 rounded-2xl transition-all duration-200"
            style={{
              background: "linear-gradient(90deg, #E8577A 0%, #F7A072 100%)",
              color: "#fff",
              boxShadow: "0 4px 14px rgba(232,87,122,0.28)",
            }}
          >
            View Details →
          </Link>
          <Link
            href={`/product/${product.slug}#order`}
            className="block text-center font-semibold text-sm py-2.5 rounded-2xl transition-all"
            style={{
              border: "1.5px solid #FADADD",
              color: "#E8577A",
              background: "#FFF5F7",
            }}
          >
            Quick Order
          </Link>
        </div>
      </div>
    </article>
  );
}
