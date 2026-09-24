"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import SuccessModal from "../../components/SuccessModal";

const CATEGORIES = [
  { value: "MEMBERSHIP", label: "القيد والعضوية" },
  { value: "CERTIFICATES_CARDS", label: "الشهادات والكارنيهات" },
  { value: "SUBSCRIPTIONS", label: "الاشتراكات" },
  { value: "INSTALLMENTS_PROJECTS", label: "الأقساط والمشروعات" },
  { value: "TRIPS_COURSES_EVENTS", label: "الرحلات والكورسات والفعاليات" },
  { value: "ADS", label: "الإعلانات" },
  { value: "TECHNICAL_ISSUE", label: "مشكلة فنية في الموقع أو الدفع" },
  { value: "ADMINISTRATIVE", label: "شكوى إدارية" },
  { value: "OTHER", label: "أخرى" },
];

export default function ComplaintPage() {
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [submitterName, setSubmitterName] = useState("");
  const [submitterContact, setSubmitterContact] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const attachments: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      attachments.push(uploadData.url);
    }

    const res = await fetch("/api/complaints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category,
        title,
        details,
        attachments,
        submitterName,
        submitterContact,
      }),
    });
    const data = await res.json();

    setTicketNumber(data.ticketNumber);
    setLoading(false);
    setShowSuccess(true);
    setTitle("");
    setDetails("");
    setSubmitterName("");
    setSubmitterContact("");
    setFiles([]);
  }

  return (
    <main>
      <PageHeader title="تقديم شكوى" subtitle="إرسال الشكاوى ومتابعتها إلكترونيًا" />
      <section className="bg-surface-muted py-14">
        <div className="max-w-2xl mx-auto px-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
            <p className="text-xs text-gray-400 -mb-2">هذه الخدمة متاحة للأعضاء وغير الأعضاء على حد سواء</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-700">الاسم</label>
                <input value={submitterName} onChange={(e) => setSubmitterName(e.target.value)} required type="text" placeholder="اكتب اسمك" className="mt-2 w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none text-right" />
              </div>
              <div>
                <label className="text-sm text-gray-700">رقم الهاتف أو البريد الإلكتروني</label>
                <input value={submitterContact} onChange={(e) => setSubmitterContact(e.target.value)} required type="text" placeholder="بيانات التواصل" className="mt-2 w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none text-right" dir="ltr" />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-700">تصنيف الشكوى</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-2 w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none text-right text-gray-700">
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-700">عنوان الشكوى</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required type="text" placeholder="اكتب عنوان مختصر للشكوى" className="mt-2 w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none text-right" />
            </div>

            <div>
              <label className="text-sm text-gray-700">تفاصيل الشكوى</label>
              <textarea value={details} onChange={(e) => setDetails(e.target.value)} required rows={5} placeholder="اكتب تفاصيل شكواك هنا" className="mt-2 w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none text-right resize-none" />
            </div>

            <div>
              <label className="text-sm text-gray-700">إرفاق مستندات أو صور (اختياري)</label>
              <label className="mt-2 flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-4 text-gray-400 text-sm cursor-pointer">
                {files.length > 0 ? `${files.length} ملف تم اختياره` : "اضغط لرفع ملف أو أكثر (PDF أو صور)"}
                <input type="file" accept="image/*,application/pdf" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} className="hidden" />
              </label>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-pill font-medium flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {loading ? "جاري الإرسال..." : "إرسال الشكوى"}
            </button>
          </form>
        </div>
      </section>

      {showSuccess && (
        <SuccessModal
          title="تم استلام شكواك"
          message={`رقم المتابعة الخاص بك هو ${ticketNumber}. سيتم الرد خلال 3 إلى 5 أيام عمل.`}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </main>
  );
}