"use client";

import { useState } from "react";
import { Paperclip, CheckCircle } from "lucide-react";

export default function DocumentUploadRow({ label }: { label: string }) {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">{label}</span>
        <span className={`w-2 h-2 rounded-full ${fileName ? "bg-primary" : "bg-gray-300"}`} />
      </div>

      <label className="flex items-center gap-2 bg-primary text-white text-xs px-4 py-2 rounded-pill cursor-pointer">
        {fileName ? <CheckCircle className="w-3.5 h-3.5" /> : <Paperclip className="w-3.5 h-3.5" />}
        {fileName ? "تم الإرفاق" : "اضافة المستند"}
        <input
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        />
      </label>
    </div>
  );
}