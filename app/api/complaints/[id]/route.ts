import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const data: any = {};
  if (body.status) data.status = body.status;
  if (body.adminResponse !== undefined) {
    data.adminResponse = body.adminResponse;
    data.respondedAt = new Date();
  }
  if (body.escalated !== undefined) data.escalated = body.escalated;

  const updated = await prisma.complaint.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.complaint.delete({ where: { id } });
  return NextResponse.json({ success: true });
}