"use client";

import { useEffect, useState } from "react";
import { Check, X, Pencil, Trash2, ExternalLink, Megaphone, Clock, CircleDollarSign } from "lucide-react";

interface AdItem {
  id: string;
  placement: "WEBSITE" | "HQ" | "BOTH";
  duration: string;
  price: number;
  title: string;
  description: string;
  contactInfo: string;
  fileUrl: string | null;
  status: string;
  createdAt: string;
}

const PLACEMENT_LABELS: Record<string, string> = {
  WEBSITE: "على الموقع",
  HQ: "مقر النقابة",
  BOTH: "الموقع + النقابة",
};

const DURATION_LABELS: Record<string, string> = {
  week: "أسبوع",
  month: "شهر",
  "3months": "3 شهور",
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "مسودة", color: "bg-gray-100 text-gray-600" },
  UNDER_REVIEW: { label: "تحت المراجعة", color: "bg-yellow-100 text-yellow-700" },
  NEEDS_EDIT: { label: "مطلوب تعديل", color: "bg-orange-100 text-orange-700" },
  APPROVED_AWAITING_PAYMENT: { label: "مقبول - بانتظار الدفع", color: "bg-blue-100 text-blue-700" },
  PAID: { label: "مدفوع", color: "bg-teal-100 text-teal-700" },
  SCHEDULED: { label: "مجدول للنشر", color: "bg-indigo-100 text-indigo-700" },
  PUBLISHED: { label: "منشور", color: "bg-green-100 text-green-700" },
  COMPLETED: { label: "مكتمل", color: "bg-gray-200 text-gray-700" },
  REJECTED: { label: "مرفوض", color: "bg-red-100 text-red-700" },
};

export default function AdminAdsPage() {
  const [ads, setAds] = useState<AdItem[]>([]);

  async function loadAds() {
    const res = await fetch("/api/ads");
    const data = await res.json();
    setAds(data);
  }

  useEffect(() => {
    loadAds();
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/ads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadAds();
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("متأكد إنك عايز تحذف الإعلان ده نهائيًا؟");
    if (!confirmed) return;
    await fetch(`/api/ads/${id}`, { method: "DELETE" });
    loadAds();
  }

  const pendingCount = ads.filter((a) => a.status === "UNDER_REVIEW").length;
  const publishedCount = ads.filter((a) => a.status === "PUBLISHED" || a.status === "SCHEDULED").length;
  const totalRevenue = ads.filter((a) => a.status !== "REJECTED" && a.status !== "DRAFT").reduce((sum, a) => sum + a.price, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-xs text-gray-400">إجمالي الإعلانات</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{ads.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-yellow-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">بانتظار المراجعة</p>
            <p className="font-bold text-gray-900">{pendingCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <CircleDollarSign className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-gray-400">إجمالي القيمة</p>
            <p className="font-bold text-gray-900">{totalRevenue} جنيه</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-bold text-gray-900 mb-4">جميع الإعلانات</h2>

        {ads.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Megaphone className="w-8 h-8 mx-auto mb-2 opacity-40" />
            لا توجد إعلانات حاليًا
          </div>
        ) : (
          <div className="space-y-3">
            {ads.map((ad) => (
              <div key={ad.id} className="rounded-xl border border-gray-100 bg-surface-muted p-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-[240px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_LABELS[ad.status]?.color}`}>
                        {STATUS_LABELS[ad.status]?.label}
                      </span>
                      <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-500">
                        {PLACEMENT_LABELS[ad.placement]}
                      </span>
                      <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-500">
                        {DURATION_LABELS[ad.duration]}
                      </span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                        {ad.price} جنيه
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 mt-2">{ad.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{ad.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span dir="ltr">{ad.contactInfo}</span>
                      {ad.fileUrl && (
                        <a href={ad.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary">
                          <ExternalLink className="w-3 h-3" />
                          معاينة الملف
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {ad.status === "UNDER_REVIEW" && (
                      <>
                        <button
                          onClick={() => updateStatus(ad.id, "APPROVED_AWAITING_PAYMENT")}
                          className="flex items-center gap-1 text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          قبول
                        </button>
                        <button
                          onClick={() => updateStatus(ad.id, "NEEDS_EDIT")}
                          className="flex items-center gap-1 text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          طلب تعديل
                        </button>
                        <button
                          onClick={() => updateStatus(ad.id, "REJECTED")}
                          className="flex items-center gap-1 text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          رفض
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(ad.id)}
                      className="flex items-center gap-1 text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}