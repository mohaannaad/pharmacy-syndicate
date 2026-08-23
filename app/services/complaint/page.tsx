"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import SuccessModal from "../../components/SuccessModal";

const types = ["شكوى إدارية", "شكوى مالية", "شكوى سلوك مهني", "أخرى"];

export default function ComplaintPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const ticketNumber = "CMP-" + Math.floor(100000 + Math.random() * 900000);

  return (
    <main>
      <PageHeader title="تقديم شكوى" subtitle="إرسال الشكاوى ومتابعتها إلكترونيًا" />
      <section className="bg-surface-muted py-14">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
            <div>
              <label className="text-sm text-gray-700">نوع الشكوى</label>
              <select className="mt-2 w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none text-right text-gray-500">
                {types.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-700">تفاصيل الشكوى</label>
              <textarea
                rows={5}
                placeholder="اكتب تفاصيل شكواك هنا"
                className="mt-2 w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none text-right resize-none"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700">إرفاق مستند (اختياري)</label>
              <label className="mt-2 flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-4 text-gray-400 text-sm cursor-pointer">
                اضغط لرفع ملف
                <input type="file" className="hidden" />
              </label>
            </div>
            <button onClick={() => setShowSuccess(true)} className="w-full bg-primary text-white py-3 rounded-pill font-medium flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              إرسال الشكوى
            </button>
          </div>
        </div>
      </section>

      {showSuccess && (
        <SuccessModal
          title="تم استلام شكواك"
          message={`رقم المتابعة الخاص بك هو ${ticketNumber}. يمكنك متابعة حالة الشكوى من صفحة حسابك.`}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </main>
  );
}