import { NextResponse } from "next/server";
import { updateOrderStatus } from "@/src/lib/orders";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const updated = await updateOrderStatus(
      params.id,
      body.status
    );

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
