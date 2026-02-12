import { NextResponse } from "next/server";
import { createOrder, getAllOrders } from "@/src/lib/orders";

export async function GET() {
  try {
    const orders = await getAllOrders();
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
