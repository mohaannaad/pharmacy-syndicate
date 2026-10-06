import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import { calculateFee, GRADUATE_STATUS_LABELS, trackingNumber } from "../../../lib/graduate";
import { getCurrentUser } from "../../../lib/auth";
import { buildGraduateApplication } from "../../../lib/graduateServer";

// الموظف بيستخدمها عشان يغيّر حالة الطلب، يكتب ملاحظة، أو يحدد فئة الجامعة
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const application = await prisma.graduateApplication.findUnique({ where: { id } });
  if (!application) {
    return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
  }

  const data: { status?: typeof application.status; adminNote?: string | null; fee?: number; category?: number } = {};

  // 1) تحديد فئة الجامعة (للخاص والخارجي) → الرسوم تتحسب والطلب يروح "في انتظار الدفع"
  if (body.category) {
    const category = Number(body.category) as 1 | 2 | 3;
    const fee = calculateFee(application.universityType, application.graduationYear, category);
    if (fee === null) {
      return NextResponse.json({ error: "فئة غير صحيحة" }, { status: 400 });
    }
    data.fee = fee;
    data.category = category;
    data.status = "AWAITING_PAYMENT";
  }

  // 2) تغيير الحالة
  if (body.status) {
    if (!GRADUATE_STATUS_LABELS[body.status]) {
      return NextResponse.json({ error: "حالة غير صحيحة" }, { status: 400 });
    }
    // "مطلوب استكمال" و"مرفوض" لازم يكون معاهم سبب
    if ((body.status === "NEEDS_COMPLETION" || body.status === "REJECTED") && !String(body.adminNote || "").trim()) {
      return NextResponse.json({ error: "من فضلك اكتب السبب" }, { status: 400 });
    }
        // "تم القيد" مبتتعملش يدوي، لازم من زرار "إصدار رقم القيد"
    if (body.status === "REGISTERED" && application.status !== "REGISTERED") {
      return NextResponse.json({ error: "حالة «تم القيد» بتتعمل من زرار «إصدار رقم القيد» بس" }, { status: 400 });
    }
    data.status = body.status as typeof application.status;
  }

  // 3) الملاحظة
  if (body.adminNote !== undefined) {
    data.adminNote = String(body.adminNote).trim() || null;
  }

  const updated = await prisma.graduateApplication.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.graduateApplication.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

// الخريج بيستكمل طلبه بعد "مطلوب استكمال" ويبعته تاني (نفس الطلب، مش طلب جديد)
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "لازم تسجّل دخول الأول" }, { status: 401 });
  }

  const application = await prisma.graduateApplication.findUnique({ where: { id } });
  // الطلب لازم يكون بتاعه هو
  if (!application || application.userId !== user.id) {
    return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
  }
  if (application.status !== "NEEDS_COMPLETION") {
    return NextResponse.json({ error: "الطلب ده مش محتاج استكمال حاليًا" }, { status: 400 });
  }

  const body = await request.json();
  const result = buildGraduateApplication(body, { nationalId: user.nationalId, phone: user.phone }, application.category);
  if (result.error || !result.data) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const updated = await prisma.graduateApplication.update({
    where: { id },
    data: {
      ...result.data,
      status: "UNDER_REVIEW", // يرجع للموظف يراجعه تاني
      adminNote: null,
    },
  });

  return NextResponse.json({
    id: updated.id,
    trackingNumber: trackingNumber(updated.serial, updated.createdAt),
    fee: updated.fee,
    status: updated.status,
  });
}