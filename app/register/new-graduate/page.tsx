"use client";

import { useState } from "react";
import { Clock, AlertCircle } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import RegisterSteps from "../../components/RegisterSteps";
import DocumentUploadRow from "../../components/DocumentUploadRow";

const steps = ["البيانات الشخصية", "رفع المستندات", "مراجعة الطلب"];

const documents = ["شهادة التخرج", "صورة بطاقة الرقم القومي (وجه أمامي وخلفي)", "صورة شخصية حديثة"];

export default function NewGraduateRegisterPage() {
  const [step, setStep] = useState(1);

  return (
    <main>
      <PageHeader
        title="تسجيل خريج جديد"
        subtitle="في حال كنت خريجا جديدا وترغب في القيد بالنقابة، يرجى استكمال البيانات التالية ورفع المستندات المطلوبة لإرسال طلب التسجيل للمراجعة."
      />

      <section className="bg-surface-muted py-14">
        <div className="max-w-3xl mx-auto px-6">
          <RegisterSteps steps={steps} current={step} onStepClick={setStep} />

          {step === 1 && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm text-gray-700">الاسم رباعي</label>
                  <input type="text" placeholder="ادخل الاسم رباعي" className="mt-2 w-full bg-white rounded-xl px-4 py-3 text-sm outline-none text-right shadow-sm" />
                </div>
                <div>
                  <label className="text-sm text-gray-700">الرقم القومي</label>
                  <input type="text" placeholder="أدخل الرقم القومي المكون من 14 رقم" className="mt-2 w-full bg-white rounded-xl px-4 py-3 text-sm outline-none text-right shadow-sm" />
                </div>
                <div>
                  <label className="text-sm text-gray-700">تاريخ الميلاد</label>
                  <input type="date" className="mt-2 w-full bg-white rounded-xl px-4 py-3 text-sm outline-none text-right shadow-sm" />
                </div>
                <div>
                  <label className="text-sm text-gray-700">البريد الإلكتروني</label>
                  <input type="email" placeholder="ادخل البريد الالكتروني" className="mt-2 w-full bg-white rounded-xl px-4 py-3 text-sm outline-none text-right shadow-sm" />
                </div>
                <div>
                  <label className="text-sm text-gray-700">رقم الهاتف</label>
                  <input type="text" placeholder="+20" className="mt-2 w-full bg-white rounded-xl px-4 py-3 text-sm outline-none text-right shadow-sm" />
                </div>
                <div>
                  <label className="text-sm text-gray-700">الجامعة</label>
                  <select className="mt-2 w-full bg-white rounded-xl px-4 py-3 text-sm outline-none text-right shadow-sm text-gray-400">
                    <option>اختر الجامعة</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-700">سنة التخرج</label>
                  <select className="mt-2 w-full bg-white rounded-xl px-4 py-3 text-sm outline-none text-right shadow-sm text-gray-400">
                    <option>اختر سنة التخرج</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-700">المحافظة</label>
                  <select className="mt-2 w-full bg-white rounded-xl px-4 py-3 text-sm outline-none text-right shadow-sm text-gray-400">
                    <option>اختر المحافظة</option>
                  </select>
                </div>
              </div>
              <button onClick={() => setStep(2)} className="mt-8 w-full bg-primary text-white py-3 rounded-pill font-medium">
                التالي
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 text-sm rounded-xl px-4 py-3 border border-yellow-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                يرجى رفع صور واضحة للمستندات التالية بصيغة PDF أو JPG.
              </div>

              <div className="mt-6 bg-white rounded-2xl px-5 py-2 shadow-sm">
                {documents.map((doc) => (
                  <DocumentUploadRow key={doc} label={doc} />
                ))}
              </div>

              <button onClick={() => setStep(3)} className="mt-8 w-full bg-primary text-white py-3 rounded-pill font-medium">
                ارسال الطلب
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center text-center gap-3 py-8">
              <Clock className="w-14 h-14 text-yellow-500" />
              <p className="text-gray-700">سيتم مراجعة الطلب من قبل إدارة النقابة</p>
              <p className="text-gray-500 text-sm">وسيتم إشعارك بحالة الطلب عبر الموقع أو الرسائل النصية.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}