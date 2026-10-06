"use client";

import { useState } from "react";
import { useAutoRefresh } from "../../lib/useAutoRefresh";
import { UserCheck, Search, Clock, AlertCircle, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";

interface AccountRequest {
  id: string;
  membershipNumber: string;
  nationalId: string;
  fullName: string;
  oldPhone: string;
  newPhone: string;
  idFrontUrl: string;
  idBackUrl: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminNote: string | null;
  createdAt: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: "قيد المراجعة", color: "bg-orange-100 text-orange-700" },
  APPROVED: { label: "تم التفعيل", color: "bg-green-100 text-green-700" },
  REJECTED: { label: "مرفوض", color: "bg-gray-200 text-gray-700" },
};

function RequestCard({ item, onChanged }: { item: AccountRequest; onChanged: () => void }) {
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function decide(action: "approve" | "reject") {
    if (action === "reject" && !note.trim()) {
      setError("اكتب سبب الرفض الأول (هيوصل للعضو في رسالة)");
      return;
    }
    const question = action === "approve" ? "هيتعمل حساب للعضو بالرقم الجديد، والرقم هيتحدث في سجلات النقابة. متأكد؟" : "متأكد إنك عايز ترفض الطلب؟";
    if (!window.confirm(question)) return;

    setSaving(true);
    setError("");
    const res = await fetch(`/api/member-accounts/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, adminNote: note }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "حصلت مشكلة");
      return;
    }
    onChanged();
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-surface-muted p-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[240px]">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_LABELS[item.status].color}`}>
            {STATUS_LABELS[item.status].label}
          </span>
          <h3 className="font-bold text-gray-900 mt-2">{item.fullName}</h3>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
            <span>
              رقم القيد: <b dir="ltr" className="text-gray-800">{item.membershipNumber}</b>
            </span>
            <span>
              الرقم القومي: <span dir="ltr">{item.nationalId}</span>
            </span>
            <span>{new Date(item.createdAt).toLocaleDateString("ar-EG")}</span>
          </div>

          {/* الرقم القديم ← الجديد */}
          <div className="mt-3 inline-flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <span className="text-gray-400 line-through" dir="ltr">{item.oldPhone}</span>
            <ArrowLeft className="w-4 h-4 text-primary" />
            <span className="font-bold text-primary" dir="ltr">{item.newPhone}</span>
          </div>
        </div>

        {/* صور البطاقة */}
        <div className="flex gap-2 shrink-0">
          <a href={item.idFrontUrl} target="_blank" rel="noopener noreferrer" className="block text-center">
            <img src={item.idFrontUrl} alt="البطاقة - الوش" className="w-32 h-20 object-cover rounded-lg border border-gray-200 bg-white" />
            <span className="text-[11px] text-gray-500">الوش</span>
          </a>
          <a href={item.idBackUrl} target="_blank" rel="noopener noreferrer" className="block text-center">
            <img src={item.idBackUrl} alt="البطاقة - الضهر" className="w-32 h-20 object-cover rounded-lg border border-gray-200 bg-white" />
            <span className="text-[11px] text-gray-500">الضهر</span>
          </a>
        </div>
      </div>

      {item.adminNote && item.status !== "PENDING" && (
        <div className="mt-3 text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-600">
          <span className="font-bold">ملاحظة الموظف: </span>
          {item.adminNote}
        </div>
      )}

      {item.status === "PENDING" && (
        <div className="mt-4 bg-white rounded-xl p-4 space-y-3">
          <p className="text-xs text-gray-500">
            قارن الاسم والرقم القومي بصورة البطاقة. لو كله مطابق دوس «قبول»، ولو فيه مشكلة اكتب السبب ودوس «رفض».
          </p>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="سبب الرفض (إجباري في الرفض)، مثال: صورة البطاقة غير واضحة" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none resize-none" />

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <button type="button" disabled={saving} onClick={() => decide("approve")} className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm px-5 py-2.5 rounded-lg font-bold disabled:opacity-50">
              <CheckCircle2 className="w-4 h-4" />
              قبول وتفعيل الحساب
            </button>
            <button type="button" disabled={saving} onClick={() => decide("reject")} className="flex items-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm px-5 py-2.5 rounded-lg font-medium disabled:opacity-50">
              <XCircle className="w-4 h-4" />
              رفض
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminMemberAccountsPage() {
  const [requests, setRequests] = useState<AccountRequest[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("PENDING");

  async function loadRequests() {
    const res = await fetch("/api/member-accounts");
    const data = await res.json();
    setRequests(data);
  }

  useAutoRefresh(loadRequests);

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;

  const query = search.trim();
  const filtered = requests.filter((r) => {
    if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
    if (!query) return true;
    return r.fullName.includes(query) || r.nationalId.includes(query) || r.membershipNumber.includes(query) || r.newPhone.includes(query);
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-xs text-gray-400">إجمالي الطلبات</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{requests.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">مستني مراجعة</p>
            <p className="font-bold text-gray-900">{pendingCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
          <div>
            <h2 className="font-bold text-gray-900">طلبات حسابات الأعضاء</h2>
            <p className="text-xs text-gray-400 mt-1">أعضاء قدام غيّروا رقم موبايلهم وعايزين يعملوا حساب على البوابة</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="اسم، رقم قيد، رقم قومي، أو موبايل" className="text-sm border border-gray-200 rounded-lg pr-9 pl-3 py-2 outline-none w-64" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-2 py-2 bg-white outline-none">
              <option value="ALL">كل الحالات</option>
              {Object.entries(STATUS_LABELS).map(([value, { label }]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <UserCheck className="w-8 h-8 mx-auto mb-2 opacity-40" />
            لا توجد طلبات
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <RequestCard key={`${item.id}-${item.status}`} item={item} onChanged={loadRequests} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}