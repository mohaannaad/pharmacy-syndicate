// =====================================================================
// الإشعارات الجديدة في «طلباتي»
// ---------------------------------------------------------------------
// بنحفظ في المتصفح آخر مرة العضو فتح «طلباتي»،
// وأي طلب الموظف غيّر حالته بعد الوقت ده بيتعتبر إشعار جديد.
// =====================================================================

const KEY = "myRequestsSeenAt";

export function getSeenAt(): string {
  try {
    return localStorage.getItem(KEY) || "1970-01-01T00:00:00.000Z";
  } catch {
    return "1970-01-01T00:00:00.000Z";
  }
}

export function markSeen() {
  try {
    localStorage.setItem(KEY, new Date().toISOString());
  } catch {}
}

// الطلب "اتحدّث" لو الموظف غيّره بعد ما اتعمل (مش مجرد إنشاء الطلب)
export function isUpdated(item: { createdAt: string; updatedAt: string }) {
  return new Date(item.updatedAt).getTime() - new Date(item.createdAt).getTime() > 2000;
}

export function isUnread(item: { createdAt: string; updatedAt: string }, seenAt: string) {
  return isUpdated(item) && item.updatedAt > seenAt;
}
