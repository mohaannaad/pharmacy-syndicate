import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// حذف حساب من الموقع
// - جلسات الدخول بتاعته بتتمسح معاه (بيخرج من الموقع تلقائي)
// - طلباته القديمة (القيد، الشهادات، الإعلانات، الشكاوى) بتفضل موجودة في لوحة التحكم بس من غير صاحب
// - بعد الحذف يقدر نفس الشخص يسجّل من جديد بنفس رقم القيد / الرقم القومي
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return NextResponse.json({ error: "الحساب غير موجود" }, { status: 404 });
  if (user.role === "ADMIN") {
    return NextResponse.json({ error: "لا يمكن حذف حساب مدير النظام" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
