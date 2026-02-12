import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const product = await prisma.product.create({
      data: {
        title: body.title,
        slug: body.slug,
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
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
