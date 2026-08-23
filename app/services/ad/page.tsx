"use client";

import { useState } from "react";
import { Megaphone } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import SuccessModal from "../../components/SuccessModal";

export default function AdPage() {
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <main>
      <PageHeader title="اضافة اعلان" subtitle="انشاء وادارة إعلاناتك داخل المنصة" />
      <section className="bg-surface-muted py-14">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
            <div>
              <label className="text-sm text-gray-700">عنوان الإعلان</label>
              <input type="text" placeholder="اكتب عنوان الإعلان" className="mt-2 w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none text-right" />
            </div>
            <div>
              <label className="text-sm text-gray-700">وصف الإعلان</label>
              <textarea rows={4} placeholder="اكتب وصف الإعلان" className="mt-2 w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none text-right resize-none" />
            </div>
            <div>
              <label className="text-sm text-gray-700">صورة الإعلان</label>
              <label className="mt-2 flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-4 text-gray-400 text-sm cursor-pointer">
                اضغط لرفع صورة
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-700">تاريخ البداية</label>
                <input type="date" className="mt-2 w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none text-right" />
              </div>
              <div>
                <label className="text-sm text-gray-700">تاريخ النهاية</label>
                <input type="date" className="mt-2 w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none text-right" />
              </div>
            </div>
            <button onClick={() => setShowSuccess(true)} className="w-full bg-primary text-white py-3 rounded-pill font-medium flex items-center justify-center gap-2">
              <Megaphone className="w-4 h-4" />
              إرسال الإعلان للمراجعة
            </button>
          </div>
        </div>
      </section>

      {showSuccess && (
        <SuccessModal
          title="تم إرسال إعلانك"
          message="سيتم مراجعة الإعلان من قبل إدارة النقابة قبل نشره على المنصة."
          onClose={() => setShowSuccess(false)}
        />
      )}
    </main>
  );
}