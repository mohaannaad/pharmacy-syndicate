"use client";

import { useState } from "react";
import { useAutoRefresh } from "../../lib/useAutoRefresh";
import { GraduationCap, Search, ChevronDown, ChevronUp, ExternalLink, Trash2, Clock, AlertCircle } from "lucide-react";
import { GRADUATE_STATUS_LABELS, PRIVATE_CATEGORY_FEES, CATEGORY_LABELS, trackingNumber } from "../../lib/graduate";

interface GraduateDocument {
  key: string;
  label: string;
  original: boolean;
  url: string;
}

interface GraduateApplication {
  id: string;
  serial: number;
  fullNameAr: string;
  fullNameEn: string;
  nationalId: string;
  phone: string;
  email: string;
  gender: string;
  nationality: string;
  religion: string;
  birthDate: string;
  birthGovernorate: string;
  idIssuer: string;
  governorate: string;
  city: string;
  district: string;
  street: string;
  buildingNo: string;
  apartment: string | null;
  landmark: string | null;
  universityType: string;
  universityName: string;
  universityCountry: string | null;
  studyStartYear: number;
  graduationYear: number;
  studyYears: number;
  grade: string;
  highSchoolType: string;
  highSchoolYear: number;
    highSchoolScore: number | null;
  highSchoolPercent: number | null;
  hasPreviousQualification: boolean;
  previousQualification: string | null;
  previousRejection: boolean;
  documents: GraduateDocument[];
    category: number | null;
  fee: number | null;
  status: string;
  adminNote: string | null;
  createdAt: string;
}

const UNIVERSITY_TYPE_LABELS: Record<string, string> = {
  GOVERNMENT: "حكومية",
  PRIVATE: "خاصة",
  FOREIGN: "خارج مصر",
};

function InfoRow({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm border-b border-gray-100 last:border-0">
      <span className="text-gray-400 shrink-0">{label}</span>
      <span className="text-gray-800 text-left">{value || "—"}</span>
    </div>
  );
}

