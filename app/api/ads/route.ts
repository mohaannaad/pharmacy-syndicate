import { getCurrentUser } from "../../lib/auth";
import { isMemberRole } from "../../lib/services";
import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const ads = await prisma.ad.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(ads);
}

export async function POST(request: Request) {
  // الخدمة دي لأعضاء النقابة بس
  const user = await getCurrentUser();
  if (!user || !isMemberRole(user.role)) {
    return NextResponse.json({ error: "هذه الخدمة متاحة لأعضاء النقابة فقط" }, { status: 403 });
  }

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