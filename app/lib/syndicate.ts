import type { Prisma } from "../generated/prisma/client";
import { prisma } from "./prisma";

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

// =====================================================================
// البحث عن عضو في سجلات النقابة (برقم القيد + الرقم القومي)
// ---------------------------------------------------------------------
// مؤقتًا: بندوّر في جدول الأعضاء عندنا، وفيه أعضاء تجريبيين بيتضافوا لوحدهم.
// لما API النقابة يجهز، الدالة دي هتسأل Oracle بدل كده.
// =====================================================================

export interface SyndicateMember {
  membershipNumber: string;
  nationalId: string;
  fullName: string;
  phone: string; // رقم الموبايل المسجل في النقابة
  address: string;
  lastPaidYear: number;
  photoUrl: string | null;
}

// أعضاء تجريبيين للتجربة (كأنهم مسجلين في النقابة من زمان)
const MOCK_REGISTRY = [
  { membershipNumber: "23456", nationalId: "28503150101234", fullName: "سارة أحمد محمود السيد", phone: "01123456789", address: "12 شارع الجمهورية، المنصورة، الدقهلية", lastPaidYear: 2025 },
  { membershipNumber: "34567", nationalId: "27811200201234", fullName: "محمد عبد الله حسن علي", phone: "01234567890", address: "8 شارع فيصل، الهرم، الجيزة", lastPaidYear: 2024 },
  { membershipNumber: "45678", nationalId: "28807120102345", fullName: "منى حسن إبراهيم عبد الله", phone: "01155566677", address: "15 شارع الهرم، الجيزة", lastPaidYear: 2025 },
  { membershipNumber: "56789", nationalId: "29102250103456", fullName: "كريم سامي عبد العزيز", phone: "01277788899", address: "22 شارع النصر، طنطا، الغربية", lastPaidYear: 2023 },
  { membershipNumber: "67890", nationalId: "28511300104567", fullName: "هبة محمود فتحي السيد", phone: "01099988877", address: "7 شارع سعد زغلول، الإسكندرية", lastPaidYear: 2026 },
];

let mockSeeded = false;
async function seedMockRegistry() {
  if (mockSeeded) return;
  for (const member of MOCK_REGISTRY) {
    await prisma.member.upsert({ where: { membershipNumber: member.membershipNumber }, update: {}, create: member });
  }
  mockSeeded = true;
}

// ---------------------------------------------------------------------
// API النقابة الحقيقي
// لو SYNDICATE_API_URL موجود في .env → بنكلّم API النقابة (محتاج VPN)
// لو مش موجود → بنستخدم الأعضاء التجريبيين اللي فوق
// ---------------------------------------------------------------------
const SYNDICATE_API_URL = process.env.SYNDICATE_API_URL;

export function isSyndicateApiEnabled() {
  return !!SYNDICATE_API_URL;
}

// خطأ خاص: API النقابة مش بيرد (الـ VPN مقفول، أو السيرفر واقع)
export class SyndicateUnavailableError extends Error {}

// بنوحّد شكل رقم الموبايل: 01XXXXXXXXX
function normalizeMobile(value: unknown) {
  let digits = String(value || "").replace(/\D/g, "");
  if (digits.startsWith("20") && digits.length === 12) digits = "0" + digits.slice(2);
  return /^01\d{9}$/.test(digits) ? digits : "";
}

