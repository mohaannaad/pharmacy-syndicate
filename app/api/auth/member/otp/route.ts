import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { isValidPhone } from "../../../../lib/auth";
import { createOtp } from "../../../../lib/otp";
import { checkMemberEligibility, maskPhone } from "../../../../lib/memberSignup";

// الخطوة 2: نبعت رمز التحقق
// - على الرقم المسجل في النقابة (العادي)
// - أو على الرقم الجديد (لو العضو غيّر رقمه)
export async function POST(request: Request) {
  const body = await request.json();
  const result = await checkMemberEligibility(body.membershipNumber, body.nationalId);
  if (!result.member) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const newPhone = String(body.newPhone || "").trim();
  let phone = result.member.phone;

  if (newPhone) {
    if (!isValidPhone(newPhone)) {
      return NextResponse.json({ error: "رقم الهاتف لازم يكون 11 رقم ويبدأ بـ 01" }, { status: 400 });
    }
    if (newPhone === result.member.phone) {
      return NextResponse.json({ error: "ده نفس الرقم المسجل في النقابة، اختار «الرقم ده معايا»" }, { status: 400 });
    }
    phone = newPhone;
  }

  const phoneUsed = await prisma.user.findUnique({ where: { phone } });
  if (phoneUsed) {
    return NextResponse.json({ error: "رقم الهاتف ده مستخدم في حساب تاني على البوابة. لو ده مش رقمك، اختار «غيّرت رقمي»" }, { status: 409 });
  }

  try {
    const demoCode = await createOtp(phone, "MEMBER_SIGNUP");
    return NextResponse.json({ ok: true, demoCode, sentTo: newPhone || maskPhone(phone) });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 429 });
  }
}