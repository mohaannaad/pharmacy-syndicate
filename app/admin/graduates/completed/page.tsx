"use client";

import { useState } from "react";
import Link from "next/link";
import { useAutoRefresh } from "../../../lib/useAutoRefresh";
import { BadgeCheck, Search, ArrowRight } from "lucide-react";
import { trackingNumber } from "../../../lib/graduate";
import { ApplicationCard, type GraduateApplication } from "../ApplicationCard";

// =====================================================================
// الطلبات المكتملة: طلبات القيد اللي وصلت «تم القيد» (صدر لها رقم قيد)
// للعرض بس — مفيش أي إجراء عليها غير الحذف
// =====================================================================
export default function CompletedGraduatesPage() {
  const [applications, setApplications] = useState<GraduateApplication[]>([]);
  const [search, setSearch] = useState("");

  async function loadApplications() {
    const res = await fetch("/api/graduates");
    const data = await res.json();
    setApplications(data.filter((a: GraduateApplication) => a.status === "REGISTERED"));
  }

  useAutoRefresh(loadApplications);

  // البحث بالاسم أو الرقم القومي أو رقم المتابعة أو رقم القيد أو الجامعة
  const query = search.trim();
  const filtered = applications.filter((a) => {
    if (!query) return true;
    return (
      a.fullNameAr.includes(query) ||
      a.nationalId.includes(query) ||
      a.universityName.includes(query) ||
      (a.user?.membershipNumber || "").includes(query) ||
      trackingNumber(a.serial, a.createdAt).includes(query.toUpperCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-line shadow-card p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
            <BadgeCheck className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">إجمالي الطلبات المكتملة</p>
            <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-line shadow-card p-6">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-bold text-gray-900">الطلبات المكتملة</h2>
            <Link href="/admin/graduates" className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-mint hover:bg-[#d9ece0] px-3 py-1.5 rounded-lg">
              <ArrowRight className="w-3.5 h-3.5" />
              طلبات القيد الجارية
            </Link>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="الاسم أو الرقم القومي أو رقم القيد أو رقم المتابعة" className="text-sm border border-gray-200 rounded-lg pr-9 pl-3 py-2 outline-none w-80 max-w-full" />
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-4">طلبات القيد التي صدر لها رقم قيد وتحوّل أصحابها إلى أعضاء. للعرض فقط، ولا يمكن تغيير حالتها.</p>

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <BadgeCheck className="w-8 h-8 mx-auto mb-2 opacity-40" />
            {query ? "لا توجد نتائج مطابقة للبحث" : "لا توجد طلبات مكتملة بعد"}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((app) => (
              <ApplicationCard key={app.id} app={app} onChanged={loadApplications} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
