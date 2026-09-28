import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import { RENEWAL_STATUS_LABELS } from "../../../lib/renewal";

// الموظف بيغيّر حالة الطلب
// لما الطلب يتحول من "في انتظار الدفع" لـ "تم الاستلام" (يعني اتدفع):
//   → آخر سنة مدفوعة عند العضو بتتحدث تلقائيًا
// (لما بوابة الدفع تشتغل، هي اللي هتعمل الخطوة دي بدل الموظف)
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const renewal = await prisma.renewalRequest.findUnique({ where: { id } });
  if (!renewal) {
    return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
  }

  if (!RENEWAL_STATUS_LABELS[body.status]) {
    return NextResponse.json({ error: "حالة غير صحيحة" }, { status: 400 });
  }
  if (body.status === "REJECTED" && !String(body.adminNote || "").trim()) {
    return NextResponse.json({ error: "من فضلك اكتب سبب الرفض" }, { status: 400 });
  }

  const justPaid = renewal.status === "AWAITING_PAYMENT" && body.status !== "AWAITING_PAYMENT" && body.status !== "REJECTED";

  const updated = await prisma.renewalRequest.update({
    where: { id },
    data: {
      status: body.status,
      adminNote: String(body.adminNote || "").trim() || null,
      ...(justPaid ? { paidAt: new Date() } : {}),
    },
  });

  if (justPaid) {
    await prisma.member.update({
      where: { id: renewal.memberId },
      data: {
        lastPaidYear: Math.max(...renewal.years),
        phone: renewal.phone,
        address: renewal.address,
        ...(renewal.photoUrl ? { photoUrl: renewal.photoUrl } : {}),
      },
    });
  }

  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.renewalRequest.delete({ where: { id } });
  return NextResponse.json({ success: true });
}