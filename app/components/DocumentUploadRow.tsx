"use client";

import { useState } from "react";
import { Paperclip, CheckCircle, Loader2 } from "lucide-react";

interface DocumentUploadRowProps {
  label: string;
  original?: boolean; // لو true بيظهر شارة "أصل" (يعني هيسلّم الأصل عند الحضور)
  uploaded?: boolean; // لو المستند اترفع قبل كده (مثلًا رجع خطوة ورا)
  onUpload?: (url: string | null) => void; // بيرجّع رابط الملف بعد رفعه
}

export default function DocumentUploadRow({ label, original = false, uploaded = false, onUpload }: DocumentUploadRowProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const done = !!fileName || uploaded;

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // لو الصفحة مش محتاجة رفع حقيقي، نكتفي بعرض اسم الملف
    if (!onUpload) {
      setFileName(file.name);
      return;
    }

    setLoading(true);
    setError(false);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error("upload failed");
      setFileName(file.name);
      onUpload(data.url);
    } catch {
      setError(true);
      onUpload(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2 min-w-0 flex-wrap">
        <span className={`w-2 h-2 rounded-full shrink-0 ${done ? "bg-primary" : "bg-gray-300"}`} />
        <span className="text-sm text-gray-700">{label}</span>
        {original && <span className="text-[11px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full shrink-0">أصل</span>}
        {error && <span className="text-[11px] text-red-600 shrink-0">فشل الرفع، حاول تاني</span>}
      </div>

      <label className="flex items-center gap-2 bg-primary text-white text-xs px-4 py-2 rounded-pill cursor-pointer shrink-0">
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : done ? <CheckCircle className="w-3.5 h-3.5" /> : <Paperclip className="w-3.5 h-3.5" />}
        {loading ? "جاري الرفع..." : done ? "تم الإرفاق" : "اضافة المستند"}
        <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" disabled={loading} onChange={handleChange} />
      </label>
    </div>
  );
}