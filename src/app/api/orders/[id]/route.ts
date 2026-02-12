import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus } from "@/src/lib/orders";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: NextRequest,
  context: Context
) {
  try {
    const { id } = await context.params;

    const body = await request.json();

    const updated = await updateOrderStatus(
      id,
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