function toNumber(value: unknown, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

// النقابة بترجع statusCode، وفي واجهة تحديث الموبايل بترجعه StatusCode (بحرف S كبير)
function isSuccess(data: Record<string, unknown> | null) {
  return String(data?.statusCode ?? data?.StatusCode ?? "") === "1";
}

// دالة واحدة بتكلّم أي خدمة عند النقابة
async function callSyndicate(service: string, payload: Record<string, string>) {
  let data;
  try {
    const res = await fetch(`${SYNDICATE_API_URL}/${service}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000), // لو مردّش في 10 ثواني نعتبره واقع
      cache: "no-store",
    });
    data = await res.json();
  } catch (e) {
    console.error(`❌ [API النقابة] ${service} مش بيرد:`, e);
    throw new SyndicateUnavailableError();
  }
  console.log(`📡 [API النقابة] ${service} → ${data?.statusCode ?? data?.StatusCode} ${data?.statusMessage ?? ""}`);
  if (!isSuccess(data)) {
    console.log(`📥 [API النقابة] ${service} الرد كامل:`, JSON.stringify(data));
  }
  return data as Record<string, unknown>;
}

// ---------------------------------------------------------------------
// (1) getMemberDataByRegId — بيانات العضو برقم القيد + الرقم القومي
// ---------------------------------------------------------------------
async function findMemberFromApi(membershipNumber: string, nationalId: string): Promise<SyndicateMember | null> {
  const data = await callSyndicate("getMemberDataByRegId", { registerNo: membershipNumber, nationalId });
  if (!isSuccess(data) || !data.member) return null;

  const m = data.member as Record<string, unknown>;

  // تأكيد إضافي من عندنا: الرقم القومي اللي راجع لازم يطابق اللي العضو كتبه
  if (String(m.nationalId || "").trim() !== nationalId) {
    console.warn(`⚠️ [API النقابة] الرقم القومي مش مطابق لرقم القيد ${membershipNumber}`);
    return null;
  }

  const photo = String(m.photoUrl || "").trim();
  return {
    membershipNumber: String(m.membershipNumber || membershipNumber).trim(),
    nationalId,
    fullName: String(m.fullNameAr || m.name || "").trim(),
    phone: normalizeMobile(m.mobile),
    address: String(m.address || "").trim(),
    lastPaidYear: toNumber(m.lastPaidYear),
    // النقابة بترجع "0" لو مفيش صورة
    photoUrl: photo.startsWith("http") ? photo : null,
  };
}

export async function findSyndicateMember(membershipNumber: string, nationalId: string): Promise<SyndicateMember | null> {
  // (1) API النقابة الحقيقي
  if (SYNDICATE_API_URL) {
    return findMemberFromApi(membershipNumber, nationalId);
  }

  // (2) الأعضاء التجريبيين
  await seedMockRegistry();
  const member = await prisma.member.findUnique({ where: { membershipNumber } });
  // لازم الرقمين يكونوا لنفس الشخص
  if (!member || member.nationalId !== nationalId) return null;
  return {
    membershipNumber: member.membershipNumber,
    nationalId: member.nationalId,
    fullName: member.fullName,
    phone: member.phone,
    address: member.address,
    lastPaidYear: member.lastPaidYear,
    photoUrl: member.photoUrl,
  };
}

// بنجيب أحدث بيانات العضو من النقابة، ونحفظ نسخة منها في جدول الأعضاء عندنا
// (عشان طلبات التجديد مربوطة بالجدول ده)
export async function syncMemberFromSyndicate(membershipNumber: string, nationalId: string) {
  const fresh = await findSyndicateMember(membershipNumber, nationalId);
  if (!fresh) return null;
  if (!SYNDICATE_API_URL) {
    return prisma.member.findUnique({ where: { membershipNumber } });
  }
  const data = {
    nationalId: fresh.nationalId,
    fullName: fresh.fullName,
    phone: fresh.phone,
    address: fresh.address,
    lastPaidYear: fresh.lastPaidYear,
  };
  return prisma.member.upsert({
    where: { membershipNumber },
    update: { ...data, ...(fresh.photoUrl ? { photoUrl: fresh.photoUrl } : {}) },
    create: { membershipNumber, ...data, ...(fresh.photoUrl ? { photoUrl: fresh.photoUrl } : {}) },
  });
}

// ---------------------------------------------------------------------
// (2) updateMemberMobile — تسجيل رقم الموبايل الجديد في سجلات النقابة
// ---------------------------------------------------------------------
// بترجع null لو نجح، أو رسالة الخطأ
export async function pushMemberPhoneToSyndicate(membershipNumber: string, phone: string): Promise<string | null> {
  if (!SYNDICATE_API_URL) return null; // الوضع التجريبي: مفيش حاجة نبعتها
  const data = await callSyndicate("updateMemberMobile", { registerNo: membershipNumber, mobileNo: phone });
  if (isSuccess(data)) return null;
  return `تعذّر تحديث رقم الهاتف في سجلات النقابة${data.statusMessage ? `: ${data.statusMessage}` : ""}`;
}

// تحديث رقم موبايل العضو في جدول الأعضاء عندنا (بعد ما الموظف يوافق على الرقم الجديد)
export async function updateSyndicateMemberPhone(tx: Prisma.TransactionClient, membershipNumber: string, phone: string) {
  // updateMany عشان لو العضو مش موجود في الجدول ميحصلش خطأ
  await tx.member.updateMany({ where: { membershipNumber }, data: { phone } });
}

// ---------------------------------------------------------------------
// (3) getMemberDues — المستحقات على العضو
// ---------------------------------------------------------------------
export interface SyndicateDues {
  lastPaidYear: number;
  noOfYears: number;
  total: number;
  canRenew: boolean;
  blockReason: string;
}

export async function getMemberDuesFromSyndicate(membershipNumber: string): Promise<SyndicateDues | null> {
  const data = await callSyndicate("getMemberDues", { registerNo: membershipNumber });
  if (!isSuccess(data)) return null;
  return {
    lastPaidYear: toNumber(data.lastPaidYear),
    noOfYears: toNumber(data.noOfYears),
    total: toNumber(data.total),
    canRenew: String(data.canRenew).toLowerCase() === "true",
    blockReason: String(data.blockReason || "").trim(),
  };
}

// ---------------------------------------------------------------------
// (4) checkPaymentStatus — هل العضو دفع؟
// ---------------------------------------------------------------------
export interface SyndicatePayment {
  paid: boolean;
  message: string;
  receiptNumber: string;
  lastPaidYear: number;
  paidYears: number;
  channel: string;
  amount: number;
  paidAt: Date | null;
}

export async function checkPaymentStatusFromSyndicate(membershipNumber: string, paymentRef: string): Promise<SyndicatePayment> {
  const data = await callSyndicate("checkPaymentStatus", { registerNo: membershipNumber, paymentRef });
  const paidAt = data.paidAt ? new Date(String(data.paidAt).replace(" ", "T")) : null;
  return {
    paid: isSuccess(data),
    message: String(data.statusMessage || ""),
    receiptNumber: String(data.receiptNumber || ""),
    lastPaidYear: toNumber(data.lastPaidYear),
    paidYears: toNumber(data.paidYears),
    channel: String(data.channel || ""),
    amount: toNumber(data.amount),
    paidAt: paidAt && !isNaN(paidAt.getTime()) ? paidAt : null,
  };
}
