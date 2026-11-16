import { prisma } from "./prisma";
import { renewalNumber, RENEWAL_STATUS_LABELS } from "./renewal";

// =====================================================================
// «طلباتي» للعضو المقيد: كل طلباته للخدمات في قائمة واحدة زي الإشعارات
// (تجديد الاشتراك، الشهادات، الإعلانات، الشكاوى)
// =====================================================================

export type RequestKind = "renewal" | "certificate" | "ad" | "complaint";

export interface MyRequestItem {
  id: string;
  kind: RequestKind;
  kindLabel: string;
  title: string;
  ref: string;
  status: string;
  statusLabel: string;
  tone: "pending" | "progress" | "success" | "danger";
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

const KIND_LABELS: Record<RequestKind, string> = {
  renewal: "تجديد الاشتراك والكارنيه",
  certificate: "استخراج شهادة",
  ad: "إضافة إعلان",
  complaint: "شكوى",
};

const CERTIFICATE_TYPES: Record<string, string> = {
  GOOD_CONDUCT_AR: "شهادة حسن سير وسلوك (عربي)",
  GOOD_CONDUCT_EN: "شهادة حسن سير وسلوك (إنجليزي)",
  MBA_ISLESCA: "MBA من جامعة إسلسكا",
  DBA_ISLESCA: "DBA من جامعة إسلسكا",
  MBA_NAVAL_ACADEMY: "MBA من الأكاديمية البحرية",
  DBA_NAVAL_ACADEMY: "DBA من الأكاديمية البحرية",
  DIPLOMA_NAVAL_ACADEMY: "دبلوم من الأكاديمية البحرية",
  MBA_ARAB_ACADEMY: "MBA من الأكاديمية العربية الإدارية والمصرفية",
  DBA_ARAB_ACADEMY: "DBA من الأكاديمية العربية الإدارية والمصرفية",
};

const CERTIFICATE_STATUS: Record<string, string> = {
  DRAFT: "مسودة",
  AWAITING_PAYMENT: "في انتظار الدفع",
  PAID: "تم الدفع",
  UNDER_REVIEW: "قيد المراجعة",
  ISSUED: "صدرت وجاهزة",
  COMPLETED: "مكتمل",
  REJECTED: "مرفوض",
};

const AD_STATUS: Record<string, string> = {
  DRAFT: "مسودة",
  UNDER_REVIEW: "قيد المراجعة",
  NEEDS_EDIT: "مطلوب تعديل",
  APPROVED_AWAITING_PAYMENT: "مقبول — في انتظار الدفع",
  PAID: "تم الدفع",
  SCHEDULED: "مجدول للنشر",
  PUBLISHED: "منشور",
  COMPLETED: "مكتمل",
  REJECTED: "مرفوض",
};

const COMPLAINT_STATUS: Record<string, string> = {
  RECEIVED: "تم الاستلام",
  UNDER_REVIEW: "قيد المراجعة",
  NEEDS_INFO: "مطلوب معلومات إضافية",
  TRANSFERRED: "محالة لإدارة أخرى",
  RESPONDED: "تم الرد",
  CLOSED: "مغلقة",
  REJECTED: "مرفوضة",
};

// لون الإشعار حسب الحالة
function toneOf(status: string): MyRequestItem["tone"] {
  if (["REJECTED"].includes(status)) return "danger";
  if (["NEEDS_EDIT", "NEEDS_INFO", "AWAITING_PAYMENT", "APPROVED_AWAITING_PAYMENT"].includes(status)) return "pending";
  if (["ISSUED", "COMPLETED", "DELIVERED", "PUBLISHED", "RESPONDED", "CLOSED", "PAID", "SCHEDULED"].includes(status)) return "success";
  return "progress";
}

export async function getMyRequests(user: { id: string; membershipNumber: string | null }): Promise<MyRequestItem[]> {
  const member = user.membershipNumber
    ? await prisma.member.findUnique({ where: { membershipNumber: user.membershipNumber } })
    : null;

  const [renewals, certificates, ads, complaints] = await Promise.all([
    member ? prisma.renewalRequest.findMany({ where: { memberId: member.id } }) : Promise.resolve([]),
    prisma.certificateRequest.findMany({
      where: user.membershipNumber
        ? { OR: [{ userId: user.id }, { membershipNumber: user.membershipNumber }] }
        : { userId: user.id },
    }),
    prisma.ad.findMany({ where: { userId: user.id } }),
    prisma.complaint.findMany({ where: { userId: user.id } }),
  ]);

  const items: MyRequestItem[] = [
    ...renewals.map((r) => ({
      id: r.id,
      kind: "renewal" as const,
      kindLabel: KIND_LABELS.renewal,
      title: `تجديد عن ${r.years.length} ${r.years.length === 1 ? "سنة" : "سنوات"} — ${r.total.toLocaleString("ar-EG")} جنيه`,
      ref: renewalNumber(r.serial, r.createdAt),
      status: r.status,
      statusLabel: RENEWAL_STATUS_LABELS[r.status]?.label ?? r.status,
      tone: toneOf(r.status),
      note: r.adminNote,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    })),
    ...certificates.map((c) => ({
      id: c.id,
      kind: "certificate" as const,
      kindLabel: KIND_LABELS.certificate,
      title: CERTIFICATE_TYPES[c.type] ?? c.type,
      ref: `CRT-${c.id.slice(-6).toUpperCase()}`,
      status: c.status,
      statusLabel: CERTIFICATE_STATUS[c.status] ?? c.status,
      tone: toneOf(c.status),
      note: null,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    })),
    ...ads.map((a) => ({
      id: a.id,
      kind: "ad" as const,
      kindLabel: KIND_LABELS.ad,
      title: a.title,
      ref: `AD-${a.id.slice(-6).toUpperCase()}`,
      status: a.status,
      statusLabel: AD_STATUS[a.status] ?? a.status,
      tone: toneOf(a.status),
      note: null,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    })),
    ...complaints.map((c) => ({
      id: c.id,
      kind: "complaint" as const,
      kindLabel: KIND_LABELS.complaint,
      title: c.title,
      ref: c.ticketNumber,
      status: c.status,
      statusLabel: COMPLAINT_STATUS[c.status] ?? c.status,
      tone: toneOf(c.status),
      note: c.adminResponse,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    })),
  ];

  // الأحدث تحديثًا الأول
  return items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
