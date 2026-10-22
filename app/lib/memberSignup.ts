import { prisma } from "./prisma";
import { isValidNationalId } from "./auth";
import { findSyndicateMember, SyndicateMember, SyndicateUnavailableError } from "./syndicate";

// =====================================================================
// تسجيل العضو القديم: الفحوصات المشتركة بين كل الخطوات
// =====================================================================

// 01012345678 → 010•••••678
export function maskPhone(phone: string) {
  return `${phone.slice(0, 3)}•••••${phone.slice(-3)}`;
}

type EligibilityResult = { member: SyndicateMember; error?: undefined; status?: undefined } | { error: string; status: number; member?: undefined };

// بيتأكد إن العضو موجود في النقابة، ومعندوش حساب أو طلب مفتوح على البوابة
export async function checkMemberEligibility(membershipNumberInput: unknown, nationalIdInput: unknown): Promise<EligibilityResult> {
  const membershipNumber = String(membershipNumberInput || "").trim();
  const nationalId = String(nationalIdInput || "").trim();

  if (!/^\d+$/.test(membershipNumber)) {
    return { error: "يجب أن يتكون رقم القيد من أرقام فقط", status: 400 };
  }
  if (!isValidNationalId(nationalId)) {
    return { error: "يجب أن يتكون الرقم القومي من 14 رقمًا", status: 400 };
  }

    let member: SyndicateMember | null;
  try {
    member = await findSyndicateMember(membershipNumber, nationalId);
  } catch (e) {
    if (e instanceof SyndicateUnavailableError) {
      return { error: "تعذّر الاتصال بسجلات النقابة حاليًا، يرجى المحاولة بعد قليل", status: 503 };
    }
    throw e;
  }
  if (!member) {
    return { error: "البيانات غير مطابقة لسجلات النقابة، يرجى التأكد من رقم القيد والرقم القومي", status: 404 };
  }

  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ membershipNumber }, { nationalId }] },
  });
  if (existingUser) {
    return { error: "لديك حساب على البوابة بالفعل، يرجى تسجيل الدخول برقم القيد وكلمة المرور", status: 409 };
  }

  const pending = await prisma.memberAccountRequest.findFirst({
    where: { nationalId, status: "PENDING" },
  });
  if (pending) {
    return { error: "لديك طلب إنشاء حساب قيد المراجعة، وستصلك رسالة فور مراجعته", status: 409 };
  }

  return { member };
}