import { randomInt } from "crypto";
import { prisma } from "./prisma";
import { sha256 } from "./auth";

// =====================================================================
// رموز التحقق (OTP)
// ---------------------------------------------------------------------
// ⚠️ وضع تجريبي: لحد ما نتعاقد مع شركة رسائل (SMS)، الرسالة مش بتتبعت فعلًا.
// الرمز بيظهر في التيرمينال، وبيرجع للصفحة عشان يتعرض في مربع أصفر.
// لما نضيف مفتاح شركة الرسائل SMS_API_KEY، الوضع التجريبي بيقفل لوحده.
// =====================================================================

export const OTP_DEMO_MODE = !process.env.SMS_API_KEY;

const OTP_MINUTES = 5; // صلاحية الرمز
const RESEND_SECONDS = 60; // أقل وقت بين رمزين لنفس التليفون
const MAX_ATTEMPTS = 5; // أقصى عدد محاولات غلط

async function sendSms(phone: string, message: string) {
  if (OTP_DEMO_MODE) {
    console.log(`📱 [رسالة تجريبية] إلى ${phone}: ${message}`);
    return;
  }
  // هنا هنضيف كود شركة الرسائل لما نتعاقد معاها
}

// بيعمل رمز جديد ويبعته. بيرجع الرمز نفسه في الوضع التجريبي بس.
export async function createOtp(phone: string, purpose: string) {
  const last = await prisma.otpCode.findFirst({
    where: { phone, purpose },
    orderBy: { createdAt: "desc" },
  });
  if (last && Date.now() - last.createdAt.getTime() < RESEND_SECONDS * 1000) {
    throw new Error("استنى دقيقة قبل ما تطلب رمز جديد");
  }

  const code = String(randomInt(100000, 1000000)); // 6 أرقام
  await prisma.otpCode.create({
    data: {
      phone,
      purpose,
      codeHash: sha256(code),
      expiresAt: new Date(Date.now() + OTP_MINUTES * 60 * 1000),
    },
  });

  await sendSms(phone, `رمز التحقق الخاص بك في نقابة الصيادلة: ${code}`);
  return OTP_DEMO_MODE ? code : null;
}

// بيتأكد من الرمز. بيرجع رسالة خطأ، أو null لو الرمز صح.
export async function verifyOtp(phone: string, purpose: string, code: string) {
  const otp = await prisma.otpCode.findFirst({
    where: { phone, purpose, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (!otp || otp.expiresAt < new Date()) return "الرمز انتهت صلاحيته، اطلب رمز جديد";
  if (otp.attempts >= MAX_ATTEMPTS) return "محاولات كتير غلط، اطلب رمز جديد";

  if (otp.codeHash !== sha256(code.trim())) {
    await prisma.otpCode.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
    return "رمز التحقق غير صحيح";
  }

  await prisma.otpCode.update({ where: { id: otp.id }, data: { consumedAt: new Date() } });
  return null;
}