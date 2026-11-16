import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

// كل حسابات الموقع (خريجين + أعضاء) للوحة التحكم — من غير كلمات السر طبعًا
export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      nationalId: true,
      phone: true,
      role: true,
      membershipNumber: true,
      createdAt: true,
      _count: { select: { graduateApplications: true } },
    },
  });
  return NextResponse.json(users);
}
