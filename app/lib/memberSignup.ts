import { prisma } from "./prisma";
import { isValidNationalId } from "./auth";
import { findSyndicateMember, SyndicateMember } from "./syndicate";

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
    return { error: "رقم القيد لازم يكون أرقام بس", status: 400 };
  }
  if (!isValidNationalId(nationalId)) {
    return { error: "الرقم القومي لازم يكون 14 رقم", status: 400 };
  }

  const member = await findSyndicateMember(membershipNumber, nationalId);
  if (!member) {
    return { error: "البيانات دي مش مطابقة لسجلات النقابة، اتأكد من رقم القيد والرقم القومي", status: 404 };
  }

  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ membershipNumber }, { nationalId }] },
  });
  if (existingUser) {
    return { error: "عندك حساب على البوابة بالفعل، سجّل دخول برقم القيد وكلمة المرور", status: 409 };
  }

  const pending = await prisma.memberAccountRequest.findFirst({
    where: { nationalId, status: "PENDING" },
  });
  if (pending) {
    return { error: "عندك طلب إنشاء حساب قيد المراجعة، هيوصلك رسالة أول ما يتراجع", status: 409 };
  }

  return { member };
}