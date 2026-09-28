import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";
import { calculateRenewal, renewalNumber, CARD_DELIVERY_FEE } from "../../lib/renewal";

// لوحة التحكم: كل طلبات التجديد
export async function GET() {
  const requests = await prisma.renewalRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { member: true },
  });
  return NextResponse.json(requests);
}

export async function POST(request: Request) {
  const body = await request.json();

  // 1) نتأكد من العضو تاني في السيرفر (منصدقش الصفحة)
  const member = await prisma.member.findUnique({ where: { membershipNumber: String(body.membershipNumber || "").trim() } });
  if (!member || member.nationalId !== String(body.nationalId || "").trim()) {
    return NextResponse.json({ error: "رقم القيد أو الرقم القومي غير صحيح" }, { status: 404 });
  }

  // 2) لازم يكون عليه سنين مستحقة
  const renewal = calculateRenewal(member.lastPaidYear);
  if (renewal.years.length === 0) {
    return NextResponse.json({ error: "اشتراكك مسدد حتى العام الحالي، لا توجد مستحقات" }, { status: 400 });
  }

  // 3) طريقة الاستلام: توصيل (محتاج عنوان) أو استلام من النقابة
  if (body.deliveryMethod !== "DELIVERY" && body.deliveryMethod !== "PICKUP") {
    return NextResponse.json({ error: "اختر طريقة استلام الكارنيه" }, { status: 400 });
  }
  if (body.deliveryMethod === "DELIVERY" && !String(body.deliveryAddress || "").trim()) {
    return NextResponse.json({ error: "اكتب عنوان التوصيل" }, { status: 400 });
  }

  // 4) رقم الهاتف
  if (!/^01\d{9}$/.test(String(body.phone || ""))) {
    return NextResponse.json({ error: "رقم الهاتف لازم يكون 11 رقم ويبدأ بـ 01" }, { status: 400 });
  }

  // 5) مفيش طلبين مفتوحين لنفس العضو
  const openRequest = await prisma.renewalRequest.findFirst({
    where: { memberId: member.id, status: { in: ["AWAITING_PAYMENT", "RECEIVED", "UNDER_REVIEW", "ISSUED"] } },
  });
  if (openRequest) {
    return NextResponse.json({ error: `لديك طلب تجديد مفتوح بالفعل رقم ${renewalNumber(openRequest.serial, openRequest.createdAt)}` }, { status: 409 });
  }

  // 6) الحساب بيتعمل في السيرفر بس
  const deliveryFee = body.deliveryMethod === "DELIVERY" ? CARD_DELIVERY_FEE : 0;

  const created = await prisma.renewalRequest.create({
    data: {
      memberId: member.id,
      years: renewal.years.map((y) => y.year),
      subscriptionTotal: renewal.subscriptionTotal,
      lateTotal: renewal.lateTotal,
      deliveryFee,
      total: renewal.total + deliveryFee,
      phone: body.phone,
      address: String(body.address || member.address),
      photoUrl: body.photoUrl || null,
      deliveryMethod: body.deliveryMethod,
      deliveryAddress: body.deliveryMethod === "DELIVERY" ? body.deliveryAddress : null,
    },
  });

  return NextResponse.json({
    id: created.id,
    number: renewalNumber(created.serial, created.createdAt),
    total: created.total,
  });
}