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

export async function getRelatedProducts(
  currentSlug: string,
  limit = 4
): Promise<any[]> {
  try {
    // First get the current product to know its category
    const current = await prisma.product.findUnique({
      where: { slug: currentSlug },
      select: { category: true },
    });

    if (!current) return [];

    const related = await prisma.product.findMany({
      where: {
        category: current.category,
        slug: { not: currentSlug },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return related.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      description: p.description,
      category: p.category,
      sizes: p.sizes as Record<string, number>,
      flavors: p.flavors,
      images: p.images,
      isPhotoCake: p.isPhotoCake,
      isCustomizable: p.isCustomizable,
      isEggless: p.isEggless,
      createdAt: p.createdAt,
    }));
  } catch (error) {
    console.error(
      `[getRelatedProducts] Error for slug "${currentSlug}":`,
      error
    );
    return [];
  }
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
