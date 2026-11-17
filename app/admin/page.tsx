"use client";

import { useState } from "react";
import { useAutoRefresh } from "../lib/useAutoRefresh";
import Link from "next/link";
import { Newspaper, Megaphone, AlertTriangle, CircleDollarSign, CalendarDays, FileText, ChevronLeft, GraduationCap, IdCard, UserCheck } from "lucide-react";

interface Summary {
  news: number;
  ads: number;
  adsPending: number;
  complaints: number;
  complaintsPending: number;
  fees: number;
  activities: number;
  certificates: number;
  certificatesPending: number;
  graduatesPending: number;
  renewalsPending: number;
  accountsPending: number;
}

export default function AdminHomePage() {
  const [summary, setSummary] = useState<Summary | null>(null);

  // الأرقام بتتحدث لوحدها كل 10 ثواني (من غير ريفريش)
  useAutoRefresh(async () => {
    {
      const [news, ads, complaints, fees, activities, certificates, graduates, renewals, accounts] = await Promise.all([
        fetch("/api/news?category=MAIN").then((r) => r.json()),
        fetch("/api/ads").then((r) => r.json()),
        fetch("/api/complaints").then((r) => r.json()),
        fetch("/api/fees").then((r) => r.json()),
        fetch("/api/activities").then((r) => r.json()),
        fetch("/api/certificates").then((r) => r.json()),
        fetch("/api/graduates").then((r) => r.json()),
        fetch("/api/renewals").then((r) => r.json()),
        fetch("/api/member-accounts").then((r) => r.json()),
      ]);

      setSummary({
        news: news.length,
        ads: ads.length,
        adsPending: ads.filter((a: any) => a.status === "UNDER_REVIEW").length,
        complaints: complaints.length,
        complaintsPending: complaints.filter((c: any) => c.status === "RECEIVED" || c.status === "UNDER_REVIEW").length,
        fees: fees.length,
        activities: activities.length,
        certificates: certificates.length,
        certificatesPending: certificates.filter((c: any) => c.status === "AWAITING_PAYMENT" || c.status === "UNDER_REVIEW").length,
        graduatesPending: graduates.filter((g: any) => g.status === "UNDER_REVIEW" || g.status === "LICENSING").length,
        renewalsPending: renewals.filter((r: any) => ["AWAITING_PAYMENT", "RECEIVED", "UNDER_REVIEW"].includes(r.status)).length,
        accountsPending: accounts.filter((a: any) => a.status === "PENDING").length,
      });
    }
  }, 10000);

  const rows = [
    { label: "الإعلانات", desc: "طلبات الإعلانات المقدمة من الأعضاء", href: "/admin/ads", icon: Megaphone, count: summary?.ads, pending: summary?.adsPending },
    { label: "الشكاوى", desc: "شكاوى ومقترحات الأعضاء وغير الأعضاء", href: "/admin/complaints", icon: AlertTriangle, count: summary?.complaints, pending: summary?.complaintsPending },
    { label: "الشهادات", desc: "طلبات استخراج الشهادات بأنواعها", href: "/admin/certificates", icon: FileText, count: summary?.certificates, pending: summary?.certificatesPending },
    { label: "الرحلات والفعاليات", desc: "الأنشطة المتاحة على الموقع", href: "/admin/activities", icon: CalendarDays, count: summary?.activities, pending: undefined },
    { label: "الأخبار", desc: "المقالات وفيديوهات اليوتيوب", href: "/admin/news", icon: Newspaper, count: summary?.news, pending: undefined },
    { label: "الرسوم", desc: "جدول رسوم خدمات النقابة", href: "/admin/fees", icon: CircleDollarSign, count: summary?.fees, pending: undefined },
  ];

  const kpis = [
    { label: "طلبات القيد", note: "بانتظار المراجعة", href: "/admin/graduates", icon: GraduationCap, value: summary?.graduatesPending },
    { label: "تجديد الاشتراك", note: "طلبات مفتوحة", href: "/admin/renewals", icon: IdCard, value: summary?.renewalsPending },
    { label: "حسابات الأعضاء", note: "تغيير رقم الهاتف", href: "/admin/member-accounts", icon: UserCheck, value: summary?.accountsPending },
    { label: "الشكاوى", note: "جديدة أو قيد المراجعة", href: "/admin/complaints", icon: AlertTriangle, value: summary?.complaintsPending },
  ];

  const totalPending = rows.reduce((sum, r) => sum + (r.pending ?? 0), 0) + kpis.slice(0, 3).reduce((sum, k) => sum + (k.value ?? 0), 0);
  const today = new Date().toLocaleDateString("ar-EG", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm text-ink-muted">{today}</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-ink mt-1">مرحبًا بك في لوحة التحكم</h1>
        </div>
        <div className="flex items-center gap-3 bg-white border border-line rounded-2xl px-5 py-3">
          <span className="text-sm text-ink-muted">طلبات بانتظار إجراء منك</span>
          <span className="text-2xl font-extrabold text-[#9A7A12]">{summary === null ? "—" : totalPending}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          const highlight = i === 0;
          return (
            <Link key={kpi.href} href={kpi.href} className={`group rounded-[22px] p-5 flex flex-col gap-3 transition-all hover:-translate-y-0.5 hover:shadow-lift ${highlight ? "bg-primary text-white" : "bg-white border border-line text-ink"}`}>
              <span className="flex items-center justify-between">
                <span className={`text-sm font-semibold ${highlight ? "text-[#CFE3D8]" : "text-ink-muted"}`}>{kpi.label}</span>
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${highlight ? "bg-white/15" : "bg-mint text-primary"}`}><Icon className="w-[18px] h-[18px]" /></span>
              </span>
              <span className="text-4xl font-extrabold leading-none">{kpi.value === undefined ? "—" : kpi.value}</span>
              <span className={`text-xs font-semibold ${highlight ? "text-[#F2D97E]" : "text-ink-muted"}`}>{kpi.note}</span>
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl border border-line divide-y divide-line overflow-hidden">
        <div className="px-6 py-4">
          <h2 className="font-extrabold text-ink">باقي الأقسام</h2>
        </div>
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <Link
              key={row.href}
              href={row.href}
              className="flex items-center justify-between px-6 py-4 hover:bg-[#F6FAF8] transition-colors group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-mint flex items-center justify-center shrink-0">
                  <Icon className="w-[18px] h-[18px] text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-ink">{row.label}</p>
                  <p className="text-xs text-ink-muted truncate">{row.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                {row.pending !== undefined && row.pending > 0 && (
                  <span className="text-xs bg-gold-soft text-[#8A6C0E] px-2.5 py-1 rounded-full font-bold">
                    {row.pending} معلّق
                  </span>
                )}
                <span className="text-lg font-extrabold text-ink w-8 text-left">
                  {row.count === undefined ? "—" : row.count}
                </span>
                <ChevronLeft className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:-translate-x-0.5 transition-all" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
