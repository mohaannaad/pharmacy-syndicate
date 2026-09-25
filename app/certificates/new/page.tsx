"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import SuccessModal from "../../components/SuccessModal";

const CERTIFICATE_TYPES = [
  { value: "GOOD_CONDUCT_AR", label: "شهادة حسن سير وسلوك (عربي)", needsDestination: true, needsAttachments: true, attachmentHint: "صورة بطاقة الرقم القومي (وجه وظهر) أو رخصة قيادة سارية" },
  { value: "GOOD_CONDUCT_EN", label: "شهادة حسن سير وسلوك (إنجليزي)", needsDestination: true, needsAttachments: true, attachmentHint: "صورة جواز السفر + صورة بطاقة الرقم القومي (وجه وظهر) أو رخصة قيادة" },
  { value: "MBA_ISLESCA", label: "MBA من جامعة إسلسكا", needsDestination: false, needsAttachments: false, attachmentHint: "" },
  { value: "DBA_ISLESCA", label: "DBA من جامعة إسلسكا", needsDestination: false, needsAttachments: false, attachmentHint: "" },
  { value: "MBA_NAVAL_ACADEMY", label: "MBA من الأكاديمية البحرية", needsDestination: false, needsAttachments: false, attachmentHint: "" },
  { value: "DBA_NAVAL_ACADEMY", label: "DBA من الأكاديمية البحرية", needsDestination: false, needsAttachments: false, attachmentHint: "" },
  { value: "DIPLOMA_NAVAL_ACADEMY", label: "دبلوم من الأكاديمية البحرية", needsDestination: false, needsAttachments: false, attachmentHint: "" },
  { value: "MBA_ARAB_ACADEMY", label: "MBA من الأكاديمية العربية الإدارية والمصرفية", needsDestination: false, needsAttachments: false, attachmentHint: "" },
  { value: "DBA_ARAB_ACADEMY", label: "DBA من الأكاديمية العربية الإدارية والمصرفية", needsDestination: false, needsAttachments: false, attachmentHint: "" },
];

const DELIVERY_METHODS = [
  { value: "ELECTRONIC", label: "تحميل إلكتروني" },
  { value: "DELIVERY", label: "التوصيل" },
  { value: "PICKUP", label: "الاستلام من داخل النقابة" },
];

export default function NewCertificateRequestPage() {
  const [type, setType] = useState(CERTIFICATE_TYPES[0].value);
  const [destination, setDestination] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("ELECTRONIC");
  const [memberName, setMemberName] = useState("");
  const [membershipNumber, setMembershipNumber] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const selectedType = CERTIFICATE_TYPES.find((t) => t.value === type)!;

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

    await fetch("/api/certificates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        destination: selectedType.needsDestination ? destination : null,
        attachments,
        deliveryMethod,
        memberName,
        membershipNumber,
        contactInfo,
      }),
    });

    setLoading(false);
    setShowSuccess(true);
    setDestination("");
    setMemberName("");
    setMembershipNumber("");
    setContactInfo("");
    setFiles([]);
  }

  return (
    <main>
      <PageHeader title="طلب شهادة جديدة" subtitle="اختر نوع الشهادة واملأ البيانات المطلوبة" />
      <section className="bg-surface-muted py-14">
        <div className="max-w-2xl mx-auto px-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
            <div>
              <label className="text-sm text-gray-700">نوع الشهادة</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="mt-2 w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none text-right text-gray-700">
                {CERTIFICATE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-700">اسم العضو</label>
                <input value={memberName} onChange={(e) => setMemberName(e.target.value)} required type="text" placeholder="اكتب اسمك بالكامل" className="mt-2 w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none text-right" />
              </div>
              <div>
                <label className="text-sm text-gray-700">رقم القيد</label>
                <input value={membershipNumber} onChange={(e) => setMembershipNumber(e.target.value)} required type="text" placeholder="رقم القيد بالنقابة" className="mt-2 w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none text-right" dir="ltr" />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-700">رقم الهاتف أو البريد الإلكتروني</label>
              <input value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} required type="text" placeholder="بيانات التواصل" className="mt-2 w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none text-right" dir="ltr" />
            </div>

            {selectedType.needsDestination && (
              <div>
                <label className="text-sm text-gray-700">الجهة الموجهة إليها الشهادة أو الدولة</label>
                <input value={destination} onChange={(e) => setDestination(e.target.value)} required type="text" placeholder="اكتب الجهة أو الدولة" className="mt-2 w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none text-right" />
              </div>
            )}

            {selectedType.needsAttachments && (
              <div>
                <label className="text-sm text-gray-700">المرفقات المطلوبة</label>
                <p className="mt-1 text-xs text-gray-400">{selectedType.attachmentHint}</p>
                <label className="mt-2 flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-4 text-gray-400 text-sm cursor-pointer">
                  {files.length > 0 ? `${files.length} ملف تم اختياره` : "اضغط لرفع الملفات"}
                  <input type="file" accept="image/*,application/pdf" multiple required onChange={(e) => setFiles(Array.from(e.target.files || []))} className="hidden" />
                </label>
              </div>
            )}

            <div>
              <label className="text-sm text-gray-700">طريقة الاستلام</label>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                {DELIVERY_METHODS.map((m) => (
                  <label key={m.value} className={`text-center border rounded-xl py-2.5 text-sm cursor-pointer ${deliveryMethod === m.value ? "border-primary bg-primary/5" : "border-gray-200"}`}>
                    <input type="radio" checked={deliveryMethod === m.value} onChange={() => setDeliveryMethod(m.value)} className="hidden" />
                    {m.label}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-pill font-medium flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              {loading ? "جاري الإرسال..." : "تقديم الطلب"}
            </button>
          </form>
        </div>
      </section>

      {showSuccess && (
        <SuccessModal
          title="تم استلام طلبك"
          message="سيتم مراجعة طلبك من قبل النقابة، ويمكنك متابعة حالته من صفحة الشهادات."
          onClose={() => setShowSuccess(false)}
        />
      )}
    </main>
  );
}