import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "../../lib/auth";

function generateTicketNumber() {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `CMP-${random}`;
}

export async function GET() {
  const complaints = await prisma.complaint.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(complaints);
}

export async function POST(request: Request) {
  const body = await request.json();
  // الشكوى متاحة للجميع، ولو صاحبها داخل بحسابه بنربطها بيه عشان يتابع الرد في «طلباتي»
  const user = await getCurrentUser();

  const newComplaint = await prisma.complaint.create({
    data: {
      ticketNumber: generateTicketNumber(),
      category: body.category,
      title: body.title,
      details: body.details,
      attachments: body.attachments || [],
      submitterName: body.submitterName,
      submitterContact: body.submitterContact,
      status: "RECEIVED",
      userId: user?.id ?? null,
    },
  });

  return NextResponse.json(newComplaint);
}