function ApplicationCard({ app, onChanged }: { app: GraduateApplication; onChanged: () => void }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(app.status);
  const [note, setNote] = useState(app.adminNote || "");
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

    // الخاص والخارجي: الموظف يقدر يحدد الفئة أو يغيّرها
  const canSetCategory = app.universityType !== "GOVERNMENT";
  const needsReason = status === "NEEDS_COMPLETION" || status === "REJECTED";

  async function save(payload: Record<string, unknown>) {
    setSaving(true);
    setError("");
    const res = await fetch(`/api/graduates/${app.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "حصلت مشكلة");
      return;
    }
    onChanged();
  }

  async function handleDelete() {
    if (!window.confirm("متأكد إنك عايز تحذف الطلب ده نهائيًا؟")) return;
    await fetch(`/api/graduates/${app.id}`, { method: "DELETE" });
    onChanged();
  }

  const address = [app.buildingNo && `عقار ${app.buildingNo}`, app.apartment && `شقة ${app.apartment}`, app.street, app.district, app.city, app.governorate].filter(Boolean).join("، ");

  return (
    <div className="rounded-xl border border-gray-100 bg-surface-muted p-4">
      {/* ---------- الملخص ---------- */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[260px]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${GRADUATE_STATUS_LABELS[app.status]?.color}`}>
              {GRADUATE_STATUS_LABELS[app.status]?.label}
            </span>
            <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-500">
              {UNIVERSITY_TYPE_LABELS[app.universityType]}
            </span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              {app.fee !== null ? `${app.fee} جنيه` : "الرسوم لم تحدد"}
            </span>
          </div>
          <h3 className="font-bold text-gray-900 mt-2">{app.fullNameAr}</h3>
          <p className="text-sm text-gray-500 mt-1">{app.universityName} — دفعة {app.graduationYear}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
            <span dir="ltr" className="font-medium text-gray-600">{trackingNumber(app.serial, app.createdAt)}</span>
            <span dir="ltr">{app.nationalId}</span>
            <span dir="ltr">{app.phone}</span>
            <span>{new Date(app.createdAt).toLocaleDateString("ar-EG")}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button type="button" onClick={() => setOpen(!open)} className="flex items-center gap-1 text-primary bg-white border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-medium">
            {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {open ? "إخفاء التفاصيل" : "عرض التفاصيل"}
          </button>
          <button type="button" onClick={handleDelete} className="flex items-center gap-1 text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-medium">
            <Trash2 className="w-3.5 h-3.5" />
            حذف
          </button>
        </div>
      </div>

      {app.adminNote && (
        <div className="mt-3 text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-600">
          <span className="font-bold">ملاحظة الموظف: </span>
          {app.adminNote}
        </div>
      )}

      {/* ---------- التفاصيل ---------- */}
      {open && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4">
              <h4 className="font-bold text-sm text-gray-900 mb-2">البيانات الشخصية</h4>
              <InfoRow label="الاسم (إنجليزي)" value={app.fullNameEn} />
              <InfoRow label="البريد" value={app.email} />
              <InfoRow label="النوع" value={app.gender === "MALE" ? "ذكر" : "أنثى"} />
              <InfoRow label="الجنسية" value={app.nationality} />
              <InfoRow label="الديانة" value={app.religion} />
              <InfoRow label="تاريخ الميلاد" value={new Date(app.birthDate).toLocaleDateString("ar-EG")} />
              <InfoRow label="محافظة الميلاد" value={app.birthGovernorate} />
              <InfoRow label="جهة إصدار البطاقة" value={app.idIssuer} />
            </div>

            <div className="bg-white rounded-xl p-4">
              <h4 className="font-bold text-sm text-gray-900 mb-2">محل الإقامة</h4>
              <InfoRow label="العنوان" value={address} />
              <InfoRow label="علامة مميزة" value={app.landmark} />
            </div>

            <div className="bg-white rounded-xl p-4">
              <h4 className="font-bold text-sm text-gray-900 mb-2">البيانات الأكاديمية</h4>
              {app.universityCountry && <InfoRow label="دولة الجامعة" value={app.universityCountry} />}
              <InfoRow label="سنوات الدراسة" value={`${app.studyStartYear} - ${app.graduationYear} (${app.studyYears} سنوات)`} />
              <InfoRow label="التقدير" value={app.grade} />
              <InfoRow label="الثانوية" value={`${app.highSchoolType} (${app.highSchoolYear})`} />
                            <InfoRow label="نسبة الثانوية" value={app.highSchoolPercent ? `${app.highSchoolPercent}%${app.highSchoolScore ? ` (${app.highSchoolScore} درجة)` : ""}` : null} />
              {app.category && <InfoRow label="الفئة" value={CATEGORY_LABELS[app.category]} />}
              <InfoRow label="مؤهل سابق" value={app.hasPreviousQualification ? app.previousQualification : "لا يوجد"} />
              {app.universityType === "FOREIGN" && <InfoRow label="رفض سابق" value={app.previousRejection ? "نعم" : "لا"} />}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4">
            <h4 className="font-bold text-sm text-gray-900 mb-2">المستندات ({app.documents.length})</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {app.documents.map((doc) => (
                <a key={doc.key} href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-2 border border-gray-100 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
                  <span className="flex items-center gap-2 text-gray-700">
                    {doc.label}
                    {doc.original && <span className="text-[11px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">أصل</span>}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-primary shrink-0" />
                </a>
              ))}
            </div>
          </div>

          {/* ---------- الإجراءات ---------- */}
          <div className="bg-white rounded-xl p-4 space-y-4">
            <h4 className="font-bold text-sm text-gray-900">الإجراء</h4>

                       {canSetCategory && (
              <div className="flex items-end gap-2 flex-wrap bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex-1 min-w-[200px]">
                                    <label className="text-xs text-amber-800">
                    {app.category ? `الفئة الحالية: ${CATEGORY_LABELS[app.category]} — تغيير الفئة:` : "تحديد فئة الجامعة (لحساب الرسوم)"}
                  </label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-2 py-2 bg-white outline-none">
                    <option value="">اختر الفئة</option>
                    {Object.entries(PRIVATE_CATEGORY_FEES).map(([cat, price]) => (
                      <option key={cat} value={cat}>الفئة {cat} — {price} جنيه</option>
                    ))}
                  </select>
                </div>
                <button type="button" disabled={!category || saving} onClick={() => save({ category })} className="bg-primary text-white text-xs px-4 py-2.5 rounded-lg font-medium disabled:opacity-50">
                  اعتماد الفئة
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-500">حالة الطلب</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-2 py-2 bg-white outline-none">
                  {Object.entries(GRADUATE_STATUS_LABELS).map(([value, { label }]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-gray-500">{needsReason ? "السبب (إجباري — هيظهر للخريج)" : "ملاحظة (اختياري)"}</label>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder={needsReason ? "مثال: صورة البطاقة غير واضحة، برجاء إعادة رفعها" : ""} className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none resize-none" />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {error}
              </div>
            )}

            <button type="button" disabled={saving} onClick={() => save({ status, adminNote: note })} className="bg-primary text-white text-sm px-6 py-2.5 rounded-lg font-medium disabled:opacity-50">
              {saving ? "جاري الحفظ..." : "حفظ"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminGraduatesPage() {
  const [applications, setApplications] = useState<GraduateApplication[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  async function loadApplications() {
    const res = await fetch("/api/graduates");
    const data = await res.json();
    setApplications(data);
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
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-xs text-gray-400">إجمالي الطلبات</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{applications.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">قيد المراجعة</p>
            <p className="font-bold text-gray-900">{pendingCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">مطلوب استكمال</p>
            <p className="font-bold text-gray-900">{needsCompletionCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
          <h2 className="font-bold text-gray-900">طلبات قيد الخريجين</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="اسم، رقم قومي، أو رقم متابعة" className="text-sm border border-gray-200 rounded-lg pr-9 pl-3 py-2 outline-none w-64" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-2 py-2 bg-white outline-none">
              <option value="ALL">كل الحالات</option>
              {Object.entries(GRADUATE_STATUS_LABELS).map(([value, { label }]) => (
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