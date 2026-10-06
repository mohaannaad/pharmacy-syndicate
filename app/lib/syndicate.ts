import type { Prisma } from "../generated/prisma/client";

// =====================================================================
// ⚠️ طبقة النقابة المؤقتة (Mock)
// ---------------------------------------------------------------------
// رقم القيد الحقيقي بيطلع من سيستم النقابة (Oracle).
// لحد ما مطوري زها يسلّمونا الـ API، الدالة دي بتعمل نفس الدور هنا:
// بتسجّل العضو في جدول الأعضاء وبتديله رقم قيد جديد.
// لما الـ API يجهز، هنغيّر الدالة دي بس، وباقي الموقع مش هيتغير.
// =====================================================================

// أول رقم قيد هيطلع من البوابة (عشان ميتلخبطش مع العضو التجريبي 12345)
const FIRST_MEMBERSHIP_NUMBER = 50001;

interface NewMemberData {
  nationalId: string;
  fullName: string;
  phone: string;
  address: string;
}

export async function issueMembershipNumber(tx: Prisma.TransactionClient, data: NewMemberData): Promise<string> {
  // لو الشخص ده متسجل كعضو قبل كده (بنفس الرقم القومي) → نرجّع رقمه هو
  const existing = await tx.member.findUnique({ where: { nationalId: data.nationalId } });
  if (existing) return existing.membershipNumber;

  // أكبر رقم قيد موجود + 1
  const members = await tx.member.findMany({ select: { membershipNumber: true } });
  const users = await tx.user.findMany({ where: { membershipNumber: { not: null } }, select: { membershipNumber: true } });
  const numbers = [...members, ...users].map((m) => Number(m.membershipNumber)).filter((n) => Number.isFinite(n));
  const next = Math.max(FIRST_MEMBERSHIP_NUMBER - 1, ...numbers) + 1;
  const membershipNumber = String(next);

  await tx.member.create({
    data: {
      membershipNumber,
      nationalId: data.nationalId,
      fullName: data.fullName,
      phone: data.phone,
      address: data.address,
      // رسوم القيد بتشمل اشتراك السنة الحالية
      lastPaidYear: new Date().getFullYear(),
    },
  });

  return membershipNumber;
}