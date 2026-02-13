import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

async function sendEmailNotification(enquiry: any) {
  await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PRIVATE_KEY,
      template_params: {
        name: enquiry.name || "Not Provided",
        phone: enquiry.phone,
        email: enquiry.email || "Not Provided",
        message: enquiry.message || "No message",
        occasion: enquiry.occasion || "Not specified",
        budget: enquiry.budget || "Not specified",
        deliveryDate: enquiry.deliveryDate || "Not specified",
        imageUrl: enquiry.imageUrl || "No image",
      },
    }),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const enquiry = await prisma.contactEnquiry.create({
      data: {
        name: body.name,
        phone: body.phone,
        email: body.email,
        message: body.message,
        occasion: body.occasion,
        budget: body.budget,
        deliveryDate: body.deliveryDate,
        imageUrl: body.imageUrl,
      },
    });

    await sendEmailNotification(enquiry);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
