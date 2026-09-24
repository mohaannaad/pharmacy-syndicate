import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const ads = await prisma.ad.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(ads);
}

export async function POST(request: Request) {
  const body = await request.json();

  const newAd = await prisma.ad.create({
    data: {
      placement: body.placement,
      duration: body.duration,
      price: body.price,
      title: body.title,
      description: body.description,
      contactInfo: body.contactInfo,
      fileUrl: body.fileUrl || null,
      status: "UNDER_REVIEW",
    },
  });

  return NextResponse.json(newAd);
}