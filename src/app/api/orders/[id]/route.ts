import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

type Params = {
  params: Promise<{ id: string }>;
};

// ─────────────────────────────────────────
// GET → Single Order
// ─────────────────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: Params
) {
  const { id } = await params;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


// ─────────────────────────────────────────
// PATCH → Update Order (status etc)
// ─────────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: Params
) {
  const { id } = await params;
  const body = await req.json();

  try {
    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}


// ─────────────────────────────────────────
// DELETE → Delete Order
// ─────────────────────────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: Params
) {
  const { id } = await params;

  try {
    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
