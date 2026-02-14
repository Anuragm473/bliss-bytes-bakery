import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      phone,
      occasion,
      budget,
      deliveryDate,
      message,
      imageUrl,
    } = body;

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const enquiry = await prisma.contactEnquiry.create({
      data: {
        name,
        phone,
        occasion,
        budget,
        deliveryDate,
        message,
        imageUrl,
        status: "new",
      },
    });

    return NextResponse.json(enquiry, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
// ─────────────────────────────────────────
// GET → Fetch All Custom Cake Enquiries
// ─────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status");
    const phone = searchParams.get("phone");
    const sort = searchParams.get("sort") || "desc";

    const enquiries = await prisma.contactEnquiry.findMany({
      where: {
        ...(status && { status }),
        ...(phone && {
          phone: {
            contains: phone,
          },
        }),
      },
      orderBy: {
        createdAt: sort === "asc" ? "asc" : "desc",
      },
    });

    return NextResponse.json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch enquiries" },
      { status: 500 }
    );
  }
}
