import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const updated = await prisma.fee.update({
    where: { id },
    data: {
      name: body.name,
      price: body.price,
      note: body.note || null,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.fee.delete({ where: { id } });
  return NextResponse.json({ success: true });
}