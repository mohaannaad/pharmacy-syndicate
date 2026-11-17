import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// آخر طلب وصل في كل قسم من أقسام الطلبات — لوحة التحكم بتسأل عليه كل شوية
// عشان تحط نقطة دهبي جنب القسم اللي فيه حاجة جديدة
export const dynamic = "force-dynamic";

export async function GET() {
  const [graduates, renewals, accounts, certificates, complaints, ads] = await Promise.all([
    prisma.graduateApplication.aggregate({ _max: { createdAt: true } }),
    prisma.renewalRequest.aggregate({ _max: { createdAt: true } }),
    prisma.memberAccountRequest.aggregate({ _max: { createdAt: true } }),
    prisma.certificateRequest.aggregate({ _max: { createdAt: true } }),
    prisma.complaint.aggregate({ _max: { createdAt: true } }),
    prisma.ad.aggregate({ _max: { createdAt: true } }),
  ]);

  return NextResponse.json({
    "/admin/graduates": graduates._max.createdAt,
    "/admin/renewals": renewals._max.createdAt,
    "/admin/member-accounts": accounts._max.createdAt,
    "/admin/certificates": certificates._max.createdAt,
    "/admin/complaints": complaints._max.createdAt,
    "/admin/ads": ads._max.createdAt,
  });
}
