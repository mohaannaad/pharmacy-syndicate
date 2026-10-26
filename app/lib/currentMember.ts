import { prisma } from "./prisma";
import { getCurrentUser } from "./auth";
import { isSyndicateApiEnabled, syncMemberFromSyndicate, SyndicateUnavailableError } from "./syndicate";

// =====================================================================
// العضو اللي عامل تسجيل دخول
// ---------------------------------------------------------------------
// بنجيب الحساب الداخل، ونتأكد إنه عضو، وبعدين نجيب بياناته:
// - لو API النقابة شغال → أحدث بيانات من النقابة (وبنحفظ نسخة عندنا)
// - لو مش شغال → من جدول الأعضاء التجريبي عندنا
// =====================================================================

export async function getCurrentMember() {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "يجب تسجيل الدخول أولًا", status: 401 } as const;
  }
  if (user.role !== "MEMBER" || !user.membershipNumber) {
    return { error: "هذه الخدمة متاحة للأعضاء المقيدين بالنقابة فقط", status: 403 } as const;
  }

  let member;
  if (isSyndicateApiEnabled()) {
    try {
      member = await syncMemberFromSyndicate(user.membershipNumber, String(user.nationalId || ""));
    } catch (e) {
      if (e instanceof SyndicateUnavailableError) {
        return { error: "تعذّر الاتصال بسجلات النقابة حاليًا، يرجى المحاولة بعد قليل", status: 503 } as const;
      }
      throw e;
    }
  } else {
    member = await prisma.member.findUnique({ where: { membershipNumber: user.membershipNumber } });
  }

  if (!member) {
    return { error: "بيانات عضويتك غير موجودة في سجلات النقابة، يرجى التواصل مع النقابة", status: 404 } as const;
  }

  return { member } as const;
}
