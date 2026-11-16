"use client";

import { useEffect, useState } from "react";
import { Loader2, Bell, CreditCard, FileText, Megaphone, MessageSquareWarning, Inbox } from "lucide-react";
import PageHeader from "../components/PageHeader";
import type { MyRequestItem, RequestKind } from "../lib/myRequests";
import { getSeenAt, markSeen, isUpdated, isUnread } from "../lib/requestsSeen";

const KIND_ICONS: Record<RequestKind, typeof Bell> = {
  renewal: CreditCard,
  certificate: FileText,
  ad: Megaphone,
  complaint: MessageSquareWarning,
};

const TONES: Record<MyRequestItem["tone"], string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  progress: "bg-blue-50 text-blue-700 border-blue-200",
  success: "bg-mint text-primary border-[#BFDCCB]",
  danger: "bg-red-50 text-red-700 border-red-200",
};

const FILTERS: { value: "all" | RequestKind; label: string }[] = [
  { value: "all", label: "الكل" },
  { value: "renewal", label: "التجديد" },
  { value: "certificate", label: "الشهادات" },
  { value: "ad", label: "الإعلانات" },
  { value: "complaint", label: "الشكاوى" },
];

// "منذ ساعتين" ... إلخ
function timeAgo(iso: string) {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "الآن";
  if (minutes < 60) return `منذ ${minutes.toLocaleString("ar-EG")} دقيقة`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `منذ ${hours.toLocaleString("ar-EG")} ساعة`;
  const days = Math.round(hours / 24);
  if (days < 30) return `منذ ${days.toLocaleString("ar-EG")} يوم`;
  return new Date(iso).toLocaleDateString("ar-EG");
}

export default function MyRequestsPage() {
  const [items, setItems] = useState<MyRequestItem[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  // وقت آخر زيارة (قبل الزيارة دي) عشان نعلّم التحديثات الجديدة
  const [seenAt] = useState(() => getSeenAt());
  const [filter, setFilter] = useState<"all" | RequestKind>("all");

  useEffect(() => {
    fetch("/api/my-requests")
      .then(async (res) => {
        if (!res.ok) throw new Error();
        const data = await res.json();
        setItems(data.requests);
        setState("ready");
        markSeen();
      })
      .catch(() => setState("error"));
  }, []);

  const shown = items.filter((i) => filter === "all" || i.kind === filter);
  const unreadCount = items.filter((i) => isUnread(i, seenAt)).length;

  return (
    <main>
      <PageHeader title="طلباتي" subtitle="ردود النقابة وتحديثات طلباتك في مكان واحد" />
      <section className="bg-surface-muted py-12 md:py-14">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          {state === "loading" && <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />}
          {state === "error" && <p className="text-center text-ink-muted">حدث خطأ أثناء التحميل، يرجى تحديث الصفحة.</p>}

          {state === "ready" && (
            <>
              <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
                <div className="flex items-center gap-2 text-ink font-bold">
                  <Bell className="w-5 h-5 text-primary" />
                  {unreadCount > 0 ? `لديك ${unreadCount.toLocaleString("ar-EG")} تحديث جديد` : "لا توجد تحديثات جديدة"}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {FILTERS.map((f) => (
                    <button key={f.value} type="button" onClick={() => setFilter(f.value)} className={`h-9 px-4 rounded-pill text-sm font-bold border transition-colors ${filter === f.value ? "bg-primary border-primary text-white" : "bg-white border-line text-[#3E4B44] hover:border-primary"}`}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {shown.length === 0 && (
                <div className="bg-white rounded-3xl border border-line shadow-card p-10 text-center">
                  <Inbox className="w-12 h-12 text-primary mx-auto" />
                  <h2 className="mt-4 font-bold text-ink">لا توجد طلبات بعد</h2>
                  <p className="mt-2 text-sm text-ink-muted">عند تقديم أي طلب من صفحة الخدمات، ستظهر هنا ردود النقابة وتحديثات حالته.</p>
                  <a href="/services" className="mt-6 inline-block bg-primary text-white px-6 py-3 rounded-pill font-bold">
                    تصفّح الخدمات
                  </a>
                </div>
              )}

              <div className="space-y-3">
                {shown.map((item) => {
                  const Icon = KIND_ICONS[item.kind];
                  const unread = isUnread(item, seenAt);
                  return (
                    <div key={`${item.kind}-${item.id}`} className={`relative bg-white rounded-3xl border p-5 md:p-6 flex gap-4 ${unread ? "border-primary/40 shadow-lift" : "border-line shadow-card"}`}>
                      {unread && <span className="absolute top-5 left-5 w-2.5 h-2.5 rounded-full bg-red-500" aria-label="جديد" />}
                      <span className="shrink-0 w-12 h-12 rounded-2xl bg-mint text-primary flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </span>
                      <div className="flex-1 min-w-0 text-right">
                        <div className="flex items-center gap-2 flex-wrap text-xs text-ink-muted">
                          <span className="font-bold text-primary">{item.kindLabel}</span>
                          <span>·</span>
                          <span dir="ltr">{item.ref}</span>
                          <span>·</span>
                          <span>{timeAgo(item.updatedAt)}</span>
                        </div>
                        <p className="mt-1.5 font-bold text-ink leading-relaxed">
                          {isUpdated(item) ? "تم تحديث حالة طلبك إلى " : "تم استلام طلبك، وحالته الآن "}
                          <span className={`inline-block align-middle text-xs px-2.5 py-0.5 rounded-pill border ${TONES[item.tone]}`}>{item.statusLabel}</span>
                        </p>
                        <p className="mt-1 text-sm text-ink-muted">{item.title}</p>
                        {item.note && (
                          <div className="mt-3 bg-surface-muted border border-line rounded-2xl px-4 py-3 text-sm text-ink leading-relaxed">
                            <span className="font-bold">رد النقابة: </span>
                            {item.note}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
