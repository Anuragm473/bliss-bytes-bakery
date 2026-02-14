import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

// ─────────────────────────────
// GET → Single Enquiry
// ─────────────────────────────
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const enquiry = await prisma.contactEnquiry.findUnique({
      where: { id },
    });

    if (!enquiry) {
      return NextResponse.json(
        { error: "Enquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(enquiry);
  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────
// PATCH → Update Status
// ─────────────────────────────
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status required" },
        { status: 400 }
      );
    }

    const updated = await prisma.contactEnquiry.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────
// DELETE → Remove Enquiry
// ─────────────────────────────
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.contactEnquiry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}
