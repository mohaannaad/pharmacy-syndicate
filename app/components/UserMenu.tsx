"use client";

import { useState } from "react";
import { ChevronDown, LogOut, FileText, User } from "lucide-react";

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

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(!open)} className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-pill text-sm font-medium whitespace-nowrap">
        <User className="w-4 h-4" />
        {firstName}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}

      {open && (
        <div className="absolute left-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 text-right">
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
          {user.role === "GRADUATE" && (
            <a href="/register/new-graduate" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-sm text-gray-700">
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