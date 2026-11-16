"use client";

import { useEffect, useState } from "react";
import { Search, Trash2, Users, Loader2 } from "lucide-react";

interface SiteUser {
  id: string;
  fullName: string;
  nationalId: string;
  phone: string;
  role: string;
  membershipNumber: string | null;
  createdAt: string;
  _count: { graduateApplications: number };
}

const ROLES: Record<string, { label: string; className: string }> = {
  MEMBER: { label: "عضو", className: "bg-mint text-primary" },
  GRADUATE: { label: "خريج", className: "bg-[#E8EEFA] text-[#2C4E8C]" },
  ADMIN: { label: "مدير النظام", className: "bg-gold-soft text-[#8A6C0E]" },
};

const FILTERS = [
  { value: "all", label: "الكل" },
  { value: "MEMBER", label: "الأعضاء" },
  { value: "GRADUATE", label: "الخريجون" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<SiteUser[] | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function loadUsers() {
    const res = await fetch("/api/users");
    setUsers(await res.json());
  }

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  async function handleDelete(user: SiteUser) {
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف حساب «${user.fullName}»؟\n\nسيتم حذف الحساب نهائيًا ولا يمكن التراجع، وسيتمكن صاحبه من التسجيل من جديد. طلباته السابقة ستبقى في لوحة التحكم.`
    );
    if (!confirmed) return;
    setError("");
    setDeletingId(user.id);
    const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "تعذّر حذف الحساب");
    }
    setDeletingId(null);
    loadUsers();
  }

  const q = query.trim();
  const shown = (users || []).filter((u) => {
    if (filter !== "all" && u.role !== filter) return false;
    return !q || u.fullName.includes(q) || u.nationalId.includes(q) || u.phone.includes(q) || (u.membershipNumber || "").includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-line shadow-card p-4 md:p-5 flex gap-3 items-center flex-wrap">
        <label className="flex-1 min-w-[240px] flex items-center gap-2.5 bg-surface-muted border border-line rounded-2xl px-4 h-11">
          <Search className="w-5 h-5 text-ink-muted shrink-0" />
          <span className="sr-only">بحث</span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث بالاسم أو الرقم القومي أو الهاتف أو رقم القيد" className="flex-1 bg-transparent outline-none text-sm text-right !shadow-none !border-0" />
        </label>
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button key={f.value} type="button" onClick={() => setFilter(f.value)} className={`h-10 px-4 rounded-pill text-sm font-bold border transition-colors ${filter === f.value ? "bg-primary border-primary text-white" : "bg-white border-line text-[#3E4B44] hover:border-primary"}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-4 py-3">{error}</p>}

      <div className="bg-white rounded-3xl border border-line shadow-card p-6">
        <h2 className="font-bold text-ink mb-1">حسابات المستخدمين ({shown.length})</h2>
        <p className="text-sm text-ink-muted mb-5">كل الحسابات المسجلة على الموقع. حذف الحساب يسمح لصاحبه بالتسجيل من جديد بنفس البيانات.</p>

        {users === null ? (
          <Loader2 className="w-7 h-7 animate-spin mx-auto text-primary" />
        ) : shown.length === 0 ? (
          <div className="text-center py-12 text-ink-muted">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
            لا توجد حسابات مطابقة
          </div>
        ) : (
          <div className="space-y-2">
            {shown.map((u) => (
              <div key={u.id} className="rounded-2xl border border-line bg-surface-muted p-4 flex items-center gap-4 flex-wrap">
                <span className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center font-extrabold shrink-0">{u.fullName.charAt(0)}</span>
                <div className="flex-1 min-w-[220px] text-right">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-ink">{u.fullName}</span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-pill ${ROLES[u.role]?.className}`}>{ROLES[u.role]?.label}</span>
                  </div>
                  <div className="mt-1 flex gap-x-4 gap-y-1 flex-wrap text-xs text-ink-muted">
                    {u.membershipNumber && (
                      <span>
                        رقم القيد: <b className="text-ink" dir="ltr">{u.membershipNumber}</b>
                      </span>
                    )}
                    <span>
                      الرقم القومي: <span dir="ltr">{u.nationalId}</span>
                    </span>
                    <span>
                      الهاتف: <span dir="ltr">{u.phone}</span>
                    </span>
                    <span>تاريخ التسجيل: {new Date(u.createdAt).toLocaleDateString("ar-EG")}</span>
                    {u._count.graduateApplications > 0 && <span>طلبات القيد: {u._count.graduateApplications}</span>}
                  </div>
                </div>
                {u.role !== "ADMIN" && (
                  <button type="button" onClick={() => handleDelete(u)} disabled={deletingId === u.id} className="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-pill text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 disabled:opacity-60">
                    <Trash2 className="w-4 h-4" />
                    {deletingId === u.id ? "جاري الحذف..." : "حذف الحساب"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
