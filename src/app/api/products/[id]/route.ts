import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const updated = await prisma.product.update({
      where: { id: params.id },
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

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
