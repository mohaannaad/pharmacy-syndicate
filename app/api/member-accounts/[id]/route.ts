import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { sendSms } from "../../../lib/otp";
import { updateSyndicateMemberPhone } from "../../../lib/syndicate";

// الموظف بيقبل أو يرفض طلب حساب عضو غيّر رقمه
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const action = String(body.action || "");
  const adminNote = String(body.adminNote || "").trim();

  const accountRequest = await prisma.memberAccountRequest.findUnique({ where: { id } });
  if (!accountRequest) {
    return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
  }
  if (accountRequest.status !== "PENDING") {
    return NextResponse.json({ error: "تمت مراجعة هذا الطلب من قبل" }, { status: 400 });
  }

  // ---------- الرفض ----------
  if (action === "reject") {
    if (!adminNote) {
      return NextResponse.json({ error: "يرجى كتابة سبب الرفض" }, { status: 400 });
    }
    await prisma.memberAccountRequest.update({
      where: { id },
      data: { status: "REJECTED", adminNote },
    });
    await sendSms(accountRequest.newPhone, `نقابة الصيادلة: تم رفض طلب إنشاء حسابك. السبب: ${adminNote}`);
    return NextResponse.json({ ok: true });
  }

  if (action !== "approve") {
    return NextResponse.json({ error: "إجراء غير معروف" }, { status: 400 });
  }

  // ---------- القبول ----------
  // نتأكد إن محدش عمل حساب بنفس البيانات من ساعة ما الطلب اتبعت
  const conflict = await prisma.user.findFirst({
    where: {
      OR: [
        { membershipNumber: accountRequest.membershipNumber },
        { nationalId: accountRequest.nationalId },
        { phone: accountRequest.newPhone },
      ],
    },
  });
  if (conflict) {
    return NextResponse.json({ error: "يوجد حساب على البوابة بنفس رقم القيد أو الرقم القومي أو رقم الهاتف، يرجى رفض الطلب مع كتابة السبب" }, { status: 409 });
  }

  // كل الخطوات مع بعض: لو واحدة فشلت، ولا حاجة تتسجل
  await prisma.$transaction(
    async (tx) => {
      // أ) الحساب يتعمل كعضو بكلمة السر اللي اختارها
      await tx.user.create({
        data: {
          fullName: accountRequest.fullName,
          nationalId: accountRequest.nationalId,
          phone: accountRequest.newPhone,
          passwordHash: accountRequest.passwordHash,
          role: "MEMBER",
          membershipNumber: accountRequest.membershipNumber,
        },
      });

      // ب) الرقم الجديد يتسجل في سجلات النقابة
      await updateSyndicateMemberPhone(tx, accountRequest.membershipNumber, accountRequest.newPhone);

      // ج) الطلب يبقى "مقبول"
      await tx.memberAccountRequest.update({
        where: { id },
        data: { status: "APPROVED", adminNote: adminNote || null },
      });
    },
    { timeout: 20000 } // Neon ساعات بيبقى بطيء
  );

  await sendSms(accountRequest.newPhone, `نقابة الصيادلة: تم تفعيل حسابك. يمكنك تسجيل الدخول برقم القيد ${accountRequest.membershipNumber} وكلمة المرور الخاصة بك.`);
  return NextResponse.json({ ok: true });
}