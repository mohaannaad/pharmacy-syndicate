import { cookies } from "next/headers";
import { randomBytes, scryptSync, timingSafeEqual, createHash } from "crypto";
import { prisma } from "./prisma";

// =====================================================================
// كل حاجة خاصة بالحسابات وتسجيل الدخول في مكان واحد
// =====================================================================

const SESSION_COOKIE = "session";
const SESSION_DAYS = 30;

// ---------------- قواعد البيانات المدخلة ----------------
export const isValidPhone = (phone: string) => /^01\d{9}$/.test(phone);
export const isValidNationalId = (id: string) => /^\d{14}$/.test(id);
export const isValidPassword = (pw: string) => pw.length >= 8;

export const ROLE_LABELS: Record<string, string> = {
  GRADUATE: "خريج",
  MEMBER: "عضو",
  ADMIN: "مدير النظام",
};

// ---------------- كلمات السر ----------------
// كلمة السر عمرها ما بتتحفظ زي ما هي.
// بنحفظ "بصمة" منها (hash) + رقم عشوائي (salt)، ومستحيل نرجّع منهم كلمة السر الأصلية.
export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const test = scryptSync(password, salt, 64);
  const original = Buffer.from(hash, "hex");
  return original.length === test.length && timingSafeEqual(test, original);
}

export function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

// ---------------- الجلسات ----------------
// لما المستخدم يدخل: بنعمل مفتاح عشوائي، نحطه في كوكي عند المستخدم،
// ونحفظ بصمته في قاعدة البيانات. مع كل طلب بنقارن الاتنين.
export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await prisma.session.create({ data: { id: sha256(token), userId, expiresAt } });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true, // الجافاسكريبت في المتصفح مش هيقدر يقرا الكوكي
    secure: process.env.NODE_ENV === "production", // على HTTPS بس في الموقع الحقيقي
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

// بترجع المستخدم الداخل حاليًا، أو null لو مفيش حد داخل
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { id: sha256(token) },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) return null;
  return session.user;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { id: sha256(token) } });
  }
  cookieStore.delete(SESSION_COOKIE);
}