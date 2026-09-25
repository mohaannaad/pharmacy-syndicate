"use client";

import { useEffect, useState } from "react";
import { FileText, Trash2, ExternalLink, Clock } from "lucide-react";

interface CertRequest {
  id: string;
  type: string;
  destination: string | null;
  attachments: string[];
  deliveryMethod: string;
  price: number;
  memberName: string;
  membershipNumber: string;
  contactInfo: string;
  status: string;
  createdAt: string;
}

const TYPE_LABELS: Record<string, string> = {
  GOOD_CONDUCT_AR: "حسن سير وسلوك (عربي)",
  GOOD_CONDUCT_EN: "حسن سير وسلوك (إنجليزي)",
  MBA_ISLESCA: "MBA - إسلسكا",
  DBA_ISLESCA: "DBA - إسلسكا",
  MBA_NAVAL_ACADEMY: "MBA - الأكاديمية البحرية",
  DBA_NAVAL_ACADEMY: "DBA - الأكاديمية البحرية",
  DIPLOMA_NAVAL_ACADEMY: "دبلوم - الأكاديمية البحرية",
  MBA_ARAB_ACADEMY: "MBA - الأكاديمية العربية",
  DBA_ARAB_ACADEMY: "DBA - الأكاديمية العربية",
};

const DELIVERY_LABELS: Record<string, string> = {
  ELECTRONIC: "تحميل إلكتروني",
  DELIVERY: "توصيل",
  PICKUP: "استلام من النقابة",
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "مسودة", color: "bg-gray-100 text-gray-600" },
  AWAITING_PAYMENT: { label: "في انتظار الدفع", color: "bg-yellow-100 text-yellow-700" },
  PAID: { label: "مدفوع", color: "bg-blue-100 text-blue-700" },
  UNDER_REVIEW: { label: "تحت المراجعة", color: "bg-orange-100 text-orange-700" },
  ISSUED: { label: "صدرت وجاهزة", color: "bg-teal-100 text-teal-700" },
  COMPLETED: { label: "مكتمل", color: "bg-green-100 text-green-700" },
  REJECTED: { label: "مرفوض", color: "bg-red-100 text-red-700" },
};

export default function AdminCertificatesPage() {
  const [requests, setRequests] = useState<CertRequest[]>([]);

  async function loadRequests() {
    const res = await fetch("/api/certificates");
    const data = await res.json();
    setRequests(data);
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/certificates/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadRequests();
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("متأكد إنك عايز تحذف الطلب ده نهائيًا؟");
    if (!confirmed) return;
    await fetch(`/api/certificates/${id}`, { method: "DELETE" });
    loadRequests();
  }

  const pendingCount = requests.filter((r) => r.status === "AWAITING_PAYMENT" || r.status === "UNDER_REVIEW").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-xs text-gray-400">إجمالي الطلبات</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{requests.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-yellow-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">بحاجة لإجراء</p>
            <p className="font-bold text-gray-900">{pendingCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-bold text-gray-900 mb-4">جميع طلبات الشهادات</h2>

        {requests.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
            لا توجد طلبات حاليًا
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => (
              <div key={r.id} className="rounded-xl border border-gray-100 bg-surface-muted p-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-[260px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_LABELS[r.status]?.color}`}>
                        {STATUS_LABELS[r.status]?.label}
                      </span>
                      <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-500">
                        {DELIVERY_LABELS[r.deliveryMethod]}
                      </span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                        {r.price} جنيه
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 mt-2">{TYPE_LABELS[r.type]}</h3>
                    {r.destination && <p className="text-sm text-gray-500 mt-1">الجهة: {r.destination}</p>}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
                      <span>{r.memberName}</span>
                      <span dir="ltr">{r.membershipNumber}</span>
                      <span dir="ltr">{r.contactInfo}</span>
                      {r.attachments.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary">
                          <ExternalLink className="w-3 h-3" />
                          مرفق {i + 1}
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={r.status}
                      onChange={(e) => updateStatus(r.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white outline-none"
                    >
                      {Object.entries(STATUS_LABELS).map(([value, { label }]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleDelete(r.id)}
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