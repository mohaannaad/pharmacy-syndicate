import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../lib/auth";
import { trackingNumber } from "../../../lib/graduate";

// بيانات الخريج الداخل + طلبات القيد بتاعته (الأحدث الأول)
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "لازم تسجّل دخول الأول" }, { status: 401 });
  }

  const applications = await prisma.graduateApplication.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    user: {
      fullName: user.fullName,
      nationalId: user.nationalId,
      phone: user.phone,
      role: user.role,
      membershipNumber: user.membershipNumber,
    },
    applications: applications.map((a) => ({
      ...a,
      trackingNumber: trackingNumber(a.serial, a.createdAt),
    })),
  });
}