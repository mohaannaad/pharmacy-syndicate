import { NextResponse } from "next/server";
import { checkMemberEligibility, maskPhone } from "../../../../lib/memberSignup";

// الخطوة 1: العضو بيكتب رقم القيد والرقم القومي، وإحنا بنسأل النقابة
export async function POST(request: Request) {
  const body = await request.json();
  const result = await checkMemberEligibility(body.membershipNumber, body.nationalId);
  if (!result.member) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  // بنرجّع الاسم ورقم الموبايل متخبي جزء منه (مش الرقم كامل)
  return NextResponse.json({
    fullName: result.member.fullName,
    maskedPhone: maskPhone(result.member.phone),
  });
}