import { prisma } from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/* ───────────────────────── PATCH (Update Product) ───────────────────────── */

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const updatedProduct = await prisma.product.update({
      where: { id },
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

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

/* ───────────────────────── DELETE ───────────────────────── */

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

/* ───────────────────────── GET BY ID (Optional but recommended) ───────────────────────── */

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
