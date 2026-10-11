import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { parseSlideInput } from "../../lib/heroSlides";

// الداشبورد: كل الشرائح بالترتيب (الظاهرة والمخفية)
export async function GET() {
  const slides = await prisma.heroSlide.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(slides);
}

// إضافة شريحة جديدة (بتتحط في الآخر)
export async function POST(request: Request) {
  const body = await request.json();
  const result = parseSlideInput(body);
  if (!result.data) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const count = await prisma.heroSlide.count();
  const slide = await prisma.heroSlide.create({
    data: { ...result.data, order: count },
  });
  return NextResponse.json(slide);
}