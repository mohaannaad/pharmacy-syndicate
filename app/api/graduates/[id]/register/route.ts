import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { issueMembershipNumber } from "../../../../lib/syndicate";

// الموظف بيدوس "إصدار رقم القيد" → الخريج يبقى عضو
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const application = await prisma.graduateApplication.findUnique({
    where: { id },
    include: { user: true },
  });

  // 1) شروط قبل الإصدار
  if (!application) {
    return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
  }
  if (application.status !== "LICENSING") {
    return NextResponse.json({ error: "يجب أن يكون الطلب في مرحلة «لدى إدارة التراخيص» أولًا" }, { status: 400 });
  }
  const user = application.user;
  if (!user) {
    return NextResponse.json({ error: "هذا الطلب غير مرتبط بحساب خريج (طلب قديم)، لذا لا يمكن تحويله إلى عضو تلقائيًا" }, { status: 400 });
  }
  if (user.membershipNumber) {
    return NextResponse.json({ error: `لدى صاحب الطلب رقم قيد بالفعل: ${user.membershipNumber}` }, { status: 400 });
  }

  const address = [application.buildingNo && `عقار ${application.buildingNo}`, application.apartment && `شقة ${application.apartment}`, application.street, application.district, application.city, application.governorate].filter(Boolean).join("، ");

  // 2) كل الخطوات مع بعض: لو واحدة فشلت، ولا حاجة تتسجل
  const membershipNumber = await prisma.$transaction(
    async (tx) => {
      // أ) رقم قيد جديد من "النقابة"
      const number = await issueMembershipNumber(tx, {
        nationalId: user.nationalId,
        fullName: application.fullNameAr,
        phone: user.phone,
        address,
      });

      // ب) الحساب يتحول من خريج لعضو (نفس كلمة السر)
      await tx.user.update({
        where: { id: user.id },
        data: { role: "MEMBER", membershipNumber: number },
      });

      // ج) الطلب يبقى "تم القيد"
      await tx.graduateApplication.update({
        where: { id },
        data: { status: "REGISTERED", adminNote: null },
      });

      return number;
    },
    { timeout: 20000 } // Neon ساعات بيبقى بطيء
  );

  return NextResponse.json({ membershipNumber });
}