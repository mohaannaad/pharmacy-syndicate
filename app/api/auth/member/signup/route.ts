import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { createSession, hashPassword, isValidPassword, isValidPhone } from "../../../../lib/auth";
import { verifyOtp } from "../../../../lib/otp";
import { checkMemberEligibility } from "../../../../lib/memberSignup";

// الخطوة 3: نتأكد من الرمز، وبعدين:
// - رقمه زي ما هو → الحساب يتعمل على طول كعضو
// - غيّر رقمه → طلب يروح للموظف يراجع البطاقة
export async function POST(request: Request) {
  const body = await request.json();
  const result = await checkMemberEligibility(body.membershipNumber, body.nationalId);
  if (!result.member) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  const member = result.member;

  const password = String(body.password || "");
  if (!isValidPassword(password)) {
    return NextResponse.json({ error: "يجب ألا تقل كلمة المرور عن 8 أحرف أو أرقام" }, { status: 400 });
  }

  const newPhone = String(body.newPhone || "").trim();
  const changingPhone = !!newPhone;
  const idFrontUrl = String(body.idFrontUrl || "");
  const idBackUrl = String(body.idBackUrl || "");

  if (changingPhone) {
    if (!isValidPhone(newPhone) || newPhone === member.phone) {
      return NextResponse.json({ error: "رقم الهاتف الجديد غير صحيح، يرجى الرجوع إلى الخطوة السابقة" }, { status: 400 });
    }
    if (!idFrontUrl.startsWith("https://") || !idBackUrl.startsWith("https://")) {
      return NextResponse.json({ error: "يرجى رفع صورة البطاقة من الوجه والظهر" }, { status: 400 });
    }
  }

  const phone = changingPhone ? newPhone : member.phone;

  const otpError = await verifyOtp(phone, "MEMBER_SIGNUP", String(body.code || ""));
  if (otpError) {
    return NextResponse.json({ error: otpError }, { status: 400 });
  }

  const phoneUsed = await prisma.user.findUnique({ where: { phone } });
  if (phoneUsed) {
    return NextResponse.json({ error: "رقم الهاتف هذا مستخدم في حساب آخر على البوابة" }, { status: 409 });
  }

  // (أ) رقمه زي ما هو → حساب عضو على طول
  if (!changingPhone) {
    const user = await prisma.user.create({
      data: {
        fullName: member.fullName,
        nationalId: member.nationalId,
        phone,
        passwordHash: hashPassword(password),
        role: "MEMBER",
        membershipNumber: member.membershipNumber,
      },
    });
    await createSession(user.id);
    return NextResponse.json({ ok: true, mode: "created" });
  }

  // (ب) غيّر رقمه → طلب للموظف
  await prisma.memberAccountRequest.create({
    data: {
      membershipNumber: member.membershipNumber,
      nationalId: member.nationalId,
      fullName: member.fullName,
      oldPhone: member.phone,
      newPhone,
      passwordHash: hashPassword(password),
      idFrontUrl,
      idBackUrl,
    },
  });
  return NextResponse.json({ ok: true, mode: "pending" });
}