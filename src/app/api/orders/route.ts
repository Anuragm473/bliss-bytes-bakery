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
      email,
      address,
      area,
      landmark,
      pincode,
      deliveryDate,
      deliveryTime,
      items,
      subtotal,
      deliveryFee,
      tax,
      totalPrice,
    } = body;

    // ✅ Basic validation
    if (
      !name ||
      !phone ||
      !address ||
      !area ||
      !pincode ||
      !deliveryDate ||
      !deliveryTime ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ─────────────────────────────────────
    // 1️⃣ Check if user exists
    // ─────────────────────────────────────
    let user = await prisma.user.findUnique({
      where: { phone },
    });

    // ─────────────────────────────────────
    // 2️⃣ Create user if not exists
    // ─────────────────────────────────────
    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          phone,
          email,
        },
      });
    }

    // ─────────────────────────────────────
    // 3️⃣ Generate Order Number
    // ─────────────────────────────────────
    const orderNumber = `BB-${Date.now()}`;

    // ─────────────────────────────────────
    // 4️⃣ Create Order linked to user
    // ─────────────────────────────────────
    const order = await prisma.order.create({
      data: {
        orderNumber,

        userId: user.id, // 🔥 Important relation

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
        deliveryFee,
        tax,
        totalPrice,

        paymentMethod: "cod",
        status: "pending",
      },
    });

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ORDER CREATE ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────
// GET → Get All Orders (Admin)
// ─────────────────────────────────────────
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true, // 🔥 useful for admin
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("ORDER FETCH ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
