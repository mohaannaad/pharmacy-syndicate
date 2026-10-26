import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentMember } from "../../../lib/currentMember";
import { renewalNumber } from "../../../lib/renewal";
import { getRenewalDues } from "../../../lib/renewalServer";
import { SyndicateUnavailableError } from "../../../lib/syndicate";

const UNAVAILABLE = "تعذّر الاتصال بسجلات النقابة حاليًا، يرجى المحاولة بعد قليل";


// بيرجّع بيانات العضو الحالي + السنين المستحقة عليه + أي طلب تجديد مفتوح
export async function GET() {
  const current = await getCurrentMember();
  if ("error" in current) {
    return NextResponse.json({ error: current.error }, { status: current.status });
  }
  const member = current.member;

  let renewal;
  try {
    renewal = await getRenewalDues(member);
  } catch (e) {
    if (e instanceof SyndicateUnavailableError) return NextResponse.json({ error: UNAVAILABLE }, { status: 503 });
    throw e;
  }

  const openRequest = await prisma.renewalRequest.findFirst({
    where: { memberId: member.id, status: { in: ["AWAITING_PAYMENT", "RECEIVED", "UNDER_REVIEW", "ISSUED"] } },
    orderBy: { createdAt: "desc" },
  });
  // آخر طلب اترفض (عشان نعرّف العضو بالسبب)
  const lastRequest = await prisma.renewalRequest.findFirst({
    where: { memberId: member.id },
    orderBy: { createdAt: "desc" },
  });
  const rejectedRequest =
    lastRequest && lastRequest.status === "REJECTED"
      ? { number: renewalNumber(lastRequest.serial, lastRequest.createdAt), adminNote: lastRequest.adminNote }
      : null;

  return NextResponse.json({
    member: {
      fullName: member.fullName,
      membershipNumber: member.membershipNumber,
      phone: member.phone,
      address: member.address,
      photoUrl: member.photoUrl,
      lastPaidYear: member.lastPaidYear,
    },
    renewal,
    openRequest: openRequest
      ? {
          number: renewalNumber(openRequest.serial, openRequest.createdAt),
          status: openRequest.status,
          total: openRequest.total,
          adminNote: openRequest.adminNote,
        }
      : null,
    rejectedRequest,
  });
}