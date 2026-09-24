"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Send, Trash2, ExternalLink, Clock, CheckCircle2 } from "lucide-react";

interface ComplaintItem {
  id: string;
  ticketNumber: string;
  category: string;
  title: string;
  details: string;
  attachments: string[];
  submitterName: string;
  submitterContact: string;
  status: string;
  adminResponse: string | null;
  escalated: boolean;
  createdAt: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  MEMBERSHIP: "القيد والعضوية",
  CERTIFICATES_CARDS: "الشهادات والكارنيهات",
  SUBSCRIPTIONS: "الاشتراكات",
  INSTALLMENTS_PROJECTS: "الأقساط والمشروعات",
  TRIPS_COURSES_EVENTS: "الرحلات والكورسات والفعاليات",
  ADS: "الإعلانات",
  TECHNICAL_ISSUE: "مشكلة فنية",
  ADMINISTRATIVE: "شكوى إدارية",
  OTHER: "أخرى",
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  RECEIVED: { label: "تم الاستلام", color: "bg-gray-100 text-gray-600" },
  UNDER_REVIEW: { label: "قيد المراجعة", color: "bg-yellow-100 text-yellow-700" },
  NEEDS_INFO: { label: "مطلوب معلومات إضافية", color: "bg-orange-100 text-orange-700" },
  TRANSFERRED: { label: "محالة لإدارة أخرى", color: "bg-blue-100 text-blue-700" },
  RESPONDED: { label: "تم الرد", color: "bg-teal-100 text-teal-700" },
  CLOSED: { label: "مغلقة", color: "bg-green-100 text-green-700" },
  REJECTED: { label: "مرفوضة", color: "bg-red-100 text-red-700" },
};

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [responseDrafts, setResponseDrafts] = useState<Record<string, string>>({});

  async function loadComplaints() {
    const res = await fetch("/api/complaints");
    const data = await res.json();
    setComplaints(data);
  }

  useEffect(() => {
    loadComplaints();
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/complaints/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadComplaints();
  }

  async function sendResponse(id: string) {
    const response = responseDrafts[id];
    if (!response) return;

    await fetch(`/api/complaints/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "RESPONDED", adminResponse: response }),
    });
    setResponseDrafts((prev) => ({ ...prev, [id]: "" }));
    loadComplaints();
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("متأكد إنك عايز تحذف الشكوى دي نهائيًا؟");
    if (!confirmed) return;
    await fetch(`/api/complaints/${id}`, { method: "DELETE" });
    loadComplaints();
  }

  const pendingCount = complaints.filter((c) => c.status === "RECEIVED" || c.status === "UNDER_REVIEW").length;
  const escalatedCount = complaints.filter((c) => c.escalated).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-xs text-gray-400">إجمالي الشكاوى</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{complaints.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-yellow-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">بانتظار الرد</p>
            <p className="font-bold text-gray-900">{pendingCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400">شكاوى مُصعّدة</p>
            <p className="font-bold text-gray-900">{escalatedCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-bold text-gray-900 mb-4">جميع الشكاوى</h2>

        {complaints.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-40" />
            لا توجد شكاوى حاليًا
          </div>
        ) : (
          <div className="space-y-3">
            {complaints.map((c) => (
              <div key={c.id} className="rounded-xl border border-gray-100 bg-surface-muted p-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-[260px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_LABELS[c.status]?.color}`}>
                        {STATUS_LABELS[c.status]?.label}
                      </span>
                      {c.escalated && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          مُصعّدة
                        </span>
                      )}
                      <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-500">
                        {CATEGORY_LABELS[c.category]}
                      </span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-mono">
                        {c.ticketNumber}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 mt-2">{c.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{c.details}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
                      <span>{c.submitterName}</span>
                      <span dir="ltr">{c.submitterContact}</span>
                      {c.attachments.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary">
                          <ExternalLink className="w-3 h-3" />
                          مرفق {i + 1}
                        </a>
                      ))}
                    </div>

                    {c.adminResponse && (
                      <div className="mt-3 bg-white rounded-lg p-3 text-sm text-gray-600 border border-gray-100">
                        <span className="text-xs font-medium text-primary flex items-center gap-1 mb-1">
                          <CheckCircle2 className="w-3 h-3" />
                          رد النقابة
                        </span>
                        {c.adminResponse}
                      </div>
                    )}

                    {c.status !== "CLOSED" && c.status !== "REJECTED" && (
                      <div className="mt-3 flex items-center gap-2">
                        <input
                          value={responseDrafts[c.id] || ""}
                          onChange={(e) => setResponseDrafts((prev) => ({ ...prev, [c.id]: e.target.value }))}
                          placeholder="اكتب الرد هنا..."
                          className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
                        />
                        <button
                          onClick={() => sendResponse(c.id)}
                          className="flex items-center gap-1 bg-primary text-white px-3 py-2 rounded-lg text-xs font-medium shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                          إرسال الرد
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={c.status}
                      onChange={(e) => updateStatus(c.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white outline-none"
                    >
                      {Object.entries(STATUS_LABELS).map(([value, { label }]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleDelete(c.id)}
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