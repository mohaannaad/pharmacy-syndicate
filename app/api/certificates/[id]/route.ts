import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const updated = await prisma.certificateRequest.update({
    where: { id },
    data: { status: body.status },
  });

  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.certificateRequest.delete({ where: { id } });
  return NextResponse.json({ success: true });
}