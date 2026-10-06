import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { createSession, verifyPassword } from "../../../lib/auth";

// الدخول برقم القيد أو الرقم القومي أو رقم الهاتف + كلمة المرور
export async function POST(request: Request) {
  const body = await request.json();
  const identifier = String(body.identifier || "").trim();
  const password = String(body.password || "");

  if (!identifier || !password) {
    return NextResponse.json({ error: "اكتب بيانات الدخول وكلمة المرور" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: { OR: [{ nationalId: identifier }, { phone: identifier }, { membershipNumber: identifier }] },
  });
    // عضو قديم طلبه لسه عند الموظف (أو اترفض) → نقوله الحقيقة بدل "بيانات غلط"
  // (بس لو كلمة السر صح، عشان محدش غريب يعرف إن فيه طلب)
  if (!user) {
    const accountRequest = await prisma.memberAccountRequest.findFirst({
      where: { OR: [{ nationalId: identifier }, { newPhone: identifier }, { membershipNumber: identifier }] },
      orderBy: { createdAt: "desc" },
    });
    if (accountRequest && verifyPassword(password, accountRequest.passwordHash)) {
      if (accountRequest.status === "PENDING") {
        return NextResponse.json({ error: "طلب إنشاء حسابك لسه قيد المراجعة عند موظف النقابة، هيوصلك رسالة أول ما يتفعّل" }, { status: 403 });
      }
      if (accountRequest.status === "REJECTED") {
        return NextResponse.json({ error: `طلب إنشاء حسابك اترفض: ${accountRequest.adminNote || ""}. تقدر تقدّم طلب جديد من «تسجيل عضو حالي»` }, { status: 403 });
      }
    }
  }

  // نفس الرسالة لو الحساب مش موجود أو كلمة السر غلط، عشان محدش يعرف مين متسجل
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "بيانات الدخول أو كلمة المرور غير صحيحة" }, { status: 401 });
  }

  await createSession(user.id);
  return NextResponse.json({ ok: true });
}