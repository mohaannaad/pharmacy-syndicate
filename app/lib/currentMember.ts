import { prisma } from "./prisma";
import { getCurrentUser } from "./auth";

// =====================================================================
// العضو اللي عامل تسجيل دخول
// ---------------------------------------------------------------------
// بنجيب الحساب الداخل، ونتأكد إنه عضو، وبعدين نجيب بياناته من سجلات النقابة
// (مؤقتًا جدول الأعضاء عندنا، ولما API النقابة يجهز هتيجي من هناك).
// =====================================================================

export async function getCurrentMember() {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "يجب تسجيل الدخول أولًا", status: 401 } as const;
  }
  if (user.role !== "MEMBER" || !user.membershipNumber) {
    return { error: "هذه الخدمة متاحة للأعضاء المقيدين بالنقابة فقط", status: 403 } as const;
  }

  const member = await prisma.member.findUnique({ where: { membershipNumber: user.membershipNumber } });
  if (!member) {
    return { error: "بيانات عضويتك غير موجودة في سجلات النقابة، يرجى التواصل مع النقابة", status: 404 } as const;
  }

  return { member } as const;
}