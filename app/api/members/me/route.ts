import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentMember } from "../../../lib/currentMember";
import { calculateRenewal, renewalNumber } from "../../../lib/renewal";

// بيرجّع بيانات العضو الحالي + السنين المستحقة عليه + أي طلب تجديد مفتوح
export async function GET() {
  const member = await getCurrentMember();

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
    renewal: calculateRenewal(member.lastPaidYear),
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