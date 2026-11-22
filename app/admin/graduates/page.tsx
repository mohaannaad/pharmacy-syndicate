"use client";

import { useState } from "react";
import Link from "next/link";
import { useAutoRefresh } from "../../lib/useAutoRefresh";
import { GraduationCap, Search, Clock, AlertCircle, BadgeCheck, ArrowLeft } from "lucide-react";
import { GRADUATE_STATUS_LABELS, trackingNumber } from "../../lib/graduate";
import { ApplicationCard, type GraduateApplication } from "./ApplicationCard";

export default function AdminGraduatesPage() {
  const [applications, setApplications] = useState<GraduateApplication[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  async function loadApplications() {
    const res = await fetch("/api/graduates");
    const data = await res.json();
    // الطلبات المكتملة («تم القيد») بتتنقل لصفحة «الطلبات المكتملة»
    setApplications(data.filter((a: GraduateApplication) => a.status !== "REGISTERED"));
  }

    useAutoRefresh(loadApplications);

  const pendingCount = applications.filter((a) => a.status === "UNDER_REVIEW").length;
  const needsCompletionCount = applications.filter((a) => a.status === "NEEDS_COMPLETION").length;

  // البحث بالاسم أو الرقم القومي أو رقم المتابعة
  const query = search.trim();
  const filtered = applications.filter((a) => {
    if (statusFilter !== "ALL" && a.status !== statusFilter) return false;
    if (!query) return true;
    return a.fullNameAr.includes(query) || a.nationalId.includes(query) || trackingNumber(a.serial, a.createdAt).includes(query.toUpperCase());
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-line shadow-card p-5">
          <p className="text-xs text-gray-400">إجمالي الطلبات</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{applications.length}</p>
        </div>
        <div className="bg-white rounded-3xl border border-line shadow-card p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">قيد المراجعة</p>
            <p className="font-bold text-gray-900">{pendingCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-line shadow-card p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">مطلوب استكمال</p>
            <p className="font-bold text-gray-900">{needsCompletionCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-line shadow-card p-6">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-bold text-gray-900">طلبات قيد الخريجين</h2>
            <Link href="/admin/graduates/completed" className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 px-3 py-1.5 rounded-lg">
              <BadgeCheck className="w-3.5 h-3.5" />
              الطلبات المكتملة
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="الاسم أو الرقم القومي أو رقم المتابعة" className="text-sm border border-gray-200 rounded-lg pr-9 pl-3 py-2 outline-none w-64" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-2 py-2 bg-white outline-none">
              <option value="ALL">كل الحالات</option>
              {Object.entries(GRADUATE_STATUS_LABELS)
                .filter(([value]) => value !== "REGISTERED")
                .map(([value, { label }]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-40" />
            لا توجد طلبات
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((app) => (
              <ApplicationCard key={`${app.id}-${app.status}-${app.fee}`} app={app} onChanged={loadApplications} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}