import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { orderedIds }: { orderedIds: string[] } = body;

  await Promise.all(
    orderedIds.map((id, index) =>
      prisma.news.update({
        where: { id },
        data: { order: index },
      })
    )
  );

  return NextResponse.json({ success: true });
}