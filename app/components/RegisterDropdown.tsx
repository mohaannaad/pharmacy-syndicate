"use client";

import { useState } from "react";
import { ChevronDown, UserCheck, GraduationCap } from "lucide-react";

export default function RegisterDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 bg-brand-green text-white px-5 py-2 rounded-pill text-sm font-medium whitespace-nowrap"
      >
        تسجيل
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}

      {open && (
        <div className="absolute left-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
          <a href="/register/existing-member" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-sm text-gray-700 text-right">
            <UserCheck className="w-4 h-4 text-primary shrink-0" />
            تسجيل عضو حالي
          </a>
          <a href="/register/new-graduate" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-sm text-gray-700 text-right border-t border-gray-100">
            <GraduationCap className="w-4 h-4 text-primary shrink-0" />
            تسجيل خريج جديد
          </a>
        </div>
      )}
    </div>
  );
}