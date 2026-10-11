import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// ترتيب الشرائح الجديد بعد ما الموظف يحرّكها
export async function POST(request: Request) {
  const { orderedIds }: { orderedIds: string[] } = await request.json();

  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.heroSlide.update({ where: { id }, data: { order: index } }))
  );

  return NextResponse.json({ success: true });
}