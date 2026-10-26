import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { renewalNumber } from "../../../../lib/renewal";
import { checkPaymentStatusFromSyndicate, isSyndicateApiEnabled, SyndicateUnavailableError } from "../../../../lib/syndicate";

// الموظف بيسأل النقابة: الطلب ده اتدفع ولا لأ؟ (checkPaymentStatus)
// مرجع الدفع (paymentRef) = رقم طلب التجديد، مثال: RNW-2026-00001
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!isSyndicateApiEnabled()) {
    return NextResponse.json({ error: "الربط مع سجلات النقابة غير مفعّل على هذه النسخة" }, { status: 400 });
  }

  const renewal = await prisma.renewalRequest.findUnique({ where: { id }, include: { member: true } });
  if (!renewal) {
    return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
  }
  if (renewal.status !== "AWAITING_PAYMENT") {
    return NextResponse.json({ error: "تم تسجيل سداد هذا الطلب بالفعل" }, { status: 400 });
  }

  const paymentRef = renewalNumber(renewal.serial, renewal.createdAt);
  let payment;
  try {
    payment = await checkPaymentStatusFromSyndicate(renewal.member.membershipNumber, paymentRef);
  } catch (e) {
    if (e instanceof SyndicateUnavailableError) {
      return NextResponse.json({ error: "تعذّر الاتصال بسجلات النقابة حاليًا، يرجى المحاولة بعد قليل" }, { status: 503 });
    }
    throw e;
  }

  if (!payment.paid) {
    return NextResponse.json({ paid: false, message: payment.message || "لم يتم تسجيل سداد لهذا الطلب لدى النقابة حتى الآن" });
  }

  const note = [
    "تم السداد",
    payment.channel && `عبر ${payment.channel}`,
    payment.receiptNumber && `— إيصال رقم ${payment.receiptNumber}`,
  ].filter(Boolean).join(" ");

  await prisma.renewalRequest.update({
    where: { id },
    data: { status: "RECEIVED", paidAt: payment.paidAt ?? new Date(), adminNote: note },
  });
  await prisma.member.update({
    where: { id: renewal.memberId },
    data: {
      lastPaidYear: payment.lastPaidYear || Math.max(...renewal.years),
      phone: renewal.phone,
      address: renewal.address,
      ...(renewal.photoUrl ? { photoUrl: renewal.photoUrl } : {}),
    },
  });

  return NextResponse.json({ paid: true, message: note });
}
