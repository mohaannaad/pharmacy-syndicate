import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const fees = await prisma.fee.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(fees);
}

export async function POST(request: Request) {
  const body = await request.json();

  const newFee = await prisma.fee.create({
    data: {
      name: body.name,
      price: body.price,
      note: body.note || null,
      order: body.order ?? 0,
    },
  });

  return NextResponse.json(newFee);
}