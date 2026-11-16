"use client";

import { useState } from "react";
import { ChevronDown, UserCheck, GraduationCap } from "lucide-react";

export default function RegisterDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="h-11 flex items-center gap-1.5 border-[1.5px] border-primary text-primary hover:bg-mint px-4 md:px-5 rounded-pill text-sm md:text-[15px] font-bold whitespace-nowrap transition-colors"
      >
        تسجيل
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}

      {open && (
        <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-lift border border-line overflow-hidden z-50 p-1.5">
          <a href="/register/existing-member" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-mint text-sm font-semibold text-ink text-right">
            <UserCheck className="w-4 h-4 text-primary shrink-0" />
            تسجيل عضو حالي
          </a>
          <a href="/signup" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-mint text-sm font-semibold text-ink text-right">
            <GraduationCap className="w-4 h-4 text-primary shrink-0" />
            تسجيل خريج جديد
          </a>
        </div>
      )}
    </div>
  );
}