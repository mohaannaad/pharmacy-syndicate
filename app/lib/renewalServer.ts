import { calculateRenewalDues, type RenewalDues } from "./renewal";
import { getMemberDuesFromSyndicate, isSyndicateApiEnabled } from "./syndicate";

// =====================================================================
// المستحقات على العضو (بتشتغل في السيرفر بس)
// - لو API النقابة شغال → المبلغ والسنين من النقابة (getMemberDues)
// - لو مش شغال → الحسبة التجريبية عندنا
// =====================================================================
export async function getRenewalDues(member: { membershipNumber: string; lastPaidYear: number }): Promise<RenewalDues> {
  if (!isSyndicateApiEnabled()) {
    return calculateRenewalDues(member.lastPaidYear);
  }

  const dues = await getMemberDuesFromSyndicate(member.membershipNumber);
  if (!dues) {
    return {
      years: [],
      subscriptionTotal: 0,
      lateTotal: 0,
      total: 0,
      detailed: false,
      canRenew: false,
      blockReason: "تعذّر الاستعلام عن مستحقاتك من سجلات النقابة، يرجى المحاولة لاحقًا أو التواصل مع النقابة",
    };
  }

  const years = Array.from({ length: Math.max(0, dues.noOfYears) }, (_, i) => ({
    year: dues.lastPaidYear + i + 1,
    subscription: null,
    late: null,
  }));

  return {
    years,
    subscriptionTotal: dues.total, // الإجمالي شامل الغرامات
    lateTotal: 0,
    total: dues.total,
    detailed: false,
    canRenew: dues.canRenew,
    blockReason: dues.blockReason,
  };
}
