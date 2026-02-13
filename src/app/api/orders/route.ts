import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

// ─────────────────────────────────────────
// POST → Create Order
// ─────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      phone,
      address,
      area,
      landmark,
      pincode,
      deliveryDate,
      deliveryTime,
      items,
      subtotal,
      delivery,
      tax,
      totalPrice,
    } = body;

    if (
      !name ||
      !phone ||
      !address ||
      !area ||
      !pincode ||
      !deliveryDate ||
      !deliveryTime ||
      !items ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const orderNumber = `BB-${Date.now()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        name,
        phone,
        address,
        area,
        landmark,
        pincode,
        deliveryDate: new Date(deliveryDate),
        deliveryTime,
        items,
        subtotal,
        deliveryFee: delivery,
        tax,
        totalPrice,
        paymentMethod: "cod",
        status: "pending",
      },
    });

    return NextResponse.json(order, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


// ─────────────────────────────────────────
// GET → Get All Orders (Admin)
// ─────────────────────────────────────────
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
