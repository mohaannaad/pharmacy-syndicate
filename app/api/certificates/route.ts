import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

// أسعار مبدئية (Placeholder) — تتغير لاحقًا حسب الجدول الرسمي من النقابة
export const CERTIFICATE_PRICING: Record<string, number> = {
  GOOD_CONDUCT_AR: 50,
  GOOD_CONDUCT_EN: 70,
  MBA_ISLESCA: 500,
  DBA_ISLESCA: 700,
  MBA_NAVAL_ACADEMY: 500,
  DBA_NAVAL_ACADEMY: 700,
  DIPLOMA_NAVAL_ACADEMY: 300,
  MBA_ARAB_ACADEMY: 500,
  DBA_ARAB_ACADEMY: 700,
};

export async function GET() {
  const requests = await prisma.certificateRequest.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(requests);
}

export async function POST(request: Request) {
  const body = await request.json();
  const price = CERTIFICATE_PRICING[body.type] ?? 0;

  const newRequest = await prisma.certificateRequest.create({
    data: {
      type: body.type,
      destination: body.destination || null,
      attachments: body.attachments || [],
      deliveryMethod: body.deliveryMethod,
      price,
      memberName: body.memberName,
      membershipNumber: body.membershipNumber,
      contactInfo: body.contactInfo,
      status: "AWAITING_PAYMENT",
    },
  });

  return NextResponse.json(newRequest);
}