"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import SuccessModal from "../../components/SuccessModal";

const payments = ["رسوم تجديد الكارنيه - 150 جنيه - 10/03/2025", "شهادة عضوية النقابة - 50 جنيه - 22/01/2025"];

export default function RefundPage() {
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <main>
      <PageHeader title="الاسترداد" subtitle="إرسال طلبات استرداد المدفوعات ومتابعتها" />
      <section className="bg-surface-muted py-14">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
            <div>
              <label className="text-sm text-gray-700">اختر العملية المراد استردادها</label>
              <select className="mt-2 w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none text-right text-gray-500">
                {payments.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-700">سبب الاسترداد</label>
              <textarea
                rows={4}
                placeholder="اكتب سبب طلب الاسترداد"
                className="mt-2 w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none text-right resize-none"
              />
            </div>
            <button onClick={() => setShowSuccess(true)} className="w-full bg-primary text-white py-3 rounded-pill font-medium flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" />
              إرسال طلب الاسترداد
            </button>
          </div>
        </div>
      </section>

      {showSuccess && (
        <SuccessModal
          title="تم إرسال طلب الاسترداد"
          message="سيتم مراجعة طلبك من قبل النقابة. بعد الموافقة، يرجى التوجه إلى مقر النقابة لاستلام الشيك."
          onClose={() => setShowSuccess(false)}
        />
      )}
    </main>
  );
}