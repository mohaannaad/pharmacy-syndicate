"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Newspaper, Megaphone, AlertTriangle, CircleDollarSign, CalendarDays, FileText, ChevronLeft } from "lucide-react";

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
}

export default function AdminHomePage() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    async function loadSummary() {
      const [news, ads, complaints, fees, activities, certificates] = await Promise.all([
        fetch("/api/news").then((r) => r.json()),
        fetch("/api/ads").then((r) => r.json()),
        fetch("/api/complaints").then((r) => r.json()),
        fetch("/api/fees").then((r) => r.json()),
        fetch("/api/activities").then((r) => r.json()),
        fetch("/api/certificates").then((r) => r.json()),
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
      });
    }
    loadSummary();
  }, []);

  const rows = [
    { label: "الإعلانات", desc: "طلبات الإعلانات المقدمة من الأعضاء", href: "/admin/ads", icon: Megaphone, count: summary?.ads, pending: summary?.adsPending },
    { label: "الشكاوى", desc: "شكاوى ومقترحات الأعضاء وغير الأعضاء", href: "/admin/complaints", icon: AlertTriangle, count: summary?.complaints, pending: summary?.complaintsPending },
    { label: "الشهادات", desc: "طلبات استخراج الشهادات بأنواعها", href: "/admin/certificates", icon: FileText, count: summary?.certificates, pending: summary?.certificatesPending },
    { label: "الرحلات والفعاليات", desc: "الأنشطة المتاحة على الموقع", href: "/admin/activities", icon: CalendarDays, count: summary?.activities, pending: undefined },
    { label: "الأخبار", desc: "المقالات وفيديوهات اليوتيوب", href: "/admin/news", icon: Newspaper, count: summary?.news, pending: undefined },
    { label: "الرسوم", desc: "جدول رسوم خدمات النقابة", href: "/admin/fees", icon: CircleDollarSign, count: summary?.fees, pending: undefined },
  ];

  const totalPending = rows.reduce((sum, r) => sum + (r.pending ?? 0), 0);
  const today = new Date().toLocaleDateString("ar-EG", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-gray-400">{today}</p>
        <h1 className="text-xl font-bold text-gray-900 mt-1">أهلاً بيك في لوحة التحكم</h1>
      </div>

      <div className="rounded-2xl overflow-hidden bg-primary relative">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 85% 20%, white 0%, transparent 45%)" }} />
        <div className="relative px-7 py-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-white/70 text-sm">طلبات بانتظار إجراء منك</p>
            <p className="text-5xl font-bold text-[#D1AA43] mt-2 leading-none">
              {summary === null ? "—" : totalPending}
            </p>
          </div>
          <p className="text-white/60 text-sm max-w-[220px] leading-relaxed">
            موزعة بين الإعلانات والشكاوى وطلبات الشهادات المعلقة
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <Link
              key={row.href}
              href={row.href}
              className="flex items-center justify-between px-6 py-4 hover:bg-surface-muted transition-colors group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900">{row.label}</p>
                  <p className="text-xs text-gray-400 truncate">{row.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                {row.pending !== undefined && row.pending > 0 && (
                  <span className="text-xs bg-[#D1AA43]/15 text-[#a5822f] px-2.5 py-1 rounded-full font-medium">
                    {row.pending} معلّق
                  </span>
                )}
                <span className="text-lg font-bold text-gray-900 w-8 text-left">
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