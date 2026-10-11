import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { parseSlideInput } from "../../../lib/heroSlides";

// تعديل شريحة، أو إظهارها/إخفاؤها بس
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  // إظهار/إخفاء فقط
  if (Object.keys(body).length === 1 && typeof body.active === "boolean") {
    const slide = await prisma.heroSlide.update({ where: { id }, data: { active: body.active } });
    return NextResponse.json(slide);
  }

  const result = parseSlideInput(body);
  if (!result.data) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  const slide = await prisma.heroSlide.update({ where: { id }, data: result.data });
  return NextResponse.json(slide);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.heroSlide.delete({ where: { id } });
  return NextResponse.json({ success: true });
}