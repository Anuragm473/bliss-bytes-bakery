import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";
import { generateSlug } from "@/src/lib/slugify";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Generate base slug
    let slug = generateSlug(body.title);

    // Ensure uniqueness
    let existing = await prisma.product.findUnique({ where: { slug } });
    let counter = 1;

    while (existing) {
      slug = `${generateSlug(body.title)}-${counter}`;
      existing = await prisma.product.findUnique({ where: { slug } });
      counter++;
    }

    const product = await prisma.product.create({
      data: {
        title: body.title,
        slug, // 🔥 Backend controlled
        category: body.category,
        description: body.description,
        sizes: body.sizes,
        flavors: body.flavors,
        images: body.images,
        isCustomizable: body.isCustomizable,
        isPhotoCake: body.isPhotoCake,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
