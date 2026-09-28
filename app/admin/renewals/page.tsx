"use client";

import { useState } from "react";
import { useAutoRefresh } from "../../lib/useAutoRefresh";
import { IdCard, Search, Trash2, Clock, Truck, Building2, ExternalLink, AlertCircle } from "lucide-react";
import { RENEWAL_STATUS_LABELS, DELIVERY_LABELS, renewalNumber } from "../../lib/renewal";

interface RenewalItem {
  id: string;
  serial: number;
  years: number[];
  subscriptionTotal: number;
  lateTotal: number;
  deliveryFee: number;
  total: number;
  phone: string;
  address: string;
  photoUrl: string | null;
  deliveryMethod: string;
  deliveryAddress: string | null;
  status: string;
  adminNote: string | null;
  paidAt: string | null;
  createdAt: string;
  member: {
    fullName: string;
    membershipNumber: string;
    lastPaidYear: number;
  };
}

const money = (n: number) => `${n.toLocaleString("ar-EG")} جنيه`;

function RenewalCard({ item, onChanged }: { item: RenewalItem; onChanged: () => void }) {
  const [status, setStatus] = useState(item.status);
  const [note, setNote] = useState(item.adminNote || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setSaving(true);
    setError("");
    const res = await fetch(`/api/renewals/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, adminNote: note }),
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
    await fetch(`/api/renewals/${item.id}`, { method: "DELETE" });
    onChanged();
  }

  const changed = status !== item.status || note !== (item.adminNote || "");

  return (
    <div className="rounded-xl border border-gray-100 bg-surface-muted p-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[260px]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${RENEWAL_STATUS_LABELS[item.status]?.color}`}>
              {RENEWAL_STATUS_LABELS[item.status]?.label}
            </span>
            <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-500 flex items-center gap-1">
              {item.deliveryMethod === "DELIVERY" ? <Truck className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
              {DELIVERY_LABELS[item.deliveryMethod]}
            </span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{money(item.total)}</span>
          </div>

          <h3 className="font-bold text-gray-900 mt-2">{item.member.fullName}</h3>
          <p className="text-sm text-gray-500 mt-1">
            سنوات: {item.years.join("، ")}
            {item.lateTotal > 0 && <span className="text-red-600"> — غرامات {money(item.lateTotal)}</span>}
          </p>

          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
            <span dir="ltr" className="font-medium text-gray-600">{renewalNumber(item.serial, item.createdAt)}</span>
            <span>
              قيد: <span dir="ltr">{item.member.membershipNumber}</span>
            </span>
            <span dir="ltr">{item.phone}</span>
            <span>{new Date(item.createdAt).toLocaleDateString("ar-EG")}</span>
            {item.photoUrl && (
              <a href={item.photoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary">
                <ExternalLink className="w-3 h-3" />
                صورة جديدة
              </a>
            )}
          </div>

          {item.deliveryMethod === "DELIVERY" && item.deliveryAddress && (
            <p className="mt-2 text-xs text-gray-500">عنوان التوصيل: {item.deliveryAddress}</p>
          )}
        </div>

        <button type="button" onClick={handleDelete} className="flex items-center gap-1 text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0">
          <Trash2 className="w-3.5 h-3.5" />
          حذف
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div>
          <label className="text-xs text-gray-500">الحالة</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-2 py-2 bg-white outline-none">
            {Object.entries(RENEWAL_STATUS_LABELS).map(([value, { label }]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="text-xs text-gray-500">{status === "REJECTED" ? "سبب الرفض (إجباري — هيظهر للعضو)" : "ملاحظة للعضو (اختياري)"}</label>
          <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder={status === "ISSUED" ? "مثال: الكارنيه جاهز للاستلام من مقر النقابة" : ""} className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none" />
        </div>
        <button type="button" disabled={!changed || saving} onClick={save} className="bg-primary text-white text-sm py-2 rounded-lg font-medium disabled:opacity-40">
          {saving ? "جاري الحفظ..." : "حفظ"}
        </button>
      </div>

      {item.status === "AWAITING_PAYMENT" && status !== "AWAITING_PAYMENT" && status !== "REJECTED" && (
        <p className="mt-2 text-xs text-amber-700">⚠️ عند الحفظ هيتسجل إن الطلب اتدفع، وآخر عام مسدد عند العضو هيتحدث لـ {Math.max(...item.years)}.</p>
      )}

      {error && (
        <div className="mt-2 flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}

export default function AdminRenewalsPage() {
  const [renewals, setRenewals] = useState<RenewalItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  async function loadRenewals() {
    const res = await fetch("/api/renewals");
    const data = await res.json();
    setRenewals(data);
  }

  useAutoRefresh(loadRenewals);

  const awaitingPayment = renewals.filter((r) => r.status === "AWAITING_PAYMENT").length;
  const inProgress = renewals.filter((r) => ["RECEIVED", "UNDER_REVIEW", "ISSUED"].includes(r.status)).length;

  // البحث بالاسم أو رقم القيد أو رقم الطلب
  const query = search.trim();
  const filtered = renewals.filter((r) => {
    if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
    if (!query) return true;
    return r.member.fullName.includes(query) || r.member.membershipNumber.includes(query) || renewalNumber(r.serial, r.createdAt).includes(query.toUpperCase());
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-xs text-gray-400">إجمالي الطلبات</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{renewals.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-yellow-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">في انتظار الدفع</p>
            <p className="font-bold text-gray-900">{awaitingPayment}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <IdCard className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">كارنيهات قيد التجهيز</p>
            <p className="font-bold text-gray-900">{inProgress}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
          <h2 className="font-bold text-gray-900">طلبات تجديد الاشتراك والكارنيه</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="اسم، رقم قيد، أو رقم طلب" className="text-sm border border-gray-200 rounded-lg pr-9 pl-3 py-2 outline-none w-64" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-2 py-2 bg-white outline-none">
              <option value="ALL">كل الحالات</option>
              {Object.entries(RENEWAL_STATUS_LABELS).map(([value, { label }]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <IdCard className="w-8 h-8 mx-auto mb-2 opacity-40" />
            لا توجد طلبات
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <RenewalCard key={`${item.id}-${item.status}-${item.adminNote}`} item={item} onChanged={loadRenewals} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}