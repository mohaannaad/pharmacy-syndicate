"use client";

import { useEffect, useState } from "react";
import { getSeenAt, isUnread } from "../lib/requestsSeen";
import { ChevronDown, LogOut, FileText, ClipboardList } from "lucide-react";

const ROLE_LABELS: Record<string, string> = {
  GRADUATE: "خريج",
  MEMBER: "عضو",
  ADMIN: "مدير النظام",
};

export interface CurrentUser {
  fullName: string;
  role: string;
  membershipNumber: string | null;
}

export default function UserMenu({ user }: { user: CurrentUser }) {
  const [open, setOpen] = useState(false);
  const firstName = user.fullName.split(" ")[0];
  const isMember = user.role === "MEMBER" || user.role === "ADMIN";

  // عدد ردود النقابة الجديدة على طلبات العضو (الإشعارات)
  const [unread, setUnread] = useState(0);
  useEffect(() => {
    if (!isMember) return;
    fetch("/api/my-requests")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        const seenAt = getSeenAt();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setUnread(data.requests.filter((r: any) => isUnread(r, seenAt)).length);
      })
      .catch(() => {});
  }, [isMember]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(!open)} className="h-11 flex items-center gap-2 bg-white border border-line hover:border-primary/40 text-ink ps-1.5 pe-4 rounded-pill text-sm font-bold whitespace-nowrap transition-colors">
        <span className="relative w-8 h-8 rounded-pill bg-primary text-white flex items-center justify-center text-sm font-extrabold">
          {firstName.charAt(0)}
          {unread > 0 && <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">{unread}</span>}
        </span>
        {firstName}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}

      {open && (
        <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-lift border border-line overflow-hidden z-50 text-right">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-bold text-gray-900">{user.fullName}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {ROLE_LABELS[user.role]}
              {user.membershipNumber && (
                <span>
                  {" "}· رقم القيد <span dir="ltr">{user.membershipNumber}</span>
                </span>
              )}
            </p>
          </div>
          {/* العضو: «طلباتي» فيها ردود النقابة على طلباته */}
          {isMember && (
            <a href="/my-requests" className="flex items-center gap-3 px-4 py-3 hover:bg-mint text-sm font-semibold text-ink">
              <ClipboardList className="w-4 h-4 text-primary shrink-0" />
              <span className="flex-1">طلباتي</span>
              {unread > 0 && <span className="text-[11px] font-bold bg-red-500 text-white rounded-pill px-2 py-0.5">{unread} جديد</span>}
            </a>
          )}
          {/* الخريج: «طلب القيد» فيها الفورم أو حالة طلبه */}
          {user.role === "GRADUATE" && (
            <a href="/register/new-graduate" className="flex items-center gap-3 px-4 py-3 hover:bg-mint text-sm font-semibold text-ink">
              <FileText className="w-4 h-4 text-primary shrink-0" />
              طلب القيد
            </a>
          )}
          <button type="button" onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-sm text-red-600 border-t border-gray-100">
            <LogOut className="w-4 h-4 shrink-0" />
            تسجيل الخروج
          </button>
        </div>
      )}
    </div>
  );
}