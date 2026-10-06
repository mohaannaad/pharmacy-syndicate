import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { createSession, hashPassword, isValidNationalId, isValidPassword, isValidPhone } from "../../../lib/auth";
import { verifyOtp } from "../../../lib/otp";

// الخطوة التانية: نتأكد من الرمز ونعمل الحساب وندخّل المستخدم على طول
export async function POST(request: Request) {
  const body = await request.json();
  const fullName = String(body.fullName || "").trim();
  const nationalId = String(body.nationalId || "").trim();
  const phone = String(body.phone || "").trim();
  const password = String(body.password || "");
  const code = String(body.code || "");

  if (!fullName || !isValidNationalId(nationalId) || !isValidPhone(phone)) {
    return NextResponse.json({ error: "بيانات غير صحيحة، ارجع للخطوة الأولى" }, { status: 400 });
  }
  if (!isValidPassword(password)) {
    return NextResponse.json({ error: "كلمة المرور لازم تكون 8 حروف أو أرقام على الأقل" }, { status: 400 });
  }

  const otpError = await verifyOtp(phone, "SIGNUP", code);
  if (otpError) {
    return NextResponse.json({ error: otpError }, { status: 400 });
  }

  const existing = await prisma.user.findFirst({ where: { OR: [{ nationalId }, { phone }] } });
  if (existing) {
    return NextResponse.json({ error: "يوجد حساب مسجل بهذه البيانات بالفعل" }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: { fullName, nationalId, phone, passwordHash: hashPassword(password), role: "GRADUATE" },
  });

  await createSession(user.id);
  return NextResponse.json({ ok: true });
}