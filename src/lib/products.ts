import { prisma } from "./prisma";

export async function getAllProducts() {
  return prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getFeaturedProducts(limit = 6) {
  return prisma.product.findMany({
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
  });
}

export async function getProductsByCategory(category: string) {
  return prisma.product.findMany({
    where: { category },
    orderBy: { createdAt: "desc" },
  });
}

export function getStartingPrice(sizes: any) {
  if (!sizes) return 0;

  const values = Object.values(sizes) as number[];
  return Math.min(...values);
}
