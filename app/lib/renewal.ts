// =====================================================================
// قواعد خدمة "تجديد الاشتراك وتجديد الكارنيه"
// =====================================================================

// ⚠️ أسعار مبدئية — لازم تتبدل بالأسعار الرسمية من النقابة
export const ANNUAL_SUBSCRIPTION = 300; // الاشتراك السنوي
export const LATE_FEE_PER_YEAR = 50; // غرامة عن كل سنة متأخرة
export const CARD_DELIVERY_FEE = 50; // رسوم توصيل الكارنيه

export interface RenewalYear {
  year: number;
  subscription: number;
  late: number;
}

// بتحسب السنين المستحقة من بعد آخر سنة مدفوعة لحد السنة الحالية
// السنة الحالية = اشتراك بس، والسنين اللي قبلها = اشتراك + غرامة تأخير
export function calculateRenewal(lastPaidYear: number, currentYear = new Date().getFullYear()) {
  const years: RenewalYear[] = [];
  for (let year = lastPaidYear + 1; year <= currentYear; year++) {
    years.push({
      year,
      subscription: ANNUAL_SUBSCRIPTION,
      late: year < currentYear ? LATE_FEE_PER_YEAR : 0,
    });
  }
  const subscriptionTotal = years.reduce((sum, y) => sum + y.subscription, 0);
  const lateTotal = years.reduce((sum, y) => sum + y.late, 0);
  return { years, subscriptionTotal, lateTotal, total: subscriptionTotal + lateTotal };
}

export function renewalNumber(serial: number, createdAt: string | Date) {
  const year = new Date(createdAt).getFullYear();
  return `RNW-${year}-${String(serial).padStart(5, "0")}`;
}

export const DELIVERY_LABELS: Record<string, string> = {
  DELIVERY: "توصيل الكارنيه",
  PICKUP: "استلام من النقابة",
};

export const RENEWAL_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  AWAITING_PAYMENT: { label: "في انتظار الدفع", color: "bg-yellow-100 text-yellow-700" },
  RECEIVED: { label: "تم الاستلام", color: "bg-blue-100 text-blue-700" },
  UNDER_REVIEW: { label: "قيد المراجعة", color: "bg-orange-100 text-orange-700" },
  ISSUED: { label: "تم إصدار الكارنيه", color: "bg-teal-100 text-teal-700" },
  DELIVERED: { label: "تم التسليم", color: "bg-green-100 text-green-700" },
  REJECTED: { label: "مرفوض", color: "bg-red-100 text-red-700" },
};