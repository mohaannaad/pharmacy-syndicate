"use client";

import { useState } from "react";
import { IdCard, Clock3 } from "lucide-react";
import PageHeader from "../../components/PageHeader";

export default function RenewCardPage() {
  const [showNotice, setShowNotice] = useState(false);

  return (
    <main>
      <PageHeader title="تجديد الكارنيه" subtitle="تجديد بطاقة العضوية بسهولة وسرعة" />
      <section className="bg-surface-muted py-14">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <IdCard className="w-8 h-8 text-primary" />
            </div>
            <div className="mt-4 text-sm text-gray-500">حالة الكارنيه الحالية</div>
            <div className="mt-1 font-bold text-red-500">منتهي منذ 15/01/2025</div>

            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
              <span className="font-bold text-primary text-lg">150 جنيه</span>
              <span className="text-sm text-gray-500">رسوم التجديد</span>
            </div>

            <button onClick={() => setShowNotice(true)} className="mt-6 w-full bg-primary text-white py-3 rounded-pill font-medium">
              ادفع الآن وجدد الكارنيه
            </button>

            {showNotice && (
              <div className="mt-4 flex items-center gap-2 bg-yellow-50 text-yellow-700 text-xs rounded-xl px-4 py-3 border border-yellow-200">
                <Clock3 className="w-4 h-4 shrink-0" />
                بوابة الدفع الإلكتروني قيد التفعيل حاليًا، وستكون متاحة قريبًا.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}