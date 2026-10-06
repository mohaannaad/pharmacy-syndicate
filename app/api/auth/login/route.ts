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

  // نفس الرسالة لو الحساب مش موجود أو كلمة السر غلط، عشان محدش يعرف مين متسجل
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "بيانات الدخول أو كلمة المرور غير صحيحة" }, { status: 401 });
  }

  await createSession(user.id);
  return NextResponse.json({ ok: true });
}