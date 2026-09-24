"use client";

import { useState } from "react";
import { Megaphone } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import SuccessModal from "../../components/SuccessModal";

type Placement = "WEBSITE" | "HQ" | "BOTH";

const DURATIONS = [
  { value: "week", label: "أسبوع" },
  { value: "month", label: "شهر" },
  { value: "3months", label: "3 شهور" },
];

// أسعار مبدئية (Placeholder) — تتغير لاحقًا حسب الجدول الرسمي من النقابة
const PRICING: Record<Placement, Record<string, number>> = {
  WEBSITE: { week: 100, month: 350, "3months": 900 },
  HQ: { week: 150, month: 500, "3months": 1300 },
  BOTH: { week: 200, month: 700, "3months": 1800 },
};

const PLACEMENT_LABELS: Record<Placement, string> = {
  WEBSITE: "على الموقع الإلكتروني",
  HQ: "داخل مقر النقابة",
  BOTH: "الموقع + مقر النقابة معًا",
};

export default function AdPage() {
  const [placement, setPlacement] = useState<Placement>("WEBSITE");
  const [duration, setDuration] = useState("week");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const price = PRICING[placement][duration];
  const acceptedTypes = placement === "WEBSITE" ? "image/*" : "image/*,application/pdf";
  const fileHint = placement === "WEBSITE"
    ? "بانر أفقي (JPG أو PNG)"
    : placement === "HQ"
    ? "بوستر A4 (JPG, PNG أو PDF)"
    : "بانر للموقع + بوستر A4 لمقر النقابة (يمكنك رفع ملف واحد يجمعهما، أو التواصل معنا لاحقًا لإرسال الثاني)";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    let fileUrl: string | null = null;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      fileUrl = uploadData.url;
    }

    await fetch("/api/ads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        placement,
        duration,
        price,
        title,
        description,
        contactInfo,
        fileUrl,
      }),
    });

    setLoading(false);
    setShowSuccess(true);
    setTitle("");
    setDescription("");
    setContactInfo("");
    setFile(null);
  }

  return (
    <main>
      <PageHeader title="اضافة اعلان" subtitle="انشاء وادارة إعلاناتك داخل المنصة" />
      <section className="bg-surface-muted py-14">
        <div className="max-w-3xl mx-auto px-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-6">

            <div>
              <label className="text-sm text-gray-700">مكان الإعلان</label>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                {(Object.keys(PLACEMENT_LABELS) as Placement[]).map((key) => (
                  <label key={key} className={`flex items-center justify-between border rounded-xl px-4 py-3 text-sm cursor-pointer ${placement === key ? "border-primary bg-primary/5" : "border-gray-200"}`}>
                    <span>{PLACEMENT_LABELS[key]}</span>
                    <input type="radio" checked={placement === key} onChange={() => setPlacement(key)} />
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-700">المدة</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {DURATIONS.map((d) => (
                    <label key={d.value} className={`text-center border rounded-xl py-2.5 text-sm cursor-pointer ${duration === d.value ? "border-primary bg-primary/5" : "border-gray-200"}`}>
                      <input type="radio" checked={duration === d.value} onChange={() => setDuration(d.value)} className="hidden" />
                      {d.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-700">السعر الإجمالي</label>
                <div className="mt-2 bg-primary/5 rounded-xl px-4 py-2.5 h-[42px] flex items-center justify-between">
                  <span className="text-sm text-gray-600">شامل الرسوم</span>
                  <span className="font-bold text-primary text-lg">{price} جنيه</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-700">عنوان الإعلان</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} required type="text" placeholder="اكتب عنوان الإعلان" className="mt-2 w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none text-right" />
              </div>

              <div>
                <label className="text-sm text-gray-700">بيانات التواصل</label>
                <input value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} required type="text" placeholder="رقم الهاتف أو البريد الإلكتروني" className="mt-2 w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none text-right" dir="ltr" />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-700">وصف الإعلان</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} placeholder="اكتب وصف الإعلان" className="mt-2 w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none text-right resize-none" />
            </div>

            <div>
              <label className="text-sm text-gray-700">ملف الإعلان</label>
              <p className="mt-1 text-xs text-gray-400">{fileHint}</p>
              <label className="mt-2 flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-4 text-gray-400 text-sm cursor-pointer">
                {file ? file.name : "اضغط لرفع الملف"}
                <input type="file" accept={acceptedTypes} required onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
              </label>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-pill font-medium flex items-center justify-center gap-2">
              <Megaphone className="w-4 h-4" />
              {loading ? "جاري الإرسال..." : "إرسال الإعلان للمراجعة"}
            </button>
          </form>
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