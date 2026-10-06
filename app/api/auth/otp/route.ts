import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { isValidNationalId, isValidPhone } from "../../../lib/auth";
import { createOtp } from "../../../lib/otp";

// الخطوة الأولى في إنشاء حساب خريج: نتأكد من البيانات ونبعت رمز تحقق
export async function POST(request: Request) {
  const body = await request.json();
  const fullName = String(body.fullName || "").trim();
  const nationalId = String(body.nationalId || "").trim();
  const phone = String(body.phone || "").trim();

  if (fullName.split(/\s+/).length < 3) {
    return NextResponse.json({ error: "اكتب الاسم ثلاثي على الأقل" }, { status: 400 });
  }
  if (!isValidNationalId(nationalId)) {
    return NextResponse.json({ error: "الرقم القومي لازم يكون 14 رقم" }, { status: 400 });
  }
  if (!isValidPhone(phone)) {
    return NextResponse.json({ error: "رقم الهاتف لازم يكون 11 رقم ويبدأ بـ 01" }, { status: 400 });
  }

  const existing = await prisma.user.findFirst({ where: { OR: [{ nationalId }, { phone }] } });
  if (existing) {
    return NextResponse.json({ error: "يوجد حساب مسجل بهذا الرقم القومي أو رقم الهاتف، سجّل دخول بدلًا من ذلك" }, { status: 409 });
  }

  try {
    const demoCode = await createOtp(phone, "SIGNUP");
    return NextResponse.json({ ok: true, demoCode });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 429 });
  }
}