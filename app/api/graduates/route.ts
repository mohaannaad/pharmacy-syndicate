import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";
import { trackingNumber } from "../../lib/graduate";
import { getCurrentUser } from "../../lib/auth";
import { buildGraduateApplication } from "../../lib/graduateServer";

// لوحة التحكم: كل الطلبات
export async function GET() {
  const applications = await prisma.graduateApplication.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(applications);
}

// الخريج بيبعت طلب قيد جديد
export async function POST(request: Request) {
  // 1) لازم يكون داخل بحساب خريج
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "لازم تسجّل دخول الأول" }, { status: 401 });
  }
  if (user.role !== "GRADUATE") {
    return NextResponse.json({ error: "طلب القيد متاح لحسابات الخريجين فقط" }, { status: 403 });
  }

  // 2) مينفعش يكون عنده طلب مفتوح (أو طلب بنفس الرقم القومي)
  const existing = await prisma.graduateApplication.findFirst({
    where: {
      OR: [{ userId: user.id }, { nationalId: user.nationalId }],
      status: { not: "REJECTED" },
    },
  });
  if (existing) {
    return NextResponse.json(
      { error: `لديك طلب قيد بالفعل، رقم المتابعة: ${trackingNumber(existing.serial, existing.createdAt)}` },
      { status: 409 }
    );
  }

  // 3) التحقق من البيانات وتجهيزها
  const body = await request.json();
  const result = buildGraduateApplication(body, { nationalId: user.nationalId, phone: user.phone });
  if (result.error || !result.data) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const application = await prisma.graduateApplication.create({
    data: {
      ...result.data,
      userId: user.id,
      status: result.data.fee === null ? "UNDER_REVIEW" : "AWAITING_PAYMENT",
    },
  });

  return NextResponse.json({
    id: application.id,
    trackingNumber: trackingNumber(application.serial, application.createdAt),
    fee: application.fee,
    status: application.status,
  });
}